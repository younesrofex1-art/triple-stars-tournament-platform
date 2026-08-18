import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRealtimeStore } from '../../hooks/useRealtimeStore';
import { store } from '../../services/store';
import { formatMAD, formatDate, getStatusBadge } from '../../utils/formatters';
import { Tournament, TournamentMatch } from '../../types';
import {
  LayoutDashboard,
  Trophy,
  Users,
  Radio,
  Plus,
  Edit,
  DollarSign,
  UserCheck,
  LogOut,
  ArrowLeft,
  Tv,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isStaff, logout } = useAuth();
  const { tournaments, profiles, finance, auditLogs, matches, registrations } = useRealtimeStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'tournaments' | 'matches' | 'registrations' | 'stream' | 'finances' | 'audit'
  >('overview');

  // Selected tournament for match scoring and bracket control
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(
    tournaments[0]?.id || ''
  );

  // Tournament Create/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Partial<Tournament>>({
    name: '',
    game_id: store.getGames()[0]?.id || '',
    entry_fee_mad: 50,
    prize_pool_mad: 2000,
    max_players: 16,
    format: 'single_elimination',
    status: 'REGISTRATION_OPEN',
    location: 'Triple Stars Main Stage',
    rules: 'Best of 3 matches. Tactical defending mandatory.',
    stream_url: '',
    stream_embed_url: '',
    stream_title: '',
  });

  // Stream Manager inputs
  const [streamEmbedInput, setStreamEmbedInput] = useState('');
  const [streamTitleInput, setStreamTitleInput] = useState('');
  const [streamSaveStatus, setStreamSaveStatus] = useState(false);

  // Registrations search filter
  const [regSearch, setRegSearch] = useState('');

  // Protect admin route
  useEffect(() => {
    if (!isStaff) {
      navigate('/admin/login');
    }
  }, [isStaff, navigate]);

  const activeTournamentId = selectedTournamentId || tournaments[0]?.id || '';
  const currentTournament = tournaments.find((t) => t.id === activeTournamentId);
  const currentTournamentMatches = matches.filter((m) => m.tournament_id === activeTournamentId);
  const currentTournamentRegs = registrations.filter((r) => r.tournament_id === activeTournamentId);

  // Sync stream director inputs when active tournament changes
  useEffect(() => {
    if (currentTournament) {
      setStreamEmbedInput(currentTournament.stream_embed_url || '');
      setStreamTitleInput(currentTournament.stream_title || currentTournament.name || '');
    }
  }, [activeTournamentId, currentTournament]);

  const handleSaveTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTournament.id) {
      store.updateTournament(editingTournament.id, editingTournament);
    } else {
      store.createTournament(editingTournament);
    }
    setIsModalOpen(false);
  };

  const handleUpdateStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTournamentId) return;
    store.updateTournament(activeTournamentId, {
      stream_embed_url: streamEmbedInput,
      stream_title: streamTitleInput,
    });
    setStreamSaveStatus(true);
    setTimeout(() => setStreamSaveStatus(false), 2000);
  };

  const filteredRegistrations = currentTournamentRegs.filter(
    (r) =>
      r.player?.username.toLowerCase().includes(regSearch.toLowerCase()) ||
      r.player?.display_name.toLowerCase().includes(regSearch.toLowerCase())
  );

  const revenueChartData = tournaments.map((t) => ({
    name: t.name.length > 14 ? t.name.slice(0, 14) + '...' : t.name,
    PrizePool: t.prize_pool_mad,
    EntryFee: t.entry_fee_mad,
  }));

  return (
    <div className="min-h-screen bg-background text-gray-200 flex flex-col font-sans selection:bg-brand-dark selection:text-white">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-surface-300 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Admin Console Badge */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded bg-surface-200 border border-brand-dark/40 flex items-center justify-center font-display font-bold text-brand-orange text-sm">
                  ★3
                </div>
                <span className="font-display text-lg font-bold tracking-tight text-white">
                  TRIPLE STARS
                </span>
              </Link>
              <div className="h-4 w-[1px] bg-border" />
              <span className="px-2 py-0.5 rounded bg-brand-subtle text-brand-orange border border-brand-dark/40 font-mono text-[10px] font-bold">
                ADMIN CONTROL
              </span>
            </div>

            {/* Right: Supabase Sync Status, Public Site link & Logout */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-surface-200 border border-border text-[11px] font-mono text-emerald-400">
                <Activity className="w-3 h-3 animate-pulse" />
                <span>Supabase Live</span>
              </div>

              <Link
                to="/"
                className="hidden sm:flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>View Public Site</span>
              </Link>

              <div className="flex items-center space-x-2 pl-2 border-l border-border">
                <span className="text-xs font-semibold text-white font-mono hidden md:block">
                  @{user?.username}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/admin/login');
                  }}
                  title="Sign Out of Admin"
                  className="p-2 rounded-lg bg-surface-200 hover:bg-rose-950/40 text-gray-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                activeTab === 'overview'
                  ? 'bg-surface-100 text-brand-orange border border-border'
                  : 'text-gray-400 hover:text-white hover:bg-surface-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('tournaments')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                activeTab === 'tournaments'
                  ? 'bg-surface-100 text-brand-orange border border-border'
                  : 'text-gray-400 hover:text-white hover:bg-surface-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Tournaments ({tournaments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                activeTab === 'matches'
                  ? 'bg-surface-100 text-brand-orange border border-border'
                  : 'text-gray-400 hover:text-white hover:bg-surface-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Match Scoring</span>
            </button>

            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                activeTab === 'registrations'
                  ? 'bg-surface-100 text-brand-orange border border-border'
                  : 'text-gray-400 hover:text-white hover:bg-surface-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Cash & Check-In</span>
            </button>

            <button
              onClick={() => setActiveTab('stream')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                activeTab === 'stream'
                  ? 'bg-surface-100 text-brand-orange border border-border'
                  : 'text-gray-400 hover:text-white hover:bg-surface-200'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Live Stream Director</span>
            </button>

            <button
              onClick={() => setActiveTab('finances')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                activeTab === 'finances'
                  ? 'bg-surface-100 text-brand-orange border border-border'
                  : 'text-gray-400 hover:text-white hover:bg-surface-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Finances (DH)</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                activeTab === 'audit'
                  ? 'bg-surface-100 text-brand-orange border border-border'
                  : 'text-gray-400 hover:text-white hover:bg-surface-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Audit Trail</span>
            </button>
          </div>

          {/* Quick Create Action */}
          <button
            onClick={() => {
              setEditingTournament({
                name: '',
                game_id: store.getGames()[0]?.id || '',
                entry_fee_mad: 50,
                prize_pool_mad: 2000,
                max_players: 16,
                format: 'single_elimination',
                status: 'REGISTRATION_OPEN',
                location: 'Triple Stars Main Stage',
                rules: 'Best of 3 matches.',
              });
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-lg bg-brand-dark hover:bg-brand-orange text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-orange-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tournament</span>
          </button>
        </div>

        {/* --- TAB 1: OVERVIEW & ANALYTICS --- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-surface-200 border border-border space-y-1">
                <div className="text-[11px] font-semibold uppercase text-gray-400">Total Tournaments</div>
                <div className="text-2xl font-bold font-mono text-white">{tournaments.length}</div>
              </div>

              <div className="p-5 rounded-xl bg-surface-200 border border-border space-y-1">
                <div className="text-[11px] font-semibold uppercase text-gray-400">Registered Players</div>
                <div className="text-2xl font-bold font-mono text-brand-orange">{profiles.length}</div>
              </div>

              <div className="p-5 rounded-xl bg-surface-200 border border-border space-y-1">
                <div className="text-[11px] font-semibold uppercase text-gray-400">Total Cash Collected</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {formatMAD(finance.total_revenue_mad)}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-surface-200 border border-border space-y-1">
                <div className="text-[11px] font-semibold uppercase text-gray-400">Total Prize Pool (DH)</div>
                <div className="text-2xl font-bold font-mono text-amber-400">
                  {formatMAD(finance.total_prize_pool_mad)}
                </div>
              </div>
            </div>

            {/* Financial Performance Chart */}
            <div className="p-6 rounded-2xl bg-surface-200 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-white uppercase">
                  Tournament Prizes & Entry Fees (MAD / DH)
                </h3>
                <span className="text-xs font-mono text-gray-400">Moroccan Dirham</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueChartData}>
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                    <YAxis stroke="#6B7280" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#12151B', borderColor: '#262B35', color: '#fff', borderRadius: '8px' }}
                      formatter={(val: any) => [`${val} DH`, '']}
                    />
                    <Bar dataKey="PrizePool" fill="#EA580C" radius={[4, 4, 0, 0]} name="Prize Pool (DH)" />
                    <Bar dataKey="EntryFee" fill="#71717A" radius={[4, 4, 0, 0]} name="Entry Fee (DH)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: TOURNAMENTS MANAGER --- */}
        {activeTab === 'tournaments' && (
          <div className="bg-surface-200 border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white uppercase">Tournament Directory</h3>
              <span className="text-xs text-gray-400 font-mono">{tournaments.length} Configured</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-surface-300 text-gray-400 uppercase font-bold text-[10px] border-b border-border">
                  <tr>
                    <th className="p-3.5">Tournament</th>
                    <th className="p-3.5">Game</th>
                    <th className="p-3.5">Entry Fee</th>
                    <th className="p-3.5">Prize Pool</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tournaments.map((t) => {
                    const badge = getStatusBadge(t.status);
                    return (
                      <tr key={t.id} className="hover:bg-surface-100/50 transition-colors">
                        <td className="p-3.5 font-bold text-white">{t.name}</td>
                        <td className="p-3.5">{t.game?.name}</td>
                        <td className="p-3.5 font-mono font-semibold">{formatMAD(t.entry_fee_mad)}</td>
                        <td className="p-3.5 font-mono font-bold text-brand-orange">{formatMAD(t.prize_pool_mad)}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${badge.class}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingTournament(t);
                              setIsModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-surface-100 hover:bg-surface-50 border border-border text-gray-300 text-xs font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTournamentId(t.id);
                              setActiveTab('matches');
                            }}
                            className="px-2.5 py-1 rounded bg-brand-subtle hover:bg-brand-dark/30 border border-brand-dark/50 text-brand-orange text-xs font-bold"
                          >
                            Control
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB 3: MATCH SCORE CONTROLLER --- */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            {/* Tournament Selector & Actions */}
            <div className="p-4 rounded-xl bg-surface-200 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">Active Tournament:</span>
                <select
                  value={activeTournamentId}
                  onChange={(e) => setSelectedTournamentId(e.target.value)}
                  className="bg-surface-300 border border-border rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-brand-dark w-full sm:w-80"
                >
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => store.generateBracketForTournament(activeTournamentId, true)}
                  className="px-3.5 py-2 rounded-lg bg-surface-100 hover:bg-surface-50 border border-border text-gray-200 text-xs font-bold flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Regenerate Bracket</span>
                </button>
              </div>
            </div>

            {/* Match Score Cards */}
            {currentTournamentMatches.length === 0 ? (
              <div className="p-12 text-center bg-surface-200 border border-border rounded-xl space-y-3">
                <Trophy className="w-10 h-10 text-gray-500 mx-auto" />
                <h4 className="text-base font-bold text-white">No Bracket Matches Generated Yet</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Click "Regenerate Bracket" above to create the single elimination bracket matches for this tournament.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTournamentMatches.map((match) => {
                  const isFinished = match.status === 'finished';
                  const isLive = match.status === 'live';

                  return (
                    <div
                      key={match.id}
                      className={`p-4 rounded-xl bg-surface-200 border space-y-3 ${
                        isLive
                          ? 'border-rose-700 bg-rose-950/20'
                          : isFinished
                          ? 'border-border opacity-90'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="font-mono font-semibold">
                          Round {match.round_number} • Match #{match.match_number}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isLive
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : isFinished
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                              : 'bg-surface-100 text-gray-400 border border-border'
                          }`}
                        >
                          {match.status}
                        </span>
                      </div>

                      {/* Score Manipulation Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Player 1 Slot */}
                        <div className="p-3 rounded-lg bg-surface-300 border border-border space-y-2">
                          <div className="text-xs font-bold text-white truncate">
                            {match.player1 ? `@${match.player1.username}` : 'TBD'}
                          </div>
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() =>
                                store.updateMatchScore(
                                  match.id,
                                  Math.max(match.player1_score - 1, 0),
                                  match.player2_score,
                                  match.status
                                )
                              }
                              className="w-7 h-7 rounded bg-surface-200 border border-border hover:border-brand-dark text-white font-bold"
                            >
                              -
                            </button>
                            <span className="font-mono text-xl font-bold text-brand-orange">
                              {match.player1_score}
                            </span>
                            <button
                              onClick={() =>
                                store.updateMatchScore(
                                  match.id,
                                  match.player1_score + 1,
                                  match.player2_score,
                                  match.status
                                )
                              }
                              className="w-7 h-7 rounded bg-surface-200 border border-border hover:border-brand-dark text-white font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Player 2 Slot */}
                        <div className="p-3 rounded-lg bg-surface-300 border border-border space-y-2">
                          <div className="text-xs font-bold text-white truncate">
                            {match.is_bye
                              ? 'BYE'
                              : match.player2
                              ? `@${match.player2.username}`
                              : 'TBD'}
                          </div>
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() =>
                                store.updateMatchScore(
                                  match.id,
                                  match.player1_score,
                                  Math.max(match.player2_score - 1, 0),
                                  match.status
                                )
                              }
                              className="w-7 h-7 rounded bg-surface-200 border border-border hover:border-brand-dark text-white font-bold"
                            >
                              -
                            </button>
                            <span className="font-mono text-xl font-bold text-brand-orange">
                              {match.player2_score}
                            </span>
                            <button
                              onClick={() =>
                                store.updateMatchScore(
                                  match.id,
                                  match.player1_score,
                                  match.player2_score + 1,
                                  match.status
                                )
                              }
                              className="w-7 h-7 rounded bg-surface-200 border border-border hover:border-brand-dark text-white font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Action Triggers */}
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          onClick={() =>
                            store.updateMatchScore(
                              match.id,
                              match.player1_score,
                              match.player2_score,
                              'live'
                            )
                          }
                          className="flex-1 py-2 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-bold uppercase transition-colors"
                        >
                          Mark Live
                        </button>
                        <button
                          onClick={() =>
                            store.finishMatch(
                              match.id,
                              match.player1_score,
                              match.player2_score
                            )
                          }
                          className="flex-1 py-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold uppercase transition-colors"
                        >
                          Finish & Advance
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- TAB 4: CASH DESK & CHECK-IN --- */}
        {activeTab === 'registrations' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-200 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <span className="text-xs font-semibold text-gray-400">Tournament:</span>
                <select
                  value={activeTournamentId}
                  onChange={(e) => setSelectedTournamentId(e.target.value)}
                  className="bg-surface-300 border border-border rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-brand-dark"
                >
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by handle..."
                  value={regSearch}
                  onChange={(e) => setRegSearch(e.target.value)}
                  className="w-full bg-surface-300 border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
                />
              </div>
            </div>

            <div className="bg-surface-200 border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-surface-300 text-gray-400 uppercase font-bold text-[10px] border-b border-border">
                    <tr>
                      <th className="p-3.5">Seed</th>
                      <th className="p-3.5">Competitor</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Check-In Status</th>
                      <th className="p-3.5 text-right">Desk Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredRegistrations.map((reg, idx) => (
                      <tr key={reg.id} className="hover:bg-surface-100/50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-brand-orange">#{reg.seed || idx + 1}</td>
                        <td className="p-3.5 font-bold text-white">@{reg.player?.username}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              reg.payment_status === 'paid'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {reg.payment_status} ({formatMAD(reg.amount_paid_mad)})
                          </span>
                        </td>
                        <td className="p-3.5 capitalize">{reg.check_in_status}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() =>
                              store.updateRegistrationStatus(reg.id, 'paid', 'checked_in')
                            }
                            className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold"
                          >
                            Mark Cash Paid & Check-In
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 5: LIVE STREAM DIRECTOR --- */}
        {activeTab === 'stream' && (
          <div className="max-w-2xl bg-surface-200 border border-border rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="font-display text-xl font-bold text-white uppercase">Main Stage Live Stream Director</h3>
              <p className="text-xs text-gray-400 mt-1">
                Configure the active YouTube or Twitch livestream embed for stage broadcast in the Live Arena.
              </p>
            </div>

            <form onSubmit={handleUpdateStream} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-gray-300 font-semibold">Select Target Tournament</label>
                <select
                  value={activeTournamentId}
                  onChange={(e) => setSelectedTournamentId(e.target.value)}
                  className="w-full bg-surface-300 border border-border rounded-xl px-3 py-2.5 text-white font-bold"
                >
                  {tournaments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-gray-300 font-semibold">Broadcast Title</label>
                <input
                  type="text"
                  placeholder="e.g. EA FC 25 Semi Finals Live from Main Stage"
                  value={streamTitleInput}
                  onChange={(e) => setStreamTitleInput(e.target.value)}
                  className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-dark"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-300 font-semibold">Stream Embed URL (YouTube/Twitch)</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/jfKfPfyJRdk"
                  value={streamEmbedInput}
                  onChange={(e) => setStreamEmbedInput(e.target.value)}
                  className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-dark font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                {streamSaveStatus ? (
                  <span className="text-xs text-emerald-400 flex items-center space-x-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Livestream feed updated live!</span>
                  </span>
                ) : (
                  <span />
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-dark hover:bg-brand-orange text-white font-bold uppercase tracking-wider text-xs shadow-orange-sm"
                >
                  Publish Stream Live
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- TAB 6: FINANCES (DH) --- */}
        {activeTab === 'finances' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-xl bg-surface-200 border border-border">
                <div className="text-xs text-gray-400 uppercase font-semibold">Total Entry Cash (MAD)</div>
                <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">
                  {formatMAD(finance.total_revenue_mad)}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-surface-200 border border-border">
                <div className="text-xs text-gray-400 uppercase font-semibold">Total Prize Payouts (MAD)</div>
                <div className="text-3xl font-bold font-mono text-amber-400 mt-1">
                  {formatMAD(finance.total_prize_pool_mad)}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-surface-200 border border-border">
                <div className="text-xs text-gray-400 uppercase font-semibold">Net Income Margin (MAD)</div>
                <div className="text-3xl font-bold font-mono text-brand-orange mt-1">
                  {formatMAD(finance.net_revenue_mad)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 7: AUDIT LOG --- */}
        {activeTab === 'audit' && (
          <div className="bg-surface-200 border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-white uppercase">System Audit Log</h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-surface-300 border border-border flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-brand-orange">{log.action}</span>
                    <span className="text-gray-400 ml-2">[{log.entity_type}]</span>
                    {log.details && (
                      <span className="text-gray-500 ml-2 font-mono">{JSON.stringify(log.details)}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500">{formatDate(log.created_at)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT TOURNAMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-surface-200 border border-border rounded-2xl p-6 space-y-4 shadow-elevated">
            <h3 className="font-display text-xl font-bold text-white uppercase">
              {editingTournament.id ? 'Edit Tournament' : 'Create New Tournament'}
            </h3>

            <form onSubmit={handleSaveTournament} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-gray-300 font-semibold">Tournament Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EA FC 25 Weekly Masters"
                  value={editingTournament.name || ''}
                  onChange={(e) => setEditingTournament({ ...editingTournament, name: e.target.value })}
                  className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-dark"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-gray-300 font-semibold">Entry Fee (MAD / DH)</label>
                  <input
                    type="number"
                    required
                    value={editingTournament.entry_fee_mad || 0}
                    onChange={(e) =>
                      setEditingTournament({
                        ...editingTournament,
                        entry_fee_mad: Number(e.target.value),
                      })
                    }
                    className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-300 font-semibold">Prize Pool (MAD / DH)</label>
                  <input
                    type="number"
                    required
                    value={editingTournament.prize_pool_mad || 0}
                    onChange={(e) =>
                      setEditingTournament({
                        ...editingTournament,
                        prize_pool_mad: Number(e.target.value),
                      })
                    }
                    className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-gray-300 font-semibold">Max Players</label>
                  <select
                    value={editingTournament.max_players || 16}
                    onChange={(e) =>
                      setEditingTournament({
                        ...editingTournament,
                        max_players: Number(e.target.value),
                      })
                    }
                    className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2 text-white"
                  >
                    <option value={4}>4 Players</option>
                    <option value={8}>8 Players</option>
                    <option value={16}>16 Players</option>
                    <option value={32}>32 Players</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-300 font-semibold">Status</label>
                  <select
                    value={editingTournament.status || 'REGISTRATION_OPEN'}
                    onChange={(e) =>
                      setEditingTournament({
                        ...editingTournament,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2 text-white"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="REGISTRATION_OPEN">Registration Open</option>
                    <option value="CHECK_IN">Check-In Open</option>
                    <option value="LIVE">Live Now</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-surface-100 text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-brand-dark hover:bg-brand-orange text-white font-bold uppercase tracking-wider shadow-orange-sm"
                >
                  Save Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
