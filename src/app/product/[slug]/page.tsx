'use client';

import React, { use, useMemo } from 'react';
import Link from 'next/link';
import { BadgeCheck, ChevronRight, Heart, PackageSearch, RotateCcw, Share2, Timer, Wallet } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { PageHeader } from '@/components/ui/PageHeader';
import { ProductRail } from '@/components/ProductRail';
import { ProductImage } from '@/components/ui/ProductImage';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageSkeleton } from '@/components/ui/Skeleton';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/context/CartContext';
import { discountPercent, formatINR } from '@/lib/format';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { getProductBySlug, catalog, categories, settings, isHydrated } = useStore();
  const { isFavorite, toggleFavorite } = useAuth();
  const { showToast } = useToast();
  const { totalItems, totalAmount } = useCart();

  const product = getProductBySlug(slug);
  const category = categories.find((c) => c.id === product?.category_id);

  const similar = useMemo(
    () => (product ? catalog.filter((p) => p.category_id === product.category_id && p.id !== product.id).slice(0, 12) : []),
    [catalog, product]
  );
  const sameBrand = useMemo(
    () =>
      product?.brand
        ? catalog.filter((p) => p.brand === product.brand && p.id !== product.id && p.category_id !== product.category_id).slice(0, 12)
        : [],
    [catalog, product]
  );

  if (!product || !product.is_active) {
    if (!isHydrated) return <PageSkeleton />;
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <EmptyState
          icon={<PackageSearch className="h-9 w-9" />}
          title="Product not available"
          description="This item may have been removed from the store."
          action={{ label: 'Continue shopping', href: '/' }}
        />
      </div>
    );
  }

  const off = discountPercent(product.mrp, product.selling_price);
  const fav = isFavorite(product.id);
  const eta = settings.delivery_eta_minutes || 30;

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });
      else {
        await navigator.clipboard.writeText(url);
        showToast({ type: 'success', title: 'Link copied' });
      }
    } catch {
      /* user cancelled */
    }
  };

  const actions = (
    <div className="flex items-center">
      <button onClick={share} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-canvas" aria-label="Share">
        <Share2 className="h-[18px] w-[18px]" />
      </button>
      <button
        onClick={() => toggleFavorite(product.id)}
        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-canvas"
        aria-label={fav ? 'Remove from saved' : 'Save'}
        aria-pressed={fav}
      >
        <Heart className={`h-[18px] w-[18px] ${fav ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>
    </div>
  );

  const priceBlock = (
    <div className="flex items-baseline gap-2">
      <span className="tabular text-xl font-extrabold text-ink">{formatINR(product.selling_price)}</span>
      {off > 0 && (
        <>
          <span className="tabular text-sm text-ink-faint">
            MRP <span className="line-through">{formatINR(product.mrp)}</span>
          </span>
          <span className="text-sm font-semibold text-offer">{off}% off</span>
        </>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader hideOnMobile />
      <div className="md:hidden">
        <PageHeader title={product.name} backHref={category ? `/category/${category.slug}` : '/'} right={actions} />
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 pb-32 md:px-6 md:pb-10 md:pt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
          <div className="relative">
            <div className="aspect-square overflow-hidden bg-tile/60 md:rounded-2xl md:border md:border-line">
              <ProductImage src={product.image_url} alt={product.name} eager className="h-full w-full object-cover" fallbackClassName="text-6xl" />
            </div>
          </div>

          <div className="px-4 md:px-0">
            <nav className="mb-3 hidden items-center gap-1 text-[13px] text-ink-muted md:flex" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-ink">Home</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              {category && (
                <>
                  <Link href={`/category/${category.slug}`} className="hover:text-ink">
                    {category.name}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5" />
                </>
              )}
              <span className="truncate text-ink-soft">{product.name}</span>
            </nav>

            <div className="flex items-start justify-between gap-3">
              <h1 className="font-display text-2xl font-semibold leading-snug text-ink md:text-3xl">{product.name}</h1>
              <div className="hidden md:block">{actions}</div>
            </div>
            {product.brand && (
              <Link
                href={`/search?q=${encodeURIComponent(product.brand)}`}
                className="mt-3 flex items-center gap-0.5 text-sm font-semibold text-leaf-600"
              >
                View all by {product.brand} <ChevronRight className="h-4 w-4" />
              </Link>
            )}

            <div className="mt-5 border-t border-line pt-5">
              <p className="text-sm text-ink-muted">{product.weight_volume || product.unit}</p>
              <div className="mt-1">{priceBlock}</div>
              <p className="mt-0.5 text-xs text-ink-faint">Inclusive of all taxes</p>
              {product.stock_quantity > 0 && product.stock_quantity <= Math.min(product.min_stock_alert, 5) && (
                <p className="mt-2 text-sm font-semibold text-orange-600">Only {product.stock_quantity} left in stock</p>
              )}
              <div className="mt-5 hidden md:block">
                <QuantityStepper product={product} size="lg" addLabel="Add to cart" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-white p-3 text-center shadow-card">
              {[
                { icon: Timer, title: `${eta} min delivery`, body: 'From our shop to your door' },
                { icon: Wallet, title: 'Pay on delivery', body: 'Cash or UPI' },
                { icon: RotateCcw, title: 'Easy returns', body: 'Damaged or wrong item? We replace it' },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="px-1">
                  <Icon className="mx-auto mb-1.5 h-5 w-5 text-leaf-600" />
                  <p className="text-xs font-semibold text-ink">{title}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-ink-muted">{body}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h2 className="mb-3 text-base font-bold text-ink">Product details</h2>
              <dl className="space-y-3 text-sm">
                {product.description && (
                  <div>
                    <dt className="font-semibold text-ink">Description</dt>
                    <dd className="mt-0.5 leading-relaxed text-ink-muted">{product.description}</dd>
                  </div>
                )}
                {product.brand && (
                  <div>
                    <dt className="font-semibold text-ink">Brand</dt>
                    <dd className="mt-0.5 text-ink-muted">{product.brand}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-semibold text-ink">Unit</dt>
                  <dd className="mt-0.5 text-ink-muted">{product.weight_volume || product.unit}</dd>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-ink-muted">
                  <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf-500" />
                  Sold by {settings.store_name}, {settings.city}. Actual product packaging may vary.
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2 md:mt-10">
          <ProductRail title={category ? `More in ${category.name}` : 'You may also like'} products={similar} seeAllHref={category ? `/category/${category.slug}` : undefined} />
          {sameBrand.length > 0 && <ProductRail title={`More from ${product.brand}`} products={sameBrand} />}
        </div>
      </main>

      {/* Mobile sticky add bar */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white shadow-bar md:hidden">
        {totalItems > 0 && (
          <Link
            href="/cart"
            className="flex items-center justify-between bg-ink px-4 py-2 text-sm font-medium text-white"
          >
            <span className="tabular">
              {totalItems} item{totalItems > 1 ? 's' : ''} · {formatINR(totalAmount)}
            </span>
            <span className="flex items-center gap-0.5">
              Basket <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        )}
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-ink-muted">{product.weight_volume || product.unit}</p>
            {priceBlock}
          </div>
          <QuantityStepper product={product} size="lg" addLabel="Add to cart" />
        </div>
      </div>

      <div className="hidden md:block">
        <SiteFooter />
      </div>
    </div>
  );
}
