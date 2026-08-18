import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile } from '../types';
import { supabase } from '../lib/supabase';
import { store } from '../services/store';

interface SignUpOptions {
  username: string;
  display_name: string;
  phone?: string;
  role?: 'admin' | 'staff' | 'player';
}

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  loginAsPlayer: (username: string) => Promise<boolean>;
  loginWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithSupabase: (email: string, password: string, options: SignUpOptions) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isStaff: false,
  loginAsPlayer: async () => false,
  loginWithSupabase: async () => ({ success: false }),
  signUpWithSupabase: async () => ({ success: false }),
  logout: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('triple_stars_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string, email?: string): Promise<Profile | null> => {
    try {
      // 1. Fetch profile from public.profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      // 2. Fetch role from public.user_roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      const highestRole = roles && roles.length > 0
        ? (roles.some((r) => r.role === 'super_admin')
            ? 'super_admin'
            : roles.some((r) => r.role === 'admin')
            ? 'admin'
            : 'staff')
        : undefined;

      if (profile) {
        const fullProfile: Profile = {
          ...profile,
          role: highestRole || profile.role,
        };
        setUser(fullProfile);
        localStorage.setItem('triple_stars_user', JSON.stringify(fullProfile));
        return fullProfile;
      }

      // If profile not yet populated by trigger, construct basic profile
      if (email) {
        const fallbackProfile: Profile = {
          id: userId,
          username: email.split('@')[0],
          display_name: email.split('@')[0],
          email,
          wins: 0,
          losses: 0,
          championships: 0,
          total_prize_money: 0,
          points: 0,
          is_disabled: false,
          role: highestRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUser(fallbackProfile);
        localStorage.setItem('triple_stars_user', JSON.stringify(fallbackProfile));
        return fallbackProfile;
      }

      return null;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      return null;
    }
  };

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('triple_stars_user');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Quick player select login (for gaming hall kiosk / public profile view)
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

  // Real Supabase Sign In
  const loginWithSupabase = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchUserProfile(data.user.id, data.user.email);
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: 'User could not be found' };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Authentication failed' };
    }
  };

  // Real Supabase Sign Up
  const signUpWithSupabase = async (
    email: string,
    password: string,
    options: SignUpOptions
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: options.username.trim().toLowerCase(),
            display_name: options.display_name.trim(),
            full_name: options.display_name.trim(),
            phone: options.phone?.trim() || null,
          },
        },
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // If staff role requested or first user, assign role
        if (options.role && options.role !== 'player') {
          try {
            await supabase.from('user_roles').insert({
              user_id: data.user.id,
              role: options.role,
            });
          } catch (e) {
            // Handled by triggers or permissions
          }
        }

        await fetchUserProfile(data.user.id, data.user.email);
        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: 'Account created. Please verify your email if required.' };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Sign up failed' };
    }
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

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    try {
      await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('triple_stars_user', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update profile:', e);
    }
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
        signUpWithSupabase,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
