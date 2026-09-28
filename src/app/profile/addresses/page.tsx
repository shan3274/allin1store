'use client';

import React, { useState } from 'react';
import { Briefcase, Home, MapPin, MoreVertical, Plus } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { PageHeader } from '@/components/ui/PageHeader';
import { RequireAuth } from '@/components/ui/RequireAuth';
import { EmptyState } from '@/components/ui/EmptyState';
import { Sheet } from '@/components/ui/Sheet';
import { AddressForm } from '@/components/AddressForm';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { CustomerAddress } from '@/types/database';

const ICON = { home: Home, work: Briefcase, other: MapPin };

function AddressBook() {
  const { addresses, defaultAddress, saveAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<CustomerAddress | 'new' | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-3 pb-28 pt-3 md:px-6 md:pt-2">
      <button
        onClick={() => setEditing('new')}
        className="card flex w-full items-center gap-3 px-4 py-4 text-[15px] font-semibold text-leaf-600 hover:bg-leaf-50/40"
      >
        <Plus className="h-5 w-5" /> Add a new address
      </button>

      {addresses.length === 0 ? (
        <EmptyState icon={<MapPin className="h-9 w-9" />} title="No saved addresses" description="Add an address to get your groceries delivered." />
      ) : (
        <>
          <p className="px-1 pb-2 pt-5 text-xs font-semibold uppercase tracking-wider text-ink-faint">Your saved addresses</p>
          <ul className="card divide-y divide-line overflow-hidden">
            {addresses.map((a) => {
              const Icon = ICON[a.address_type] || MapPin;
              const isDefault = a.id === defaultAddress?.id;
              return (
                <li key={a.id} className="relative flex gap-3.5 px-4 py-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas">
                    <Icon className="h-[18px] w-[18px] text-ink-soft" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-[15px] font-semibold capitalize text-ink">
                      {a.address_type}
                      {isDefault && (
                        <span className="rounded bg-leaf-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-leaf-700">Default</span>
                      )}
                    </p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-ink-muted">
                      {a.house_flat}, {a.street_area}
                      {a.landmark ? `, ${a.landmark}` : ''}, {a.city} {a.pincode}
                    </p>
                    <p className="text-[13px] text-ink-muted">
                      {a.name} · {a.phone}
                    </p>
                  </div>
                  <button
                    onClick={() => setMenuFor(menuFor === a.id ? null : a.id)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-canvas"
                    aria-label="Address options"
                    aria-expanded={menuFor === a.id}
                  >
                    <MoreVertical className="h-4 w-4 text-ink-soft" />
                  </button>
                  {menuFor === a.id && (
                    <div className="absolute right-4 top-14 z-10 w-44 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-pop">
                      <button onClick={() => { setEditing(a); setMenuFor(null); }} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-canvas">
                        Edit
                      </button>
                      {!isDefault && (
                        <button onClick={() => { setDefaultAddress(a.id); setMenuFor(null); }} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-canvas">
                          Set as default
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm('Delete this address?')) {
                            deleteAddress(a.id);
                            showToast({ type: 'info', title: 'Address deleted' });
                          }
                          setMenuFor(null);
                        }}
                        className="block w-full px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      <Sheet open={editing !== null} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add address' : 'Edit address'}>
        {editing !== null && (
          <AddressForm
            initial={editing === 'new' ? null : editing}
            onCancel={() => setEditing(null)}
            onSubmit={(data) => {
              if (editing === 'new') saveAddress(data);
              else updateAddress(editing.id, data);
              showToast({ type: 'success', title: editing === 'new' ? 'Address saved' : 'Address updated' });
              setEditing(null);
            }}
          />
        )}
      </Sheet>
    </main>
  );
}

export default function AddressesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SiteHeader hideOnMobile />
      <PageHeader title="Address book" backHref="/profile" />
      <RequireAuth>
        <AddressBook />
      </RequireAuth>
    </div>
  );
}
