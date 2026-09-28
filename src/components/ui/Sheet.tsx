'use client';

import React, { useEffect, useId } from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Max width on desktop. */
  size?: 'sm' | 'md' | 'lg';
}

const WIDTHS = { sm: 'sm:max-w-sm', md: 'sm:max-w-md', lg: 'sm:max-w-lg' };

/** Bottom sheet on phones, centred dialog on larger screens. */
export function Sheet({ open, onClose, title, description, children, footer, size = 'md' }: SheetProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-black/50" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`relative flex max-h-[92vh] w-full animate-sheet-up flex-col rounded-t-3xl bg-white shadow-pop sm:animate-slide-up sm:rounded-2xl ${WIDTHS[size]}`}
      >
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line sm:hidden" />
        {title && (
          <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-4">
            <div>
              <h2 id={titleId} className="text-lg font-bold text-ink">
                {title}
              </h2>
              {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas text-ink-soft hover:bg-line"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 pb-5">{children}</div>
        {footer && <div className="border-t border-line px-5 py-4 pb-safe">{footer}</div>}
      </div>
    </div>
  );
}
