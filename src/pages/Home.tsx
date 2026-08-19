import React, { useState, useRef } from 'react';
import { useRealtimeStore } from '../hooks/useRealtimeStore';
import { AppleNavbar } from '../components/AppleNavbar';
import { RegistrationModal } from '../components/RegistrationModal';
import { TournamentBracket } from '../components/TournamentBracket';
import { formatMAD, formatDate, getStatusBadge } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import {
  Trophy,
  Calendar,
  MapPin,
  Sparkles,
  Layers,
  Award,
  Radio,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  Users,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { tournaments, matches, rounds, profiles } = useRealtimeStore();
  const { t, isRTL } = useLanguage();

  const [activeSection, setActiveSection] = useState<'tournaments' | 'brackets' | 'leaderboard'>('tournaments');
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('ALL');
  const [activeBracketTrnId, setActiveBracketTrnId] = useState<string>('');

  // Modal State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [targetTournamentId, setTargetTournamentId] = useState<string | undefined>(undefined);

  // Section Refs for smooth scrolling
  const tournamentsRef = useRef<HTMLDivElement | null>(null);
  const bracketsRef = useRef<HTMLDivElement | null>(null);
  const leaderboardRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (sectionId === 'tournaments' && tournamentsRef.current) {
      tournamentsRef.current.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('tournaments');
    } else if (sectionId === 'brackets' && bracketsRef.current) {
      bracketsRef.current.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('brackets');
    } else if (sectionId === 'leaderboard' && leaderboardRef.current) {
      leaderboardRef.current.scrollIntoView({ behavior: 'smooth' });
      setActiveSection('leaderboard');
    }
  };

  // Open Registration Modal
  const handleOpenRegister = (trnId?: string) => {
    setTargetTournamentId(trnId || tournaments[0]?.id);
    setIsRegisterOpen(true);
  };

  // View Bracket for a tournament
  const handleViewBracket = (trnId: string) => {
    setActiveBracketTrnId(trnId);
    scrollToSection('brackets');
  };

  // Set default bracket tournament
  const currentBracketTrnId = activeBracketTrnId || tournaments.find((t) => t.status === 'LIVE')?.id || tournaments[0]?.id || '';
  const currentBracketTournament = tournaments.find((t) => t.id === currentBracketTrnId) || tournaments[0];
  const currentMatches = matches.filter((m) => m.tournament_id === currentBracketTournament?.id);
  const currentRounds = rounds.filter((r) => r.tournament_id === currentBracketTournament?.id);

  // Game filters
  const gameFilters = ['ALL', ...Array.from(new Set(tournaments.map((t) => t.game?.name).filter(Boolean)))];

  const filteredTournaments = selectedGameFilter === 'ALL'
    ? tournaments
    : tournaments.filter((t) => t.game?.name === selectedGameFilter);

  // Stats calculation
  const totalPrizePool = tournaments.reduce((acc, curr) => acc + (curr.prize_pool_mad || 0), 0);
  const liveCount = tournaments.filter((t) => t.status === 'LIVE').length;

  // Sorted Players for Leaderboard
  const sortedPlayers = [...profiles].sort((a, b) => (b.wins || 0) - (a.wins || 0));

  return (
    <div className={`min-h-screen bg-black text-gray-200 selection:bg-brand-dark selection:text-white ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      
      {/* Apple-style Frosted Navbar */}
      <AppleNavbar onScrollToSection={scrollToSection} activeSection={activeSection} />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Warm Dark Orange Glow in Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-dark/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-1.5 rounded-full bg-surface-200/80 border border-brand-gold/25 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-xs font-medium text-gray-300">
              {t('heroTagline')}
            </span>
          </div>

          {/* Apple-grade Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            <span className="block">{t('heroTitle')}</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('heroDesc')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => handleOpenRegister()}
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-brand-deep via-brand-dark to-brand-orange hover:opacity-95 text-white font-medium text-sm transition-all shadow-gold-glow flex items-center space-x-2 rtl:space-x-reverse cursor-pointer"
            >
              <span>{t('btnRegisterHero')}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              onClick={() => scrollToSection('brackets')}
              className="px-7 py-3.5 rounded-full bg-surface-200/80 hover:bg-surface-100 border border-white/10 text-gray-200 hover:text-white font-medium text-sm transition-all flex items-center space-x-2 rtl:space-x-reverse"
            >
              <span>{t('btnViewLiveBrackets')}</span>
            </button>
          </div>

          {/* Telemetry Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-8 max-w-3xl mx-auto border-t border-white/[0.08]">
            <div className="p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-white font-mono">{formatMAD(totalPrizePool)}</div>
              <div className="text-xs text-gray-400 mt-0.5">{t('statPrizes')}</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-white font-mono">{tournaments.length}</div>
              <div className="text-xs text-gray-400 mt-0.5">{t('statTournaments')}</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-brand-orange font-mono">{liveCount} LIVE</div>
              <div className="text-xs text-gray-400 mt-0.5">{t('liveBadge')}</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-lg sm:text-2xl font-bold text-white font-mono">100% Direct</div>
              <div className="text-xs text-gray-400 mt-0.5">No Account Needed</div>
            </div>
          </div>

        </div>
      </section>

      {/* Tournaments Section */}
      <section ref={tournamentsRef} id="tournaments" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-semibold text-brand-orange uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>{t('navTournaments')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
              {t('tournamentsHeading')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-1">
              {t('tournamentsSubheading')}
            </p>
          </div>

          {/* Game Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-surface-200/80 border border-white/10">
            {gameFilters.map((g) => (
              <button
                key={g as string}
                onClick={() => setSelectedGameFilter(g as string)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedGameFilter === g
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {g === 'ALL' ? t('filterAll') : g}
              </button>
            ))}
          </div>
        </div>

        {/* Tournaments Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTournaments.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500 text-sm">
              No tournaments available under this filter.
            </div>
          ) : (
            filteredTournaments.map((tournament) => {
              const badge = getStatusBadge(tournament.status);
              const isLive = tournament.status === 'LIVE';
              const isOpen = tournament.status === 'REGISTRATION_OPEN';

              return (
                <div
                  key={tournament.id}
                  className="apple-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between"
                >
                  {/* Top Bar */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-300 border border-white/10 text-xs font-medium text-brand-orange">
                        {tournament.game?.name || 'Esports'}
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium flex items-center space-x-1.5 rtl:space-x-reverse ${
                        isLive ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-white/5 text-gray-300 border border-white/10'
                      }`}>
                        {isLive && <Radio className="w-2.5 h-2.5 text-rose-400 animate-pulse" />}
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {tournament.name}
                    </h3>
                    
                    <div className="flex items-center space-x-3 rtl:space-x-reverse text-xs text-gray-400 mt-1.5 font-sans">
                      <span className="flex items-center space-x-1 rtl:space-x-reverse">
                        <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                        <span>{formatDate(tournament.start_at)}</span>
                      </span>
                      <span className="flex items-center space-x-1 rtl:space-x-reverse">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate max-w-[120px]">{tournament.location || 'Main Arena'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Spec Row */}
                  <div className="my-5 py-3 border-y border-white/[0.07] grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block">{t('prizePool')}</span>
                      <span className="font-bold text-emerald-400 font-mono mt-0.5 block">{formatMAD(tournament.prize_pool_mad)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">{t('entryFee')}</span>
                      <span className="font-bold text-white font-mono mt-0.5 block">{formatMAD(tournament.entry_fee_mad)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">{t('format')}</span>
                      <span className="font-medium text-gray-300 truncate mt-0.5 block">
                        {tournament.format?.replace('_', ' ') || 'Single Elim'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons based on status */}
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {isOpen ? (
                      <button
                        onClick={() => handleOpenRegister(tournament.id)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-brand-deep via-brand-dark to-brand-orange hover:opacity-90 text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
                      >
                        {t('btnRegisterCard')}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleViewBracket(tournament.id)}
                        className="flex-1 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-100 border border-white/10 text-white font-medium text-xs sm:text-sm transition-all"
                      >
                        {t('btnViewBracketCard')}
                      </button>
                    )}

                    {isOpen && (
                      <button
                        onClick={() => handleViewBracket(tournament.id)}
                        className="px-3.5 py-2.5 rounded-xl bg-surface-200 hover:bg-surface-100 border border-white/10 text-gray-300 hover:text-white font-medium text-xs transition-colors"
                      >
                        {t('btnViewBracketCard')}
                      </button>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </section>

      {/* Live Bracket Arena Section */}
      <section ref={bracketsRef} id="brackets" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-semibold text-brand-gold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>{t('navLiveBrackets')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
              {t('bracketHeading')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-1">
              {t('bracketSubheading')}
            </p>
          </div>

          {/* Tournament Dropdown Selector */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <select
              value={currentBracketTrnId}
              onChange={(e) => setActiveBracketTrnId(e.target.value)}
              className="bg-surface-200 border border-white/10 text-white text-xs sm:text-sm font-medium rounded-full px-4 py-2 focus:outline-none focus:border-brand-orange"
            >
              {tournaments.map((trn) => (
                <option key={trn.id} value={trn.id}>
                  {trn.name} ({trn.game?.name || 'Esports'})
                </option>
              ))}
            </select>

            {currentBracketTournament && currentBracketTournament.status === 'REGISTRATION_OPEN' && (
              <button
                onClick={() => handleOpenRegister(currentBracketTournament.id)}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-brand-deep via-brand-dark to-brand-orange text-white font-medium text-xs"
              >
                {t('btnRegisterCard')}
              </button>
            )}
          </div>
        </div>

        {/* Embedded Interactive Bracket Component */}
        <div className="apple-glass rounded-3xl p-4 sm:p-6 overflow-hidden min-h-[450px]">
          {currentBracketTournament ? (
            <TournamentBracket
              rounds={currentRounds}
              matches={currentMatches}
              players={profiles}
              format={currentBracketTournament.format as any}
            />
          ) : (
            <div className="py-20 text-center text-gray-500 text-sm">
              No tournament selected.
            </div>
          )}
        </div>

      </section>

      {/* Leaderboard Section */}
      <section ref={leaderboardRef} id="leaderboard" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] mb-12">
        
        <div className="mb-6">
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-semibold text-amber-500 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>{t('navLeaderboard')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            {t('leaderboardHeading')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-1">
            {t('leaderboardSubheading')}
          </p>
        </div>

        {/* Standings Table */}
        <div className="apple-card rounded-2xl p-4 sm:p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-gray-400 text-xs">
                  <th className="pb-3 font-medium">#</th>
                  <th className="pb-3 font-medium">Competitor</th>
                  <th className="pb-3 font-medium text-center">{t('winRate')}</th>
                  <th className="pb-3 font-medium text-right rtl:text-left">{t('wins')} / {t('losses')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {sortedPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No competitor records yet.
                    </td>
                  </tr>
                ) : (
                  sortedPlayers.slice(0, 15).map((player, idx) => {
                    const total = (player.wins || 0) + (player.losses || 0);
                    const winRate = total === 0 ? '100%' : `${Math.round(((player.wins || 0) / total) * 100)}%`;

                    return (
                      <tr key={player.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 font-mono text-gray-500 font-medium">
                          {String(idx + 1).padStart(2, '0')}
                        </td>
                        <td className="py-3.5">
                          <div className="font-semibold text-white">@{player.username}</div>
                          <div className="text-xs text-gray-400">{player.display_name}</div>
                        </td>
                        <td className="py-3.5 text-center font-mono font-semibold text-emerald-400">
                          {winRate}
                        </td>
                        <td className="py-3.5 text-right rtl:text-left font-mono">
                          <span className="text-brand-orange font-medium">{player.wins || 0}W</span>{' '}
                          <span className="text-gray-500">/ {player.losses || 0}L</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </section>

      {/* Direct Registration Modal */}
      <RegistrationModal
        tournaments={tournaments}
        initialTournamentId={targetTournamentId}
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

    </div>
  );
};
