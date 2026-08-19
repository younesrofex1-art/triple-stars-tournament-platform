import React, { useState } from 'react';
import { TournamentBracket } from '../TournamentBracket';
import { Tournament, TournamentMatch, TournamentRound, Profile } from '../../types';
import { Layers } from 'lucide-react';
import { soundManager } from '../../utils/sound';
import { useLanguage } from '../../context/LanguageContext';

interface BracketArenaSlideProps {
  tournaments: Tournament[];
  selectedTournamentId?: string;
  onSelectTournament?: (id: string) => void;
  matches: TournamentMatch[];
  rounds: TournamentRound[];
  profiles: Profile[];
  onOpenRegister: (tournamentId: string) => void;
}

export const BracketArenaSlide: React.FC<BracketArenaSlideProps> = ({
  tournaments,
  selectedTournamentId,
  onSelectTournament,
  matches,
  rounds,
  profiles,
  onOpenRegister,
}) => {
  const { t } = useLanguage();

  const [activeTrnId, setActiveTrnId] = useState<string>(
    selectedTournamentId || tournaments[0]?.id || ''
  );

  React.useEffect(() => {
    if (selectedTournamentId) {
      setActiveTrnId(selectedTournamentId);
    } else if (tournaments.length > 0 && !activeTrnId) {
      setActiveTrnId(tournaments[0].id);
    }
  }, [selectedTournamentId, tournaments]);

  const currentTournament = tournaments.find((t) => t.id === activeTrnId) || tournaments[0];

  const currentMatches = matches.filter((m) => m.tournament_id === currentTournament?.id);
  const currentRounds = rounds.filter((r) => r.tournament_id === currentTournament?.id);

  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-4 sm:p-8 lg:p-14 relative overflow-hidden select-none">
      
      {/* Background Cyan Flare */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto space-y-4 relative z-10 flex flex-col justify-center h-full max-h-[92vh]">
        
        {/* Header & Tournament Selector Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Layers className="w-4 h-4 text-brand-orange" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-orange">
                {t('navScene3')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white uppercase tracking-tight mt-0.5">
              {t('bracketHeading')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              {t('bracketSubtitle')}
            </p>
          </div>

          {/* Tournament Dropdown Selector & Quick Info */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <select
              value={activeTrnId}
              onChange={(e) => {
                soundManager.playClick();
                setActiveTrnId(e.target.value);
                onSelectTournament?.(e.target.value);
              }}
              className="bg-surface-200/90 border border-border/80 text-white font-mono text-xs sm:text-sm font-bold rounded-2xl px-3.5 py-2 focus:outline-none focus:border-brand-orange backdrop-blur-xl"
            >
              {tournaments.map((trn) => (
                <option key={trn.id} value={trn.id}>
                  {trn.name} ({trn.game?.name || 'Esports'})
                </option>
              ))}
            </select>

            {currentTournament && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenRegister(currentTournament.id);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-brand-dark to-brand-orange hover:from-brand-orange hover:to-amber-500 text-white font-mono font-bold text-xs uppercase shadow-orange-sm transition-all"
              >
                {t('btnDirectRegister')}
              </button>
            )}
          </div>
        </div>

        {/* Embedded Interactive Bracket Component Container */}
        <div className="flex-1 bg-surface-200/80 border border-border/80 rounded-3xl p-3 sm:p-5 backdrop-blur-xl shadow-elevated overflow-hidden flex flex-col min-h-[420px] max-h-[64vh]">
          {currentTournament ? (
            <div className="w-full h-full overflow-auto scrollbar-none">
              <TournamentBracket
                rounds={currentRounds}
                matches={currentMatches}
                players={profiles}
                format={currentTournament.format as any}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 font-mono text-xs">
              No active tournament loaded.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
