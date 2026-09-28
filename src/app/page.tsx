'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ProductRail } from '@/components/ProductRail';
import { CategoryTile } from '@/components/CategoryTile';
import { ProductImage } from '@/components/ui/ProductImage';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { discountPercent, formatINR } from '@/lib/format';
import type { Product } from '@/types/database';

interface Banner {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  tone: string;
  image: string | null;
}

export default function StorefrontPage() {
  const { catalog, categories, settings, orders, getProductById } = useStore();
  const { user } = useAuth();
  const { availableCoupons } = useCart();

  const activeCategories = useMemo(
    () => categories.filter((c) => c.slug !== 'all' && c.is_active).sort((a, b) => a.display_order - b.display_order),
    [categories]
  );

  const inStockFirst = (list: Product[]) =>
    [...list].sort((a, b) => Number(b.stock_quantity > 0) - Number(a.stock_quantity > 0));

  const bestsellers = useMemo(() => inStockFirst(catalog.filter((p) => p.is_featured)), [catalog]);
  const deals = useMemo(
    () =>
      inStockFirst(catalog.filter((p) => discountPercent(p.mrp, p.selling_price) >= 10)).sort(
        (a, b) => discountPercent(b.mrp, b.selling_price) - discountPercent(a.mrp, a.selling_price)
      ),
    [catalog]
  );

  // "Order again" — products from this customer's recent orders.
  const orderAgain = useMemo(() => {
    if (!user) return [];
    const seen = new Set<string>();
    const list: Product[] = [];
    orders
      .filter((o) => o.user_id === user.id)
      .forEach((o) =>
        o.items?.forEach((i) => {
          const p = i.product_id ? getProductById(i.product_id) : undefined;
          if (p && p.is_active && !seen.has(p.id)) {
            seen.add(p.id);
            list.push(p);
          }
        })
      );
    return list.slice(0, 12);
  }, [user, orders, getProductById]);

  const byCategory = (catId: string) => inStockFirst(catalog.filter((p) => p.category_id === catId)).slice(0, 12);

  const banners: Banner[] = useMemo(() => {
    const list: Banner[] = [];
    const firstImg = (catSlug: string) =>
      catalog.find((p) => categories.find((c) => c.slug === catSlug)?.id === p.category_id)?.image_url ?? null;

    list.push({
      id: 'staples',
      eyebrow: 'From our shelf',
      title: 'Atta, rice & dal at fair kirana prices',
      body: 'Restocked every morning, packed by hand.',
      cta: 'Shop staples',
      href: '/category/atta-flour',
      tone: 'bg-leaf-700 text-canvas',
      image: firstImg('atta-flour'),
    });
    if (settings.free_delivery_above > 0) {
      list.push({
        id: 'free-delivery',
        eyebrow: 'Delivery on us',
        title: `Free delivery above ${formatINR(settings.free_delivery_above)}`,
        body: `Otherwise just ${formatINR(settings.delivery_charge)} per order.`,
        cta: 'Start shopping',
        href: '/categories',
        tone: 'bg-sun-100 text-ink',
        image: firstImg('dairy-bread'),
      });
    }
    const coupon = availableCoupons[0];
    if (coupon) {
      list.push({
        id: 'coupon',
        eyebrow: `Use code ${coupon.code}`,
        title:
          coupon.discountType === 'flat'
            ? `${formatINR(coupon.discountValue)} off your order`
            : `${coupon.discountValue}% off${coupon.maxDiscount ? `, up to ${formatINR(coupon.maxDiscount)}` : ''}`,
        body: `On orders above ${formatINR(coupon.minOrderValue)}.`,
        cta: 'Use it now',
        href: '/cart',
        tone: 'bg-offer-soft text-ink',
        image: firstImg('oil-ghee'),
      });
    }
    return list;
  }, [catalog, categories, settings, availableCoupons]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 pb-4 md:px-6">
        {/* Banners */}
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pt-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pt-6">
          {banners.map((b) => (
            <Link
              key={b.id}
              href={b.href}
              className={`relative flex min-h-[172px] w-[86%] shrink-0 snap-start overflow-hidden rounded-3xl p-5 md:w-auto ${b.tone}`}
            >
              <div className="relative z-10 flex max-w-[62%] flex-col">
                <span className="text-xs font-medium opacity-75">{b.eyebrow}</span>
                <span className="mt-1.5 font-display text-xl font-semibold leading-snug md:text-[22px]">{b.title}</span>
                <span className="mt-1 text-xs opacity-80">{b.body}</span>
                <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink shadow-xs">
                  {b.cta} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
              {b.image && (
                <ProductImage
                  src={b.image}
                  alt=""
                  eager
                  className="absolute -bottom-6 -right-6 h-40 w-40 rounded-full border-4 border-white/70 object-cover md:h-44 md:w-44"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Categories */}
        <section className="px-4 pt-7 md:px-0">
          <h2 className="section-title mb-4">Browse the aisles</h2>
          <div className="grid grid-cols-4 gap-x-3 gap-y-5 sm:grid-cols-7 lg:gap-x-5">
            {activeCategories.map((c) => (
              <CategoryTile key={c.id} category={c} />
            ))}
          </div>
        </section>

        <div className="mt-4 space-y-1">
          {orderAgain.length > 0 && <ProductRail title="Buy it again" products={orderAgain} seeAllHref="/orders" />}
          <ProductRail title="Everyday favourites" products={bestsellers} />
          <ProductRail title="Savings this week" products={deals.slice(0, 12)} />
          {activeCategories.map((c) => (
            <ProductRail key={c.id} title={c.name} products={byCategory(c.id)} seeAllHref={`/category/${c.slug}`} />
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
