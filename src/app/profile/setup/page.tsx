'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, User, Phone, Mail, CheckCircle2 } from 'lucide-react';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProfile({
      full_name: name,
      email: email || null,
      phone,
    });

    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your personal information was saved successfully.',
    });

    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      <Navbar />

      <main className="max-w-md mx-auto w-full px-4 py-8 flex-1 flex flex-col justify-center space-y-6">
        <Link href="/profile" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 self-start">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Profile
        </Link>

        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Profile Settings
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Keep your grocery contact details updated for delivery updates
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Mobile Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address (Optional)</label>
            <input
              type="email"
              value={email}
              placeholder="e.g. rahul@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition"
          >
            Save Profile Changes
          </button>
        </form>
      </main>
    </div>
  );
}
