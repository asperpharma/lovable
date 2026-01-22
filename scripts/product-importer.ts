/**
 * Product Import Utility for Shopify Sync
 * 
 * This script reads product data from Excel/CSV files and prepares them for Shopify import
 * Supports automatic categorization, brand extraction, and image generation
 * 
 * Usage:
 *   npm run import:products
 *   or
 *   node --loader ts-node/esm scripts/product-importer.ts
 */

// Load environment variables from .env file (only if not already loaded)
import { config } from 'dotenv';
if (!process.env.VITE_SUPABASE_URL) {
    config();
}

import ExcelJS from 'exceljs';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Configuration
const EXCEL_FILE_PATH = join(process.cwd(), 'public/data/products-data.xlsx');
const CSV_OUTPUT_PATH = join(process.cwd(), 'public/data/products.csv');
const JSON_OUTPUT_PATH = join(process.cwd(), 'public/data/products.json');

// Supabase configuration (load from .env if available)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

interface RawProduct {
    sku?: string;
    name?: string;
    title?: string;
    product_name?: string;
    brand?: string;
    vendor?: string;
    category?: string;
    type?: string;
    price?: number;
    selling_price?: number;
    cost?: number;
    cost_price?: number;
    description?: string;
    image?: string;
    image_url?: string;
    stock?: number;
    quantity?: number;
    [key: string]: any;
}

interface ProcessedProduct {
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
    variants?: Array<{
        title: string;
        price: number;
        sku?: string;
        inventory_quantity: number;
    }>;
}

// Category mapping with expanded keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
    "Skin Care": [
        "cream", "lotion", "serum", "moisturizer", "cleanser", "toner", "mask", "scrub",
        "sunscreen", "spf", "anti-aging", "wrinkle", "acne", "facial", "face", "skin",
        "gel", "foam", "balm", "essence", "ampoule", "treatment",
        "كريم", "مرطب", "واقي", "بشرة", "وجه", "سيروم", "منظف"
    ],
    "Hair Care": [
        "shampoo", "conditioner", "hair", "oil", "treatment", "mask", "spray",
        "styling", "gel", "mousse", "serum", "dye", "color",
        "شعر", "شامبو", "بلسم", "زيت"
    ],
    "Body Care": [
        "body lotion", "body wash", "soap", "hand cream", "foot", "deodorant",
        "shower", "bath", "scrub", "butter",
        "جسم", "صابون", "يد", "قدم"
    ],
    "Make Up": [
        "mascara", "lipstick", "foundation", "blush", "eyeshadow", "liner", "makeup",
        "nail", "polish", "cosmetic", "concealer", "powder", "highlighter", "bronzer",
        "primer", "gloss", "pencil", "kajal", "kohl",
        "مكياج", "أحمر", "ماسكارا", "شفاه", "عيون"
    ],
    "Fragrances": [
        "perfume", "cologne", "fragrance", "eau de", "spray", "scent", "mist",
        "عطر", "كولونيا"
    ],
    "Health & Supplements": [
        "vitamin", "supplement", "capsule", "tablet", "mineral", "omega", "probiotic",
        "protein", "collagen", "biotin",
        "فيتامين", "كبسولة", "مكمل"
    ],
    "Medical Supplies": [
        "cannula", "syringe", "glove", "bandage", "gauze", "medical", "surgical",
        "oximeter", "crutch", "thermometer", "test",
        "طبي", "عكاز", "ضمادة"
    ],
    "Personal Care": [
        "toothbrush", "toothpaste", "brush", "comb", "razor", "cotton", "wipes",
        "dental", "oral", "hygiene",
        "فرشاة", "مشط", "معجون"
    ],
    "Baby Care": [
        "baby", "infant", "diaper", "nappy", "wipes", "talc", "powder",
        "طفل", "رضيع", "حفاض"
    ]
};

