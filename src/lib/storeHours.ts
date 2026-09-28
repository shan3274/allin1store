import type { StoreSettings } from '@/types/database';

function toMinutes(t: string | null): number | null {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  if (Number.isNaN(h)) return null;
  return h * 60 + (m || 0);
}

export function formatClock(t: string | null): string {
  const mins = toMinutes(t);
  if (mins === null) return '';
  const d = new Date();
  d.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

export interface StoreStatus {
  isOpen: boolean;
  /** Human text such as "Opens at 7:00 am" when closed. */
  message: string;
}

/** Store is open only when the owner toggle is on AND current time is within hours. */
export function getStoreStatus(settings: StoreSettings, now: Date = new Date()): StoreStatus {
  if (!settings.is_store_open) {
    return { isOpen: false, message: 'Store is closed right now. Please check back soon.' };
  }
  const open = toMinutes(settings.opening_time);
  const close = toMinutes(settings.closing_time);
  if (open === null || close === null) return { isOpen: true, message: '' };

  const cur = now.getHours() * 60 + now.getMinutes();
  const within = open <= close ? cur >= open && cur < close : cur >= open || cur < close;
  if (within) return { isOpen: true, message: '' };
  return {
    isOpen: false,
    message: `Store is closed. Opens at ${formatClock(settings.opening_time)}.`,
  };
}

export interface DeliverySlot {
  id: string;
  label: string;
  sublabel: string;
}

/**
 * "Now" (when open) plus the next few 2-hour slots inside store hours,
 * rolling over to tomorrow.
 */
export function getDeliverySlots(settings: StoreSettings, now: Date = new Date()): DeliverySlot[] {
  const slots: DeliverySlot[] = [];
  const status = getStoreStatus(settings, now);
  if (status.isOpen) {
    slots.push({ id: 'asap', label: 'Now', sublabel: '25–35 min' });
  }

  const open = toMinutes(settings.opening_time) ?? 7 * 60;
  const close = toMinutes(settings.closing_time) ?? 22 * 60;
  const fmt = (d: Date) => d.toLocaleTimeString('en-IN', { hour: 'numeric' });

  for (let dayOffset = 0; dayOffset < 2 && slots.length < 4; dayOffset++) {
    for (let start = open; start + 120 <= close && slots.length < 4; start += 120) {
      const s = new Date(now);
      s.setDate(now.getDate() + dayOffset);
      s.setHours(Math.floor(start / 60), start % 60, 0, 0);
      // leave an hour of prep time
      if (s.getTime() < now.getTime() + 60 * 60000) continue;
      const e = new Date(s.getTime() + 120 * 60000);
      const day = dayOffset === 0 ? 'Today' : 'Tomorrow';
      slots.push({
        id: s.toISOString(),
        label: `${day}`,
        sublabel: `${fmt(s)} – ${fmt(e)}`,
      });
    }
  }
  return slots;
}
