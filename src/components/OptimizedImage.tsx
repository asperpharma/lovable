import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  priority = false,
  sizes = '100vw',
  quality = 85
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('.webp') || originalSrc.includes('.avif')) {
      return originalSrc;
    }
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  return (
    <div ref={imgRef} className="relative overflow-hidden">
      {!isLoaded && !isError && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-cream/50 to-gold/20 animate-pulse",
          className
        )} />
      )}
      
      {isInView && (
        <img
          src={getOptimizedSrc(src)}
          alt={alt}
          className={cn(
            "transition-all duration-700 ease-out",
            isLoaded 
              ? "opacity-100 scale-100 blur-0" 
              : "opacity-0 scale-105 blur-sm",
            className
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsError(true);
            if (imgRef.current) {
              imgRef.current.src = src; // Fallback to original
            }
          }}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
        />
      )}
    </div>
  );
};