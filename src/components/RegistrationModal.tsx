import React, { useState } from 'react';
import { Tournament } from '../types';
import { formatMAD, formatDate } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { store } from '../services/store';
import { X, CheckCircle, Wallet, ShieldCheck, UserCheck } from 'lucide-react';

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
  const { user } = useAuth();
  const [teamName, setTeamName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      store.registerPlayer(tournament.id, user, teamName || undefined);
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      alert('Registration could not be completed.');
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
              You are signed up for <span className="text-brand-orange font-semibold">{tournament.name}</span>. Please settle the entry fee of{' '}
              <strong className="text-white font-mono">{formatMAD(tournament.entry_fee_mad)}</strong> at Triple Stars cash desk.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-orange">
                Player Registration
              </span>
              <h2 className="text-xl font-display font-bold text-white uppercase mt-0.5">{tournament.name}</h2>
              <p className="text-xs text-gray-400">
                {tournament.game?.name} • Starts {formatDate(tournament.start_at)}
              </p>
            </div>

            {/* Pricing Summary */}
            <div className="p-4 rounded-xl bg-surface-300 border border-border space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Registered Handle</span>
                <span className="font-bold text-white font-mono">@{user?.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Entry Fee (Cash at Desk)</span>
                <span className="font-bold text-brand-orange font-mono">
                  {formatMAD(tournament.entry_fee_mad)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Prize Pool</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {formatMAD(tournament.prize_pool_mad)}
                </span>
              </div>
            </div>

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
            <div className="p-3 rounded-lg bg-surface-100 border border-border flex items-start space-x-2 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
              <span>
                Please check in at the Triple Stars front desk at least 15 minutes before the scheduled bracket match time.
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-3 pt-2">
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
