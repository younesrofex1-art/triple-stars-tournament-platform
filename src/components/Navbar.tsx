import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Radio, Users, Search, LogOut, X, Shield, Swords } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRealtimeStore } from '../hooks/useRealtimeStore';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isStaff } = useAuth();
  const { tournaments, profiles } = useRealtimeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const liveTournamentsCount = tournaments.filter((t) => t.status === 'LIVE').length;

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setIsSearchOpen(q.trim().length > 0);
  };

  const filteredTournaments = tournaments.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPlayers = profiles.filter(
    (p) =>
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-300/95 backdrop-blur-md border-b border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Pro Esports Logo */}
          <Logo size="md" />

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1.5">
            <Link
              to="/tournaments"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                isActive('/tournaments')
                  ? 'bg-surface-100 text-brand-orange border border-border shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-surface-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-brand-orange" />
              <span>Tournaments</span>
            </Link>

            <Link
              to="/live"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                isActive('/live')
                  ? 'bg-surface-100 text-rose-400 border border-border shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-surface-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-rose-500" />
              <span>Live Arena</span>
              {liveTournamentsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[9px] font-black animate-pulse">
                  {liveTournamentsCount}
                </span>
              )}
            </Link>

            <Link
              to="/leaderboard"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                isActive('/leaderboard')
                  ? 'bg-surface-100 text-brand-orange border border-border shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-surface-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-brand-orange" />
              <span>Leaderboard</span>
            </Link>
          </nav>

          {/* Right Utilities (Search & Admin Controls) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="sm:hidden p-2 rounded-xl bg-surface-200 border border-border text-gray-400 hover:text-white transition-colors"
              aria-label="Open Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Desktop Autocomplete Search Bar */}
            <div className="relative hidden sm:block">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tournaments & players..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) setIsSearchOpen(true);
                  }}
                  className="bg-surface-200 border border-border rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark w-48 lg:w-64 transition-all focus:w-64 lg:focus:w-72"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-200 border border-border rounded-2xl p-3 shadow-elevated z-50 space-y-3">
                  {/* Tournaments Match */}
                  {filteredTournaments.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400 px-2 font-mono">
                        Tournaments ({filteredTournaments.length})
                      </span>
                      <div className="max-h-36 overflow-y-auto space-y-1">
                        {filteredTournaments.slice(0, 4).map((t) => (
                          <Link
                            key={t.id}
                            to={`/tournaments/${t.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="block p-2 rounded-xl hover:bg-surface-100 transition-colors"
                          >
                            <div className="text-xs font-bold text-white truncate">{t.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono">
                              {t.game?.name} • {t.format.replace('_', ' ')}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Players Match */}
                  {filteredPlayers.length > 0 && (
                    <div className="space-y-1 border-t border-border pt-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400 px-2 font-mono">
                        Competitors ({filteredPlayers.length})
                      </span>
                      <div className="max-h-36 overflow-y-auto space-y-1">
                        {filteredPlayers.slice(0, 4).map((p) => (
                          <Link
                            key={p.id}
                            to={`/players/${p.username}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center space-x-2 p-2 rounded-xl hover:bg-surface-100 transition-colors"
                          >
                            <div className="w-6 h-6 rounded-lg bg-surface-300 border border-border flex items-center justify-center font-bold text-[10px] text-brand-orange font-mono">
                              {p.username[0]?.toUpperCase()}
                            </div>
                            <div className="truncate">
                              <div className="text-xs font-bold text-white truncate">{p.display_name}</div>
                              <div className="text-[10px] text-gray-400 font-mono">@{p.username}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredTournaments.length === 0 && filteredPlayers.length === 0 && (
                    <div className="p-4 text-center text-xs text-gray-400">
                      No matching tournaments or players found.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Controls */}
            {isStaff ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin"
                  className="px-3.5 py-2 rounded-xl bg-brand-dark/40 hover:bg-brand-dark border border-brand-orange/60 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-orange-sm"
                >
                  <Shield className="w-3.5 h-3.5 text-brand-orange" />
                  <span className="hidden sm:inline">Admin Console</span>
                  <span className="sm:hidden">Admin</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-surface-200 hover:bg-surface-100 border border-border text-gray-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="px-3 sm:px-4 py-2 rounded-xl bg-surface-200 hover:bg-surface-100 border border-border text-gray-300 hover:text-white font-semibold text-xs transition-colors flex items-center space-x-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-gray-400" />
                <span className="hidden sm:inline">Admin Portal</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Full Screen Search Drawer */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-4 sm:hidden flex flex-col space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-brand-orange" />
              <span className="font-display font-bold uppercase text-white text-sm">Tournament Search</span>
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-1.5 rounded-lg bg-surface-200 border border-border text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="Search tournaments or competitors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-200 border border-brand-dark rounded-xl pl-9 pr-8 py-3 text-xs text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {filteredTournaments.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] uppercase font-bold text-gray-400 font-mono">
                  Tournaments ({filteredTournaments.length})
                </span>
                <div className="space-y-1.5">
                  {filteredTournaments.map((t) => (
                    <Link
                      key={t.id}
                      to={`/tournaments/${t.slug}`}
                      onClick={() => setIsMobileSearchOpen(false)}
                      className="block p-3 rounded-xl bg-surface-200 border border-border"
                    >
                      <div className="text-xs font-bold text-white">{t.name}</div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                        {t.game?.name} • {t.format.replace('_', ' ')}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {filteredPlayers.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] uppercase font-bold text-gray-400 font-mono">
                  Competitors ({filteredPlayers.length})
                </span>
                <div className="space-y-1.5">
                  {filteredPlayers.map((p) => (
                    <Link
                      key={p.id}
                      to={`/players/${p.username}`}
                      onClick={() => setIsMobileSearchOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-surface-200 border border-border"
                    >
                      <div className="w-8 h-8 rounded-lg bg-surface-300 border border-border flex items-center justify-center font-bold text-xs text-brand-orange font-mono">
                        {p.username[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{p.display_name}</div>
                        <div className="text-[11px] text-gray-400 font-mono">@{p.username}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searchQuery && filteredTournaments.length === 0 && filteredPlayers.length === 0 && (
              <div className="py-8 text-center text-xs text-gray-400">
                No matching tournaments or players found.
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
