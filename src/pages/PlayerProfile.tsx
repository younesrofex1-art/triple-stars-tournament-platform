import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRealtimeStore } from '../hooks/useRealtimeStore';
import { formatMAD, formatDate } from '../utils/formatters';
import { Trophy, User, ArrowLeft, Calendar } from 'lucide-react';

export const PlayerProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { profiles, tournaments, registrations } = useRealtimeStore();

  const profile = profiles.find(
    (p) => p.username.toLowerCase() === (username || '').toLowerCase()
  );

  if (!profile) {
    return (
      <div className="py-16 text-center space-y-4">
        <User className="w-12 h-12 text-gray-500 mx-auto" />
        <h2 className="text-2xl font-bold font-display uppercase text-white">Player Not Found</h2>
        <p className="text-xs text-gray-400">
          The requested competitor profile @{username} does not exist in the Triple Stars database.
        </p>
        <Link
          to="/leaderboard"
          className="inline-block px-5 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-border text-white text-xs font-semibold"
        >
          View Leaderboard
        </Link>
      </div>
    );
  }

  const wins = profile.wins || 0;
  const losses = profile.losses || 0;
  const totalMatches = wins + losses;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

  // Filter real tournaments joined by this player
  const playerRegs = registrations.filter((r) => r.player_id === profile.id);
  const playerTournaments = tournaments.filter((t) =>
    playerRegs.some((r) => r.tournament_id === t.id)
  );

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        to="/leaderboard"
        className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Leaderboard</span>
      </Link>

      {/* Header Profile Card */}
      <div className="rounded-3xl bg-surface-200 border border-border p-6 sm:p-8 space-y-6 shadow-card">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-surface-300 border border-brand-dark/50 flex items-center justify-center font-display text-4xl font-bold text-brand-orange font-mono">
            {profile.username ? profile.username[0].toUpperCase() : 'U'}
          </div>

          {/* Details */}
          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-display text-3xl font-bold text-white">
                {profile.display_name}
              </h1>
              <span className="px-2 py-0.5 rounded bg-surface-100 text-gray-300 border border-border text-xs font-mono font-bold">
                @{profile.username}
              </span>
            </div>

            <p className="text-xs text-gray-400">
              Triple Stars Competitor • Registered {formatDate(profile.created_at)}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-lg bg-surface-300 border border-border text-xs font-bold text-brand-orange flex items-center space-x-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>{profile.championships || 0} Hall Championships</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-surface-300 border border-border text-xs font-mono text-gray-300">
                {profile.points || 0} Ranking Points
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface-200 border border-border text-center">
          <div className="text-[10px] uppercase font-bold text-gray-400">Total Wins</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {wins}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-200 border border-border text-center">
          <div className="text-[10px] uppercase font-bold text-gray-400">Total Losses</div>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">
            {losses}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-200 border border-border text-center">
          <div className="text-[10px] uppercase font-bold text-gray-400">Win Rate</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {winRate}%
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface-200 border border-border text-center">
          <div className="text-[10px] uppercase font-bold text-gray-400">Total Cash Won (MAD)</div>
          <div className="text-2xl font-bold text-brand-orange font-mono mt-1">
            {formatMAD(profile.total_prize_money || 0)}
          </div>
        </div>
      </div>

      {/* Tournaments Joined */}
      <div className="bg-surface-200 border border-border rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase text-white tracking-wide">
          Tournament Participation
        </h3>

        {playerTournaments.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-400">
            <p>No tournament participation recorded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {playerTournaments.map((t) => (
              <Link
                key={t.id}
                to={`/tournaments/${t.slug}`}
                className="p-3.5 rounded-xl bg-surface-300 border border-border hover:border-brand-dark transition-colors flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{t.game?.name} • {formatDate(t.start_at)}</p>
                </div>
                <span className="text-xs font-mono font-bold text-brand-orange">
                  {formatMAD(t.prize_pool_mad)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
