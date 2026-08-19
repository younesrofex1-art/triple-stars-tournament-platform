import React, { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TournamentMatch, TournamentRound, Profile } from '../types';
import { formatDate } from '../utils/formatters';
import { calculateSwissStandings } from '../services/bracketEngine';
import {
  Trophy,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Radio,
  CheckCircle2,
  X,
  Calendar,
  ChevronRight,
  Sparkles,
  Layers,
  Table,
  Swords,
  Flame,
  ShieldAlert,
  ArrowDownRight,
  TrendingUp,
} from 'lucide-react';

interface BracketProps {
  rounds: TournamentRound[];
  matches: TournamentMatch[];
  players?: Profile[];
  format?: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  onSelectMatch?: (match: TournamentMatch) => void;
}

export const TournamentBracket: React.FC<BracketProps> = ({
  rounds,
  matches,
  players = [],
  format: propFormat,
  onSelectMatch,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [selectedModalMatch, setSelectedModalMatch] = useState<TournamentMatch | null>(null);
  const [activeRoundNumber, setActiveRoundNumber] = useState<number>(1);
  const [showSwipeHint, setShowSwipeHint] = useState<boolean>(true);
  const [stageFilter, setStageFilter] = useState<'all' | 'winners' | 'losers' | 'grand_finals'>('all');
  const [swissView, setSwissView] = useState<'standings' | 'matches'>('standings');
  const [selectedSwissRound, setSelectedSwissRound] = useState<number>(1);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-detect format if not explicitly passed
  const detectedFormat = useMemo(() => {
    if (propFormat) return propFormat;
    const hasLosers = matches.some((m) => m.stage === 'losers');
    const hasSwiss = matches.some((m) => m.stage === 'swiss');
    const hasGroup = matches.some((m) => m.stage === 'group');
    if (hasLosers) return 'double_elimination';
    if (hasSwiss) return 'swiss';
    if (hasGroup) return 'round_robin';
    return 'single_elimination';
  }, [propFormat, matches]);

  // Extract all unique player profiles from matches if players prop is empty
  const allTournamentPlayers = useMemo(() => {
    if (players.length > 0) return players;
    const pMap = new Map<string, Profile>();
    matches.forEach((m) => {
      if (m.player1?.id) pMap.set(m.player1.id, m.player1);
      if (m.player2?.id) pMap.set(m.player2.id, m.player2);
    });
    return Array.from(pMap.values());
  }, [players, matches]);

  // Compute Swiss / Group standings
  const swissStandings = useMemo(() => {
    if (detectedFormat === 'swiss' || detectedFormat === 'round_robin') {
      return calculateSwissStandings(allTournamentPlayers, matches);
    }
    return [];
  }, [detectedFormat, allTournamentPlayers, matches]);

  if (!rounds || rounds.length === 0 || !matches || matches.length === 0) {
    return (
      <div className="p-12 text-center bg-surface-200 border border-border rounded-2xl space-y-2">
        <Trophy className="w-10 h-10 text-gray-500 mx-auto" />
        <h3 className="text-base font-bold text-white uppercase font-display">Bracket Not Generated Yet</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          The tournament administrator will seed and generate the live bracket once player check-in concludes.
        </p>
      </div>
    );
  }

  // Filter rounds & matches according to stage filter (for Double Elimination)
  const filteredRounds = rounds
    .filter((r) => {
      if (detectedFormat !== 'double_elimination' || stageFilter === 'all') return true;
      if (stageFilter === 'winners') return r.stage === 'winners';
      if (stageFilter === 'losers') return r.stage === 'losers';
      if (stageFilter === 'grand_finals') return r.stage === 'grand_finals' || r.stage === 'reset';
      return true;
    })
    .sort((a, b) => a.round_number - b.round_number);

  const scrollToRound = (roundNum: number) => {
    setActiveRoundNumber(roundNum);
    setShowSwipeHint(false);
    const roundElement = document.getElementById(`bracket-round-${roundNum}`);
    if (roundElement && scrollContainerRef.current) {
      roundElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  const handleMatchCardClick = (match: TournamentMatch) => {
    if (onSelectMatch) {
      onSelectMatch(match);
    } else {
      setSelectedModalMatch(match);
    }
  };

  // Unique swiss rounds
  const swissRoundNumbers = Array.from(new Set(matches.map((m) => m.round_number))).sort((a, b) => a - b);

  return (
    <div className="bg-surface-200 border border-border rounded-2xl p-4 sm:p-6 space-y-5 shadow-card relative">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {detectedFormat === 'double_elimination' && 'Double Elimination Bracket'}
            {detectedFormat === 'swiss' && 'Swiss Tournament System'}
            {detectedFormat === 'round_robin' && 'Round Robin League'}
            {detectedFormat === 'single_elimination' && 'Single Elimination Bracket'}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-100 text-brand-orange border border-border">
            {detectedFormat === 'double_elimination' ? 'Winners & Losers' : 'Realtime Synced'}
          </span>
        </div>

        {/* View Switchers / Zoom Controls */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {detectedFormat === 'swiss' && (
            <div className="flex items-center bg-surface-300 rounded-lg p-0.5 border border-border mr-2">
              <button
                onClick={() => setSwissView('standings')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center space-x-1 transition-colors ${
                  swissView === 'standings'
                    ? 'bg-brand-dark text-white shadow-orange-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Standings</span>
              </button>
              <button
                onClick={() => setSwissView('matches')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center space-x-1 transition-colors ${
                  swissView === 'matches'
                    ? 'bg-brand-dark text-white shadow-orange-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Pairings</span>
              </button>
            </div>
          )}

          {/* Zoom controls for bracket tree formats */}
          {(detectedFormat === 'single_elimination' || detectedFormat === 'double_elimination') && (
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setZoom((prev) => Math.max(Number((prev - 0.1).toFixed(1)), 0.7))}
                className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-border text-gray-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono text-gray-300 px-1 font-semibold">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((prev) => Math.min(Number((prev + 0.1).toFixed(1)), 1.4))}
                className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-border text-gray-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-border text-gray-300 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Double Elimination Stage Filter Tabs */}
      {detectedFormat === 'double_elimination' && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-gray-400 flex-shrink-0 tracking-wider">
            Bracket Stage:
          </span>
          <button
            onClick={() => setStageFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              stageFilter === 'all'
                ? 'bg-brand-dark text-white border border-brand-orange/60 shadow-orange-sm'
                : 'bg-surface-300 text-gray-400 hover:text-white border border-border'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full Arena View</span>
          </button>
          <button
            onClick={() => setStageFilter('winners')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              stageFilter === 'winners'
                ? 'bg-brand-dark text-white border border-brand-orange/60 shadow-orange-sm'
                : 'bg-surface-300 text-gray-400 hover:text-white border border-border'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-brand-orange" />
            <span>Winners Bracket</span>
          </button>
          <button
            onClick={() => setStageFilter('losers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              stageFilter === 'losers'
                ? 'bg-brand-dark text-white border border-brand-orange/60 shadow-orange-sm'
                : 'bg-surface-300 text-gray-400 hover:text-white border border-border'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Losers Bracket</span>
          </button>
          <button
            onClick={() => setStageFilter('grand_finals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${
              stageFilter === 'grand_finals'
                ? 'bg-brand-dark text-white border border-brand-orange/60 shadow-orange-sm'
                : 'bg-surface-300 text-gray-400 hover:text-white border border-border'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>Grand Finals</span>
          </button>
        </div>
      )}

      {/* --- SWISS STANDINGS VIEW --- */}
      {detectedFormat === 'swiss' && swissView === 'standings' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold uppercase text-white tracking-wider flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-brand-orange" />
                <span>Live Swiss Leaderboard & Buchholz Strength</span>
              </h4>
              <p className="text-[11px] text-gray-400">
                Ranked by Match Points (3 pts / win), Buchholz Opponent Strength, and Game Score Differential.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-300 text-gray-400 font-mono uppercase text-[10px] border-b border-border">
                <tr>
                  <th className="p-3 text-center w-12">Rank</th>
                  <th className="p-3">Competitor</th>
                  <th className="p-3 text-center">Played</th>
                  <th className="p-3 text-center">Record (W-D-L)</th>
                  <th className="p-3 text-center">Score Diff</th>
                  <th className="p-3 text-center">Buchholz</th>
                  <th className="p-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface-200">
                {swissStandings.map((st, idx) => {
                  const isTop3 = idx < 3;
                  const isTop8 = idx < 8;

                  return (
                    <tr
                      key={st.player_id}
                      className={`hover:bg-surface-100 transition-colors ${
                        isTop3 ? 'bg-brand-dark/10' : ''
                      }`}
                    >
                      <td className="p-3 text-center font-mono font-bold">
                        {idx === 0 && <span className="text-amber-400">🥇 #1</span>}
                        {idx === 1 && <span className="text-gray-300">🥈 #2</span>}
                        {idx === 2 && <span className="text-amber-600">🥉 #3</span>}
                        {idx > 2 && <span className="text-gray-400">#{idx + 1}</span>}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-surface-300 border border-border flex items-center justify-center font-bold text-[11px] text-brand-orange font-mono">
                            {st.player.username ? st.player.username[0].toUpperCase() : 'P'}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center space-x-1.5">
                              <span>{st.player.display_name}</span>
                              {isTop8 && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-mono">
                                  Top Cut
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono">
                              @{st.player.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-center font-mono text-gray-300">
                        {st.matches_played}
                      </td>

                      <td className="p-3 text-center font-mono font-semibold">
                        <span className="text-emerald-400">{st.wins}W</span> -{' '}
                        <span className="text-gray-400">{st.draws}D</span> -{' '}
                        <span className="text-rose-400">{st.losses}L</span>
                      </td>

                      <td className="p-3 text-center font-mono">
                        <span
                          className={
                            st.game_differential > 0
                              ? 'text-emerald-400 font-bold'
                              : st.game_differential < 0
                              ? 'text-rose-400'
                              : 'text-gray-400'
                          }
                        >
                          {st.game_differential > 0 ? `+${st.game_differential}` : st.game_differential}
                        </span>
                      </td>

                      <td className="p-3 text-center font-mono text-gray-300 font-bold">
                        {st.buchholz}
                      </td>

                      <td className="p-3 text-right font-mono font-black text-sm text-brand-orange">
                        {st.match_points} PTS
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SWISS ROUND-BY-ROUND PAIRINGS VIEW --- */}
      {detectedFormat === 'swiss' && swissView === 'matches' && (
        <div className="space-y-4 animate-fade-in">
          {/* Swiss Round Selector */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 flex-shrink-0">
              Select Round:
            </span>
            {swissRoundNumbers.map((rNum) => (
              <button
                key={rNum}
                onClick={() => setSelectedSwissRound(rNum)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase font-mono transition-colors ${
                  selectedSwissRound === rNum
                    ? 'bg-brand-dark text-white border border-brand-orange shadow-orange-sm'
                    : 'bg-surface-300 text-gray-400 hover:text-white border border-border'
                }`}
              >
                Round {rNum}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches
              .filter((m) => m.round_number === selectedSwissRound)
              .map((match) => (
                <div
                  key={match.id}
                  onClick={() => handleMatchCardClick(match)}
                  className="p-4 rounded-xl bg-surface-300 border border-border hover:border-brand-dark transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-mono font-semibold">
                      Match #{match.match_number} {match.is_bye ? '• BYE' : ''}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        match.status === 'live'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : match.status === 'finished'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                          : 'bg-surface-100 text-gray-400 border border-border'
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {/* Player 1 */}
                    <div
                      className={`flex items-center justify-between p-2.5 rounded-lg ${
                        match.status === 'finished' && match.winner_id === match.player1_id
                          ? 'bg-emerald-950/40 border border-emerald-800 text-white font-bold'
                          : 'bg-surface-200 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <div className="w-5 h-5 rounded bg-surface-100 flex items-center justify-center text-[10px] font-mono font-bold text-brand-orange">
                          {match.player1?.username ? match.player1.username[0].toUpperCase() : 'P'}
                        </div>
                        <span className="truncate">{match.player1?.display_name || 'TBD'}</span>
                      </div>
                      <span className="font-mono font-bold text-sm">{match.player1_score}</span>
                    </div>

                    {/* Player 2 */}
                    <div
                      className={`flex items-center justify-between p-2.5 rounded-lg ${
                        match.status === 'finished' && match.winner_id === match.player2_id
                          ? 'bg-emerald-950/40 border border-emerald-800 text-white font-bold'
                          : match.is_bye
                          ? 'bg-surface-100/50 text-gray-500 italic'
                          : 'bg-surface-200 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <div className="w-5 h-5 rounded bg-surface-100 flex items-center justify-center text-[10px] font-mono font-bold text-brand-orange">
                          {match.is_bye ? '—' : match.player2?.username ? match.player2.username[0].toUpperCase() : 'P'}
                        </div>
                        <span className="truncate">
                          {match.is_bye ? 'BYE (Automatic Win)' : match.player2?.display_name || 'TBD'}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-sm">
                        {match.is_bye ? '0' : match.player2_score}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* --- BRACKET TREE VIEW (Single & Double Elimination) --- */}
      {detectedFormat !== 'swiss' && (
        <>
          {/* Round Quick Selector Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-gray-400 flex-shrink-0 tracking-wider">
              Jump to:
            </span>
            {filteredRounds.map((round) => {
              const roundMatches = matches.filter((m) => m.round_number === round.round_number);
              const isSelected = activeRoundNumber === round.round_number;
              const isLosers = round.stage === 'losers';
              const isGF = round.stage === 'grand_finals';

              return (
                <button
                  key={round.id}
                  onClick={() => scrollToRound(round.round_number)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-brand-dark text-white border border-brand-orange/60 shadow-orange-sm'
                      : isLosers
                      ? 'bg-surface-300 text-rose-300/80 hover:text-white border border-rose-950/60'
                      : isGF
                      ? 'bg-surface-300 text-yellow-300/90 hover:text-white border border-yellow-950/60'
                      : 'bg-surface-300 text-gray-300 hover:text-white border border-border'
                  }`}
                >
                  <span>{round.name}</span>
                  <span className="text-[10px] font-mono opacity-80">({roundMatches.length})</span>
                </button>
              );
            })}
          </div>

          {/* Touch Swipe Helper Notification on mobile */}
          {showSwipeHint && (
            <div className="sm:hidden p-2 rounded-xl bg-surface-300/80 border border-border/80 text-[11px] text-gray-400 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Swipe horizontally or tap rounds above to navigate</span>
              </span>
              <button
                onClick={() => setShowSwipeHint(false)}
                className="text-gray-500 hover:text-gray-300 p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Bracket Tree Container */}
          <div
            ref={scrollContainerRef}
            onScroll={() => setShowSwipeHint(false)}
            className="overflow-x-auto pb-6 scrollbar-thin rounded-xl"
          >
            <div
              className="flex space-x-8 sm:space-x-10 min-w-max transition-transform origin-top-left duration-150 py-2 px-1"
              style={{ transform: `scale(${zoom})` }}
            >
              {filteredRounds.map((round) => {
                const roundMatches = matches
                  .filter((m) => m.round_number === round.round_number)
                  .sort((a, b) => a.match_number - b.match_number);

                const isLosers = round.stage === 'losers';
                const isGF = round.stage === 'grand_finals';

                return (
                  <div
                    id={`bracket-round-${round.round_number}`}
                    key={round.id}
                    className="flex flex-col w-72 sm:w-80 flex-shrink-0"
                  >
                    {/* Round Header */}
                    <div
                      className={`mb-4 text-center py-2.5 px-3 rounded-xl border ${
                        isGF
                          ? 'bg-yellow-950/30 border-yellow-800 text-yellow-400'
                          : isLosers
                          ? 'bg-rose-950/20 border-rose-900/60 text-rose-300'
                          : 'bg-surface-300 border-border text-brand-orange'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-1.5">
                        {isGF && <Trophy className="w-4 h-4 text-yellow-400" />}
                        {isLosers && <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                        <span className="font-display text-base font-bold tracking-wide uppercase">
                          {round.name}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {roundMatches.length} {roundMatches.length === 1 ? 'Match' : 'Matches'}
                      </div>
                    </div>

                    {/* Match Cards List */}
                    <div className="flex flex-col justify-around flex-grow space-y-6 sm:space-y-8">
                      {roundMatches.map((match) => {
                        const isLive = match.status === 'live';
                        const isFinished = match.status === 'finished';
                        const isReset = match.stage === 'reset';

                        const p1IsWinner =
                          isFinished && match.winner_id === match.player1_id && match.player1_id;
                        const p2IsWinner =
                          isFinished && match.winner_id === match.player2_id && match.player2_id;

                        return (
                          <div
                            key={match.id}
                            onClick={() => handleMatchCardClick(match)}
                            className={`rounded-2xl p-3.5 border transition-all duration-200 cursor-pointer group active:scale-[0.99] ${
                              isLive
                                ? 'bg-rose-950/30 border-rose-600 shadow-lg shadow-rose-950/40'
                                : isReset
                                ? 'bg-yellow-950/20 border-yellow-800/80 hover:border-yellow-600'
                                : isLosers
                                ? 'bg-surface-300 border-border hover:border-rose-900/80'
                                : isFinished
                                ? 'bg-surface-300 border-border hover:border-brand-dark/70'
                                : 'bg-surface-300/90 border-border/80 hover:border-border-active'
                            }`}
                          >
                            {/* Live / Match Number Indicator */}
                            <div className="flex items-center justify-between mb-2.5">
                              {isLive ? (
                                <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-[10px] font-bold text-rose-400 font-mono">
                                  <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
                                  <span>LIVE ARENA</span>
                                </span>
                              ) : isReset ? (
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-yellow-950/70 border border-yellow-800 text-[10px] font-bold text-yellow-400 font-mono">
                                  <RotateCcw className="w-3 h-3" />
                                  <span>RESET MATCH</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-gray-400 font-mono font-medium">
                                  Match #{match.match_number}
                                </span>
                              )}

                              <span className="text-[10px] text-gray-400 group-hover:text-brand-orange transition-colors flex items-center space-x-0.5">
                                <span>Details</span>
                                <ChevronRight className="w-3 h-3" />
                              </span>
                            </div>

                            {/* Player 1 Slot */}
                            <div
                              className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                                p1IsWinner
                                  ? 'bg-emerald-950/50 border border-emerald-800 text-white font-bold'
                                  : 'bg-surface-200 text-gray-300 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5 truncate pr-2">
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono ${
                                    p1IsWinner
                                      ? 'bg-emerald-500 text-black'
                                      : 'bg-surface-100 text-gray-300'
                                  }`}
                                >
                                  {match.player1 ? match.player1.username[0].toUpperCase() : '?'}
                                </div>
                                <span className="text-xs truncate font-medium">
                                  {match.player1 ? match.player1.display_name : 'TBD'}
                                </span>
                              </div>
                              <span
                                className={`font-mono text-sm px-2 py-0.5 rounded font-bold ${
                                  p1IsWinner ? 'text-emerald-400 font-black' : 'text-gray-400'
                                }`}
                              >
                                {match.player1_score}
                              </span>
                            </div>

                            {/* VS Separator */}
                            <div className="my-1.5 text-center text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                              VS
                            </div>

                            {/* Player 2 Slot */}
                            <div
                              className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                                p2IsWinner
                                  ? 'bg-emerald-950/50 border border-emerald-800 text-white font-bold'
                                  : match.is_bye
                                  ? 'bg-surface-100/60 text-gray-400 italic border border-transparent'
                                  : 'bg-surface-200 text-gray-300 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5 truncate pr-2">
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono ${
                                    p2IsWinner
                                      ? 'bg-emerald-500 text-black'
                                      : match.is_bye
                                      ? 'bg-surface-100 text-gray-500'
                                      : 'bg-surface-100 text-gray-300'
                                  }`}
                                >
                                  {match.is_bye
                                    ? '—'
                                    : match.player2
                                    ? match.player2.username[0].toUpperCase()
                                    : '?'}
                                </div>
                                <span className="text-xs truncate font-medium">
                                  {match.is_bye
                                    ? 'BYE (Advances)'
                                    : match.player2
                                    ? match.player2.display_name
                                    : 'TBD'}
                                </span>
                              </div>
                              <span
                                className={`font-mono text-sm px-2 py-0.5 rounded font-bold ${
                                  p2IsWinner ? 'text-emerald-400 font-black' : 'text-gray-400'
                                }`}
                              >
                                {match.player2_score}
                              </span>
                            </div>

                            {/* Drop to Losers hint on Double Elimination WB matches */}
                            {match.stage === 'winners' && match.loser_match_id && (
                              <div className="mt-2 text-[10px] text-rose-400/80 font-mono flex items-center space-x-1">
                                <ArrowDownRight className="w-3 h-3 text-rose-400" />
                                <span>Loser drops to Losers Bracket</span>
                              </div>
                            )}

                            {/* Footer details */}
                            <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                              <span>
                                R{match.round_number} • M{match.match_number}
                              </span>
                              {isFinished ? (
                                <span className="text-emerald-400 flex items-center space-x-1 font-semibold">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Finished</span>
                                </span>
                              ) : (
                                <span>{formatDate(match.scheduled_at)}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Match Details Modal */}
      {selectedModalMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-surface-200 border border-border rounded-2xl p-6 shadow-elevated space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] font-mono text-brand-orange uppercase font-bold">
                  {selectedModalMatch.stage ? `${selectedModalMatch.stage.toUpperCase()} • ` : ''}
                  Round {selectedModalMatch.round_number} • Match #{selectedModalMatch.match_number}
                </span>
                <h3 className="font-display text-lg font-bold text-white uppercase">Match Details</h3>
              </div>
              <button
                onClick={() => setSelectedModalMatch(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedModalMatch.status === 'live' && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                <span className="font-semibold">This match is currently LIVE on the arena floor.</span>
              </div>
            )}

            {/* Head to Head Card */}
            <div className="p-4 rounded-xl bg-surface-300 border border-border space-y-4">
              {/* Player 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 truncate pr-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-100 border border-border text-brand-orange font-bold text-xs flex items-center justify-center font-mono">
                    {selectedModalMatch.player1 ? selectedModalMatch.player1.username[0].toUpperCase() : '?'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {selectedModalMatch.player1 ? selectedModalMatch.player1.display_name : 'TBD'}
                    </div>
                    {selectedModalMatch.player1 && (
                      <Link
                        to={`/players/${selectedModalMatch.player1.username}`}
                        onClick={() => setSelectedModalMatch(null)}
                        className="text-[10px] text-brand-orange hover:underline font-mono"
                      >
                        @{selectedModalMatch.player1.username}
                      </Link>
                    )}
                  </div>
                </div>
                <span className="text-xl font-mono font-bold text-white">
                  {selectedModalMatch.player1_score}
                </span>
              </div>

              <div className="border-t border-border/80 flex items-center justify-center py-1">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                  VERSUS
                </span>
              </div>

              {/* Player 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 truncate pr-2">
                  <div className="w-8 h-8 rounded-lg bg-surface-100 border border-border text-brand-orange font-bold text-xs flex items-center justify-center font-mono">
                    {selectedModalMatch.is_bye
                      ? '—'
                      : selectedModalMatch.player2
                      ? selectedModalMatch.player2.username[0].toUpperCase()
                      : '?'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {selectedModalMatch.is_bye
                        ? 'BYE (Automatic Advance)'
                        : selectedModalMatch.player2
                        ? selectedModalMatch.player2.display_name
                        : 'TBD'}
                    </div>
                    {selectedModalMatch.player2 && (
                      <Link
                        to={`/players/${selectedModalMatch.player2.username}`}
                        onClick={() => setSelectedModalMatch(null)}
                        className="text-[10px] text-brand-orange hover:underline font-mono"
                      >
                        @{selectedModalMatch.player2.username}
                      </Link>
                    )}
                  </div>
                </div>
                <span className="text-xl font-mono font-bold text-white">
                  {selectedModalMatch.player2_score}
                </span>
              </div>
            </div>

            {/* Winner Banner if Finished */}
            {selectedModalMatch.status === 'finished' && selectedModalMatch.winner && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>
                  Winner: <strong className="text-white">{selectedModalMatch.winner.display_name}</strong> (@{selectedModalMatch.winner.username})
                </span>
              </div>
            )}

            {/* Loser drop explanation */}
            {selectedModalMatch.loser_match_id && (
              <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/50 text-[11px] text-rose-300 flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Double Elimination: Loser drops into Losers Bracket to continue competing.</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-border">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                <span>{formatDate(selectedModalMatch.scheduled_at)}</span>
              </span>
              <button
                onClick={() => setSelectedModalMatch(null)}
                className="px-4 py-2 rounded-xl bg-surface-100 hover:bg-surface-50 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
