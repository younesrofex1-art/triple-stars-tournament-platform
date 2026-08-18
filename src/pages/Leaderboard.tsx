import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRealtimeStore } from '../hooks/useRealtimeStore';
import { formatMAD } from '../utils/formatters';
import { Trophy, Crown, Search, Medal } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { profiles } = useRealtimeStore();
  const [search, setSearch] = useState('');

  const sortedProfiles = [...profiles]
    .filter(
      (p) =>
        p.username.toLowerCase().includes(search.toLowerCase()) ||
        p.display_name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.points - a.points || b.wins - a.wins);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-brand-orange" />
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider font-mono">
            Triple Stars Gaming Hall
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight mt-1">
          Competitor Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-1">
          Official ranking of competitors at Triple Stars Gaming Hall. Points and cash earnings are updated after every tournament final.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter player leaderboard..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-200 border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
        />
      </div>

      {/* Leaderboard Table */}
      <div className="bg-surface-200 border border-border rounded-2xl overflow-hidden shadow-card">
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
              {sortedProfiles.map((player, idx) => {
                const total = player.wins + player.losses;
                const winRate = total > 0 ? Math.round((player.wins / total) * 100) : 0;
                const rank = idx + 1;

                return (
                  <tr key={player.id} className="hover:bg-surface-100/50 transition-colors">
                    <td className="p-4">
                      {rank === 1 ? (
                        <span className="w-6 h-6 rounded bg-brand-dark text-white flex items-center justify-center font-bold text-xs">
                          <Crown className="w-3.5 h-3.5 fill-white" />
                        </span>
                      ) : rank === 2 ? (
                        <span className="w-6 h-6 rounded bg-surface-100 text-gray-200 flex items-center justify-center font-bold text-xs">
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className="w-6 h-6 rounded bg-surface-100 text-amber-500 flex items-center justify-center font-bold text-xs">
                          3
                        </span>
                      ) : (
                        <span className="font-mono text-gray-500 font-bold px-1.5">#{rank}</span>
                      )}
                    </td>

                    <td className="p-4">
                      <Link
                        to={`/players/${player.username}`}
                        className="flex items-center space-x-3 group"
                      >
                        <div className="w-7 h-7 rounded bg-surface-100 border border-border flex items-center justify-center font-bold text-brand-orange text-xs font-mono">
                          {player.username[0].toUpperCase()}
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
                        <span>{player.championships} Titles</span>
                      </span>
                    </td>

                    <td className="p-4 text-center font-mono font-bold text-emerald-400">
                      {player.wins}
                    </td>

                    <td className="p-4 text-center font-mono text-rose-400">
                      {player.losses}
                    </td>

                    <td className="p-4 text-center font-mono font-bold text-gray-200">
                      {winRate}%
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-brand-orange">
                      {formatMAD(player.total_prize_money)}
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-white text-sm">
                      {player.points} PTS
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