// Known brand list
const KNOWN_BRANDS = [
    "Palmer's", "Palmers", "Eucerin", "Vichy", "Bioderma", "Cetaphil", "La Roche-Posay",
    "Jergens", "Old Spice", "Speed Stick", "Sundown", "Jamieson", "Nivea", "Dove",
    "Arm & Hammer", "Secret", "Teen Spirit", "SVR", "Bourjois", "Garnier", "L'Oréal",
    "Mavala", "Isadora", "Essence", "Bioten", "Olaplex", "Bepanthen", "Smilest",
    "Bio Balance", "Raghad", "Maybelline", "Revlon", "CeraVe", "Neutrogena", "Aveeno",
    "Johnson's", "Vaseline", "Listerine", "Colgate", "Oral-B", "Pantene", "Head & Shoulders"
];

/**
 * Categorize product based on name and description
 */
function categorizeProduct(name: string, description: string = ''): string {
    const searchText = `${name} ${description}`.toLowerCase();

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const keyword of keywords) {
            if (searchText.includes(keyword.toLowerCase())) {
                return category;
            }
        }
    }

    return "Personal Care"; // Default category
}

/**
 * Extract brand from product name
 */
function extractBrand(name: string, vendorField?: string): string {
    // First check vendor field
    if (vendorField && vendorField.trim()) {
        return vendorField.trim();
    }

    const nameLower = name.toLowerCase();

    // Check known brands
    for (const brand of KNOWN_BRANDS) {
        if (nameLower.includes(brand.toLowerCase())) {
            return brand;
        }
    }

    // Try to extract first word as brand if it's capitalized
    const words = name.split(/[\s-]/);
    const firstWord = words[0];
    if (firstWord && firstWord.length > 2 && /^[A-Z]/.test(firstWord)) {
        return firstWord;
    }

    return "Generic";
}

/**
 * Generate SEO-friendly tags
 */
function generateTags(product: ProcessedProduct): string[] {
    const tags = new Set<string>();

    tags.add(product.category);
    tags.add(product.brand);

    const nameLower = product.name.toLowerCase();

    // Add skin type tags
    if (nameLower.includes('oily')) tags.add('Oily Skin');
    if (nameLower.includes('dry')) tags.add('Dry Skin');
    if (nameLower.includes('sensitive')) tags.add('Sensitive Skin');
    if (nameLower.includes('combination')) tags.add('Combination Skin');

    // Add concern tags
    if (nameLower.includes('acne')) tags.add('Acne');
    if (nameLower.includes('anti-aging') || nameLower.includes('wrinkle')) tags.add('Anti-Aging');
    if (nameLower.includes('whitening') || nameLower.includes('brightening')) tags.add('Brightening');
    if (nameLower.includes('sun') || nameLower.includes('spf')) tags.add('Sun Protection');

    // Add gender tags
    if (nameLower.includes('men') || nameLower.includes('man')) tags.add('Men');
    if (nameLower.includes('women') || nameLower.includes('woman')) tags.add('Women');

    return Array.from(tags);
}

/**
 * Normalize column names from Excel file
 */
function normalizeColumnName(name: string): string {
    return name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
}

/**
 * Read and parse Excel file
 */
async function readExcelFile(filePath: string): Promise<RawProduct[]> {
    if (!existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        return [];
    }

    console.log(`📖 Reading Excel file: ${filePath}`);

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            console.error('❌ No worksheet found in Excel file');
            return [];
        }

        const rawData: RawProduct[] = [];
        const headers: string[] = [];
        
        // Get headers from first row
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell, colNumber) => {
            headers[colNumber - 1] = String(cell.value || '').trim();
        });

        // Process data rows
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header row
            
            const rowData: RawProduct = {};
            row.eachCell((cell, colNumber) => {
                const header = headers[colNumber - 1];
                if (header) {
                    rowData[header] = cell.value;
                }
            });
            
            rawData.push(rowData);
        });

        console.log(`✅ Found ${rawData.length} rows in Excel`);
        return rawData;
    } catch (error: any) {
        console.error(`❌ Error reading Excel file: ${error.message}`);
        console.log('Tip: Make sure the file is a valid Excel file (.xlsx or .xls)');
        return [];
    }
}

