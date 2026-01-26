-- Add SKU field to products table for better product identification and image mapping
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sku TEXT;

-- Add index for efficient SKU lookups
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

-- Add helpful comment
COMMENT ON COLUMN public.products.sku IS 'Product SKU/Barcode for inventory tracking and image mapping';
