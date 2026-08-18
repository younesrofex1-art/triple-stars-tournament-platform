import React, { useState } from 'react';
import { Tournament } from '../types';
import { formatMAD, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { store } from '../services/store';
import { X, CheckCircle, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

interface RegistrationModalProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  tournament,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, loginAsPlayer } = useAuth();
  const [teamName, setTeamName] = useState('');
  
  // Walk-in / Guest fields if not signed in yet
  const [guestUsername, setGuestUsername] = useState('');
  const [guestDisplayName, setGuestDisplayName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      let activePlayer = user;

      // If not logged in, create a real player profile first
      if (!activePlayer) {
        if (!guestUsername.trim() || !guestDisplayName.trim() || !guestEmail.trim()) {
          setErrorMessage('Please provide your gamer tag, full name, and email.');
          setIsSubmitting(false);
          return;
        }

        const newProfile = await store.createPlayerProfile({
          username: guestUsername,
          display_name: guestDisplayName,
          email: guestEmail,
          phone: guestPhone || undefined,
        });

        await loginAsPlayer(newProfile.username);
        activePlayer = newProfile;
      }

      await store.registerPlayer(tournament.id, activePlayer, teamName || undefined);
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess?.();
        onClose();
      }, 1800);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Registration could not be completed. You may already be registered.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-surface-200 border border-border rounded-2xl p-6 shadow-elevated overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-surface-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto" />
            <h3 className="text-2xl font-bold font-display uppercase text-white">Registration Confirmed</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              You are signed up for <span className="text-brand-orange font-semibold">{tournament.name}</span>. Settle the entry fee of{' '}
              <strong className="text-white font-mono">{formatMAD(tournament.entry_fee_mad)}</strong> at Triple Stars cash desk.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-orange">
                Player Registration
              </span>
              <h2 className="text-xl font-display font-bold text-white uppercase mt-0.5">{tournament.name}</h2>
              <p className="text-xs text-gray-400">
                {tournament.game?.name} • Starts {formatDate(tournament.start_at)}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Pricing Summary */}
            <div className="p-3.5 rounded-xl bg-surface-300 border border-border space-y-2 text-xs">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Competitor</span>
                  <span className="font-bold text-white font-mono">@{user.username} ({user.display_name})</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Entry Fee (Pay at Cash Desk)</span>
                <span className="font-bold text-brand-orange font-mono">
                  {formatMAD(tournament.entry_fee_mad)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Guaranteed Prize Pool</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {formatMAD(tournament.prize_pool_mad)}
                </span>
              </div>
            </div>

            {/* If not logged in, ask for gamer info */}
            {!user && (
              <div className="space-y-3 p-3.5 rounded-xl bg-surface-100 border border-border">
                <div className="text-[11px] font-bold text-brand-orange uppercase font-mono">
                  Competitor Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="block text-gray-300 font-semibold">Gamer Tag *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. striker_99"
                      value={guestUsername}
                      onChange={(e) => setGuestUsername(e.target.value)}
                      className="w-full bg-surface-300 border border-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-gray-300 font-semibold">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Yassine Tazi"
                      value={guestDisplayName}
                      onChange={(e) => setGuestDisplayName(e.target.value)}
                      className="w-full bg-surface-300 border border-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-gray-300 font-semibold">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="yassine@gmail.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-surface-300 border border-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-gray-300 font-semibold">Phone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+212 600-000000"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-surface-300 border border-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Optional Team Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-300">
                Team / Clan Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Atlas Esports"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
              />
            </div>

            {/* Terms notice */}
            <div className="p-2.5 rounded-lg bg-surface-100 border border-border flex items-start space-x-2 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
              <span>
                Please check in at the Triple Stars front desk at least 15 minutes before match time.
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 text-gray-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-brand-dark hover:bg-brand-orange text-white font-bold text-xs uppercase tracking-wider shadow-orange-sm transition-colors flex items-center justify-center space-x-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Confirm ({formatMAD(tournament.entry_fee_mad)})</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
