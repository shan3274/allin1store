'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Check, Home, MapPin, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Sheet } from './ui/Sheet';
import { AddressForm } from './AddressForm';

const TYPE_ICON = { home: Home, work: Briefcase, other: MapPin };

interface AddressPickerProps {
  open: boolean;
  onClose: () => void;
  /** Called with the chosen address id (defaults to making it the default address). */
  onSelect?: (id: string) => void;
  selectedId?: string | null;
}

export function AddressPicker({ open, onClose, onSelect, selectedId }: AddressPickerProps) {
  const { isAuthenticated, addresses, defaultAddress, setDefaultAddress, saveAddress } = useAuth();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);

  const current = selectedId ?? defaultAddress?.id ?? null;

  const choose = (id: string) => {
    if (onSelect) onSelect(id);
    else setDefaultAddress(id);
    onClose();
  };

  const close = () => {
    setAdding(false);
    onClose();
  };

  return (
    <Sheet
      open={open}
      onClose={close}
      title={adding ? 'Add delivery address' : 'Select delivery location'}
      size="md"
    >
      {!isAuthenticated ? (
        <div className="py-6 text-center">
          <MapPin className="mx-auto mb-3 h-10 w-10 text-ink-faint" />
          <p className="text-sm text-ink-muted">Log in to add or pick a saved address.</p>
          <Link href="/login" onClick={close} className="btn-primary mt-5 w-full">
            Log in
          </Link>
        </div>
      ) : adding ? (
        <AddressForm
          onCancel={() => setAdding(false)}
          onSubmit={(data) => {
            const created = saveAddress(data);
            setAdding(false);
            if (created) {
              showToast({ type: 'success', title: 'Address saved' });
              choose(created.id);
            }
          }}
        />
      ) : (
        <div className="space-y-2">
          <button
            onClick={() => setAdding(true)}
            className="flex w-full items-center gap-3 rounded-xl border border-dashed border-leaf-500/50 px-4 py-3.5 text-sm font-semibold text-leaf-600 hover:bg-leaf-50"
          >
            <Plus className="h-4 w-4" /> Add a new address
          </button>

          {addresses.length > 0 && (
            <p className="px-1 pb-1 pt-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Saved addresses
            </p>
          )}
          {addresses.map((a) => {
            const Icon = TYPE_ICON[a.address_type] || MapPin;
            const active = a.id === current;
            return (
              <button
                key={a.id}
                onClick={() => choose(a.id)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
                  active ? 'border-leaf-500 bg-leaf-50/60' : 'border-line hover:border-ink-faint/60'
                }`}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas text-ink-soft">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold capitalize text-ink">{a.address_type}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-ink-muted">
                    {a.house_flat}, {a.street_area}
                    {a.landmark ? `, ${a.landmark}` : ''}, {a.city} {a.pincode}
                  </span>
                </span>
                {active && <Check className="mt-1 h-4 w-4 shrink-0 text-leaf-600" />}
              </button>
            );
          })}
        </div>
      )}
    </Sheet>
  );
}
