'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CustomerAddress, Profile } from '@/types/database';
import { formatPhone, normalizePhone } from '@/lib/format';

interface Account {
  profile: Profile;
  addresses: CustomerAddress[];
  defaultAddressId: string | null;
  favorites: string[];
}

interface PendingOtp {
  phone: string;
  code: string;
  expiresAt: number;
  attempts: number;
}

interface AuthState {
  accounts: Record<string, Account>;
  currentPhone: string | null;
  guestFavorites: string[];
  pendingOtp: PendingOtp | null;
}

export type AddressInput = Omit<CustomerAddress, 'id' | 'user_id' | 'created_at'>;

export type VerifyResult =
  | { ok: true; isNewUser: boolean }
  | { ok: false; error: string };

interface AuthContextType {
  isHydrated: boolean;
  user: Profile | null;
  addresses: CustomerAddress[];
  defaultAddress: CustomerAddress | null;
  favorites: string[];
  isAuthenticated: boolean;
  /** Starts phone login. Returns the one-time code so the caller can deliver it (SMS gateway / test mode). */
  requestOtp: (phone: string) => string;
  verifyOtp: (code: string) => VerifyResult;
  pendingPhone: string | null;
  logout: () => void;
  saveAddress: (address: AddressInput) => CustomerAddress | null;
  updateAddress: (id: string, address: AddressInput) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  updateProfile: (profile: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'kirana_auth_v2';
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

const emptyState: AuthState = { accounts: {}, currentPhone: null, guestFavorites: [], pendingOtp: null };

function generateOtp(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(buf[0] % 1_000_000).padStart(6, '0');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(emptyState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) setState({ ...emptyState, ...JSON.parse(stored) });
    } catch (e) {
      console.error('Failed to load auth session', e);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save auth session', e);
    }
  }, [state, isHydrated]);

  const account = state.currentPhone ? state.accounts[state.currentPhone] ?? null : null;

  const updateAccount = (fn: (a: Account) => Account) => {
    setState((prev) => {
      if (!prev.currentPhone || !prev.accounts[prev.currentPhone]) return prev;
      return {
        ...prev,
        accounts: { ...prev.accounts, [prev.currentPhone]: fn(prev.accounts[prev.currentPhone]) },
      };
    });
  };

  const requestOtp = (rawPhone: string) => {
    const phone = normalizePhone(rawPhone);
    const code = generateOtp();
    setState((prev) => ({
      ...prev,
      pendingOtp: { phone, code, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 },
    }));
    return code;
  };

  const verifyOtp = (code: string): VerifyResult => {
    const pending = state.pendingOtp;
    if (!pending) return { ok: false, error: 'Session expired. Please request a new code.' };
    if (Date.now() > pending.expiresAt) {
      setState((prev) => ({ ...prev, pendingOtp: null }));
      return { ok: false, error: 'This code has expired. Please request a new one.' };
    }
    if (pending.attempts >= OTP_MAX_ATTEMPTS) {
      setState((prev) => ({ ...prev, pendingOtp: null }));
      return { ok: false, error: 'Too many attempts. Please request a new code.' };
    }
    if (code !== pending.code) {
      setState((prev) =>
        prev.pendingOtp ? { ...prev, pendingOtp: { ...prev.pendingOtp, attempts: prev.pendingOtp.attempts + 1 } } : prev
      );
      return { ok: false, error: 'Incorrect code. Please try again.' };
    }

    const phone = pending.phone;
    const existing = state.accounts[phone];
    const now = new Date().toISOString();
    const isNewUser = !existing || !existing.profile.full_name;

    setState((prev) => {
      const acc: Account = prev.accounts[phone] ?? {
        profile: {
          id: `cust-${phone}`,
          role: 'customer',
          full_name: '',
          phone: formatPhone(phone),
          email: null,
          avatar_url: null,
          created_at: now,
          updated_at: now,
        },
        addresses: [],
        defaultAddressId: null,
        favorites: [],
      };
      const favorites = Array.from(new Set([...acc.favorites, ...prev.guestFavorites]));
      return {
        ...prev,
        accounts: { ...prev.accounts, [phone]: { ...acc, favorites } },
        currentPhone: phone,
        guestFavorites: [],
        pendingOtp: null,
      };
    });

    return { ok: true, isNewUser };
  };

  const logout = () => {
    setState((prev) => ({ ...prev, currentPhone: null, pendingOtp: null }));
  };

  const saveAddress = (address: AddressInput): CustomerAddress | null => {
    if (!account) return null;
    const newAddress: CustomerAddress = {
      ...address,
      id: `addr-${Date.now().toString(36)}`,
      user_id: account.profile.id,
      created_at: new Date().toISOString(),
    };
    updateAccount((a) => {
      const makeDefault = a.addresses.length === 0 || address.is_default;
      return {
        ...a,
        addresses: [
          ...a.addresses.map((x) => (makeDefault ? { ...x, is_default: false } : x)),
          { ...newAddress, is_default: makeDefault },
        ],
        defaultAddressId: makeDefault ? newAddress.id : a.defaultAddressId,
      };
    });
    return newAddress;
  };

  const updateAddress = (id: string, address: AddressInput) => {
    updateAccount((a) => ({
      ...a,
      addresses: a.addresses.map((x) =>
        x.id === id ? { ...x, ...address } : address.is_default ? { ...x, is_default: false } : x
      ),
      defaultAddressId: address.is_default ? id : a.defaultAddressId,
    }));
  };

  const deleteAddress = (id: string) => {
    updateAccount((a) => {
      const addresses = a.addresses.filter((x) => x.id !== id);
      const defaultAddressId = a.defaultAddressId === id ? addresses[0]?.id ?? null : a.defaultAddressId;
      return {
        ...a,
        addresses: addresses.map((x) => ({ ...x, is_default: x.id === defaultAddressId })),
        defaultAddressId,
      };
    });
  };

  const setDefaultAddress = (id: string) => {
    updateAccount((a) => ({
      ...a,
      defaultAddressId: id,
      addresses: a.addresses.map((x) => ({ ...x, is_default: x.id === id })),
    }));
  };

  const favorites = account ? account.favorites : state.guestFavorites;

  const toggleFavorite = (productId: string) => {
    const flip = (list: string[]) =>
      list.includes(productId) ? list.filter((x) => x !== productId) : [...list, productId];
    if (account) {
      updateAccount((a) => ({ ...a, favorites: flip(a.favorites) }));
    } else {
      setState((prev) => ({ ...prev, guestFavorites: flip(prev.guestFavorites) }));
    }
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const updateProfile = (profileUpdate: Partial<Profile>) => {
    updateAccount((a) => ({
      ...a,
      profile: { ...a.profile, ...profileUpdate, updated_at: new Date().toISOString() },
    }));
  };

  const addresses = account?.addresses ?? [];
  const defaultAddress =
    addresses.find((a) => a.id === account?.defaultAddressId) || addresses[0] || null;

  return (
    <AuthContext.Provider
      value={{
        isHydrated,
        user: account?.profile ?? null,
        addresses,
        defaultAddress,
        favorites,
        isAuthenticated: !!account,
        requestOtp,
        verifyOtp,
        pendingPhone: state.pendingOtp?.phone ?? null,
        logout,
        saveAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        toggleFavorite,
        isFavorite,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
