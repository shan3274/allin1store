'use client';

import React, { useState } from 'react';
import { Briefcase, Home, MapPin } from 'lucide-react';
import type { CustomerAddress } from '@/types/database';
import type { AddressInput } from '@/context/AuthContext';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/context/StoreContext';
import { formatPhone, isValidIndianMobile, isValidPincode, normalizePhone } from '@/lib/format';

interface AddressFormProps {
  initial?: CustomerAddress | null;
  onSubmit: (address: AddressInput) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const TYPES = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'work', label: 'Work', icon: Briefcase },
  { id: 'other', label: 'Other', icon: MapPin },
] as const;

type Errors = Partial<Record<'name' | 'phone' | 'house_flat' | 'street_area' | 'city' | 'pincode', string>>;

export function AddressForm({ initial, onSubmit, onCancel, submitLabel = 'Save address' }: AddressFormProps) {
  const { user } = useAuth();
  const { settings } = useStore();

  const [form, setForm] = useState({
    name: initial?.name ?? user?.full_name ?? '',
    phone: normalizePhone(initial?.phone ?? user?.phone ?? ''),
    house_flat: initial?.house_flat ?? '',
    street_area: initial?.street_area ?? '',
    landmark: initial?.landmark ?? '',
    city: initial?.city ?? settings.city,
    pincode: initial?.pincode ?? '',
    address_type: initial?.address_type ?? ('home' as CustomerAddress['address_type']),
    is_default: initial?.is_default ?? false,
  });
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = 'Enter the receiver’s name';
    if (!isValidIndianMobile(form.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    if (!form.house_flat.trim()) e.house_flat = 'Enter house / flat number';
    if (form.street_area.trim().length < 3) e.street_area = 'Enter area, street or society';
    if (!form.city.trim()) e.city = 'Enter city';
    if (!isValidPincode(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode';
    else if (settings.serviceable_pincodes?.length && !settings.serviceable_pincodes.includes(form.pincode.trim())) {
      e.pincode = 'Sorry, we don’t deliver to this pincode yet';
    }
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    onSubmit({
      name: form.name.trim(),
      phone: formatPhone(form.phone),
      house_flat: form.house_flat.trim(),
      street_area: form.street_area.trim(),
      landmark: form.landmark.trim() || null,
      city: form.city.trim(),
      pincode: form.pincode.trim(),
      address_type: form.address_type,
      is_default: form.is_default,
    });
  };

  const err = (k: keyof Errors) =>
    errors[k] ? <p className="mt-1 text-xs font-medium text-rose-600">{errors[k]}</p> : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <span className="field-label">Save address as</span>
        <div className="flex gap-2">
          {TYPES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => set('address_type', id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                form.address_type === id
                  ? 'border-leaf-500 bg-leaf-50 text-leaf-700'
                  : 'border-line text-ink-soft hover:border-ink-faint'
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="addr-house">House / flat / floor *</label>
        <input id="addr-house" className="field" value={form.house_flat} onChange={(e) => set('house_flat', e.target.value)} autoComplete="address-line1" />
        {err('house_flat')}
      </div>
      <div>
        <label className="field-label" htmlFor="addr-street">Area / sector / society *</label>
        <input id="addr-street" className="field" value={form.street_area} onChange={(e) => set('street_area', e.target.value)} autoComplete="address-line2" />
        {err('street_area')}
      </div>
      <div>
        <label className="field-label" htmlFor="addr-landmark">Nearby landmark (optional)</label>
        <input id="addr-landmark" className="field" value={form.landmark} onChange={(e) => set('landmark', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label" htmlFor="addr-city">City *</label>
          <input id="addr-city" className="field" value={form.city} onChange={(e) => set('city', e.target.value)} autoComplete="address-level2" />
          {err('city')}
        </div>
        <div>
          <label className="field-label" htmlFor="addr-pin">Pincode *</label>
          <input
            id="addr-pin"
            className="field tabular"
            inputMode="numeric"
            maxLength={6}
            value={form.pincode}
            onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))}
            autoComplete="postal-code"
          />
          {err('pincode')}
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <p className="mb-3 text-sm font-semibold text-ink">Receiver details</p>
        <div className="space-y-4">
          <div>
            <label className="field-label" htmlFor="addr-name">Name *</label>
            <input id="addr-name" className="field" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
            {err('name')}
          </div>
          <div>
            <label className="field-label" htmlFor="addr-phone">Mobile number *</label>
            <div className="flex">
              <span className="flex items-center rounded-l-xl border border-r-0 border-line bg-canvas px-3 text-sm font-medium text-ink-muted">+91</span>
              <input
                id="addr-phone"
                className="field rounded-l-none tabular"
                inputMode="numeric"
                maxLength={10}
                value={form.phone}
                onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
                autoComplete="tel-national"
              />
            </div>
            {err('phone')}
          </div>
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={form.is_default}
          onChange={(e) => set('is_default', e.target.checked)}
          className="h-4 w-4 rounded border-line accent-leaf-500"
        />
        Make this my default address
      </label>

      <div className="flex gap-3 pt-1">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary flex-1">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
