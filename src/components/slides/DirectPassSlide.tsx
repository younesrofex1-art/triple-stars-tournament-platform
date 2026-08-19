import React, { useState } from 'react';
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
      onSuccess?.();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || (isRTL ? 'تعذر إتمام التسجيل. قد تكون مسجلاً بالفعل.' : 'Could not complete registration. You may already be registered.'));
    }
  };

  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-hidden select-none">
      <div className="max-w-4xl w-full mx-auto space-y-4 relative z-10 flex flex-col justify-center h-full max-h-[88vh]">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest block">
            {t('navScene5')}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white uppercase tracking-tight">
            {t('passTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            {t('passDesc')}
          </p>
        </div>

        {/* Minimal Tesla Form / Access Badge Container */}
        <div className="tesla-panel rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto w-full relative">
          
          {isSuccess ? (
            <div className="py-6 text-center space-y-4 animate-fade-in font-mono">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-white text-lg font-bold">
                ✓
              </div>
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block">
                  VERIFIED PASS
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
                  <span>Name:</span> <strong className="text-gray-200">{fullName}</strong>
                </div>
                <div className="text-gray-400 flex justify-between">
                  <span>Tournament:</span> <strong className="text-brand-orange">{currentTournament?.name}</strong>
                </div>
                <div className="text-gray-400 flex justify-between">
                  <span>Entry Fee:</span> <strong className="text-emerald-400">{formatMAD(currentTournament?.entry_fee_mad)}</strong>
                </div>
                <div className="text-gray-400 flex justify-between">
                  <span>WhatsApp:</span> <strong className="text-white">{phone}</strong>
                </div>
              </div>

              <p className="text-xs text-gray-400 max-w-md mx-auto">
                {t('successDesc')}
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
                className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition-colors"
              >
                {isRTL ? 'تسجيل لاعب إضافي' : 'Register Another Player'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* Tournament Selector */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-medium text-gray-400 uppercase">
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

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    placeholder={isRTL ? 'مثال: ghost_99' : 'e.g. ghost_99'}
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
                    placeholder={isRTL ? 'مثال: Atlas Elite' : 'e.g. Atlas Elite'}
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-surface-300 border border-white/10 focus:border-white/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="text-[11px] text-gray-500 font-mono pt-1">
                {t('passNotice')}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-white hover:bg-gray-100 text-black font-mono font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer"
              >
                {isSubmitting ? (isRTL ? 'جاري المعالجة...' : 'PROCESSING...') : t('submitPass')}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
