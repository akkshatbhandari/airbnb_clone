'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWishlists, toggleWishlist as toggleWishlistApi } from '@/lib/api';

type Role = 'GUEST' | 'HOST';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  wishlistIds: Set<string>;
  toggleWishlistId: (id: string) => void;
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>('GUEST');
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set(['list_1']));
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load persisted role and wishlists on mount
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('airbnb_active_role') as Role;
      if (savedRole === 'GUEST' || savedRole === 'HOST') {
        setRoleState(savedRole);
      }
    } catch (e) {
      // localStorage unavailable in some environments
    }

    fetchWishlists()
      .then((items) => {
        if (items && items.length > 0) {
          const ids = new Set(
            items.map((item) => item.listing_id || item.listing?.id).filter(Boolean) as string[]
          );
          setWishlistIds(ids);
        }
      })
      .catch(() => {});
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    try {
      localStorage.setItem('airbnb_active_role', newRole);
    } catch (e) {}
  };

  const addToast = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleWishlistId = (id: string) => {
    const wasSaved = wishlistIds.has(id);

    // 1. Update local Set state cleanly
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (wasSaved) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

    // 2. Trigger side-effects outside of state updater callback
    if (wasSaved) {
      addToast('Removed from Wishlist', 'Item removed from your saved list', 'info');
    } else {
      addToast('Saved to Wishlist', 'Added to your favorites', 'success');
    }

    // 3. Persist change to backend DB
    toggleWishlistApi(id).catch(() => {});
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        wishlistIds,
        toggleWishlistId,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
