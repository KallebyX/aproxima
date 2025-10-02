// 🚀 APROXIMA - Advanced Image Optimization
// Intelligent Image Loading & Format Selection

import { useState, useEffect, useRef, useCallback } from 'react';

interface ImageOptimizationConfig {
  enableWebP: boolean;
  enableAVIF: boolean;
  lazyLoading: boolean;
  responsiveImages: boolean;
  qualityThreshold: number;
  compressionLevel: number;
}

export class ImageOptimizer {
  private supportedFormats: Set<string>;
  private config: ImageOptimizationConfig;
  private intersectionObserver: IntersectionObserver | null;
  private imageCache: Map<string, HTMLImageElement>;

  constructor(config: Partial<ImageOptimizationConfig> = {}) {
    this.supportedFormats = new Set();
    this.config = {
      enableWebP: true,
      enableAVIF: true,
      lazyLoading: true,
      responsiveImages: true,
      qualityThreshold: 0.8,
      compressionLevel: 85,
      ...config
    };
    this.intersectionObserver = null;
    this.imageCache = new Map();
    
    this.init();
  }

  private async init(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Detect supported formats
    await this.detectSupportedFormats();
    
    // Setup lazy loading observer
    if (this.config.lazyLoading) {
      this.setupLazyLoading();
    }

    console.log('🖼️ Image optimizer initialized:', {
      supportedFormats: Array.from(this.supportedFormats),
      config: this.config
    });
  }

