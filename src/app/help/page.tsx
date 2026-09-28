'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ChevronDown, Mail, MessageCircle, Phone } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHeader } from '@/components/ui/PageHeader';
import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';

const ISSUES = [
  'Order is delayed',
  'Item missing from order',
  'Wrong item delivered',
  'Item damaged or expired',
  'Payment issue',
  'Something else',
];

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'Most orders arrive within the time shown in the app. Scheduled orders arrive in the slot you picked.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'Yes, from the order page, as long as the store hasn’t packed it yet. After that, please contact the store.',
  },
  {
    q: 'How do I pay?',
    a: 'Pay the rider in cash or scan the store’s UPI QR code with any UPI app when your order arrives.',
  },
  {
    q: 'An item was damaged or missing. What now?',
    a: 'Raise a request below with your order number. The store will call you and replace or refund the item.',
  },
];

function HelpView() {
  const params = useSearchParams();
  const { settings, orders, createSupportTicket } = useStore();
  const { user } = useAuth();
  const myOrders = user ? orders.filter((o) => o.user_id === user.id).slice(0, 10) : [];

  const [orderNumber, setOrderNumber] = useState(params.get('order') ?? '');
  const [issue, setIssue] = useState(ISSUES[0]);
  const [description, setDescription] = useState('');
  const [name, setName] = useState(user?.full_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const tel = settings.phone.replace(/\s/g, '');
  const whatsapp = `https://wa.me/${tel.replace(/\D/g, '')}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 10) return setError('Please describe the issue in a few words (10+ characters).');
    if (!user && (name.trim().length < 2 || phone.replace(/\D/g, '').length < 10))
      return setError('Please add your name and a 10-digit phone number so the store can reach you.');
    const t = createSupportTicket({
      customerName: user?.full_name || name.trim(),
      customerPhone: user?.phone || phone.trim(),
      orderNumber: orderNumber ? Number(orderNumber) : undefined,
      issueType: issue,
      description: description.trim(),
    });
    setTicketId(t.id);
  };

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 space-y-3 px-3 pb-28 pt-3 md:px-6 md:pt-2">
      <section className="card px-4 py-4">
        <h2 className="mb-3 text-sm font-bold text-ink">Talk to the store</h2>
        <div className="grid grid-cols-3 gap-2">
          <a href={`tel:${tel}`} className="flex flex-col items-center gap-1.5 rounded-xl border border-line py-3 text-xs font-semibold text-ink hover:bg-canvas">
            <Phone className="h-5 w-5 text-leaf-600" /> Call
          </a>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 rounded-xl border border-line py-3 text-xs font-semibold text-ink hover:bg-canvas">
            <MessageCircle className="h-5 w-5 text-leaf-600" /> WhatsApp
          </a>
          {settings.email ? (
            <a href={`mailto:${settings.email}`} className="flex flex-col items-center gap-1.5 rounded-xl border border-line py-3 text-xs font-semibold text-ink hover:bg-canvas">
              <Mail className="h-5 w-5 text-leaf-600" /> Email
            </a>
          ) : (
            <span />
          )}
        </div>
      </section>

      <section className="card px-4 py-4">
        <h2 className="mb-1 text-sm font-bold text-ink">Report an issue</h2>
        {ticketId ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-leaf-500" />
            <p className="mt-3 font-bold text-ink">Request received</p>
            <p className="mt-1 text-sm text-ink-muted">
              Reference <span className="tabular font-semibold text-ink">#{ticketId}</span>. The store will call you shortly.
            </p>
            <Link href="/" className="btn-secondary mt-5">
              Back to shopping
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-3 space-y-4">
            {myOrders.length > 0 && (
              <div>
                <label className="field-label" htmlFor="h-order">Order</label>
                <select id="h-order" className="field" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)}>
                  <option value="">Not about a specific order</option>
                  {myOrders.map((o) => (
                    <option key={o.id} value={o.order_number}>
                      #{o.order_number} · ₹{o.total_amount} · {o.status.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <span className="field-label">What went wrong?</span>
              <div className="flex flex-wrap gap-2">
                {ISSUES.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIssue(i)}
                    className={`rounded-full border px-3 py-1.5 text-[13px] transition ${
                      issue === i ? 'border-leaf-500 bg-leaf-50 font-medium text-leaf-700' : 'border-line text-ink-soft'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label" htmlFor="h-desc">Details</label>
              <textarea
                id="h-desc"
                rows={3}
                className="field resize-none"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value.slice(0, 600));
                  setError(null);
                }}
                placeholder="e.g. Received 1 packet of Tata Salt instead of 2"
              />
            </div>
            {!user && (
              <div className="grid grid-cols-2 gap-3">
                <input className="field" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="field" placeholder="Mobile number" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            )}
            {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              Submit request
            </button>
          </form>
        )}
      </section>

      <section className="card overflow-hidden">
        <h2 className="px-4 pb-1 pt-4 text-sm font-bold text-ink">Frequently asked questions</h2>
        <ul className="divide-y divide-line">
          {FAQS.map((f, i) => (
            <li key={f.q}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[14px] font-medium text-ink"
                aria-expanded={openFaq === i}
              >
                {f.q}
                <ChevronDown className={`h-4 w-4 shrink-0 text-ink-faint transition ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && <p className="px-4 pb-4 text-[13px] leading-relaxed text-ink-muted">{f.a}</p>}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default function HelpPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader hideOnMobile />
      <PageHeader title="Help & support" />
      <Suspense fallback={null}>
        <HelpView />
      </Suspense>
    </div>
  );
}
