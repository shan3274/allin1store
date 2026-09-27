'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerAddress, Profile } from '@/types/database';

export interface UserSession {
  user: Profile | null;
  addresses: CustomerAddress[];
  defaultAddressId: string | null;
  favorites: string[]; // product IDs
  isAdminLoggedIn: boolean;
}

interface AuthContextType {
  user: Profile | null;
  addresses: CustomerAddress[];
  defaultAddress: CustomerAddress | null;
  favorites: string[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginWithPhone: (phone: string, fullName?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  adminLogin: (passcode: string) => boolean;
  adminLogout: () => void;
  saveAddress: (address: Omit<CustomerAddress, 'id' | 'user_id' | 'created_at'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  updateProfile: (profile: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'kirana_auth_v1';

const DEFAULT_ADDRESSES: CustomerAddress[] = [
  {
    id: 'addr-default-1',
    user_id: 'cust-demo-1',
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    house_flat: 'Flat 402, Block B',
    street_area: 'Gaur City 2, Sector 16C',
    landmark: 'Near Galaxy Plaza',
    city: 'Ghaziabad',
    pincode: '201009',
    address_type: 'home',
    is_default: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'addr-default-2',
    user_id: 'cust-demo-1',
    name: 'Rahul Sharma (Office)',
    phone: '+91 98765 43210',
    house_flat: 'Floor 3, Tower A',
    street_area: 'Cyber Hub Tech Park',
    landmark: 'Opposite Metro Pillar 42',
    city: 'Noida',
    pincode: '201301',
    address_type: 'work',
    is_default: false,
    created_at: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession>({
    user: {
      id: 'cust-demo-1',
      role: 'customer',
      full_name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      email: 'rahul.sharma@example.com',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    addresses: DEFAULT_ADDRESSES,
    defaultAddressId: 'addr-default-1',
    favorites: ['p-1', 'p-7', 'p-10'],
    isAdminLoggedIn: true,
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load auth session', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      } catch (e) {
        console.error('Failed to save auth session', e);
      }
    }
  }, [session, isLoaded]);

  const loginWithPhone = async (phone: string, fullName: string = 'Kirana Customer') => {
    // Generate or update customer session
    const customerUser: Profile = {
      id: `cust-${Date.now().toString(36)}`,
      role: 'customer',
      full_name: fullName,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email: null,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setSession((prev) => ({
      ...prev,
      user: customerUser,
    }));
  };

  const loginWithGoogle = async () => {
    const customerUser: Profile = {
      id: `cust-google-${Date.now().toString(36)}`,
      role: 'customer',
      full_name: 'Aditi Verma',
      phone: '+91 98112 34567',
      email: 'aditi.verma@gmail.com',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setSession((prev) => ({
      ...prev,
      user: customerUser,
    }));
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    // Standard test OTP '123456' or any 6-digit number in demo
    return otp.length === 6;
  };

  const logout = () => {
    setSession((prev) => ({
      ...prev,
      user: null,
      isAdminLoggedIn: false,
    }));
  };

  const adminLogin = (passcode: string): boolean => {
    if (passcode === 'admin123' || passcode === 'kirana2026' || passcode === '123456') {
      setSession((prev) => ({
        ...prev,
        isAdminLoggedIn: true,
      }));
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setSession((prev) => ({
      ...prev,
      isAdminLoggedIn: false,
    }));
  };

  const saveAddress = (address: Omit<CustomerAddress, 'id' | 'user_id' | 'created_at'>) => {
    const newAddress: CustomerAddress = {
      ...address,
      id: `addr-${Date.now()}`,
      user_id: session.user ? session.user.id : 'guest',
      created_at: new Date().toISOString(),
    };

    setSession((prev) => {
      const isFirst = prev.addresses.length === 0;
      const updated = [...prev.addresses, newAddress];
      return {
        ...prev,
        addresses: updated,
        defaultAddressId: isFirst || newAddress.is_default ? newAddress.id : prev.defaultAddressId,
      };
    });
  };

  const deleteAddress = (id: string) => {
    setSession((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
      defaultAddressId: prev.defaultAddressId === id ? (prev.addresses[0]?.id || null) : prev.defaultAddressId,
    }));
  };

  const setDefaultAddress = (id: string) => {
    setSession((prev) => ({
      ...prev,
      defaultAddressId: id,
      addresses: prev.addresses.map((a) => ({
        ...a,
        is_default: a.id === id,
      })),
    }));
  };

  const toggleFavorite = (productId: string) => {
    setSession((prev) => {
      const exists = prev.favorites.includes(productId);
      return {
        ...prev,
        favorites: exists ? prev.favorites.filter((id) => id !== productId) : [...prev.favorites, productId],
      };
    });
  };

  const isFavorite = (productId: string) => {
    return session.favorites.includes(productId);
  };

  const updateProfile = (profileUpdate: Partial<Profile>) => {
    if (!session.user) return;
    setSession((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...profileUpdate, updated_at: new Date().toISOString() } : null,
    }));
  };

  const defaultAddress =
    session.addresses.find((a) => a.id === session.defaultAddressId) ||
    session.addresses[0] ||
    null;

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        addresses: session.addresses,
        defaultAddress,
        favorites: session.favorites,
        isAuthenticated: !!session.user,
        isAdmin: session.isAdminLoggedIn,
        loginWithPhone,
        loginWithGoogle,
        verifyOtp,
        logout,
        adminLogin,
        adminLogout,
        saveAddress,
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
