import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, ArrowLeft, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import gsap from 'gsap';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isStaff, loginWithSupabase, loginWithDemoAdmin, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStaff) {
      navigate('/admin');
    }
  }, [isStaff, navigate]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, []);

  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const res = await loginWithSupabase(email, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setErrorMessage(res.error || 'Invalid administrator credentials');
    }
  };

  const handleDemoBypass = () => {
    loginWithDemoAdmin();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background text-gray-200 flex flex-col items-center justify-center p-4 selection:bg-brand-dark selection:text-white">
      {/* Top back link */}
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tournament Platform</span>
        </Link>
      </div>

      {/* Login Card */}
      <div
        ref={cardRef}
        className="w-full max-w-md bg-surface-200 border border-border rounded-2xl p-8 shadow-elevated space-y-6"
      >
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-surface-300 border border-brand-dark/40 flex items-center justify-center mx-auto text-brand-orange">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
            Staff & Admin Portal
          </h1>
          <p className="text-xs text-gray-400">
            Authenticate using your Triple Stars Supabase credentials to access the tournament management system.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Supabase Auth Form */}
        <form onSubmit={handleSupabaseLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="block text-gray-300 font-semibold">Admin Email</label>
            <input
              type="email"
              required
              placeholder="khalid@triplestars.ma"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-300 font-semibold">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-3 rounded-xl bg-brand-dark hover:bg-brand-orange text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 shadow-orange-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In with Supabase'}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative text-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <span className="relative bg-surface-200 px-3 text-[10px] text-gray-500 uppercase font-mono">
            Or Demo Access
          </span>
        </div>

        {/* Instant 1-Click Demo Login */}
        <button
          onClick={handleDemoBypass}
          className="w-full py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-border text-gray-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
        >
          <KeyRound className="w-3.5 h-3.5 text-brand-orange" />
          <span>Instant Staff Demo Login (Khalid Admin)</span>
        </button>
      </div>
    </div>
  );
};