  private async detectSupportedFormats(): Promise<void> {
    const formats = [
      { name: 'webp', dataURL: 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA' },
      { name: 'avif', dataURL: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=' }
    ];

    const promises = formats.map(async (format) => {
      try {
        const supported = await this.testImageFormat(format.dataURL);
        if (supported) {
          this.supportedFormats.add(format.name);
        }
      } catch (error) {
        console.warn(`Failed to test ${format.name} support:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  private testImageFormat(dataURL: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width === 1 && img.height === 1);
      img.onerror = () => resolve(false);
      img.src = dataURL;
    });
  }

  private setupLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              this.loadImage(img);
              this.intersectionObserver?.unobserve(img);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );
    }
  }

  public optimizeImageSrc(originalSrc: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
  } = {}): string {
    const { width, height, quality = this.config.compressionLevel, format = 'auto' } = options;

    // If it's already optimized or external URL, return as is
    if (originalSrc.includes('/_next/image') || !originalSrc.startsWith('/')) {
      return originalSrc;
    }

    // Determine best format
    const targetFormat = this.getBestFormat(format);

    // Build Next.js Image optimization URL
    const params = new URLSearchParams();
    params.set('url', originalSrc);
    params.set('q', quality.toString());

    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (targetFormat && targetFormat !== 'original') {
      params.set('f', targetFormat);
    }

    return `/_next/image?${params.toString()}`;
  }

  private getBestFormat(preferredFormat: string): string {
    if (preferredFormat === 'auto') {
      if (this.config.enableAVIF && this.supportedFormats.has('avif')) {
        return 'avif';
      }
      if (this.config.enableWebP && this.supportedFormats.has('webp')) {
        return 'webp';
      }
      return 'original';
    }

    if (this.supportedFormats.has(preferredFormat)) {
      return preferredFormat;
    }

    return 'original';
  }

  public generateResponsiveSrcSet(baseSrc: string, sizes: number[]): string {
    const srcSet = sizes.map(size => {
      const optimizedSrc = this.optimizeImageSrc(baseSrc, { width: size });
      return `${optimizedSrc} ${size}w`;
    }).join(', ');

    return srcSet;
  }

  public observeImage(img: HTMLImageElement): void {
    if (this.intersectionObserver && img.dataset.src) {
      this.intersectionObserver.observe(img);
    }
  }

  private loadImage(img: HTMLImageElement): void {
    const dataSrc = img.dataset.src;
    const dataSrcSet = img.dataset.srcset;

    if (dataSrc) {
      // Preload the image
      const preloadImg = new Image();
      preloadImg.onload = () => {
        img.src = dataSrc;
        if (dataSrcSet) {
          img.srcset = dataSrcSet;
        }
        img.classList.add('loaded');
        img.classList.remove('loading');
      };
      preloadImg.onerror = () => {
        img.classList.add('error');
        img.classList.remove('loading');
      };
      preloadImg.src = dataSrc;
    }
  }

  public preloadCriticalImages(imageSrcs: string[]): void {
    imageSrcs.forEach(src => {
      if (!this.imageCache.has(src)) {
        const img = new Image();
        img.src = this.optimizeImageSrc(src);
        this.imageCache.set(src, img);
        console.log(`🖼️ Preloaded critical image: ${src}`);
      }
    });
  }

  public getStats(): any {
    return {
      supportedFormats: Array.from(this.supportedFormats),
      config: this.config,
      cachedImages: this.imageCache.size,
      observerActive: !!this.intersectionObserver
    };
  }

  public cleanup(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    this.imageCache.clear();
  }
}

// React Hook for optimized images
export function useOptimizedImage(src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  lazy?: boolean;
  critical?: boolean;
} = {}) {
  const [imageOptimizer] = useState(() => new ImageOptimizer());
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const optimizedSrc = imageOptimizer.optimizeImageSrc(src, options);

  useEffect(() => {
    if (options.critical) {
      imageOptimizer.preloadCriticalImages([src]);
    }
  }, [src, options.critical, imageOptimizer]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || !options.lazy) return;

    const handleLoad = () => setIsLoaded(true);
    const handleError = () => setHasError(true);

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    if (options.lazy) {
      imageOptimizer.observeImage(img);
    }

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [imageOptimizer, options.lazy]);

  const responsiveSizes = options.width ? 
    [options.width, options.width * 1.5, options.width * 2] : 
    [320, 480, 768, 1024, 1200];

  const srcSet = imageOptimizer.generateResponsiveSrcSet(src, responsiveSizes);

  return {
    imgRef,
    optimizedSrc,
    srcSet,
    isLoaded,
    hasError,
    imageOptimizer
  };
}

// Optimized Image Component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  lazy?: boolean;
  critical?: boolean;
  className?: string;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 85,
  format = 'auto',
  lazy = true,
  critical = false,
  className = '',
  sizes = '100vw',
  placeholder = 'empty',
  onLoad,
  onError
}) => {
  const {
    imgRef,
    optimizedSrc,
    srcSet,
    isLoaded,
    hasError
  } = useOptimizedImage(src, { width, height, quality, format, lazy, critical });

  const handleLoad = useCallback(() => {
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    onError?.();
  }, [onError]);

  const imgClassName = `${className} ${lazy ? 'loading' : ''} ${isLoaded ? 'loaded' : ''} ${hasError ? 'error' : ''}`.trim();

  if (lazy) {
    return (
      <img
        ref={imgRef}
        data-src={optimizedSrc}
        data-srcset={srcSet}
        alt={alt}
        width={width}
        height={height}
        className={imgClassName}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        decoding="async"
        style={{
          backgroundColor: placeholder === 'blur' ? '#f3f4f6' : 'transparent'
        }}
      />
    );
  }

  return (
    <img
      ref={imgRef}
      src={optimizedSrc}
      srcSet={srcSet}
      alt={alt}
      width={width}
      height={height}
      className={imgClassName}
      sizes={sizes}
      onLoad={handleLoad}
      onError={handleError}
      loading={critical ? 'eager' : 'lazy'}
      decoding="async"
      style={{
        backgroundColor: placeholder === 'blur' ? '#f3f4f6' : 'transparent'
      }}
    />
  );
};

// Initialize global image optimizer
let globalImageOptimizer: ImageOptimizer | null = null;

if (typeof window !== 'undefined') {
  globalImageOptimizer = new ImageOptimizer();
}

export default globalImageOptimizer;