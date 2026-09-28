'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Where to go if there is no history to go back to. */
  backHref?: string;
  right?: React.ReactNode;
}

/** Sticky back-header on phones; a plain page title row on desktop. */
export function PageHeader({ title, subtitle, backHref = '/', right }: PageHeaderProps) {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push(backHref);
  };

  return (
    <div className="sticky top-0 z-40 border-b border-line bg-white md:static md:z-auto md:border-0 md:bg-transparent">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-2 py-2.5 md:px-6 md:pb-2 md:pt-8">
        <button
          onClick={goBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink hover:bg-canvas md:-ml-2"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold text-ink md:text-2xl">{title}</h1>
          {subtitle && <p className="truncate text-xs text-ink-muted md:text-sm">{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}
