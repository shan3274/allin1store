'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-xl font-bold text-ink">Something went wrong</h1>
      <p className="mt-1.5 max-w-xs text-sm text-ink-muted">Please try again. If it keeps happening, call the store.</p>
      <div className="mt-6 flex gap-2">
        <button onClick={reset} className="btn-primary px-6">
          Try again
        </button>
        <Link href="/" className="btn-secondary px-6">
          Home
        </Link>
      </div>
    </main>
  );
}
