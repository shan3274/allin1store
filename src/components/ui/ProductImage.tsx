'use client';

import React, { useState } from 'react';

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  /** Tailwind classes for the monogram fallback text size. */
  fallbackClassName?: string;
  eager?: boolean;
}

/** Product/category image that degrades to a clean monogram tile when missing or broken. */
export function ProductImage({ src, alt, className = '', fallbackClassName = 'text-2xl', eager }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-tile font-bold uppercase text-ink-faint ${className}`}
        aria-label={alt}
        role="img"
      >
        <span className={fallbackClassName}>{alt.trim().charAt(0) || '?'}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote catalogue images of unknown origin
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
