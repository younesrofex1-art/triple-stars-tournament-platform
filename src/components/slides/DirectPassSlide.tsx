import React, { useState } from 'react';
import { Sparkles, UserCheck, ShieldCheck, CheckCircle, Phone, User, Tag, Trophy, AlertCircle } from 'lucide-react';
import { Tournament } from '../../types';
import { formatMAD } from '../../utils/formatters';
import { store } from '../../services/store';
import { soundManager } from '../../utils/sound';
import { useLanguage } from '../../context/LanguageContext';

interface DirectPassSlideProps {
  tournaments: Tournament[];
  onSuccess?: () => void;
}

export const DirectPassSlide: React.FC<DirectPassSlideProps> = ({ tournaments, onSuccess }) => {
  const { t, isRTL } = useLanguage();

  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(tournaments[0]?.id || '');
  const [fullName, setFullName] = useState('');
  const [gamerTag, setGamerTag] = useState('');
  const [phone, setPhone] = useState('');
  const [teamName, setTeamName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    if (tournaments.length > 0 && !selectedTournamentId) {
      setSelectedTournamentId(tournaments[0].id);
    }
  }, [tournaments, selectedTournamentId]);

  const currentTournament = tournaments.find((t) => t.id === selectedTournamentId) || tournaments[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    soundManager.playClick();

    if (!fullName.trim() || !gamerTag.trim() || !phone.trim()) {
      setErrorMessage(isRTL ? 'يرجى ملء جميع الحقول المطلوبة (الاسم، اللقب، ورقم الهاتف).' : 'Please fill all required fields (Name, Gamer Tag, and Phone Number).');
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
      onSuccess?.();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || (isRTL ? 'تعذر إتمام التسجيل. قد تكون مسجلاً بالفعل.' : 'Could not complete registration. You may already be registered.'));
    }
  };

  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-4 sm:p-8 lg:p-14 relative overflow-hidden select-none">
      
      {/* Glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-brand-orange/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto space-y-4 relative z-10 flex flex-col justify-center h-full max-h-[92vh]">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/30 text-brand-orange text-xs font-mono font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('navScene5')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white uppercase tracking-tight">
            {t('passHeading')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            {t('passSubtitle')}
          </p>
        </div>

        {/* Card Form / Success Ticket Container */}
        <div className="bg-surface-200/90 border border-border/80 rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-elevated max-w-3xl mx-auto w-full relative overflow-hidden">
          
          {isSuccess ? (
            <div className="py-8 text-center space-y-4 animate-fade-in font-mono">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-neon-cyan">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                  PASS ACTIVE // البطاقة مفعلة
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase mt-2">
                  {t('registrationSuccess')}
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-surface-300 border border-white/10 max-w-md mx-auto text-left rtl:text-right space-y-2 text-xs">
                <div className="text-gray-400 flex justify-between">
                  <span>Player Tag:</span> <strong className="text-white font-bold">@{gamerTag}</strong>
                </div>
                <div className="text-gray-400 flex justify-between">
                  <span>Full Name:</span> <strong className="text-gray-200">{fullName}</strong>
                </div>
                <div className="text-gray-400 flex justify-between">
                  <span>Tournament:</span> <strong className="text-brand-orange font-bold">{currentTournament?.name}</strong>
                </div>
                <div className="text-gray-400 flex justify-between">
                  <span>Entry Fee:</span> <strong className="text-emerald-400 font-bold">{formatMAD(currentTournament?.entry_fee_mad)}</strong>
                </div>
                <div className="text-gray-400 flex justify-between">
                  <span>WhatsApp:</span> <strong className="text-cyan-400 font-bold">{phone}</strong>
                </div>
              </div>

              <p className="text-xs text-gray-400 max-w-md mx-auto">
                {t('successDetail')}
              </p>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsSuccess(false);
                  setFullName('');
                  setGamerTag('');
                  setPhone('');
                  setTeamName('');
                }}
                className="px-6 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 text-white text-xs font-bold font-mono transition-colors"
              >
                {isRTL ? 'تسجيل لاعب آخر' : 'Register Another Player'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMessage && (
                <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2.5 rtl:space-x-reverse animate-fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Tournament Selector */}
              <div className="space-y-1">
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

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-mono font-bold text-gray-300 flex items-center space-x-1 rtl:space-x-reverse">
                    <User className="w-3 h-3 text-brand-orange" />
                    <span>{t('fieldName')} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isRTL ? 'مثال: كريم المرابط' : 'e.g. Karim Morabit'}
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
                    placeholder={isRTL ? 'مثال: ApexGhost' : 'e.g. ApexGhost'}
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
                    placeholder={isRTL ? 'مثال: Casablanca Elite' : 'e.g. Casablanca Elite'}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-surface-300 border border-border/80 focus:border-brand-orange rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Note */}
              <div className="p-3 rounded-xl bg-surface-100 border border-border/80 flex items-start space-x-2.5 rtl:space-x-reverse text-[11px] text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t('passNotice')}</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-dark via-brand-orange to-amber-500 hover:from-brand-orange hover:to-yellow-400 text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-neon-orange transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isSubmitting ? (isRTL ? 'جاري الإصدار...' : 'ISSUING ARENA PASS...') : t('btnSubmitPass')}</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
