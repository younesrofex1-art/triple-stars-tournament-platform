import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, ArrowLeft, AlertCircle, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isStaff, loginWithSupabase, signUpWithSupabase, loading } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('admin');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (mode === 'signin') {
      const res = await loginWithSupabase(email, password);
      setIsSubmitting(false);

      if (res.success) {
        navigate('/admin');
      } else {
        setErrorMessage(res.error || 'Invalid administrator credentials. Please check your email and password.');
      }
    } else {
      if (!username.trim() || !displayName.trim()) {
        setErrorMessage('Please provide both username and full name.');
        setIsSubmitting(false);
        return;
      }

      const res = await signUpWithSupabase(email, password, {
        username,
        display_name: displayName,
        role,
      });
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage('Staff account created successfully! Signing in...');
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        setErrorMessage(res.error || 'Failed to create staff account.');
      }
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

      {/* Login / Signup Card */}
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
            {mode === 'signin'
              ? 'Authenticate using your Triple Stars credentials to access tournament control.'
              : 'Register a new administrator or tournament director account.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-surface-300 p-1 border border-border text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'signin'
                ? 'bg-surface-100 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              mode === 'signup'
                ? 'bg-surface-100 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Staff Account</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Supabase Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <>
              <div className="space-y-1">
                <label className="block text-gray-300 font-semibold">Full Name / Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Khalid Alami"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-300 font-semibold">Admin Username Handle</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. khalid_admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-300 font-semibold">Staff Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'staff')}
                  className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-dark"
                >
                  <option value="admin">Administrator / Tournament Director</option>
                  <option value="staff">Gaming Hall Staff / Score Keeper</option>
                </select>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="block text-gray-300 font-semibold">Email Address</label>
            <input
              type="email"
              required
              placeholder="admin@triplestars.ma"
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
              minLength={6}
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
            <span>
              {isSubmitting
                ? 'Processing...'
                : mode === 'signin'
                ? 'Sign In to Admin Dashboard'
                : 'Create Staff Account'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
