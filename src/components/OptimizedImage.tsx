/**
 * Helper to identify Shopify CDN image URLs
 */
const isShopifyCdnUrl = (url: string | undefined | null): boolean => {
  if (!url) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Allowlist of known Shopify CDN hostnames
    const allowedHosts = new Set<string>(["cdn.shopify.com", "files.shopifycdn.com"]);

    return allowedHosts.has(hostname);
  } catch {
    return false;
  }
};

/**
 * Helper to generate Shopify CDN image URLs with size optimization
 */
export const getOptimizedShopifyImageUrl = (
  url: string,
  width: number,
  height?: number,
): string => {
  if (!isShopifyCdnUrl(url)) {
    return url;
  }

  // Shopify image URL transformation
  // Format: {url}_WIDTHxHEIGHT.{format} or using query params
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set("width", width.toString());
    if (height) {
      urlObj.searchParams.set("height", height.toString());
    }
    urlObj.searchParams.set("crop", "center");
    return urlObj.toString();
  } catch {
    return url;
  }
};

/**
 * Generate srcset for responsive images
 */
export const getShopifyImageSrcSet = (
  url: string,
  sizes: number[],
): string => {
  if (!isShopifyCdnUrl(url)) {
    return "";
  }

  return sizes
    .map((size) => `${getOptimizedShopifyImageUrl(url, size)} ${size}w`)
    .join(", ");
};

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  isShopify?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 50vw",
  loading = "lazy",
  fetchPriority = "auto",
  isShopify = true,
}: OptimizedImageProps) => {
  const isShopifyUrl = isShopifyCdnUrl(src);

  if (isShopify && isShopifyUrl) {
    const srcSet = getShopifyImageSrcSet(src, [200, 400, 600, 800, 1200]);
    const optimizedSrc = width
      ? getOptimizedShopifyImageUrl(src, width, height)
      : src;

    return (
      <img
        src={optimizedSrc}
        srcSet={srcSet || undefined}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        width={width}
        height={height}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      width={width}
      height={height}
    />
  );
};
