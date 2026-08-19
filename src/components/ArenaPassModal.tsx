import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Tournament } from '../types';
import { formatMAD } from '../utils/formatters';
import { store } from '../services/store';
import { soundManager } from '../utils/sound';
import { useLanguage } from '../context/LanguageContext';

interface ArenaPassModalProps {
  tournaments: Tournament[];
  initialTournamentId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ArenaPassModal: React.FC<ArenaPassModalProps> = ({
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
  const [gamerTag, setGamerTag] = useState('');
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
    soundManager.playClick();

    if (!fullName.trim() || !gamerTag.trim() || !phone.trim()) {
      setErrorMessage(isRTL ? 'يرجى ملء جميع الحقول المطلوبة (الاسم الكامل، اسم اللاعب، ورقم الهاتف).' : 'Please fill all required fields (Full Name, Gamer Tag, and Phone Number).');
      return;
    }

    if (!currentTournament) {
      setErrorMessage(isRTL ? 'يرجى اختيار بطولة للمشاركة.' : 'Please select a tournament.');
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedUsername = gamerTag.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
      const generatedEmail = `${sanitizedUsername}_${Date.now()}@triplestars.player`;

      const playerProfile = await store.createPlayerProfile({
        username: sanitizedUsername || `player_${Date.now()}`,
        display_name: fullName.trim(),
        email: generatedEmail,
        phone: phone.trim(),
      });

      await store.registerPlayer(currentTournament.id, playerProfile, teamName.trim() || undefined);

      soundManager.playSuccess();
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onSuccess?.();
        onClose();
      }, 2200);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || (isRTL ? 'تعذر إتمام التسجيل. قد تكون مسجلاً بالفعل.' : 'Could not complete registration. You may already be registered.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg tesla-panel rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 font-mono">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white font-bold">
              ✓
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block">
                PASS CONFIRMED
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white uppercase mt-1">
                {t('successTitle')}
              </h3>
            </div>
            <div className="p-4 rounded-xl bg-surface-300 border border-white/5 max-w-md mx-auto text-left rtl:text-right space-y-1.5 text-xs">
              <div className="text-gray-400 flex justify-between">
                <span>Player:</span> <strong className="text-white">@{gamerTag}</strong>
              </div>
              <div className="text-gray-400 flex justify-between">
                <span>Tournament:</span> <strong className="text-brand-orange">{currentTournament?.name}</strong>
              </div>
              <div className="text-gray-400 flex justify-between">
                <span>WhatsApp:</span> <strong className="text-white">{phone}</strong>
              </div>
            </div>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {t('successDesc')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                {t('passTitle')}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight mt-1">
                {currentTournament?.name || 'Tournament Pass'}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {t('passDesc')}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Tournament Selector */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-gray-400 uppercase">
                {t('tournamentSelect')}
              </label>
              <select
                value={selectedTournamentId}
                onChange={(e) => {
                  soundManager.playHover();
                  setSelectedTournamentId(e.target.value);
                }}
                className="w-full bg-surface-300 border border-white/10 focus:border-white/30 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
              >
                {tournaments.map((trn) => (
                  <option key={trn.id} value={trn.id}>
                    {trn.name} ({trn.game?.name || 'Esports'} — {formatMAD(trn.prize_pool_mad)})
                  </option>
                ))}
              </select>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-gray-400 uppercase">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'مثال: يونس العلوي' : 'e.g. Younes Alami'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface-300 border border-white/10 focus:border-white/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-gray-400 uppercase">
                  {t('gamerTag')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'مثال: shadow' : 'e.g. shadow'}
                  value={gamerTag}
                  onChange={(e) => setGamerTag(e.target.value)}
                  className="w-full bg-surface-300 border border-white/10 focus:border-white/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-gray-400 uppercase">
                  {t('phoneNumber')} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+212 600-000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-surface-300 border border-white/10 focus:border-white/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-gray-400 uppercase">
                  {t('teamName')}
                </label>
                <input
                  type="text"
                  placeholder={isRTL ? 'مثال: Atlas Clan' : 'e.g. Atlas Clan'}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-surface-300 border border-white/10 focus:border-white/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="text-[11px] text-gray-500 font-mono pt-1">
              {t('passNotice')}
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse pt-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="flex-1 py-3 rounded-full bg-surface-100 hover:bg-surface-50 text-gray-300 font-mono text-xs transition-colors"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-full bg-white hover:bg-gray-100 text-black font-mono font-semibold text-xs uppercase tracking-wider transition-all"
              >
                {isSubmitting ? (isRTL ? 'جاري المعالجة...' : 'PROCESSING...') : t('submitPass')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
