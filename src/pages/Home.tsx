import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useRealtimeStore } from '../hooks/useRealtimeStore';
import { formatMAD, formatDate, getStatusBadge } from '../utils/formatters';
import { StreamEmbed } from '../components/StreamEmbed';
import {
  Trophy,
  Radio,
  Users,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  ArrowRight,
  Calendar,
  Layers,
  TrendingUp,
  Swords,
  Maximize2,
  CheckCircle,
} from 'lucide-react';
import gsap from 'gsap';

export const Home: React.FC = () => {
  const { tournaments, profiles, registrations } = useRealtimeStore();
  const [activeStage, setActiveStage] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef<boolean>(false);

  const STAGES_COUNT = 4;

  const goToStage = useCallback((stageIndex: number) => {
    const target = Math.max(0, Math.min(STAGES_COUNT - 1, stageIndex));
    setActiveStage(target);

    if (sliderTrackRef.current) {
      isTransitioning.current = true;
      gsap.to(sliderTrackRef.current, {
        xPercent: -target * 100,
        duration: 0.75,
        ease: 'power3.inOut',
        onComplete: () => {
          isTransitioning.current = false;
        },
      });
    }
  }, []);

  const nextStage = useCallback(() => {
    goToStage((activeStage + 1) % STAGES_COUNT);
  }, [activeStage, goToStage]);

  const prevStage = useCallback(() => {
    goToStage((activeStage - 1 + STAGES_COUNT) % STAGES_COUNT);
  }, [activeStage, goToStage]);

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        goToStage(activeStage + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToStage(activeStage - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStage, goToStage]);

  // Wheel listener to slide horizontally
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let wheelTimeout: any = null;
    let accumulatedDelta = 0;

    const handleWheel = (e: WheelEvent) => {
      // If user is scrolling vertically inside an internal scrollable element, let it scroll
      const target = e.target as HTMLElement;
      if (target && target.closest('.allow-internal-scroll')) {
        return;
      }

      accumulatedDelta += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (accumulatedDelta > 40) {
          goToStage(activeStage + 1);
        } else if (accumulatedDelta < -40) {
          goToStage(activeStage - 1);
        }
        accumulatedDelta = 0;
      }, 50);
    };

    el.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [activeStage, goToStage]);

  // Touch swipe support for mobile
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const diffX = startX - e.changedTouches[0].clientX;
      const diffY = startY - e.changedTouches[0].clientY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
        if (diffX > 0) {
          goToStage(activeStage + 1);
        } else {
          goToStage(activeStage - 1);
        }
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeStage, goToStage]);

  const liveTournaments = tournaments.filter((t) => t.status === 'LIVE');
  const featuredLive = liveTournaments[0] || tournaments[0];
  const upcomingTournaments = tournaments.slice(0, 6);
  const topPlayers = profiles.slice(0, 5);

  const totalPrizePool = tournaments.reduce((acc, t) => acc + (t.prize_pool_mad || 0), 0);

  const stageTabs = [
    { index: 0, label: '01 Arena Spotlight', icon: Flame },
    { index: 1, label: '02 Championships', icon: Trophy },
    { index: 2, label: '03 Live Broadcast', icon: Radio },
    { index: 3, label: '04 Hall of Fame', icon: Users },
  ];

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden select-none space-y-4">
      {/* --- TOP HORIZONTAL STAGE NAVIGATOR DOCK --- */}
      <div className="flex items-center justify-between bg-surface-200 border border-border rounded-2xl p-2 sm:p-2.5 shadow-card">
        {/* Stage Pills */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto scrollbar-none flex-1">
          {stageTabs.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeStage === tab.index;
            return (
              <button
                key={tab.index}
                onClick={() => goToStage(tab.index)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider whitespace-nowrap transition-all flex items-center space-x-2 ${
                  isCurrent
                    ? 'bg-brand-dark text-white border border-brand-orange/60 shadow-orange-sm'
                    : 'bg-surface-300 text-gray-400 hover:text-white hover:bg-surface-100 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-brand-orange' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Prev / Next Stage Arrows */}
        <div className="hidden sm:flex items-center space-x-1.5 pl-3 border-l border-border flex-shrink-0">
          <button
            onClick={prevStage}
            disabled={activeStage === 0}
            className="p-2 rounded-xl bg-surface-300 hover:bg-surface-100 disabled:opacity-30 border border-border text-gray-300 hover:text-white transition-colors"
            title="Previous Stage [Left Arrow]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-gray-400 px-1">
            0{activeStage + 1} / 0{STAGES_COUNT}
          </span>
          <button
            onClick={nextStage}
            disabled={activeStage === STAGES_COUNT - 1}
            className="p-2 rounded-xl bg-surface-300 hover:bg-surface-100 disabled:opacity-30 border border-border text-gray-300 hover:text-white transition-colors"
            title="Next Stage [Right Arrow]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- HORIZONTAL SLIDER VIEWPORT (4 PANELS SIDE-BY-SIDE) --- */}
      <div className="relative w-full overflow-hidden rounded-3xl min-h-[580px] lg:min-h-[620px]">
        <div
          ref={sliderTrackRef}
          className="flex w-[400%] transition-none"
          style={{ willChange: 'transform' }}
        >
          {/* =========================================================================
              PANEL 1: ARENA SPOTLIGHT & HERO
             ========================================================================= */}
          <div className="w-1/4 flex-shrink-0 px-1">
            <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-surface-200 border border-border relative overflow-hidden shadow-card min-h-[580px] lg:min-h-[620px] flex flex-col justify-between">
              {/* Top Banner Content */}
              <div className="space-y-5 max-w-3xl relative z-10">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-surface-300 border border-brand-dark/40 text-xs font-mono font-bold text-brand-orange uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 fill-brand-orange" />
                  <span>Triple Stars Esports Circuit • Official Tournaments</span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none">
                  Compete. Advance. <span className="text-brand-orange">Claim The Crown.</span>
                </h1>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl font-medium">
                  Official tournament hub for Single Elimination, Double Elimination, and Swiss championship circuits. Real-time bracket synchronization, live stream arena, and verified cash prize distributions in Moroccan Dirham (MAD / DH).
                </p>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => goToStage(1)}
                    className="px-6 py-3.5 rounded-xl bg-brand-dark hover:bg-brand-orange text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-orange-sm active:scale-95"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>View Championships</span>
                  </button>

                  <button
                    onClick={() => goToStage(2)}
                    className="px-6 py-3.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-border text-gray-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 active:scale-95"
                  >
                    <Radio className="w-4 h-4 text-rose-500" />
                    <span>Live Arena Stream</span>
                  </button>

                  <button
                    onClick={() => goToStage(3)}
                    className="px-5 py-3.5 rounded-xl bg-surface-300 hover:bg-surface-100 border border-border text-gray-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 active:scale-95"
                  >
                    <Users className="w-4 h-4 text-brand-orange" />
                    <span>Hall Ranks</span>
                  </button>
                </div>
              </div>

              {/* Stat Strip & Quick Slide Prompt */}
              <div className="relative z-10 pt-8 border-t border-border/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-2xl bg-surface-300/80 border border-border">
                  <div className="text-[10px] font-mono uppercase font-bold text-gray-400">Total Prize Pools</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-brand-orange mt-0.5">
                    {formatMAD(totalPrizePool)}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-300/80 border border-border">
                  <div className="text-[10px] font-mono uppercase font-bold text-gray-400">Active Tournaments</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
                    {tournaments.length}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-300/80 border border-border">
                  <div className="text-[10px] font-mono uppercase font-bold text-gray-400">Verified Competitors</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                    {profiles.length}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-300/80 border border-border flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase font-bold text-gray-400">Next Stage</div>
                    <div className="text-xs font-bold text-gray-200 mt-0.5">Tournaments Grid</div>
                  </div>
                  <button
                    onClick={() => goToStage(1)}
                    className="p-2 rounded-xl bg-brand-dark/40 hover:bg-brand-dark text-brand-orange hover:text-white border border-brand-orange/40 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Background Esports Ambient Glow */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-brand-orange/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* =========================================================================
              PANEL 2: ACTIVE & UPCOMING CHAMPIONSHIPS
             ========================================================================= */}
          <div className="w-1/4 flex-shrink-0 px-1">
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-200 border border-border relative overflow-hidden shadow-card min-h-[580px] lg:min-h-[620px] flex flex-col justify-between">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-surface-300 border border-brand-dark/50 flex items-center justify-center text-brand-orange">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-white uppercase">Championship Circuit</h2>
                    <p className="text-xs text-gray-400">Select any tournament to view brackets, rules, and live matches.</p>
                  </div>
                </div>

                <Link
                  to="/tournaments"
                  className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-border text-xs font-bold uppercase tracking-wider text-brand-orange transition-colors self-start sm:self-auto flex items-center space-x-1"
                >
                  <span>All Tournaments</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tournaments Grid (Internal Scrollable) */}
              <div className="my-4 flex-1 overflow-y-auto max-h-[420px] allow-internal-scroll pr-1 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingTournaments.map((t) => {
                    const badge = getStatusBadge(t.status);
                    const tourneyRegs = registrations.filter((r) => r.tournament_id === t.id);
                    const fillPercent = Math.min(100, Math.round((tourneyRegs.length / t.max_players) * 100));

                    return (
                      <Link
                        key={t.id}
                        to={`/tournaments/${t.slug}`}
                        className="p-4 rounded-2xl bg-surface-300 border border-border hover:border-brand-dark transition-all duration-200 flex flex-col justify-between group active:scale-[0.99] shadow-sm hover:shadow-card"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded bg-surface-200 text-[10px] font-mono font-bold text-gray-300 border border-border uppercase">
                              {t.game?.name}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badge.class}`}>
                              {badge.label}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-white group-hover:text-brand-orange transition-colors leading-snug line-clamp-1">
                            {t.name}
                          </h3>

                          <div className="flex items-center space-x-2 text-[11px] text-gray-400">
                            <Calendar className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" />
                            <span>{formatDate(t.start_at)}</span>
                          </div>

                          {/* Progress fill */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                              <span>Slots Filled</span>
                              <span>{tourneyRegs.length} / {t.max_players} ({fillPercent}%)</span>
                            </div>
                            <div className="h-1.5 w-full bg-surface-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-orange rounded-full"
                                style={{ width: `${fillPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                          <span className="text-gray-400 uppercase text-[10px]">
                            {t.format === 'double_elimination' && 'Double Elim'}
                            {t.format === 'swiss' && 'Swiss Format'}
                            {t.format === 'round_robin' && 'Round Robin'}
                            {(!t.format || t.format === 'single_elimination') && 'Single Elim'}
                          </span>
                          <span className="font-bold text-brand-orange">{formatMAD(t.prize_pool_mad)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Nav Hint */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-gray-400 font-mono">
                <button onClick={() => goToStage(0)} className="hover:text-white flex items-center space-x-1">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Stage 01</span>
                </button>
                <span>Stage 02 of 04</span>
                <button onClick={() => goToStage(2)} className="hover:text-white flex items-center space-x-1">
                  <span>Stage 03</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              PANEL 3: LIVE ARENA BROADCAST
             ========================================================================= */}
          <div className="w-1/4 flex-shrink-0 px-1">
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-200 border border-border relative overflow-hidden shadow-card min-h-[580px] lg:min-h-[620px] flex flex-col justify-between">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-950/60 border border-rose-800 flex items-center justify-center text-rose-400">
                    <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-white uppercase">Main Arena Live Stream</h2>
                    <p className="text-xs text-gray-400">Official tournament livestream and main stage matches.</p>
                  </div>
                </div>

                <Link
                  to="/live"
                  className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs uppercase tracking-wider transition-colors self-start sm:self-auto flex items-center space-x-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Arena Hub</span>
                </Link>
              </div>

              {/* Stream Frame */}
              <div className="my-4 flex-1 flex flex-col justify-center">
                <div className="max-w-4xl mx-auto w-full">
                  <StreamEmbed
                    embedUrl={featuredLive?.stream_embed_url}
                    streamUrl={featuredLive?.stream_url}
                    title={featuredLive?.stream_title || featuredLive?.name || 'Triple Stars Arena Stream'}
                  />
                </div>
              </div>

              {/* Bottom Nav Hint */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-gray-400 font-mono">
                <button onClick={() => goToStage(1)} className="hover:text-white flex items-center space-x-1">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Stage 02</span>
                </button>
                <span>Stage 03 of 04</span>
                <button onClick={() => goToStage(3)} className="hover:text-white flex items-center space-x-1">
                  <span>Stage 04</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              PANEL 4: HALL OF CHAMPIONS & LEADERBOARD
             ========================================================================= */}
          <div className="w-1/4 flex-shrink-0 px-1">
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-200 border border-border relative overflow-hidden shadow-card min-h-[580px] lg:min-h-[620px] flex flex-col justify-between">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-surface-300 border border-brand-dark/50 flex items-center justify-center text-brand-orange">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-white uppercase">Hall of Champions</h2>
                    <p className="text-xs text-gray-400">Global rankings, prize earnings, and hall titles.</p>
                  </div>
                </div>

                <Link
                  to="/leaderboard"
                  className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-border text-xs font-bold uppercase tracking-wider text-brand-orange transition-colors self-start sm:self-auto flex items-center space-x-1"
                >
                  <span>Full Leaderboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Ranks list (Internal Scrollable) */}
              <div className="my-4 flex-1 overflow-y-auto max-h-[420px] allow-internal-scroll space-y-2.5 pr-1">
                {topPlayers.map((player, idx) => (
                  <Link
                    key={player.id}
                    to={`/players/${player.username}`}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                      idx === 0
                        ? 'bg-amber-950/20 border-amber-800/80 hover:border-amber-500'
                        : idx === 1
                        ? 'bg-surface-300 border-border hover:border-gray-400'
                        : idx === 2
                        ? 'bg-surface-300 border-border hover:border-amber-700'
                        : 'bg-surface-300 border-border hover:border-brand-dark'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate pr-2">
                      <div className="w-8 h-8 rounded-xl bg-surface-200 border border-border flex items-center justify-center font-mono font-bold text-xs text-brand-orange">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white group-hover:text-brand-orange transition-colors truncate">
                          {player.display_name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">@{player.username}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono flex items-center space-x-4 flex-shrink-0">
                      <div>
                        <div className="text-xs font-bold text-brand-orange">
                          {formatMAD(player.total_prize_money || 0)}
                        </div>
                        <div className="text-[10px] text-gray-400">{player.points || 0} PTS</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-brand-orange transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Bottom Nav Hint */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-gray-400 font-mono">
                <button onClick={() => goToStage(2)} className="hover:text-white flex items-center space-x-1">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Stage 03</span>
                </button>
                <span>Stage 04 of 04</span>
                <button onClick={() => goToStage(0)} className="hover:text-white flex items-center space-x-1">
                  <span>Stage 01</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