/**
 * Process raw product data
 */
function processProducts(rawProducts: RawProduct[]): ProcessedProduct[] {
    console.log(`\n🔄 Processing ${rawProducts.length} products...`);

    const processed: ProcessedProduct[] = [];
    let skipped = 0;

    rawProducts.forEach((raw, index) => {
        try {
            // Extract product name from various possible columns (English and Arabic)
            const name = (
                raw.name ||
                raw.title ||
                raw.product_name ||
                raw.Product ||
                raw.Title ||
                raw['Product Name'] ||
                raw['اسم المادة'] ||  // Arabic: Item Name
                raw['المنتج'] ||      // Arabic: Product
                raw['الاسم'] ||       // Arabic: Name
                ''
            ).trim();

            if (!name) {
                skipped++;
                return;
            }

            // Extract SKU (English and Arabic)
            const sku = (
                raw.sku ||
                raw.SKU ||
                raw.Code ||
                raw.code ||
                raw['الرمز'] ||       // Arabic: Code
                raw['رمز المنتج'] ||  // Arabic: Product Code
                `AUTO-${index + 1}`
            ).toString().trim();

            // Extract prices (English and Arabic)
            const price = parseFloat(
                String(
                    raw.price ||
                    raw.selling_price ||
                    raw.Price ||
                    raw['Selling Price'] ||
                    raw['سعر البيع'] ||  // Arabic: Selling Price
                    raw['السعر'] ||      // Arabic: Price
                    0
                )
            );

            const costPrice = parseFloat(
                String(
                    raw.cost ||
                    raw.cost_price ||
                    raw.Cost ||
                    raw['Cost Price'] ||
                    raw['الكلفة'] ||     // Arabic: Cost
                    raw['سعر الشراء'] || // Arabic: Purchase Price
                    price * 0.6
                )
            );

            // Extract other fields
            const description = (
                raw.description ||
                raw.Description ||
                raw.desc ||
                `${name} - Premium quality beauty product`
            ).trim();

            const imageUrl = (raw.image || raw.image_url || raw.Image || raw['Image URL'] || '').trim();
            const stock = parseInt(String(raw.stock || raw.quantity || raw.Stock || raw.Quantity || 100));

            // Process the product
            const brand = extractBrand(name, raw.brand || raw.vendor || raw.Brand || raw.Vendor);
            const category = categorizeProduct(name, description);

            const product: ProcessedProduct = {
                sku,
                name,
                brand,
                category,
                price,
                costPrice,
                description,
                imageUrl: imageUrl || undefined,
                stock: isNaN(stock) ? 100 : stock,
                tags: []
            };

            // Generate tags
            product.tags = generateTags(product);

            processed.push(product);

        } catch (error) {
            console.error(`❌ Error processing row ${index + 1}:`, error);
            skipped++;
        }
    });

    console.log(`✅ Processed ${processed.length} products`);
    if (skipped > 0) {
        console.log(`⚠️  Skipped ${skipped} invalid rows`);
    }

    return processed;
}

/**
 * Export products to CSV
 */
