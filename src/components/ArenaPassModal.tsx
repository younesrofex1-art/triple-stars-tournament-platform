import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Sparkles, UserCheck, AlertCircle, Phone, User, Trophy, Tag } from 'lucide-react';
import { Tournament } from '../types';
import { formatMAD, formatDate } from '../utils/formatters';
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
      setErrorMessage(isRTL ? 'يرجى ملء جميع الحقول الإلزامية (الاسم، اللقب، ورقم الهاتف).' : 'Please provide full name, gamer tag, and phone number.');
      return;
    }

    if (!currentTournament) {
      setErrorMessage(isRTL ? 'يرجى اختيار بطولة للمشاركة بها.' : 'Please select a tournament.');
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
      }, 2400);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || (isRTL ? 'تعذر إتمام التسجيل. قد تكون مسجلاً بالفعل.' : 'Could not complete registration. You may already be registered.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-xl bg-surface-200 border border-border/90 rounded-3xl p-5 sm:p-7 shadow-elevated overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 rtl:right-auto rtl:left-4 sm:rtl:left-5 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-surface-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 sm:py-12 text-center space-y-4 animate-fade-in">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
              <CheckCircle className="relative w-16 h-16 text-emerald-400 mx-auto" />
            </div>
            <div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                CONFIRMED // مؤكد
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display uppercase text-white mt-2">
                {t('registrationSuccess')}
              </h3>
            </div>
            <div className="p-4 rounded-2xl bg-surface-300 border border-white/10 max-w-md mx-auto text-left rtl:text-right space-y-1.5 text-xs font-mono">
              <div className="text-gray-400 flex justify-between">
                <span>Player:</span> <strong className="text-white">@{gamerTag} ({fullName})</strong>
              </div>
              <div className="text-gray-400 flex justify-between">
                <span>Tournament:</span> <strong className="text-brand-orange">{currentTournament?.name}</strong>
              </div>
              <div className="text-gray-400 flex justify-between">
                <span>WhatsApp:</span> <strong className="text-cyan-400">{phone}</strong>
              </div>
            </div>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {t('successDetail')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-0">
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Sparkles className="w-4 h-4 text-brand-orange" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-orange">
                  {t('passHeading')}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white uppercase tracking-tight mt-1">
                {isRTL ? 'بطاقة الساحة والتسجيل الفوري' : 'Claim Direct Arena Pass'}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {t('passSubtitle')}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2.5 rtl:space-x-reverse animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-gray-300 flex items-center space-x-1.5 rtl:space-x-reverse">
                <Trophy className="w-3.5 h-3.5 text-brand-orange" />
                <span>{t('fieldTournament')}</span>
              </label>
              <select
                value={selectedTournamentId}
                onChange={(e) => {
                  soundManager.playHover();
                  setSelectedTournamentId(e.target.value);
                }}
                className="w-full bg-surface-300 border border-border/80 focus:border-brand-orange rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors"
              >
                {tournaments.map((trn) => (
                  <option key={trn.id} value={trn.id}>
                    {trn.name} ({trn.game?.name || 'Esports'} - {formatMAD(trn.prize_pool_mad)})
                  </option>
                ))}
              </select>
            </div>

            {currentTournament && (
              <div className="p-3 rounded-2xl bg-surface-300/80 border border-white/5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">{t('entryFee')}</span>
                  <span className="font-bold text-brand-orange">{formatMAD(currentTournament.entry_fee_mad)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">{t('prizePool')}</span>
                  <span className="font-bold text-emerald-400">{formatMAD(currentTournament.prize_pool_mad)}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-gray-500 uppercase block">{t('location')}</span>
                  <span className="font-bold text-gray-300 truncate block">{currentTournament.location || 'Main Arena'}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-gray-300 flex items-center space-x-1 rtl:space-x-reverse">
                  <User className="w-3 h-3 text-brand-orange" />
                  <span>{t('fieldName')} *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'مثال: يونس العلوي' : 'e.g. Younes Alami'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface-300 border border-border/80 focus:border-brand-orange rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-gray-300 flex items-center space-x-1 rtl:space-x-reverse">
                  <Tag className="w-3 h-3 text-brand-orange" />
                  <span>{t('fieldGamerTag')} *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'مثال: shadow_striker' : 'e.g. shadow_striker'}
                  value={gamerTag}
                  onChange={(e) => setGamerTag(e.target.value)}
                  className="w-full bg-surface-300 border border-border/80 focus:border-brand-orange rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-gray-300 flex items-center space-x-1 rtl:space-x-reverse">
                  <Phone className="w-3 h-3 text-brand-orange" />
                  <span>{t('fieldPhone')} *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+212 600-000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-surface-300 border border-border/80 focus:border-brand-orange rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-gray-300">
                  {t('fieldTeam')}
                </label>
                <input
                  type="text"
                  placeholder={isRTL ? 'مثال: Atlas Kings' : 'e.g. Atlas Kings'}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-surface-300 border border-border/80 focus:border-brand-orange rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-100/90 border border-border/80 flex items-start space-x-2.5 rtl:space-x-reverse text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{t('passNotice')}</span>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse pt-2">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="flex-1 py-3 rounded-xl bg-surface-100 hover:bg-surface-50 text-gray-300 font-mono font-bold text-xs transition-colors"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-dark to-brand-orange hover:from-brand-orange hover:to-amber-500 text-white font-mono font-black text-xs uppercase tracking-wider shadow-orange-sm transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isSubmitting ? (isRTL ? 'جاري المعالجة...' : 'PROCESSING...') : t('btnSubmitPass')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
