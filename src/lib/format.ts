const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });

/** ₹1,249 — whole rupees shown without decimals, paise only when present. */
export function formatINR(value: number): string {
  const rounded = Math.round(Number(value) * 100) / 100;
  return `₹${inr.format(rounded)}`;
}

export function roundMoney(value: number): number {
  return Math.round(Number(value) * 100) / 100;
}

export function discountPercent(mrp: number, price: number): number {
  const m = Number(mrp);
  const p = Number(price);
  if (!m || p >= m) return 0;
  return Math.round(((m - p) / m) * 100);
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Formats ISO timestamps relative to now ("5 min ago", "Yesterday, 4:15 PM").
 * Non-ISO legacy strings are returned unchanged.
 */
export function formatRelative(value: string | null | undefined): string {
  const d = parseDate(value);
  if (!d) return value || '';
  const diffMs = Date.now() - d.getTime();
  const min = Math.round(diffMs / 60000);
  if (min >= 0 && min < 1) return 'Just now';
  if (min >= 0 && min < 60) return `${min} min ago`;
  const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return `Today, ${time}`;
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${time}`;
}

export function formatDate(value: string | null | undefined): string {
  const d = parseDate(value);
  if (!d) return value || '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(value: string | null | undefined): string {
  const d = parseDate(value);
  if (!d) return value || '';
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** "+91 98765 43210" from any 10-digit Indian mobile input. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return raw;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '').slice(-10);
}

export function isValidIndianMobile(raw: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizePhone(raw));
}

export function isValidPincode(raw: string): boolean {
  return /^[1-9]\d{5}$/.test(raw.trim());
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Order placed',
  confirmed: 'Confirmed',
  packed: 'Packed',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cod: 'Cash on delivery',
  upi: 'UPI on delivery',
  card: 'Card',
  netbanking: 'Netbanking',
  wallet: 'Wallet',
  cash_pos: 'Cash (counter)',
};
