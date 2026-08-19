import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, ArrowLeft, AlertCircle, LogIn, Mail } from 'lucide-react';
import { Logo } from '../../components/Logo';
import gsap from 'gsap';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isStaff, loginWithSupabase, loading } = useAuth();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const res = await loginWithSupabase(email, password);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setErrorMessage(
        res.error || 'Invalid administrator credentials. Please check your email and password.'
      );
    }
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

      {/* Admin Login Card */}
      <div
        ref={cardRef}
        className="w-full max-w-md bg-surface-200 border border-border rounded-2xl p-8 shadow-elevated space-y-6"
      >
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo size="lg" linkTo="/" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold uppercase text-white tracking-wide flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5 text-brand-orange" />
              <span>Organizer Console</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Sign in with your tournament administrator credentials.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="block text-gray-300 font-semibold uppercase text-[10px] tracking-wider">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@triplestars.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-300 border border-border rounded-xl pl-9 pr-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-gray-300 font-semibold uppercase text-[10px] tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-300 border border-border rounded-xl pl-9 pr-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-3 rounded-xl bg-brand-dark hover:bg-brand-orange text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-orange-sm active:scale-95 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Console'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-border text-center text-[11px] text-gray-500">
          <span>Triple Stars Official Esports Tournament Management System</span>
        </div>
      </div>
    </div>
  );
};
