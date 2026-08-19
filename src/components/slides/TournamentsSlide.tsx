import React, { useState } from 'react';
import { Trophy, Users, Swords, Sparkles, ExternalLink, Calendar, MapPin, CheckCircle, Radio } from 'lucide-react';
import { Tournament } from '../../types';
import { formatMAD, formatDate, getStatusBadge } from '../../utils/formatters';
import { soundManager } from '../../utils/sound';
import { useLanguage } from '../../context/LanguageContext';

interface TournamentsSlideProps {
  tournaments: Tournament[];
  onOpenRegister: (tournamentId: string) => void;
  onViewBracket: (tournamentId: string) => void;
}

export const TournamentsSlide: React.FC<TournamentsSlideProps> = ({
  tournaments,
  onOpenRegister,
  onViewBracket,
}) => {
  const { t, isRTL } = useLanguage();
  const [selectedGame, setSelectedGame] = useState<string>('ALL');

  // Extract unique games for filtering
  const games = ['ALL', ...Array.from(new Set(tournaments.map((t) => t.game?.name).filter(Boolean)))];

  const filteredTournaments = selectedGame === 'ALL'
    ? tournaments
    : tournaments.filter((trn) => trn.game?.name === selectedGame);

  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-4 sm:p-8 lg:p-14 relative overflow-hidden select-none">
      
      {/* Glow */}
      <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto space-y-5 sm:space-y-6 relative z-10 flex flex-col justify-center h-full max-h-[90vh]">
        
        {/* Header & Game Filter Chips */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Swords className="w-4 h-4 text-brand-orange" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-orange">
                {t('navScene2')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white uppercase tracking-tight mt-1">
              {t('tournamentsHeading')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mt-0.5">
              {t('tournamentsSubtitle')}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-surface-200/90 border border-border/80 backdrop-blur-xl">
            {games.map((g) => (
              <button
                key={g as string}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedGame(g as string);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  selectedGame === g
                    ? 'bg-brand-orange text-white shadow-orange-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {g === 'ALL' ? t('filterAll') : g}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Card Row / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-y-auto max-h-[58vh] pr-1 scrollbar-none">
          {filteredTournaments.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500 font-mono">
              No tournaments found for this filter.
            </div>
          ) : (
            filteredTournaments.map((tournament) => {
              const badge = getStatusBadge(tournament.status);
              const isLive = tournament.status === 'LIVE';

              return (
                <div
                  key={tournament.id}
                  className="group relative rounded-3xl bg-surface-200/90 hover:bg-surface-100/90 border border-border/80 hover:border-brand-orange/70 backdrop-blur-xl p-5 shadow-elevated transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-neon-orange"
                >
                  {/* Top Bar: Game Name & Status Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-300 border border-white/10 text-cyan-400 font-mono text-[10px] font-bold uppercase">
                        {tournament.game?.name || 'Esports'}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase flex items-center space-x-1.5 rtl:space-x-reverse ${badge.class}`}>
                        {isLive && <Radio className="w-2.5 h-2.5 text-rose-400 animate-ping" />}
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    {/* Tournament Title */}
                    <h3 className="text-lg sm:text-xl font-bold font-display text-white uppercase group-hover:text-brand-orange transition-colors">
                      {tournament.name}
                    </h3>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse text-xs text-gray-400 mt-1 font-mono">
                      <span className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                        <span>{formatDate(tournament.start_at)}</span>
                      </span>
                      <span className="flex items-center space-x-1 rtl:space-x-reverse">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="truncate max-w-[120px]">{tournament.location || 'Triple Stars Arena'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Format Grid */}
                  <div className="my-4 pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-2 rounded-xl bg-surface-300/80 border border-white/5">
                      <div className="text-[9px] text-gray-400 uppercase">{t('prizePool')}</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-400">{formatMAD(tournament.prize_pool_mad)}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-300/80 border border-white/5">
                      <div className="text-[9px] text-gray-400 uppercase">{t('entryFee')}</div>
                      <div className="text-xs sm:text-sm font-bold text-brand-orange">{formatMAD(tournament.entry_fee_mad)}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-300/80 border border-white/5">
                      <div className="text-[9px] text-gray-400 uppercase">{t('format')}</div>
                      <div className="text-[11px] font-bold text-gray-200 uppercase truncate">
                        {tournament.format?.replace('_', ' ') || 'SINGLE ELIM'}
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onOpenRegister(tournament.id);
                      }}
                      onMouseEnter={() => soundManager.playHover()}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-dark to-brand-orange hover:from-brand-orange hover:to-amber-500 text-white font-mono font-black text-xs uppercase tracking-wider shadow-orange-sm transition-all flex items-center justify-center space-x-1.5 rtl:space-x-reverse"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t('btnDirectRegister')}</span>
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playSlide();
                        onViewBracket(tournament.id);
                      }}
                      onMouseEnter={() => soundManager.playHover()}
                      title="View Interactive Bracket"
                      className="px-3 py-2.5 rounded-xl bg-surface-300 hover:bg-surface-50 border border-border/80 text-gray-300 hover:text-white font-mono text-xs font-bold transition-colors flex items-center space-x-1 rtl:space-x-reverse"
                    >
                      <span>{t('btnViewBracket')}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-brand-orange" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
