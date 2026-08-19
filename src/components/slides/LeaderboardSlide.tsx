import React, { useState } from 'react';
import { Profile } from '../../types';
import { soundManager } from '../../utils/sound';
import { useLanguage } from '../../context/LanguageContext';

interface LeaderboardSlideProps {
  players: Profile[];
}

export const LeaderboardSlide: React.FC<LeaderboardSlideProps> = ({ players }) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'VALORANT' | 'FC' | 'TEKKEN'>('ALL');

  const sortedPlayers = [...players].sort((a, b) => {
    const winsDiff = (b.wins || 0) - (a.wins || 0);
    if (winsDiff !== 0) return winsDiff;
    const totalA = (a.wins || 0) + (a.losses || 0);
    const totalB = (b.wins || 0) + (b.losses || 0);
    const rateA = totalA > 0 ? (a.wins || 0) / totalA : 0;
    const rateB = totalB > 0 ? (b.wins || 0) / totalB : 0;
    return rateB - rateA;
  });

  const rank1 = sortedPlayers[0];
  const rank2 = sortedPlayers[1];
  const rank3 = sortedPlayers[2];
  const restPlayers = sortedPlayers.slice(3, 20);

  const calculateWinRate = (p?: Profile) => {
    if (!p) return '0%';
    const total = (p.wins || 0) + (p.losses || 0);
    if (total === 0) return '100%';
    return `${Math.round(((p.wins || 0) / total) * 100)}%`;
  };

  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-hidden select-none">
      <div className="max-w-6xl w-full mx-auto space-y-4 sm:space-y-5 relative z-10 flex flex-col justify-center h-full max-h-[88vh]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest block">
              {t('navScene4')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white uppercase tracking-tight mt-1">
              {t('standingsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
              {t('standingsDesc')}
            </p>
          </div>

          <div className="flex items-center space-x-1.5 rtl:space-x-reverse p-1 rounded-full bg-surface-200/80 border border-white/10 backdrop-blur-xl">
            {(['ALL', 'VALORANT', 'FC', 'TEKKEN'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'ALL' ? t('filterAll') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Layout: Clean Podium + Tabular Standings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 flex-1 max-h-[64vh] overflow-hidden">
          
          {/* Top 3 Minimalist Stepped Podiums */}
          <div className="lg:col-span-5 flex flex-col justify-end items-center p-5 sm:p-6 rounded-2xl tesla-panel relative overflow-hidden">
            <div className="w-full flex items-end justify-center gap-2.5 sm:gap-3">
              
              {/* 2nd Place */}
              <div className="flex-1 flex flex-col items-center">
                {rank2 && (
                  <div className="text-center mb-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                      {t('rank2Title')}
                    </span>
                    <div className="font-semibold text-xs sm:text-sm text-white font-mono truncate max-w-[100px] mt-0.5">
                      @{rank2.username}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                      {rank2.wins || 0}W • {calculateWinRate(rank2)}
                    </div>
                  </div>
                )}
                <div className="w-full h-24 rounded-t-xl bg-surface-100 border-t border-x border-white/10 flex items-center justify-center font-mono font-bold text-gray-300 text-lg">
                  02
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex-1 flex flex-col items-center">
                {rank1 && (
                  <div className="text-center mb-2">
                    <span className="text-[10px] font-mono text-brand-orange uppercase tracking-wider block font-semibold">
                      {t('rank1Title')}
                    </span>
                    <div className="font-bold text-sm sm:text-base text-white font-mono truncate max-w-[110px] mt-0.5">
                      @{rank1.username}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                      {rank1.wins || 0}W • {calculateWinRate(rank1)}
                    </div>
                  </div>
                )}
                <div className="w-full h-36 rounded-t-xl bg-surface-50 border-t-2 border-x border-brand-orange/80 flex items-center justify-center font-mono font-black text-white text-2xl shadow-sm">
                  01
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex-1 flex flex-col items-center">
                {rank3 && (
                  <div className="text-center mb-2">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                      {t('rank3Title')}
                    </span>
                    <div className="font-semibold text-xs sm:text-sm text-white font-mono truncate max-w-[100px] mt-0.5">
                      @{rank3.username}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                      {rank3.wins || 0}W • {calculateWinRate(rank3)}
                    </div>
                  </div>
                )}
                <div className="w-full h-16 rounded-t-xl bg-surface-100/60 border-t border-x border-white/5 flex items-center justify-center font-mono font-bold text-gray-400 text-base">
                  03
                </div>
              </div>

            </div>
          </div>

          {/* Standings Table */}
          <div className="lg:col-span-7 tesla-panel rounded-2xl p-4 sm:p-5 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/5 text-[11px] font-mono text-gray-500 uppercase tracking-wider">
              <span>COMPETITOR</span>
              <div className="flex items-center space-x-6 rtl:space-x-reverse">
                <span>{t('winRate')}</span>
                <span>W / L</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-none pr-1 mt-1">
              {sortedPlayers.length === 0 ? (
                <div className="py-12 text-center text-gray-500 font-mono text-xs">
                  No competitors in tournament registry yet.
                </div>
              ) : (
                sortedPlayers.map((player, idx) => {
                  const winRate = calculateWinRate(player);

                  return (
                    <div
                      key={player.id}
                      className="py-2.5 px-2 flex items-center justify-between rounded-lg hover:bg-white/5 transition-colors font-mono"
                    >
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="w-5 text-left rtl:text-right text-xs font-mono text-gray-500 font-medium">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <div className="font-semibold text-xs sm:text-sm text-white">
                            @{player.username}
                          </div>
                          <div className="text-[11px] text-gray-500">{player.display_name}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 rtl:space-x-reverse text-xs font-mono">
                        <span className="font-semibold text-emerald-400">{winRate}</span>
                        <span className="text-gray-400 min-w-[45px] text-right rtl:text-left">
                          {player.wins || 0}W <span className="text-gray-600">/</span> {player.losses || 0}L
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
