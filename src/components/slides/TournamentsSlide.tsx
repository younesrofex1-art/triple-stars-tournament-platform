import React, { useState } from 'react';
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
  const { t } = useLanguage();
  const [selectedGame, setSelectedGame] = useState<string>('ALL');

  const games = ['ALL', ...Array.from(new Set(tournaments.map((t) => t.game?.name).filter(Boolean)))];

  const filteredTournaments = selectedGame === 'ALL'
    ? tournaments
    : tournaments.filter((trn) => trn.game?.name === selectedGame);

  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-hidden select-none">
      <div className="max-w-6xl w-full mx-auto space-y-5 sm:space-y-6 relative z-10 flex flex-col justify-center h-full max-h-[88vh]">
        
        {/* Header & Filter Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest block">
              {t('navScene2')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white uppercase tracking-tight mt-1">
              {t('tournamentsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-0.5">
              {t('tournamentsDesc')}
            </p>
          </div>

          {/* Clean Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-surface-200/80 border border-white/10 backdrop-blur-xl">
            {games.map((g) => (
              <button
                key={g as string}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedGame(g as string);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                  selectedGame === g
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {g === 'ALL' ? t('filterAll') : g}
              </button>
            ))}
          </div>
        </div>

        {/* Monolithic Spec Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[58vh] pr-1 scrollbar-none">
          {filteredTournaments.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500 font-mono text-xs">
              No tournaments available under this category.
            </div>
          ) : (
            filteredTournaments.map((tournament) => {
              const badge = getStatusBadge(tournament.status);
              const isLive = tournament.status === 'LIVE';

              return (
                <div
                  key={tournament.id}
                  className="group relative rounded-2xl tesla-card p-5 flex flex-col justify-between"
                >
                  {/* Top Bar */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-semibold text-brand-orange uppercase">
                        {tournament.game?.name || 'Esports'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-medium uppercase flex items-center space-x-1 rtl:space-x-reverse ${
                        isLive ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-white/5 text-gray-400 border border-white/10'
                      }`}>
                        {isLive && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white uppercase group-hover:text-gray-100 transition-colors">
                      {tournament.name}
                    </h3>
                    <div className="text-[11px] text-gray-500 font-mono mt-1">
                      {formatDate(tournament.start_at)} • {tournament.location || 'Triple Stars Arena'}
                    </div>
                  </div>

                  {/* Clean Spec Rows */}
                  <div className="my-4 py-3 border-y border-white/5 grid grid-cols-3 gap-2 font-mono text-center">
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase block">{t('prizePool')}</span>
                      <span className="text-xs font-semibold text-emerald-400 mt-0.5 block">{formatMAD(tournament.prize_pool_mad)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase block">{t('entryFee')}</span>
                      <span className="text-xs font-semibold text-white mt-0.5 block">{formatMAD(tournament.entry_fee_mad)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase block">{t('format')}</span>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase mt-0.5 block truncate">
                        {tournament.format?.replace('_', ' ') || 'SINGLE ELIM'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onOpenRegister(tournament.id);
                      }}
                      onMouseEnter={() => soundManager.playHover()}
                      className="flex-1 py-2 rounded-xl bg-white hover:bg-gray-100 text-black font-mono font-semibold text-xs transition-all"
                    >
                      {t('btnRegisterNow')}
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playSlide();
                        onViewBracket(tournament.id);
                      }}
                      onMouseEnter={() => soundManager.playHover()}
                      className="px-3.5 py-2 rounded-xl bg-surface-200 hover:bg-surface-100 border border-white/10 text-gray-300 hover:text-white font-mono text-xs font-medium transition-colors"
                    >
                      {t('btnOpenBracket')}
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
