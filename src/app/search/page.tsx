'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Clock3, SearchX, Search, TrendingUp, X } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { ProductGrid } from '@/components/ProductGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { useStore } from '@/context/StoreContext';
import type { Product } from '@/types/database';

const RECENT_KEY = 'kirana_recent_searches';

// Common Hindi / Hinglish grocery words → catalogue terms.
const SYNONYMS: Record<string, string> = {
  aata: 'atta',
  chini: 'sugar',
  shakkar: 'sugar',
  namak: 'salt',
  tel: 'oil',
  doodh: 'milk',
  chawal: 'rice',
  chai: 'tea',
  patti: 'tea',
  haldi: 'turmeric',
  mirch: 'chilli',
  ghee: 'ghee',
  sabun: 'soap',
  daal: 'dal',
  makkhan: 'butter',
  suji: 'sooji',
  rava: 'sooji',
};

function score(p: Product, tokens: string[]): number {
  const name = p.name.toLowerCase();
  const brand = (p.brand || '').toLowerCase();
  const desc = (p.description || '').toLowerCase();
  let total = 0;
  for (const t of tokens) {
    if (p.barcode === t || p.sku?.toLowerCase() === t) total += 100;
    else if (name.startsWith(t)) total += 12;
    else if (name.split(/\s+/).some((w) => w.startsWith(t))) total += 9;
    else if (name.includes(t)) total += 6;
    else if (brand.includes(t)) total += 5;
    else if (desc.includes(t)) total += 2;
    else return 0; // every token must match somewhere
  }
  return total + (p.stock_quantity > 0 ? 1 : 0);
}

function SearchView() {
  const router = useRouter();
  const params = useSearchParams();
  const { catalog } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(params.get('q') ?? '');
  const [debounced, setDebounced] = useState(query);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'));
    } catch {
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 180);
    return () => clearTimeout(t);
  }, [query]);

  // Mirror the query in the URL so results are shareable and survive refresh/back.
  useEffect(() => {
    const q = debounced.trim();
    const url = q ? `/search?q=${encodeURIComponent(q)}` : '/search';
    router.replace(url, { scroll: false });
  }, [debounced, router]);

  const saveRecent = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 8);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
  };

  const results = useMemo(() => {
    const tokens = debounced
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((t) => SYNONYMS[t] ?? t);
    if (tokens.length === 0) return [];
    return catalog
      .map((p) => ({ p, s: score(p, tokens) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.p);
  }, [debounced, catalog]);

  const trending = useMemo(
    () =>
      catalog
        .filter((p) => p.is_featured && p.stock_quantity > 0)
        .slice(0, 8)
        .map((p) => (p.brand ? p.name.replace(new RegExp(`^${p.brand}\\s*`, 'i'), '') : p.name).split(' ').slice(0, 3).join(' ')),
    [catalog]
  );

  const pick = (term: string) => {
    setQuery(term);
    setDebounced(term);
    saveRecent(term);
    inputRef.current?.blur();
  };

  const hasQuery = debounced.trim().length > 0;

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-line bg-white md:top-[77px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveRecent(query);
            inputRef.current?.blur();
          }}
          className="mx-auto flex max-w-4xl items-center gap-1 px-2 py-2.5 md:px-6"
          role="search"
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-canvas md:hidden"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-muted" />
            <input
              ref={inputRef}
              autoFocus
              type="search"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for atta, dal, milk…"
              className="h-11 w-full rounded-xl border border-line bg-canvas pl-10 pr-10 text-ink placeholder:text-ink-faint focus:border-leaf-500 focus:bg-white focus:outline-none"
              aria-label="Search products"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-line text-ink-soft"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </form>
      </div>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-28 pt-5 md:px-6">
        {!hasQuery ? (
          <div className="space-y-8">
            {recent.length > 0 && (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-bold text-ink">Recent searches</h2>
                  <button onClick={clearRecent} className="text-sm font-medium text-leaf-600">
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => pick(r)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:border-ink-faint"
                    >
                      <Clock3 className="h-3.5 w-3.5 text-ink-faint" /> {r}
                    </button>
                  ))}
                </div>
              </section>
            )}
            {trending.length > 0 && (
              <section>
                <h2 className="mb-3 text-base font-bold text-ink">Trending in your store</h2>
                <div className="flex flex-wrap gap-2">
                  {trending.map((t) => (
                    <button
                      key={t}
                      onClick={() => pick(t)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:border-ink-faint"
                    >
                      <TrendingUp className="h-3.5 w-3.5 text-leaf-500" /> {t}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            icon={<SearchX className="h-9 w-9" />}
            title={`No results for “${debounced}”`}
            description="Check the spelling or try a simpler word like “atta”, “oil” or “biscuit”."
            action={{ label: 'Browse categories', href: '/categories' }}
          />
        ) : (
          <>
            <p className="mb-3 text-sm text-ink-muted">
              Showing {results.length} result{results.length > 1 ? 's' : ''} for{' '}
              <span className="font-semibold text-ink">“{debounced}”</span>
            </p>
            <ProductGrid products={results} />
          </>
        )}
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader hideOnMobile />
      <Suspense fallback={null}>
        <SearchView />
      </Suspense>
    </div>
  );
}
