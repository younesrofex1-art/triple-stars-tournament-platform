import React, { useState } from 'react';
import { TournamentMatch, TournamentRound } from '../types';
import { formatDate } from '../utils/formatters';
import { Trophy, ZoomIn, ZoomOut, RotateCcw, Radio, CheckCircle2 } from 'lucide-react';

interface BracketProps {
  rounds: TournamentRound[];
  matches: TournamentMatch[];
  onSelectMatch?: (match: TournamentMatch) => void;
}

export const TournamentBracket: React.FC<BracketProps> = ({
  rounds,
  matches,
  onSelectMatch,
}) => {
  const [zoom, setZoom] = useState<number>(1);

  if (!rounds || rounds.length === 0 || !matches || matches.length === 0) {
    return (
      <div className="p-12 text-center bg-surface-200 border border-border rounded-2xl space-y-2">
        <Trophy className="w-10 h-10 text-gray-500 mx-auto" />
        <h3 className="text-base font-bold text-white">Bracket Not Generated Yet</h3>
        <p className="text-xs text-gray-400">
          The tournament administrator will generate and seed the interactive bracket once check-in concludes.
        </p>
      </div>
    );
  }

  const sortedRounds = [...rounds].sort((a, b) => a.round_number - b.round_number);

  return (
    <div className="bg-surface-200 border border-border rounded-2xl p-6 space-y-6">
      {/* Zoom and Controls Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Single Elimination Bracket
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-100 text-gray-400 border border-border">
            Realtime Synced
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.7))}
            className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-border text-gray-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-gray-400 px-1">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((prev) => Math.min(prev + 0.1, 1.4))}
            className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-border text-gray-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-border text-gray-300 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bracket Tree Container */}
      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div
          className="flex space-x-8 min-w-max transition-transform origin-top-left duration-150"
          style={{ transform: `scale(${zoom})` }}
        >
          {sortedRounds.map((round) => {
            const roundMatches = matches
              .filter((m) => m.round_number === round.round_number)
              .sort((a, b) => a.match_number - b.match_number);

            return (
              <div key={round.id} className="flex flex-col w-72">
                {/* Round Header */}
                <div className="mb-4 text-center py-2 px-3 rounded-xl bg-surface-300 border border-border">
                  <span className="font-display text-base font-bold tracking-wide text-brand-orange uppercase">
                    {round.name}
                  </span>
                  <div className="text-[10px] text-gray-400 font-mono">
                    {roundMatches.length} {roundMatches.length === 1 ? 'Match' : 'Matches'}
                  </div>
                </div>

                {/* Match Cards List */}
                <div className="flex flex-col justify-around flex-grow space-y-6">
                  {roundMatches.map((match) => {
                    const isLive = match.status === 'live';
                    const isFinished = match.status === 'finished';

                    const p1IsWinner = isFinished && match.winner_id === match.player1_id && match.player1_id;
                    const p2IsWinner = isFinished && match.winner_id === match.player2_id && match.player2_id;

                    return (
                      <div
                        key={match.id}
                        onClick={() => onSelectMatch?.(match)}
                        className={`rounded-xl p-3 border transition-colors ${
                          isLive
                            ? 'bg-rose-950/30 border-rose-700'
                            : isFinished
                            ? 'bg-surface-300 border-border'
                            : 'bg-surface-300/80 border-border/80'
                        }`}
                      >
                        {/* Live Indicator */}
                        {isLive && (
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-[10px] font-bold text-rose-400 font-mono">
                              <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
                              <span>LIVE NOW</span>
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              Match #{match.match_number}
                            </span>
                          </div>
                        )}

                        {/* Player 1 Slot */}
                        <div
                          className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                            p1IsWinner
                              ? 'bg-emerald-950/50 border border-emerald-800 text-white font-bold'
                              : 'bg-surface-200 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate pr-2">
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold font-mono ${
                                p1IsWinner
                                  ? 'bg-emerald-500 text-black'
                                  : 'bg-surface-100 text-gray-400'
                              }`}
                            >
                              {match.player1 ? match.player1.username[0].toUpperCase() : '?'}
                            </div>
                            <span className="text-xs truncate">
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
                        <div className="my-1 text-center text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                          VS
                        </div>

                        {/* Player 2 Slot */}
                        <div
                          className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                            p2IsWinner
                              ? 'bg-emerald-950/50 border border-emerald-800 text-white font-bold'
                              : match.is_bye
                              ? 'bg-surface-100 text-gray-400 italic'
                              : 'bg-surface-200 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate pr-2">
                            <div
                              className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold font-mono ${
                                p2IsWinner
                                  ? 'bg-emerald-500 text-black'
                                  : match.is_bye
                                  ? 'bg-surface-100 text-gray-500'
                                  : 'bg-surface-100 text-gray-400'
                              }`}
                            >
                              {match.is_bye
                                ? '—'
                                : match.player2
                                ? match.player2.username[0].toUpperCase()
                                : '?'}
                            </div>
                            <span className="text-xs truncate">
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

                        {/* Footer details */}
                        <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                          <span>R{match.round_number} • M{match.match_number}</span>
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
    </div>
  );
};
