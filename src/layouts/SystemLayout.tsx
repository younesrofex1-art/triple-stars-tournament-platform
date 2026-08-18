import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRealtimeStore } from '../hooks/useRealtimeStore';
import { store } from '../services/store';
import {
  Trophy,
  Radio,
  Users,
  LayoutDashboard,
  Sparkles,
  Search,
  LogOut,
  Clock,
  Activity,
  Shield,
  Monitor,
  Terminal,
  ChevronRight,
  Wallet,
} from 'lucide-react';

interface SystemLayoutProps {
  children: React.ReactNode;
}

export const SystemLayout: React.FC<SystemLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isStaff } = useAuth();
  const { tournaments, profiles } = useRealtimeStore();

  const [time, setTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    tournaments: any[];
    players: any[];
  }>({ tournaments: [], players: [] });

  // Digital clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults({ tournaments: [], players: [] });
      return;
    }
    const query = q.toLowerCase();
    const ts = store.getTournaments().filter((t) => t.name.toLowerCase().includes(query));
    const ps = store.getProfiles().filter(
      (p) => p.username.toLowerCase().includes(query) || p.display_name.toLowerCase().includes(query)
    );
    setSearchResults({ tournaments: ts, players: ps });
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const liveCount = tournaments.filter((t) => t.status === 'LIVE').length;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-gray-100 flex flex-col font-sans selection:bg-brand-cyan selection:text-black">
      {/* FIXED TOP SYSTEM HEADER BAR */}
      <header className="h-16 bg-surface-300 border-b border-white/10 px-6 flex items-center justify-between flex-shrink-0 z-50">
        {/* Left Brand & System Status */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-cyan via-blue-600 to-purple-600 p-[2px] shadow-glow-cyan">
              <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-cyan animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display text-xl font-black tracking-wider text-white">
                  TRIPLE STARS OS
                </span>
                <span className="px-1.5 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 text-[9px] font-extrabold font-mono">
                  v2.4 LIVE
                </span>
              </div>
              <span className="text-[10px] text-gray-400 tracking-widest uppercase block font-semibold">
                Gaming Hall System Console
              </span>
            </div>
          </Link>

          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

          {/* Arena Station Badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-lg bg-surface-200 border border-white/10 text-xs">
            <Monitor className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="text-gray-400 text-[11px]">Station:</span>
            <span className="font-bold text-white text-[11px] font-mono">MAIN ARENA #01</span>
          </div>
        </div>

        {/* Center Live Ticker & Search */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tournaments, players..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              className="w-64 bg-surface-200 border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-cyan focus:w-80 transition-all"
            />

            {/* Dropdown search */}
            {isSearchOpen && (searchResults.tournaments.length > 0 || searchResults.players.length > 0) && (
              <div
                className="absolute left-0 mt-2 w-80 bg-surface-200 border border-white/15 rounded-xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto"
                onMouseLeave={() => setIsSearchOpen(false)}
              >
                {searchResults.tournaments.map((t) => (
                  <Link
                    key={t.id}
                    to={`/tournaments/${t.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5"
                  >
                    <span className="text-xs font-semibold text-white truncate">{t.name}</span>
                    <span className="text-[10px] text-brand-gold font-bold">{t.prize_pool_mad} DH</span>
                  </Link>
                ))}
                {searchResults.players.map((p) => (
                  <Link
                    key={p.id}
                    to={`/players/${p.username}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5"
                  >
                    <span className="text-xs text-gray-200">@{p.username}</span>
                    <span className="text-[10px] text-gray-400">{p.wins} Wins</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center space-x-4">
          {/* Currency Pill */}
          <div className="px-3 py-1 rounded-lg bg-surface-200 border border-brand-gold/40 text-brand-gold font-mono font-bold text-xs flex items-center space-x-1">
            <Wallet className="w-3.5 h-3.5" />
            <span>MAD / DH</span>
          </div>

          {/* System Clock */}
          <div className="px-3 py-1 rounded-lg bg-surface-200 border border-white/10 text-xs font-mono font-bold text-gray-200 flex items-center space-x-1.5 hidden sm:flex">
            <Clock className="w-3.5 h-3.5 text-brand-cyan" />
            <span>{time}</span>
          </div>

          {/* User Profile / Admin Quick Switch */}
          {user ? (
            <div className="flex items-center space-x-2">
              <Link
                to={`/players/${user.username}`}
                className="flex items-center space-x-2 p-1 pr-3 rounded-xl bg-surface-200 border border-white/10 hover:border-brand-cyan/40 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-cyan text-black font-bold text-xs flex items-center justify-center">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="text-xs font-bold text-white hidden sm:block">@{user.username}</span>
              </Link>
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-lg bg-surface-200 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => store.getProfiles()[0] && navigate(`/players/khalid_fc`)}
              className="px-4 py-1.5 rounded-xl bg-brand-cyan text-black font-extrabold text-xs uppercase"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* MAIN SHELL WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* FIXED LEFT COMMAND NAVIGATION SIDEBAR */}
        <aside className="w-64 bg-surface-300 border-r border-white/10 flex flex-col justify-between p-4 flex-shrink-0 overflow-y-auto">
          {/* Main Navigation Group */}
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                Command Navigation
              </div>

              <Link
                to="/"
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  isActive('/') && location.pathname === '/'
                    ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 shadow-glow-cyan'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Terminal className="w-4 h-4" />
                  <span>Dashboard Hub</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </Link>

              <Link
                to="/tournaments"
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  isActive('/tournaments')
                    ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 shadow-glow-cyan'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Trophy className="w-4 h-4" />
                  <span>Tournaments & Brackets</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-surface-100 text-[10px] text-gray-400 font-mono">
                  {tournaments.length}
                </span>
              </Link>

              <Link
                to="/live"
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between relative ${
                  isActive('/live')
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-glow-red'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>Live Arena & Streams</span>
                </div>
                {liveCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white font-black text-[9px] animate-pulse">
                    {liveCount} LIVE
                  </span>
                )}
              </Link>

              <Link
                to="/leaderboard"
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  isActive('/leaderboard')
                    ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/40 shadow-glow-gold'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-brand-gold" />
                  <span>Hall Leaderboard</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </Link>

              <Link
                to="/players/khalid_fc"
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  isActive('/players')
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Player Directory</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </Link>
            </div>

            {/* Admin Management Section */}
            {isStaff && (
              <div className="pt-4 border-t border-white/10 space-y-1">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-purple-400">
                  Hall Management
                </div>

                <Link
                  to="/admin"
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    isActive('/admin')
                      ? 'bg-purple-600 text-white shadow-glow-cyan'
                      : 'text-purple-300 hover:bg-purple-500/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin Control Center</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </Link>
              </div>
            )}
          </div>

          {/* Bottom System Monitor Box */}
          <div className="p-3 rounded-xl bg-surface-200 border border-white/10 space-y-2 mt-6">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-gray-400">
              <span>System Monitor</span>
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Supabase Realtime</span>
                <span className="text-emerald-400 font-mono font-bold">ONLINE (2ms)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Desk Cashier</span>
                <span className="text-emerald-400 font-mono font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Currency</span>
                <span className="text-brand-gold font-mono font-bold">MAD / DH</span>
              </div>
            </div>
          </div>
        </aside>

        {/* STAGE VIEWPORT CONTAINER (Internal scrolling pane) */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-brand-cyan/20">
          {children}
        </main>
      </div>
    </div>
  );
};
