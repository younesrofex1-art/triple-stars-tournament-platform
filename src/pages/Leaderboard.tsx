import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRealtimeStore } from '../hooks/useRealtimeStore';
import { formatMAD } from '../utils/formatters';
import { Trophy, Crown, Search, Users, Sparkles, TrendingUp, Medal } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { profiles } = useRealtimeStore();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<'points' | 'prize' | 'winrate' | 'wins'>('points');

  const sortedProfiles = useMemo(() => {
    return [...profiles]
      .filter(
        (p) =>
          p.username.toLowerCase().includes(search.toLowerCase()) ||
          p.display_name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortKey === 'prize') {
          return (b.total_prize_money || 0) - (a.total_prize_money || 0);
        }
        if (sortKey === 'wins') {
          return (b.wins || 0) - (a.wins || 0);
        }
        if (sortKey === 'winrate') {
          const aTotal = (a.wins || 0) + (a.losses || 0);
          const bTotal = (b.wins || 0) + (b.losses || 0);
          const aRate = aTotal > 0 ? (a.wins || 0) / aTotal : 0;
          const bRate = bTotal > 0 ? (b.wins || 0) / bTotal : 0;
          return bRate - aRate;
        }
        // default points
        return (b.points || 0) - (a.points || 0) || (b.wins || 0) - (a.wins || 0);
      });
  }, [profiles, search, sortKey]);

  const top3 = sortedProfiles.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-brand-orange" />
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider font-mono">
            Triple Stars Esports Circuit
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-white uppercase tracking-tight mt-1">
          Competitor Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-1">
          Official rankings for Triple Stars competitors. Ranking points and cash prizes (MAD / DH) are updated live after every official match.
        </p>
      </div>

      {/* Top 3 Podium (when players exist and no search filter) */}
      {!search && top3.length >= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Rank 2 - Silver */}
          {top3[1] && (
            <Link
              to={`/players/${top3[1].username}`}
              className="p-5 rounded-2xl bg-surface-200 border border-border hover:border-gray-400 transition-all flex flex-col justify-between order-2 sm:order-1 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-600 text-[10px] font-bold font-mono">
                  #2 SILVER
                </span>
                <Medal className="w-4 h-4 text-slate-300" />
              </div>
              <div className="space-y-1">
                <div className="font-display text-lg font-bold text-white group-hover:text-brand-orange transition-colors">
                  {top3[1].display_name}
                </div>
                <div className="text-xs text-gray-400 font-mono">@{top3[1].username}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono">{top3[1].wins || 0} Wins</span>
                <span className="font-mono font-bold text-brand-orange">
                  {formatMAD(top3[1].total_prize_money || 0)}
                </span>
              </div>
            </Link>
          )}

          {/* Rank 1 - Champion Gold */}
          {top3[0] && (
            <Link
              to={`/players/${top3[0].username}`}
              className="p-6 rounded-2xl bg-gradient-to-b from-brand-muted/20 to-surface-200 border border-brand-dark/70 hover:border-brand-orange transition-all flex flex-col justify-between order-1 sm:order-2 shadow-card group relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-dark text-white text-[10px] font-bold uppercase tracking-wider font-mono shadow-orange-sm flex items-center space-x-1">
                <Crown className="w-3 h-3 fill-white" />
                <span>Hall Champion</span>
              </div>
              <div className="flex items-center justify-between mb-3 pt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold font-mono">
                  #1 GOLD
                </span>
                <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <div className="space-y-1">
                <div className="font-display text-xl font-bold text-white group-hover:text-brand-orange transition-colors">
                  {top3[0].display_name}
                </div>
                <div className="text-xs text-brand-orange font-mono">@{top3[0].username}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-mono font-bold">{top3[0].points || 0} PTS</span>
                <span className="font-mono font-bold text-brand-orange text-sm">
                  {formatMAD(top3[0].total_prize_money || 0)}
                </span>
              </div>
            </Link>
          )}

          {/* Rank 3 - Bronze */}
          {top3[2] && (
            <Link
              to={`/players/${top3[2].username}`}
              className="p-5 rounded-2xl bg-surface-200 border border-border hover:border-amber-700/60 transition-all flex flex-col justify-between order-3 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-500 border border-amber-900 text-[10px] font-bold font-mono">
                  #3 BRONZE
                </span>
                <Medal className="w-4 h-4 text-amber-600" />
              </div>
              <div className="space-y-1">
                <div className="font-display text-lg font-bold text-white group-hover:text-brand-orange transition-colors">
                  {top3[2].display_name}
                </div>
                <div className="text-xs text-gray-400 font-mono">@{top3[2].username}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono">{top3[2].wins || 0} Wins</span>
                <span className="font-mono font-bold text-brand-orange">
                  {formatMAD(top3[2].total_prize_money || 0)}
                </span>
              </div>
            </Link>
          )}
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="p-4 rounded-2xl bg-surface-200 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search competitor handle or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-300 border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
          />
        </div>

        {/* Sort Select / Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mr-1 hidden sm:inline">
            Sort:
          </span>
          <button
            onClick={() => setSortKey('points')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              sortKey === 'points'
                ? 'bg-brand-dark text-white'
                : 'bg-surface-300 text-gray-400 hover:text-white'
            }`}
          >
            Points
          </button>
          <button
            onClick={() => setSortKey('prize')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              sortKey === 'prize'
                ? 'bg-brand-dark text-white'
                : 'bg-surface-300 text-gray-400 hover:text-white'
            }`}
          >
            Prize (DH)
          </button>
          <button
            onClick={() => setSortKey('winrate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              sortKey === 'winrate'
                ? 'bg-brand-dark text-white'
                : 'bg-surface-300 text-gray-400 hover:text-white'
            }`}
          >
            Win Rate
          </button>
          <button
            onClick={() => setSortKey('wins')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              sortKey === 'wins'
                ? 'bg-brand-dark text-white'
                : 'bg-surface-300 text-gray-400 hover:text-white'
            }`}
          >
            Wins
          </button>
        </div>
      </div>

      {/* MOBILE VIEW: Competitor Cards (< 768px) */}
      <div className="md:hidden space-y-3">
        {sortedProfiles.length === 0 ? (
          <div className="p-8 text-center bg-surface-200 border border-border rounded-2xl text-gray-400 text-xs">
            <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="font-semibold text-white">No competitors found</p>
          </div>
        ) : (
          sortedProfiles.map((player, idx) => {
            const wins = player.wins || 0;
            const losses = player.losses || 0;
            const total = wins + losses;
            const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
            const rank = idx + 1;

            return (
              <Link
                key={player.id}
                to={`/players/${player.username}`}
                className="p-4 rounded-2xl bg-surface-200 border border-border active:scale-[0.99] transition-all block space-y-3"
              >
                {/* Top: Rank, Avatar, Handle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 truncate pr-2">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs font-mono flex-shrink-0 ${
                        rank === 1
                          ? 'bg-amber-500 text-black'
                          : rank === 2
                          ? 'bg-slate-300 text-black'
                          : rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-surface-300 border border-border text-gray-400'
                      }`}
                    >
                      {rank === 1 ? <Crown className="w-3.5 h-3.5 fill-black" /> : `#${rank}`}
                    </span>

                    <div className="truncate">
                      <div className="font-bold text-white text-sm truncate">
                        {player.display_name}
                      </div>
                      <div className="text-xs text-brand-orange font-mono">
                        @{player.username}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-mono font-black text-white">
                      {player.points || 0} PTS
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">
                      {formatMAD(player.total_prize_money || 0)}
                    </div>
                  </div>
                </div>

                {/* Bottom: Quick Stats & Win Rate Progress */}
                <div className="pt-2 border-t border-border/70 flex items-center justify-between text-xs text-gray-400 font-mono">
                  <span>
                    <strong className="text-emerald-400">{wins}W</strong> -{' '}
                    <strong className="text-rose-400">{losses}L</strong> ({winRate}%)
                  </span>

                  {player.championships ? (
                    <span className="px-2 py-0.5 rounded bg-brand-subtle text-brand-orange border border-brand-dark/40 text-[10px] font-bold font-sans">
                      {player.championships} {player.championships === 1 ? 'Title' : 'Titles'}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-500">Competitor</span>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* DESKTOP VIEW: Full Data Table (>= 768px) */}
      <div className="hidden md:block bg-surface-200 border border-border rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-surface-300 text-gray-400 uppercase font-bold text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Competitor</th>
                <th className="p-4">Hall Titles</th>
                <th className="p-4 text-center">Wins</th>
                <th className="p-4 text-center">Losses</th>
                <th className="p-4 text-center">Win Rate</th>
                <th className="p-4 text-right">Prize Earnings (MAD)</th>
                <th className="p-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedProfiles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400">
                    <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="font-semibold text-white text-sm">No ranked competitors found</p>
                  </td>
                </tr>
              ) : (
                sortedProfiles.map((player, idx) => {
                  const wins = player.wins || 0;
                  const losses = player.losses || 0;
                  const total = wins + losses;
                  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
                  const rank = idx + 1;

                  return (
                    <tr key={player.id} className="hover:bg-surface-100/50 transition-colors">
                      <td className="p-4">
                        {rank === 1 ? (
                          <span className="w-6 h-6 rounded-lg bg-amber-500 text-black flex items-center justify-center font-bold text-xs shadow-sm">
                            <Crown className="w-3.5 h-3.5 fill-black" />
                          </span>
                        ) : rank === 2 ? (
                          <span className="w-6 h-6 rounded-lg bg-slate-300 text-black flex items-center justify-center font-bold text-xs">
                            2
                          </span>
                        ) : rank === 3 ? (
                          <span className="w-6 h-6 rounded-lg bg-amber-700 text-white flex items-center justify-center font-bold text-xs">
                            3
                          </span>
                        ) : (
                          <span className="font-mono text-gray-400 font-bold px-1.5">#{rank}</span>
                        )}
                      </td>

                      <td className="p-4">
                        <Link
                          to={`/players/${player.username}`}
                          className="flex items-center space-x-3 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-surface-100 border border-border flex items-center justify-center font-bold text-brand-orange text-xs font-mono group-hover:border-brand-orange transition-colors">
                            {player.username ? player.username[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-brand-orange transition-colors">
                              {player.display_name}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono">@{player.username}</div>
                          </div>
                        </Link>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-surface-100 border border-border text-brand-orange font-bold text-[10px]">
                          <Trophy className="w-3 h-3" />
                          <span>{player.championships || 0} Titles</span>
                        </span>
                      </td>

                      <td className="p-4 text-center font-mono font-bold text-emerald-400">
                        {wins}
                      </td>

                      <td className="p-4 text-center font-mono text-rose-400">
                        {losses}
                      </td>

                      <td className="p-4 text-center font-mono font-bold text-gray-200">
                        {winRate}%
                      </td>

                      <td className="p-4 text-right font-mono font-bold text-brand-orange">
                        {formatMAD(player.total_prize_money || 0)}
                      </td>

                      <td className="p-4 text-right font-mono font-bold text-white text-sm">
                        {player.points || 0} PTS
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
