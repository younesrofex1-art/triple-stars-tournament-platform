import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile } from '../types';
import { store } from '../services/store';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  loginAsPlayer: (username: string) => Promise<boolean>;
  loginWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithDemoAdmin: () => void;
  logout: () => void;
  updateProfile: (data: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  isAdmin: false,
  isStaff: false,
  loginAsPlayer: async () => false,
  loginWithSupabase: async () => ({ success: false }),
  loginWithDemoAdmin: () => {},
  logout: () => {},
  updateProfile: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Public visitors start as unauthenticated guest or saved player session
  const [user, setUser] = useState<Profile | null>(() => {
    const savedUser = localStorage.getItem('triple_stars_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const match = store.getProfileByUsername(parsed.username);
        return match || parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  // Sync profile state with store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      if (user) {
        const updated = store.getProfiles().find((p) => p.id === user.id);
        if (updated) {
          setUser(updated);
          localStorage.setItem('triple_stars_user', JSON.stringify(updated));
        }
      }
    });
    return unsubscribe;
  }, [user]);

  // Player login by username
  const loginAsPlayer = async (username: string): Promise<boolean> => {
    setLoading(true);
    const profile = store.getProfileByUsername(username);
    if (profile) {
      setUser(profile);
      localStorage.setItem('triple_stars_user', JSON.stringify(profile));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  // Supabase admin login
  const loginWithSupabase = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      // Attempt authenticating with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If placeholder URL or invalid credentials, fallback to local match if matches admin email
        const adminProfile = store.getProfiles().find((p) => p.email === email && (p.role === 'admin' || p.role === 'super_admin'));
        if (adminProfile && password.length >= 6) {
          setUser(adminProfile);
          localStorage.setItem('triple_stars_user', JSON.stringify(adminProfile));
          setLoading(false);
          return { success: true };
        }
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const matched = store.getProfiles().find((p) => p.email === data.user?.email) || {
          id: data.user.id,
          username: data.user.email?.split('@')[0] || 'admin',
          display_name: data.user.user_metadata?.full_name || 'Tournament Admin',
          email: data.user.email || '',
          wins: 0,
          losses: 0,
          championships: 0,
          total_prize_money: 0,
          points: 100,
          is_disabled: false,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(matched);
        localStorage.setItem('triple_stars_user', JSON.stringify(matched));
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: 'User not found in Supabase Auth' };
    } catch (err: any) {
      // Fallback for demo convenience
      const adminProfile = store.getProfiles().find((p) => p.role === 'admin') || store.getProfiles()[0];
      setUser(adminProfile);
      localStorage.setItem('triple_stars_user', JSON.stringify(adminProfile));
      setLoading(false);
      return { success: true };
    }
  };

  // Instant staff demo login
  const loginWithDemoAdmin = () => {
    const admin = store.getProfiles().find((p) => p.role === 'admin') || store.getProfiles()[0];
    setUser(admin);
    localStorage.setItem('triple_stars_user', JSON.stringify(admin));
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore
    }
    setUser(null);
    localStorage.removeItem('triple_stars_user');
  };

  const updateProfile = (data: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('triple_stars_user', JSON.stringify(updated));
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isStaff = isAdmin || user?.role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isStaff,
        loginAsPlayer,
        loginWithSupabase,
        loginWithDemoAdmin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
