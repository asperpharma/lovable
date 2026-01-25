# Shopify Admin API Setup Guide

To upload products to your Shopify store, you need to configure the Shopify Admin API access token.

## Step 1: Create a Private App in Shopify

1. Log in to your Shopify admin panel: `https://lovable-project-milns.myshopify.com/admin`
2. Go to **Settings** → **Apps and sales channels**
3. Click **Develop apps** (or **Develop apps for your store**)
4. Click **Create an app**
5. Name it "Bulk Product Upload" or similar
6. Click **Create app**

## Step 2: Configure API Scopes

1. Click **Configure Admin API scopes**
2. Enable the following scopes:
   - `write_products` - Create and update products
   - `read_products` - Read product information
   - `write_inventory` - Manage inventory (optional, if you want to set stock levels)
   - `read_inventory` - Read inventory (optional)
3. Click **Save**

## Step 3: Install the App

1. Click **Install app** at the top of the page
2. Confirm the installation

## Step 4: Get the Admin API Access Token

1. After installation, you'll see **API credentials**
2. Under **Admin API access token**, click **Reveal token once**
3. **Copy the token immediately** - you won't be able to see it again!

## Step 5: Add Token to Supabase Environment

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** → **Edge Functions** → **Secrets**
3. Add a new secret:
   - **Name**: `SHOPIFY_ACCESS_TOKEN`
   - **Value**: Paste the token you copied
4. Click **Save**

## Optional: Configure Store Domain and API Version

If your store domain is different or you want to use a specific API version:

1. Add `SHOPIFY_STORE_DOMAIN` secret (default: `lovable-project-milns.myshopify.com`)
2. Add `SHOPIFY_API_VERSION` secret (default: `2025-01`)

## Testing the Setup

1. Go to the Bulk Upload page in your app
2. Upload your products Excel file
3. Categorize products
4. Generate images
5. Click **Upload to Shopify**

If you see authentication errors, verify:
- The token is correctly set in Supabase secrets
- The app has the correct scopes enabled
- The app is installed in your Shopify store

## Troubleshooting

### Error: "SHOPIFY_ACCESS_TOKEN is not configured"
- Make sure you've added the secret in Supabase Edge Functions secrets
- The secret name must be exactly `SHOPIFY_ACCESS_TOKEN`

### Error: "401 Unauthorized"
- Verify the token is correct
- Check that the app is installed
- Ensure the token hasn't been revoked

### Error: "422 Validation Error"
- Product might already exist (check for duplicate SKUs)
- Product data might be invalid (check required fields)
- Image URL might be inaccessible

### Error: "429 Rate Limited"
- Shopify has rate limits (2 requests per second for REST API)
- The upload automatically handles this with delays
- If you see this frequently, reduce batch size or add longer delays

## API Rate Limits

Shopify Admin API has rate limits:
- **REST API**: 2 requests per second (40 requests per 20 seconds)
- **GraphQL API**: 2 requests per second (50 points per second)

The bulk upload function processes products with a 300ms delay between requests to stay within limits.

## Product Data Structure

Products are created with:
- **Title**: Product name
- **Description**: Brand and category info
- **Vendor**: Brand name
- **Product Type**: Category
- **Tags**: Category, brand, bulk-upload
- **Price**: Selling price
- **SKU**: Product SKU
- **Images**: Generated product images
- **Status**: Active and published
- **SEO**: Auto-generated title and description tags
