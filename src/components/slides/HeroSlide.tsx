import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
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
    <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-hidden select-none">
      <div className="max-w-6xl w-full mx-auto space-y-6 sm:space-y-8 relative z-10">
        
        {/* Top Minimal Pill */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1 rounded-full bg-surface-200/80 border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            <span className="text-[11px] font-mono font-medium text-gray-300 uppercase">
              {t('heroSubtitle')}
            </span>
          </div>

          {activeTournament?.status === 'LIVE' && (
            <div className="inline-flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>LIVE</span>
            </div>
          )}
        </div>

        {/* Headline */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white leading-tight uppercase">
            <span className="block">{t('heroHeading1')}</span>
            <span className="block text-gray-400">{t('heroHeading2')}</span>
            <span className="block text-brand-orange">{t('heroHeading3')}</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl font-sans leading-relaxed">
            {t('heroDesc')}
          </p>
        </div>

        {/* Live Next Match Card (Tesla Spec Layout) */}
        {activeTournament && (
          <div className="p-4 sm:p-5 rounded-2xl tesla-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-w-3xl">
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                {t('nextEvent')}
              </span>
              <div className="text-base sm:text-lg font-bold text-white uppercase mt-0.5">
                {activeTournament.name}
              </div>
              <div className="text-xs text-gray-400 font-mono mt-0.5">
                {activeTournament.game?.name} • <span className="text-emerald-400 font-medium">{formatMAD(activeTournament.prize_pool_mad)}</span>
              </div>
            </div>

            {/* Countdown Digits */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse font-mono text-center">
              <div className="px-3 py-1.5 rounded-xl bg-surface-300 border border-white/5 min-w-[48px]">
                <div className="text-base sm:text-lg font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</div>
                <div className="text-[9px] text-gray-400 uppercase">{t('days')}</div>
              </div>
              <span className="text-gray-600">:</span>
              <div className="px-3 py-1.5 rounded-xl bg-surface-300 border border-white/5 min-w-[48px]">
                <div className="text-base sm:text-lg font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-[9px] text-gray-400 uppercase">{t('hours')}</div>
              </div>
              <span className="text-gray-600">:</span>
              <div className="px-3 py-1.5 rounded-xl bg-surface-300 border border-white/5 min-w-[48px]">
                <div className="text-base sm:text-lg font-bold text-white">{String(timeLeft.mins).padStart(2, '0')}</div>
                <div className="text-[9px] text-gray-400 uppercase">{t('mins')}</div>
              </div>
              <span className="text-gray-600">:</span>
              <div className="px-3 py-1.5 rounded-xl bg-surface-300 border border-white/5 min-w-[48px]">
                <div className="text-base sm:text-lg font-bold text-brand-orange">{String(timeLeft.secs).padStart(2, '0')}</div>
                <div className="text-[9px] text-gray-400 uppercase">{t('secs')}</div>
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
            className="px-8 py-3.5 rounded-full bg-white hover:bg-gray-100 text-black font-semibold text-xs sm:text-sm font-mono uppercase tracking-wider transition-all hover:scale-105"
          >
            {t('btnClaimPass')}
          </button>

          <button
            onClick={() => {
              soundManager.playSlide();
              onExploreTournaments();
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="px-8 py-3.5 rounded-full bg-surface-200/80 hover:bg-surface-100/90 border border-white/10 text-white font-semibold text-xs sm:text-sm font-mono uppercase tracking-wider transition-all flex items-center space-x-2 rtl:space-x-reverse"
          >
            <span>{t('btnExploreShowdowns')}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 max-w-3xl border-t border-white/5">
          <div className="pt-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase block">{t('statPrizePool')}</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5 block">{formatMAD(totalPrizePool)}</span>
          </div>

          <div className="pt-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase block">{t('statTournaments')}</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5 block">{totalTournaments} CIRCUITS</span>
          </div>

          <div className="pt-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase block">{t('statFighters')}</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5 block">128+ VERIFIED</span>
          </div>

          <div className="pt-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase block">{t('statStations')}</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5 block">24 RIGS</span>
          </div>
        </div>

      </div>
    </div>
  );
};
