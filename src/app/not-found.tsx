import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-extrabold tracking-tight text-sun-400">404</p>
      <h1 className="mt-4 text-xl font-bold text-ink">This page isn’t on our shelves</h1>
      <p className="mt-1.5 max-w-xs text-sm text-ink-muted">The link may be broken or the page may have been moved.</p>
      <Link href="/" className="btn-primary mt-6 px-6">
        Go to home
      </Link>
    </main>
  );
}
