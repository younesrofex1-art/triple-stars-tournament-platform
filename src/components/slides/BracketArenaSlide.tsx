import React, { useState } from 'react';
import { TournamentBracket } from '../TournamentBracket';
import { Tournament, TournamentMatch, TournamentRound, Profile } from '../../types';
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
    <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative overflow-hidden select-none">
      <div className="max-w-6xl w-full mx-auto space-y-4 relative z-10 flex flex-col justify-center h-full max-h-[88vh]">
        
        {/* Header & Tournament Selector */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest block">
              {t('navScene3')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white uppercase tracking-tight mt-1">
              {t('bracketTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
              {t('bracketDesc')}
            </p>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <select
              value={activeTrnId}
              onChange={(e) => {
                soundManager.playClick();
                setActiveTrnId(e.target.value);
                onSelectTournament?.(e.target.value);
              }}
              className="bg-surface-200 border border-white/10 text-white font-mono text-xs sm:text-sm font-medium rounded-full px-4 py-2 focus:outline-none focus:border-white/30 backdrop-blur-xl"
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
                className="px-4 py-2 rounded-full bg-white hover:bg-gray-100 text-black font-mono font-semibold text-xs transition-all"
              >
                {t('btnRegisterNow')}
              </button>
            )}
          </div>
        </div>

        {/* Bracket Container */}
        <div className="flex-1 tesla-panel rounded-2xl p-4 sm:p-6 overflow-hidden flex flex-col min-h-[420px] max-h-[64vh]">
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
              No tournament selected.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
