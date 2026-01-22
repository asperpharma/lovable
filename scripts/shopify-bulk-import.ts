/**
 * Shopify Bulk Import Script
 * 
 * Directly imports products to Shopify using the Admin API
 * Requires Shopify Admin API credentials
 * 
 * Usage:
 *   bun run scripts/shopify-bulk-import.ts
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Configuration
const SHOPIFY_STORE = process.env.SHOPIFY_STORE || 'lovable-project-milns.myshopify.com';
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_KEY || '';
const SHOPIFY_API_VERSION = '2025-07';

const PRODUCTS_JSON_PATH = join(process.cwd(), 'public/data/products.json');

interface Product {
    sku: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    costPrice: number;
    description: string;
    imageUrl?: string;
    stock: number;
    tags: string[];
}

interface ShopifyProduct {
    title: string;
    body_html: string;
    vendor: string;
    product_type: string;
    tags: string[];
    variants: Array<{
        sku: string;
        price: string;
        cost?: string;
        inventory_quantity: number;
        inventory_management: string;
    }>;
    images?: Array<{
        src: string;
    }>;
    published: boolean;
}

/**
 * Make a request to Shopify Admin API
 */
async function shopifyAdminRequest(
    endpoint: string,
    method: string = 'GET',
    body?: any
): Promise<any> {
    const url = `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/${endpoint}`;

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Shopify API error (${response.status}): ${error}`);
    }

    return response.json();
}

/**
 * Convert our product format to Shopify format
 */
function convertToShopifyProduct(product: Product): ShopifyProduct {
    const shopifyProduct: ShopifyProduct = {
        title: product.name,
        body_html: `<p>${product.description}</p>`,
        vendor: product.brand,
        product_type: product.category,
        tags: product.tags,
        variants: [{
            sku: product.sku,
            price: product.price.toFixed(2),
            cost: product.costPrice.toFixed(2),
            inventory_quantity: product.stock,
            inventory_management: 'shopify',
        }],
        published: true,
    };

    // Add image if available
    if (product.imageUrl) {
        shopifyProduct.images = [{ src: product.imageUrl }];
    }

    return shopifyProduct;
}

/**
 * Create a single product in Shopify
 */
async function createShopifyProduct(product: Product): Promise<any> {
    const shopifyProduct = convertToShopifyProduct(product);

    const response = await shopifyAdminRequest(
        'products.json',
        'POST',
        { product: shopifyProduct }
    );

    return response.product;
}

/**
 * Check if product exists by SKU
 */
async function findProductBySKU(sku: string): Promise<any> {
    try {
        const response = await shopifyAdminRequest(
            `products.json?fields=id,variants&limit=1`,
            'GET'
        );

        // Search through products for matching SKU
        for (const product of response.products || []) {
            for (const variant of product.variants || []) {
                if (variant.sku === sku) {
                    return product;
                }
            }
        }

        return null;
    } catch (error) {
        return null;
    }
}

/**
 * Update existing product
 */
async function updateShopifyProduct(productId: string, product: Product): Promise<any> {
    const shopifyProduct = convertToShopifyProduct(product);

    const response = await shopifyAdminRequest(
        `products/${productId}.json`,
        'PUT',
        { product: shopifyProduct }
    );

    return response.product;
}

/**
 * Import products with progress tracking
 */
async function importProducts(products: Product[]): Promise<void> {
    console.log(`\n🚀 Starting Shopify import for ${products.length} products...`);
    console.log('━'.repeat(50));

    let created = 0;
    let updated = 0;
    let failed = 0;
    const errors: Array<{ sku: string; error: string }> = [];

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const progress = `[${i + 1}/${products.length}]`;

        try {
            process.stdout.write(`${progress} Processing ${product.sku}...`);

            // Check if product exists
            const existingProduct = await findProductBySKU(product.sku);

            if (existingProduct) {
                // Update existing product
                await updateShopifyProduct(existingProduct.id, product);
                updated++;
                console.log(` ✅ Updated`);
            } else {
                // Create new product
                await createShopifyProduct(product);
                created++;
                console.log(` ✅ Created`);
            }

            // Rate limiting - Shopify allows 2 requests per second
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error: any) {
            failed++;
            errors.push({ sku: product.sku, error: error.message });
            console.log(` ❌ Failed: ${error.message}`);
        }
    }

    // Summary
    console.log('\n━'.repeat(50));
    console.log('📊 Import Summary:');
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Failed: ${failed}`);

    if (errors.length > 0) {
        console.log('\n❌ Errors:');
        errors.forEach(({ sku, error }) => {
            console.log(`   ${sku}: ${error}`);
        });
    }
}

/**
 * Main execution
 */
async function main() {
    console.log('🏪 Shopify Bulk Import Tool');
    console.log('━'.repeat(50));

    // Validate credentials
    if (!SHOPIFY_ADMIN_TOKEN) {
        console.error('❌ Error: SHOPIFY_ADMIN_API_KEY environment variable not set');
        console.log('\nTo use this script:');
        console.log('1. Go to your Shopify Admin → Apps → Develop apps');
        console.log('2. Create a private app with Admin API access');
        console.log('3. Set the access token: export SHOPIFY_ADMIN_API_KEY=your_token');
        console.log('4. Run: bun run scripts/shopify-bulk-import.ts');
        process.exit(1);
    }

    // Load products
    if (!existsSync(PRODUCTS_JSON_PATH)) {
        console.error(`❌ Products file not found: ${PRODUCTS_JSON_PATH}`);
        console.log('\nRun product-importer.ts first to process your Excel file.');
        process.exit(1);
    }

    const productsData = readFileSync(PRODUCTS_JSON_PATH, 'utf-8');
    const products: Product[] = JSON.parse(productsData);

    console.log(`✅ Loaded ${products.length} products from ${PRODUCTS_JSON_PATH}`);
    console.log(`🏪 Store: ${SHOPIFY_STORE}`);
    console.log(`🔑 API Version: ${SHOPIFY_API_VERSION}`);

    // Confirm before proceeding
    console.log('\n⚠️  This will create/update products in your Shopify store.');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Import products
    await importProducts(products);

    console.log('\n✅ Import complete!');
}

// Run the script
main().catch(console.error);