function exportToCSV(products: ProcessedProduct[], outputPath: string): void {
    const headers = ['SKU', 'Name', 'Brand', 'Category', 'Price', 'Cost Price', 'Description', 'Image URL', 'Stock', 'Tags'];
    const rows = products.map(p => [
        p.sku,
        p.name,
        p.brand,
        p.category,
        p.price,
        p.costPrice,
        p.description,
        p.imageUrl || '',
        p.stock,
        p.tags.join(', ')
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    writeFileSync(outputPath, csvContent, 'utf-8');
    console.log(`\n✅ CSV exported to: ${outputPath}`);
}

/**
 * Export products to JSON
 */
function exportToJSON(products: ProcessedProduct[], outputPath: string): void {
    writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`✅ JSON exported to: ${outputPath}`);
}

/**
 * Upload products to Supabase for processing
 */
async function uploadToSupabase(products: ProcessedProduct[]): Promise<void> {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.log('\n⚠️  Supabase credentials not found. Skipping upload.');
        console.log('   Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to enable.');
        return;
    }

    console.log('\n📤 Uploading to Supabase...');
    
    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Upload in batches of 50
        const BATCH_SIZE = 50;
        let uploaded = 0;
        let errorCount = 0;

        for (let i = 0; i < products.length; i += BATCH_SIZE) {
            const batch = products.slice(i, i + BATCH_SIZE);

            const { error } = await supabase
                .from('bulk_products')
                .upsert(
                    batch.map(p => ({
                        sku: p.sku,
                        name: p.name,
                        brand: p.brand,
                        category: p.category,
                        price: p.price,
                        cost_price: p.costPrice,
                        description: p.description,
                        image_url: p.imageUrl,
                        stock: p.stock,
                        tags: p.tags,
                        status: 'pending'
                    })),
                    { onConflict: 'sku' }
                );

            if (error) {
                errorCount++;
                if (errorCount === 1) {
                    // Only show detailed error once
                    console.error(`   ❌ Error uploading to Supabase: ${error.message}`);
                    console.log('   💡 Tip: Make sure the bulk_products table exists in Supabase');
                }
            } else {
                uploaded += batch.length;
                if (uploaded % 200 === 0 || uploaded === products.length) {
                    console.log(`   Uploaded ${uploaded}/${products.length} products`);
                }
            }
        }

        if (errorCount > 0) {
            console.log(`   ⚠️  ${errorCount} batch(es) failed to upload. Continuing...`);
        } else {
            console.log(`   ✅ Upload complete: ${uploaded} products`);
        }
    } catch (error: any) {
        console.error(`   ❌ Supabase connection error: ${error.message}`);
        console.log('   💡 Skipping Supabase upload. Products are still exported to CSV/JSON.');
    }
}

/**
 * Display statistics
 */
function displayStats(products: ProcessedProduct[]): void {
    const byCategory = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const byBrand = products.reduce((acc, p) => {
        acc[p.brand] = (acc[p.brand] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const withImages = products.filter(p => p.imageUrl).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    console.log('\n📊 Product Statistics:');
    console.log('━'.repeat(50));
    console.log(`Total Products: ${products.length}`);
    console.log(`Products with Images: ${withImages} (${Math.round(withImages / products.length * 100)}%)`);
    console.log(`Total Inventory Value: $${totalValue.toFixed(2)}`);

    console.log('\nTop Categories:');
    Object.entries(byCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));

    console.log('\nTop Brands:');
    Object.entries(byBrand)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .forEach(([brand, count]) => console.log(`  ${brand}: ${count}`));
}

/**
 * Main execution
 */
async function main() {
    console.log('🚀 Product Import Utility for Shopify Sync');
    console.log('━'.repeat(50));

    // Read Excel file
    const rawProducts = await readExcelFile(EXCEL_FILE_PATH);

    if (rawProducts.length === 0) {
        console.error('\n❌ No products found. Check your Excel file.');
        process.exit(1);
    }

    // Process products
    const products = processProducts(rawProducts);

    if (products.length === 0) {
        console.error('\n❌ No valid products processed.');
        process.exit(1);
    }

    // Display statistics
    displayStats(products);

    // Export to CSV
    exportToCSV(products, CSV_OUTPUT_PATH);

    // Export to JSON
    exportToJSON(products, JSON_OUTPUT_PATH);

    // Upload to Supabase (optional)
    await uploadToSupabase(products);

    console.log('\n✅ Import complete! Next steps:');
    console.log('   1. Review the exported CSV and JSON files');
    console.log('   2. Go to /bulk-upload in your app to sync with Shopify');
    console.log('   3. Or use the Shopify Admin API to bulk import');
    console.log('━'.repeat(50));
}

// Run the script
main().catch(console.error);
