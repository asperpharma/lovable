import { useState, useEffect, ImgHTMLAttributes, useRef } from "react";
import { cn } from "@/lib/utils";
import { ImageSkeleton } from "./ProductCardSkeleton";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
  priority?: boolean;
}

export const LazyImage = ({
  src,
  alt,
  className,
  skeletonClassName,
  priority = false,
  ...props
}: LazyImageProps) => {
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
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
  }, [src]);

  return (
    <div ref={imgRef} className="relative w-full h-full">
      {!isLoaded && !isError && (
        <ImageSkeleton className={cn("absolute inset-0 w-full h-full", skeletonClassName)} />
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "transition-all duration-500 ease-out",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
            className
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
};
