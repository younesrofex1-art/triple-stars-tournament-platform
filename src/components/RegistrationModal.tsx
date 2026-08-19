import React, { useState } from 'react';
import { X, CheckCircle, Trophy, Phone, User, Tag } from 'lucide-react';
import { Tournament } from '../types';
import { formatMAD } from '../utils/formatters';
import { store } from '../services/store';
import { useLanguage } from '../context/LanguageContext';

interface RegistrationModalProps {
  tournaments: Tournament[];
  initialTournamentId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  tournaments,
  initialTournamentId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t, isRTL } = useLanguage();

  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(
    initialTournamentId || tournaments[0]?.id || ''
  );
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [teamName, setTeamName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (initialTournamentId) {
      setSelectedTournamentId(initialTournamentId);
    } else if (tournaments.length > 0 && !selectedTournamentId) {
      setSelectedTournamentId(tournaments[0].id);
    }
  }, [initialTournamentId, tournaments]);

  if (!isOpen) return null;

  const currentTournament = tournaments.find((t) => t.id === selectedTournamentId) || tournaments[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !phone.trim()) {
      setErrorMessage(
        isRTL
          ? 'يرجى إدخال الاسم ورقم الهاتف للمتابعة.'
          : 'Please enter your name and phone number to continue.'
      );
      return;
    }

    if (!currentTournament) {
      setErrorMessage(
        isRTL ? 'يرجى اختيار بطولة للمشاركة بها.' : 'Please select a tournament.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedUsername = fullName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
      const generatedEmail = `${sanitizedUsername || 'player'}_${Date.now()}@triplestars.player`;

      const playerProfile = await store.createPlayerProfile({
        username: sanitizedUsername || `player_${Date.now()}`,
        display_name: fullName.trim(),
        email: generatedEmail,
        phone: phone.trim(),
      });

      await store.registerPlayer(currentTournament.id, playerProfile, teamName.trim() || undefined);

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setFullName('');
        setPhone('');
        setTeamName('');
        onSuccess?.();
        onClose();
      }, 2500);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(
        err.message ||
          (isRTL
            ? 'تعذر إتمام التسجيل. قد تكون مسجلاً بالفعل في هذه البطولة.'
            : 'Could not complete registration. You may already be registered.')
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-surface-200 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Subtle Warm Amber Light Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-deep via-brand-orange to-brand-gold" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 font-sans">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {t('successTitle')}
              </h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                {t('successDesc')}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-surface-300 border border-white/5 text-left rtl:text-right space-y-1.5 text-xs font-mono">
              <div className="text-gray-400 flex justify-between">
                <span>Player:</span> <strong className="text-white">{fullName}</strong>
              </div>
              <div className="text-gray-400 flex justify-between">
                <span>Tournament:</span> <strong className="text-brand-orange">{currentTournament?.name}</strong>
              </div>
              <div className="text-gray-400 flex justify-between">
                <span>WhatsApp:</span> <strong className="text-white">{phone}</strong>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 py-0.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-mono font-semibold uppercase">
                <span>{currentTournament?.game?.name || 'Esports'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                {t('modalTitle')}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {t('modalDesc')}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Tournament Selector */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300 flex items-center space-x-1 rtl:space-x-reverse">
                <Trophy className="w-3.5 h-3.5 text-brand-orange" />
                <span>{t('fieldTournament')}</span>
              </label>
              <select
                value={selectedTournamentId}
                onChange={(e) => setSelectedTournamentId(e.target.value)}
                className="w-full bg-surface-300 border border-white/10 focus:border-brand-orange rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
              >
                {tournaments.map((trn) => (
                  <option key={trn.id} value={trn.id}>
                    {trn.name} ({formatMAD(trn.prize_pool_mad)})
                  </option>
                ))}
              </select>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300 flex items-center space-x-1 rtl:space-x-reverse">
                <User className="w-3.5 h-3.5 text-brand-orange" />
                <span>{t('fieldName')} *</span>
              </label>
              <input
                type="text"
                required
                placeholder={isRTL ? 'مثال: يونس العلوي' : 'e.g. Younes Alami'}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-surface-300 border border-white/10 focus:border-brand-orange rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Phone Input */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300 flex items-center space-x-1 rtl:space-x-reverse">
                <Phone className="w-3.5 h-3.5 text-brand-orange" />
                <span>{t('fieldPhone')} *</span>
              </label>
              <input
                type="tel"
                required
                placeholder="06 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-surface-300 border border-white/10 focus:border-brand-orange rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Optional Team / Clan */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-400">
                {t('fieldTeam')}
              </label>
              <input
                type="text"
                placeholder={isRTL ? 'مثال: Atlas Elite' : 'e.g. Atlas Elite'}
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-surface-300 border border-white/10 focus:border-brand-orange rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-brand-deep via-brand-dark to-brand-orange hover:opacity-90 text-white font-medium text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              {isSubmitting ? t('btnSubmitting') : t('btnSubmit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
