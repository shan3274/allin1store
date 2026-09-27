'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { MapPin, Plus, Trash2, CheckCircle2, ArrowLeft, Home, Briefcase, Building } from 'lucide-react';

export default function SavedAddressesPage() {
  const { addresses, defaultAddress, saveAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { showToast } = useToast();

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [houseFlat, setHouseFlat] = useState('');
  const [streetArea, setStreetArea] = useState('');
  const [city, setCity] = useState('Ghaziabad');
  const [pincode, setPincode] = useState('201001');
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('home');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!houseFlat || !streetArea) return;

    saveAddress({
      name: name || 'Customer',
      phone: phone || '+91 98765 43210',
      house_flat: houseFlat,
      street_area: streetArea,
      landmark: null,
      city,
      pincode,
      address_type: addressType,
      is_default: addresses.length === 0,
    });

    setShowAddForm(false);
    setName('');
    setPhone('');
    setHouseFlat('');
    setStreetArea('');

    showToast({
      type: 'success',
      title: 'Address Saved',
      message: 'New delivery address successfully recorded.',
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-2xl mx-auto w-full px-3 sm:px-6 py-6 space-y-6 flex-1">
        <div className="flex items-center justify-between">
          <Link href="/profile" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Profile
          </Link>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Address
          </button>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-green-600" /> Saved Delivery Addresses
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your residences, flat numbers, and work addresses for 25-minute delivery
          </p>
        </div>

        {/* Addresses List */}
        <div className="space-y-3">
          {addresses.map((addr) => {
            const isDefault = defaultAddress?.id === addr.id;

            return (
              <div
                key={addr.id}
                className={`bg-white rounded-3xl p-5 border shadow-2xs space-y-3 transition ${
                  isDefault ? 'border-green-600 ring-1 ring-green-600/40' : 'border-slate-200/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-green-100 text-green-800">
                      {addr.address_type}
                    </span>
                    {isDefault && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Default Delivery
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-xs font-bold text-green-700 hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                    {addresses.length > 1 && (
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-700 space-y-0.5">
                  <p className="font-bold text-slate-900 text-sm">{addr.name} • {addr.phone}</p>
                  <p className="leading-relaxed">
                    {addr.house_flat}, {addr.street_area}, {addr.city} - {addr.pincode}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Add Address */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">Add New Delivery Address</h3>

              <form onSubmit={handleAddAddress} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
                <input
                  type="tel"
                  required
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
                <input
                  type="text"
                  required
                  placeholder="Flat / House / Tower Number"
                  value={houseFlat}
                  onChange={(e) => setHouseFlat(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
                <textarea
                  required
                  rows={2}
                  placeholder="Street / Society / Area / Landmark"
                  value={streetArea}
                  onChange={(e) => setStreetArea(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex gap-2">
                  {(['home', 'work', 'other'] as const).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setAddressType(type)}
                      className={`flex-1 py-1.5 text-xs font-bold uppercase rounded-xl border transition ${
                        addressType === type
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-green-600 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
