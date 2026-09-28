import React from 'react';
import Link from 'next/link';

/** Shop-awning mark: the store's own identity rather than a text block. */
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="#1b6b45" />
      <path d="M9 15.5 11.5 10h17l2.5 5.5" fill="none" stroke="#f7f4ee" strokeWidth="2.2" strokeLinejoin="round" />
      <path
        d="M9 15.5c0 1.9 1.6 3.3 3.5 3.3S16 17.4 16 15.5c0 1.9 1.6 3.3 3.5 3.3s3.5-1.4 3.5-3.3c0 1.9 1.6 3.3 3.5 3.3s3.5-1.4 3.5-3.3"
        fill="#e9a23b"
        stroke="#e9a23b"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M12 21v9h16v-9" fill="none" stroke="#f7f4ee" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M18 30v-5h4v5" fill="none" stroke="#f7f4ee" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ name, compact = false }: { name: string; compact?: boolean }) {
  const short = name.replace(/\s+store$/i, '');
  return (
    <Link href="/" className="inline-flex shrink-0 items-center gap-2.5" aria-label={`${name} home`}>
      <LogoMark className={compact ? 'h-8 w-8' : 'h-10 w-10'} />
      <span className={`font-display font-semibold leading-none tracking-tight text-ink ${compact ? 'text-lg' : 'text-[22px]'}`}>
        {short}
      </span>
    </Link>
  );
}
