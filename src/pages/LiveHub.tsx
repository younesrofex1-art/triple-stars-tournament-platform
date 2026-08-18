import React from 'react';
import { Link } from 'react-router-dom';
import { useRealtimeStore } from '../hooks/useRealtimeStore';
import { StreamEmbed } from '../components/StreamEmbed';
import { Radio, Trophy, ArrowRight } from 'lucide-react';
import { formatMAD } from '../utils/formatters';

export const LiveHubPage: React.FC = () => {
  const { tournaments } = useRealtimeStore();

  const liveTournaments = tournaments.filter((t) => t.status === 'LIVE');
  const activeStreamTournament = liveTournaments.find((t) => t.stream_embed_url) || liveTournaments[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">
            Live Esports Arena
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight mt-1">
          Real-Time Match Broadcast
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Follow match scores updating live in real time via Supabase Realtime without refreshing.
        </p>
      </div>

      {/* Featured Live Stream */}
      {activeStreamTournament ? (
        <StreamEmbed
          embedUrl={activeStreamTournament.stream_embed_url}
          streamUrl={activeStreamTournament.stream_url}
          title={activeStreamTournament.stream_title || activeStreamTournament.name}
        />
      ) : (
        <div className="p-12 text-center bg-surface-200 border border-border rounded-2xl space-y-2">
          <Radio className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Live Stream Currently Broadcasting</h3>
          <p className="text-xs text-gray-400">
            Stage broadcasts will display here once the tournament director starts the live feed.
          </p>
        </div>
      )}

      {/* Currently Live Tournaments List */}
      <div className="space-y-4">
        <h3 className="font-display text-2xl font-bold text-white uppercase flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-brand-orange" />
          <span>Active Live Tournaments</span>
        </h3>

        {liveTournaments.length === 0 ? (
          <div className="p-8 text-center bg-surface-200 border border-border rounded-2xl text-gray-400 text-xs">
            There are currently no tournaments marked LIVE. Explore upcoming events on the tournaments page.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveTournaments.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-surface-200 border border-rose-800/80 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold uppercase font-mono flex items-center space-x-1">
                    <Radio className="w-3 h-3 text-rose-500" />
                    <span>LIVE NOW</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-brand-orange">{formatMAD(t.prize_pool_mad)} Cash</span>
                </div>

                <div>
                  <h4 className="font-display text-2xl font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{t.game?.name} • {t.location}</p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-gray-400">Bracket in progress</span>
                  <Link
                    to={`/tournaments/${t.slug}`}
                    className="px-4 py-2 rounded-xl bg-brand-dark hover:bg-brand-orange text-white font-bold text-xs uppercase transition-colors flex items-center space-x-1"
                  >
                    <span>View Live Bracket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
