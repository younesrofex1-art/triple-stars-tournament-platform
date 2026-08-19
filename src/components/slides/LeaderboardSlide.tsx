import React, { useState } from 'react';
import { Trophy, Medal, Flame, Star, Award, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import { Profile } from '../../types';
import { formatMAD } from '../../utils/formatters';
import { soundManager } from '../../utils/sound';
import { useLanguage } from '../../context/LanguageContext';

interface LeaderboardSlideProps {
  players: Profile[];
}

export const LeaderboardSlide: React.FC<LeaderboardSlideProps> = ({ players }) => {
  const { t, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'VALORANT' | 'FC' | 'TEKKEN'>('ALL');

  // Sort players by total wins / win rate
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
  const restPlayers = sortedPlayers.slice(3, 15);

  const calculateWinRate = (p?: Profile) => {
    if (!p) return '0%';
    const total = (p.wins || 0) + (p.losses || 0);
    if (total === 0) return '100%';
    return `${Math.round(((p.wins || 0) / total) * 100)}%`;
  };

  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-4 sm:p-8 lg:p-14 relative overflow-hidden select-none">
      
      {/* Ambient Gold & Orange Glows */}
      <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto space-y-4 sm:space-y-5 relative z-10 flex flex-col justify-center h-full max-h-[92vh]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Trophy className="w-4 h-4 text-brand-orange" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-orange">
                {t('navScene4')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white uppercase tracking-tight mt-0.5">
              {t('hallHeading')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              {t('hallSubtitle')}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse p-1 rounded-2xl bg-surface-200/90 border border-border/80 backdrop-blur-xl">
            {(['ALL', 'VALORANT', 'FC', 'TEKKEN'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-orange text-white shadow-orange-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'ALL' ? t('filterAll') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout: 3D Holographic Podium on Left, Ranking List on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 flex-1 max-h-[64vh] overflow-hidden">
          
          {/* Podium (Cols 1-5) */}
          <div className="lg:col-span-5 flex flex-col justify-end items-center p-4 sm:p-6 rounded-3xl bg-surface-200/80 border border-border/80 backdrop-blur-xl shadow-elevated relative overflow-hidden">
            <div className="text-center mb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
                TOP GLADIATORS // نخبة الأبطال
              </span>
            </div>

            {/* 3-Column Podium */}
            <div className="w-full flex items-end justify-center gap-2 sm:gap-3">
              
              {/* 2nd Place Silver */}
              <div className="flex-1 flex flex-col items-center">
                {rank2 ? (
                  <div className="text-center mb-2 animate-fade-in">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-800 border-2 border-slate-400 p-0.5 mx-auto mb-1.5 shadow-lg flex items-center justify-center font-display font-black text-slate-300 text-lg">
                      🥈
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-white font-mono truncate max-w-[90px]">
                      @{rank2.username}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {rank2.wins || 0}W • {calculateWinRate(rank2)}
                    </div>
                  </div>
                ) : null}
                <div className="w-full h-24 sm:h-28 rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-700/80 border-t-2 border-slate-400 flex flex-col items-center justify-center font-mono font-black text-slate-300">
                  <span className="text-xl sm:text-2xl">2</span>
                  <span className="text-[9px] uppercase tracking-widest text-slate-400">SILVER</span>
                </div>
              </div>

              {/* 1st Place Gold Champion */}
              <div className="flex-1 flex flex-col items-center">
                {rank1 ? (
                  <div className="text-center mb-2 animate-fade-in">
                    <div className="relative inline-block mx-auto mb-1.5">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
                      </div>
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-950/80 border-2 border-amber-400 p-0.5 shadow-neon-gold flex items-center justify-center font-display font-black text-amber-300 text-xl">
                        👑
                      </div>
                    </div>
                    <div className="font-black text-xs sm:text-base text-amber-300 font-mono truncate max-w-[100px]">
                      @{rank1.username}
                    </div>
                    <div className="text-[10px] text-amber-400/90 font-mono font-bold">
                      {rank1.wins || 0}W • {calculateWinRate(rank1)}
                    </div>
                  </div>
                ) : null}
                <div className="w-full h-32 sm:h-36 rounded-t-2xl bg-gradient-to-t from-amber-950/90 to-amber-600/80 border-t-2 border-amber-400 flex flex-col items-center justify-center font-mono font-black text-amber-200 shadow-neon-gold">
                  <span className="text-2xl sm:text-3xl">1</span>
                  <span className="text-[10px] uppercase tracking-widest text-amber-300">CHAMPION</span>
                </div>
              </div>

              {/* 3rd Place Bronze */}
              <div className="flex-1 flex flex-col items-center">
                {rank3 ? (
                  <div className="text-center mb-2 animate-fade-in">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-950/60 border-2 border-amber-700 p-0.5 mx-auto mb-1.5 shadow-lg flex items-center justify-center font-display font-black text-amber-600 text-lg">
                      🥉
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-white font-mono truncate max-w-[90px]">
                      @{rank3.username}
                    </div>
                    <div className="text-[10px] text-amber-600 font-mono">
                      {rank3.wins || 0}W • {calculateWinRate(rank3)}
                    </div>
                  </div>
                ) : null}
                <div className="w-full h-16 sm:h-20 rounded-t-2xl bg-gradient-to-t from-orange-950 to-amber-900/70 border-t-2 border-amber-700 flex flex-col items-center justify-center font-mono font-black text-amber-500">
                  <span className="text-lg sm:text-xl">3</span>
                  <span className="text-[9px] uppercase tracking-widest text-amber-600">BRONZE</span>
                </div>
              </div>

            </div>
          </div>

          {/* Ranking Table List (Cols 6-12) */}
          <div className="lg:col-span-7 bg-surface-200/80 border border-border/80 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-elevated flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 text-xs font-mono text-gray-400 font-bold uppercase">
              <span>WARRIOR / TAG</span>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
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
                  const isTop3 = idx < 3;

                  return (
                    <div
                      key={player.id}
                      className="py-2.5 px-2 flex items-center justify-between rounded-xl hover:bg-white/5 transition-colors font-mono"
                    >
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className={`w-6 text-center text-xs font-black ${
                          idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-gray-500'
                        }`}>
                          #{idx + 1}
                        </span>

                        <div>
                          <div className="font-bold text-xs sm:text-sm text-white flex items-center space-x-1.5 rtl:space-x-reverse">
                            <span>@{player.username}</span>
                            {isTop3 && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                          </div>
                          <div className="text-[11px] text-gray-400">{player.display_name}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 rtl:space-x-reverse text-xs">
                        <div className="text-right rtl:text-left">
                          <span className="font-bold text-emerald-400">{winRate}</span>
                        </div>
                        <div className="text-right rtl:text-left min-w-[50px]">
                          <span className="font-bold text-brand-orange">{player.wins || 0}W</span>{' '}
                          <span className="text-gray-500">{player.losses || 0}L</span>
                        </div>
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
