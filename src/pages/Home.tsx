import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useRealtimeStore } from '../hooks/useRealtimeStore';
import { formatMAD, formatDate, getStatusBadge } from '../utils/formatters';
import { StreamEmbed } from '../components/StreamEmbed';
import { Trophy, Radio, Shield, Users, Star, Plus, Flame } from 'lucide-react';
import gsap from 'gsap';

export const Home: React.FC = () => {
  const { tournaments, profiles } = useRealtimeStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
      );
    }
  }, []);

  const liveTournaments = tournaments.filter((t) => t.status === 'LIVE');
  const featuredLive = liveTournaments[0] || tournaments[0];
  const upcomingTournaments = tournaments.slice(0, 4);
  const topPlayers = profiles.slice(0, 5);

  return (
    <div className="space-y-10">
      {/* HERO SECTION */}
      <div
        ref={heroRef}
        className="p-8 sm:p-12 rounded-3xl bg-surface-200 border border-border relative overflow-hidden"
      >
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-surface-100 border border-border text-xs font-bold text-brand-orange uppercase tracking-wider font-mono">
            <Star className="w-3.5 h-3.5 fill-brand-orange" />
            <span>Triple Stars Gaming Hall • Morocco</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white uppercase tracking-tight leading-none">
            Where Competition <span className="text-brand-orange">Gets Serious.</span>
          </h1>

          <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
            Register for tournament brackets, track live scores directly from our main arena stations, and compete for cash prizes in Moroccan Dirham (MAD / DH).
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/tournaments"
              className="px-6 py-3 rounded-xl bg-brand-dark hover:bg-brand-orange text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-orange-sm"
            >
              <Trophy className="w-4 h-4" />
              <span>Explore Tournaments</span>
            </Link>

            <Link
              to="/live"
              className="px-6 py-3 rounded-xl bg-surface-100 hover:bg-surface-50 border border-border text-gray-200 font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-2"
            >
              <Radio className="w-4 h-4 text-rose-500" />
              <span>Live Arena</span>
            </Link>

            <Link
              to="/admin/login"
              className="px-4 py-3 rounded-xl bg-surface-300 hover:bg-surface-100 border border-border text-gray-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-brand-orange" />
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* STAGE & TOURNAMENTS GRID */}
      <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Main Stage Stream & Featured Match (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold uppercase text-white flex items-center space-x-2">
              <Radio className="w-5 h-5 text-rose-500" />
              <span>Main Arena Broadcast</span>
            </h2>
            {featuredLive?.status === 'LIVE' && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold uppercase">
                Live on Stage
              </span>
            )}
          </div>

          <StreamEmbed
            embedUrl={featuredLive?.stream_embed_url}
            streamUrl={featuredLive?.stream_url}
            title={featuredLive?.stream_title || featuredLive?.name || 'Triple Stars Gaming Hall Live Stream'}
          />

          {featuredLive ? (
            <div className="p-6 rounded-2xl bg-surface-200 border border-border space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-orange uppercase font-mono">
                  {featuredLive.game?.name} • {featuredLive.location}
                </span>
                <span className="font-mono font-bold text-amber-400">
                  {formatMAD(featuredLive.prize_pool_mad)} Cash Pool
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white">{featuredLive.name}</h3>
              <p className="text-xs text-gray-400 line-clamp-2">{featuredLive.description || 'Live tournament competition at Triple Stars Gaming Hall.'}</p>

              <div className="pt-2 flex items-center justify-between border-t border-border/80">
                <span className="text-xs text-gray-300">
                  Entry Fee: <strong className="text-white font-mono">{formatMAD(featuredLive.entry_fee_mad)}</strong>
                </span>
                <Link
                  to={`/tournaments/${featuredLive.slug}`}
                  className="px-5 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-border text-white font-bold text-xs uppercase transition-colors"
                >
                  View Bracket
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-surface-200 border border-border text-center space-y-3">
              <Trophy className="w-8 h-8 text-brand-orange mx-auto opacity-70" />
              <h3 className="text-base font-bold text-white font-display uppercase">Welcome to Triple Stars Tournament Platform</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                No tournaments have been published yet. Staff members can create and launch new tournaments from the Admin Portal.
              </p>
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-dark hover:bg-brand-orange text-white text-xs font-bold uppercase transition-colors shadow-orange-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Tournament</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right: Active Tournaments & Competitor Ranking (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Tournaments Panel */}
          <div className="p-6 rounded-2xl bg-surface-200 border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-xl font-bold text-white uppercase flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-brand-orange" />
                <span>Active Tournaments</span>
              </h3>
              <Link to="/tournaments" className="text-xs text-brand-orange font-bold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingTournaments.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  <p>No tournaments scheduled yet.</p>
                </div>
              ) : (
                upcomingTournaments.map((t) => {
                  const badge = getStatusBadge(t.status);
                  return (
                    <Link
                      key={t.id}
                      to={`/tournaments/${t.slug}`}
                      className="p-3.5 rounded-xl bg-surface-300 border border-border hover:border-brand-dark transition-colors flex items-center justify-between group"
                    >
                      <div className="space-y-1 truncate pr-2">
                        <div className="text-xs font-bold text-white group-hover:text-brand-orange transition-colors truncate">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {t.game?.name} • Entry: {formatMAD(t.entry_fee_mad)}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[9px] ${badge.class}`}>
                          {badge.label}
                        </span>
                        <div className="text-xs font-mono font-bold text-brand-orange mt-1">
                          {formatMAD(t.prize_pool_mad)}
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Top Hall Competitors */}
          <div className="p-6 rounded-2xl bg-surface-200 border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-xl font-bold text-white uppercase flex items-center space-x-2">
                <Users className="w-4 h-4 text-brand-orange" />
                <span>Competitor Rankings</span>
              </h3>
              <Link to="/leaderboard" className="text-xs text-brand-orange font-bold hover:underline">
                Leaderboard
              </Link>
            </div>

            <div className="space-y-2">
              {topPlayers.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  <p>No competitors registered yet.</p>
                </div>
              ) : (
                topPlayers.map((p, idx) => (
                  <Link
                    key={p.id}
                    to={`/players/${p.username}`}
                    className="p-2.5 rounded-xl bg-surface-300 border border-border hover:border-brand-dark transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded bg-surface-200 border border-border text-gray-300 font-bold text-xs flex items-center justify-center font-mono">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-brand-orange transition-colors">
                          @{p.username}
                        </div>
                        <div className="text-[10px] text-gray-400">{p.wins || 0} Wins • {p.championships || 0} Titles</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-brand-orange">
                      {formatMAD(p.total_prize_money || 0)}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
