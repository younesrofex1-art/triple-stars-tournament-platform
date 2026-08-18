import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRealtimeStore } from '../hooks/useRealtimeStore';
import { formatMAD, formatDate, getStatusBadge } from '../utils/formatters';
import { Trophy, Filter, Search, Calendar, Users, DollarSign } from 'lucide-react';

export const TournamentsPage: React.FC = () => {
  const { tournaments, games } = useRealtimeStore();
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'soonest' | 'prize' | 'fee'>('soonest');

  const filteredTournaments = useMemo(() => {
    return tournaments
      .filter((t) => {
        if (selectedGame !== 'all' && t.game_id !== selectedGame) return false;
        if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
        if (selectedFormat !== 'all' && t.format !== selectedFormat) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = t.name.toLowerCase().includes(q);
          const matchGame = t.game?.name.toLowerCase().includes(q);
          if (!matchName && !matchGame) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'prize') {
          return (b.prize_pool_mad || 0) - (a.prize_pool_mad || 0);
        }
        if (sortBy === 'fee') {
          return (a.entry_fee_mad || 0) - (b.entry_fee_mad || 0);
        }
        return new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
      });
  }, [tournaments, selectedGame, selectedStatus, selectedFormat, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-brand-orange" />
          <span className="text-xs font-bold text-brand-orange uppercase tracking-wider font-mono">
            Triple Stars Esports Hub
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight mt-1">
          Tournaments & Brackets
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-1">
          Explore gaming tournaments held at Triple Stars Gaming Hall. All entry fees and cash prizes are denominated in Moroccan Dirham (MAD / DH).
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-200 border border-border space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or game..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-300 border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
            />
          </div>

          {/* Game Select */}
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="bg-surface-300 border border-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-dark"
          >
            <option value="all">All Games</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-surface-300 border border-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-dark"
          >
            <option value="all">All Statuses</option>
            <option value="LIVE">Live Now</option>
            <option value="REGISTRATION_OPEN">Registration Open</option>
            <option value="CHECK_IN">Check-In Open</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Format Select */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-surface-300 border border-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-dark"
          >
            <option value="all">All Formats</option>
            <option value="single_elimination">Single Elimination</option>
            <option value="double_elimination">Double Elimination</option>
            <option value="round_robin">Round Robin</option>
            <option value="swiss">Swiss System</option>
          </select>

          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-surface-300 border border-border rounded-xl px-3 py-2 text-xs text-brand-orange font-semibold focus:outline-none focus:border-brand-dark"
          >
            <option value="soonest">Sort: Soonest Start</option>
            <option value="prize">Sort: Highest Prize (DH)</option>
            <option value="fee">Sort: Lowest Entry Fee (DH)</option>
          </select>
        </div>
      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length === 0 ? (
        <div className="p-12 text-center bg-surface-200 border border-border rounded-2xl space-y-2">
          <Trophy className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Tournaments Match Your Filter</h3>
          <p className="text-xs text-gray-400">
            Try adjusting your search keywords, status filter, or selected game.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((t) => {
            const badge = getStatusBadge(t.status);
            return (
              <Link
                key={t.id}
                to={`/tournaments/${t.slug}`}
                className="group rounded-2xl bg-surface-200 border border-border hover:border-brand-dark overflow-hidden transition-all duration-200 flex flex-col justify-between"
              >
                {/* Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-surface-300">
                  <img
                    src={t.banner_url}
                    alt={t.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-200 via-transparent to-black/60" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-bold text-white uppercase border border-border">
                      {t.game?.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${badge.class}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center space-x-2 text-[10px] font-mono text-gray-300">
                    <span className="bg-black/70 px-2 py-0.5 rounded border border-border">
                      {t.max_players} Slots
                    </span>
                    <span className="bg-black/70 px-2 py-0.5 rounded border border-border uppercase">
                      {t.format.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-brand-orange transition-colors leading-snug">
                      {t.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 mt-2">
                      <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                      <span>{formatDate(t.start_at)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase">Entry Fee</div>
                      <div className="text-base font-bold text-white font-mono">
                        {formatMAD(t.entry_fee_mad)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-gray-500 uppercase">Prize Pool</div>
                      <div className="text-base font-bold text-brand-orange font-mono">
                        {formatMAD(t.prize_pool_mad)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
