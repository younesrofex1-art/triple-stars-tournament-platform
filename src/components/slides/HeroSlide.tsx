import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Users, Swords, Play, Flame, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { Tournament } from '../../types';
import { formatMAD } from '../../utils/formatters';
import { soundManager } from '../../utils/sound';
import { useLanguage } from '../../context/LanguageContext';

interface HeroSlideProps {
  tournaments: Tournament[];
  onOpenRegister: (tournamentId?: string) => void;
  onExploreTournaments: () => void;
}

export const HeroSlide: React.FC<HeroSlideProps> = ({
  tournaments,
  onOpenRegister,
  onExploreTournaments,
}) => {
  const { t, isRTL } = useLanguage();

  const activeTournament =
    tournaments.find((t) => t.status === 'LIVE') ||
    tournaments.find((t) => t.status === 'REGISTRATION_OPEN') ||
    tournaments[0];

  const [timeLeft, setTimeLeft] = useState({ days: 1, hours: 4, mins: 32, secs: 45 });

  useEffect(() => {
    const targetDate = activeTournament?.start_at
      ? new Date(activeTournament.start_at).getTime()
      : Date.now() + 1000 * 60 * 60 * 28;

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, mins, secs });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTournament]);

  const totalPrizePool = tournaments.reduce((acc, curr) => acc + (curr.prize_pool_mad || 0), 0) || 15000;
  const totalTournaments = tournaments.length || 6;

  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-4 sm:p-8 lg:p-14 relative overflow-hidden select-none">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto space-y-6 sm:space-y-8 relative z-10">
        
        {/* Top Circuit Badge */}
        <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1.5 rounded-full bg-surface-200/90 border border-brand-orange/40 backdrop-blur-xl shadow-orange-sm">
            <Flame className="w-4 h-4 text-brand-orange animate-bounce" />
            <span className="text-xs font-mono font-black text-brand-orange tracking-widest uppercase">
              {t('heroBadge')}
            </span>
          </div>

          {activeTournament?.status === 'LIVE' && (
            <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-400 text-xs font-mono font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>LIVE MATCH IN PROGRESS</span>
            </div>
          )}
        </div>

        {/* Hero Title & Cyber Strike Typography */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white leading-none uppercase">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400">
              {t('heroHeading1')}
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-amber-400 to-yellow-500 drop-shadow-[0_0_35px_rgba(255,107,0,0.4)]">
              {t('heroHeading2')}
            </span>
            <span className="block text-white">
              {t('heroHeading3')}
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl font-sans leading-relaxed">
            {t('heroDesc')}
          </p>
        </div>

        {/* Live Countdown & Event Highlight Box */}
        {activeTournament && (
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-200/90 border border-border/90 backdrop-blur-xl shadow-elevated flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-4xl">
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-mono font-bold text-gray-400 uppercase">
                <Play className="w-3.5 h-3.5 text-brand-orange" />
                <span>{t('heroNextMatchCountdown')}</span>
              </div>
              <h3 className="text-base sm:text-xl font-bold font-display text-white uppercase mt-0.5">
                {activeTournament.name} ({activeTournament.game?.name})
              </h3>
              <div className="text-xs text-brand-orange font-mono font-bold mt-0.5">
                {t('prizePool')}: <span className="text-white">{formatMAD(activeTournament.prize_pool_mad)}</span> • {t('entryFee')}: <span className="text-gray-300">{formatMAD(activeTournament.entry_fee_mad)}</span>
              </div>
            </div>

            {/* Countdown Clock Units */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse font-mono text-center">
              <div className="px-3 py-2 rounded-xl bg-surface-300/90 border border-white/10 min-w-[54px]">
                <div className="text-lg sm:text-xl font-black text-white">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase">{t('days')}</div>
              </div>
              <span className="text-brand-orange font-bold">:</span>
              <div className="px-3 py-2 rounded-xl bg-surface-300/90 border border-white/10 min-w-[54px]">
                <div className="text-lg sm:text-xl font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase">{t('hours')}</div>
              </div>
              <span className="text-brand-orange font-bold">:</span>
              <div className="px-3 py-2 rounded-xl bg-surface-300/90 border border-white/10 min-w-[54px]">
                <div className="text-lg sm:text-xl font-black text-brand-orange">{String(timeLeft.mins).padStart(2, '0')}</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase">{t('mins')}</div>
              </div>
              <span className="text-brand-orange font-bold">:</span>
              <div className="px-3 py-2 rounded-xl bg-surface-300/90 border border-white/10 min-w-[54px]">
                <div className="text-lg sm:text-xl font-black text-cyan-400">{String(timeLeft.secs).padStart(2, '0')}</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase">{t('secs')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenRegister(activeTournament?.id);
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-dark via-brand-orange to-amber-500 hover:from-brand-orange hover:to-yellow-400 text-white font-display font-black text-sm uppercase tracking-wider shadow-neon-orange hover:scale-105 transition-all duration-300 flex items-center space-x-2.5 rtl:space-x-reverse"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>{t('heroBtnRegister')}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playSlide();
              onExploreTournaments();
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="px-6 sm:px-8 py-3.5 rounded-2xl bg-surface-200/90 hover:bg-surface-100 border border-border/80 text-gray-200 hover:text-white font-mono font-bold text-sm uppercase tracking-wider backdrop-blur-xl transition-all flex items-center space-x-2 rtl:space-x-reverse group"
          >
            <span>{t('heroBtnExplore')}</span>
            {isRTL ? (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-brand-orange" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-brand-orange" />
            )}
          </button>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 max-w-4xl">
          <div className="p-3 sm:p-4 rounded-2xl bg-surface-200/80 border border-border/70 backdrop-blur-lg">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-emerald-400 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold uppercase text-gray-400">{t('statPrizeDistributed')}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-display text-white">{formatMAD(totalPrizePool)}</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-surface-200/80 border border-border/70 backdrop-blur-lg">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-cyan-400 mb-1">
              <Swords className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold uppercase text-gray-400">{t('statLiveShowdowns')}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-display text-white">{totalTournaments} ARENA CUPS</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-surface-200/80 border border-border/70 backdrop-blur-lg">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-brand-orange mb-1">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold uppercase text-gray-400">{t('statVerifiedWarriors')}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-display text-white">128+ FIGHTERS</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-surface-200/80 border border-border/70 backdrop-blur-lg">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-amber-400 mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold uppercase text-gray-400">{t('statArenaStations')}</span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-display text-white">24 STATIONS</div>
          </div>
        </div>

      </div>
    </div>
  );
};
