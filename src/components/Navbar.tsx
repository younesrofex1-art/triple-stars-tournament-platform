import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Radio, Users, Search, User, LogOut, X, Shield, PlusCircle, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { store } from '../services/store';
import { useRealtimeStore } from '../hooks/useRealtimeStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loginAsPlayer, isStaff } = useAuth();
  const { tournaments, profiles } = useRealtimeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeLoginTab, setActiveLoginTab] = useState<'existing' | 'new'>('new');

  // Existing profile picker state
  const [selectedPlayerUsername, setSelectedPlayerUsername] = useState('');

  // New gamer registration state
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

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

  const handlePlayerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerUsername) return;
    await loginAsPlayer(selectedPlayerUsername);
    setIsLoginModalOpen(false);
    navigate(`/players/${selectedPlayerUsername}`);
  };

  const handleCreateNewPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!newUsername.trim() || !newDisplayName.trim() || !newEmail.trim()) {
      setLoginError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await store.createPlayerProfile({
        username: newUsername,
        display_name: newDisplayName,
        email: newEmail,
        phone: newPhone || undefined,
      });

      await loginAsPlayer(created.username);
      setIsSubmitting(false);
      setIsLoginModalOpen(false);
      navigate(`/players/${created.username}`);
    } catch (err: any) {
      setIsSubmitting(false);
      setLoginError(err.message || 'Username or email may already be taken.');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-300/95 backdrop-blur-md border-b border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-surface-200 border border-brand-dark/50 flex items-center justify-center font-display text-xl font-bold text-brand-orange group-hover:border-brand-orange transition-colors">
              ★3
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-brand-orange transition-colors">
                  TRIPLE STARS
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-subtle text-brand-orange border border-brand-dark/40 font-bold">
                  DH
                </span>
              </div>
              <span className="text-[10px] text-gray-400 tracking-wider block uppercase font-medium">
                Gaming Hall Platform
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/tournaments"
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                isActive('/tournaments')
                  ? 'bg-surface-100 text-brand-orange border border-border'
                  : 'text-gray-300 hover:text-white hover:bg-surface-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-brand-orange" />
              <span>Tournaments</span>
            </Link>

            <Link
              to="/live"
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                isActive('/live')
                  ? 'bg-surface-100 text-rose-400 border border-border'
                  : 'text-gray-300 hover:text-white hover:bg-surface-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-rose-500" />
              <span>Live Arena</span>
              {liveTournamentsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[9px] font-black">
                  {liveTournamentsCount}
                </span>
              )}
            </Link>

            <Link
              to="/leaderboard"
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                isActive('/leaderboard')
                  ? 'bg-surface-100 text-brand-orange border border-border'
                  : 'text-gray-300 hover:text-white hover:bg-surface-200'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-brand-orange" />
              <span>Leaderboard</span>
            </Link>
          </nav>

          {/* Right Utilities (Search & Player Identity) */}
          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tournaments, players..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.trim() && setIsSearchOpen(true)}
                className="w-48 lg:w-60 bg-surface-200 border border-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark transition-all"
              />

              {/* Search Dropdown Modal */}
              {isSearchOpen && (filteredTournaments.length > 0 || filteredPlayers.length > 0) && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-surface-200 border border-border rounded-xl shadow-elevated p-2 z-50 max-h-80 overflow-y-auto"
                  onMouseLeave={() => setIsSearchOpen(false)}
                >
                  {filteredTournaments.length > 0 && (
                    <div className="mb-2">
                      <div className="text-[10px] font-bold uppercase text-gray-500 px-2 py-1 tracking-wider">
                        Tournaments
                      </div>
                      {filteredTournaments.map((t) => (
                        <Link
                          key={t.id}
                          to={`/tournaments/${t.slug}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-100 transition-colors"
                        >
                          <span className="text-xs font-semibold text-white truncate">{t.name}</span>
                          <span className="text-[10px] text-brand-orange font-bold font-mono">{t.prize_pool_mad} DH</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {filteredPlayers.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase text-gray-500 px-2 py-1 tracking-wider">
                        Players
                      </div>
                      {filteredPlayers.map((p) => (
                        <Link
                          key={p.id}
                          to={`/players/${p.username}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-100 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded bg-surface-100 text-brand-orange font-bold text-[10px] flex items-center justify-center">
                              {p.username[0].toUpperCase()}
                            </div>
                            <span className="text-xs text-gray-300">@{p.username}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">{p.wins} Wins</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Portal link if Staff */}
            {isStaff && (
              <Link
                to="/admin"
                className="px-3 py-1.5 rounded-lg bg-surface-200 border border-brand-dark/50 hover:bg-brand-dark text-brand-orange hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Desk</span>
              </Link>
            )}

            {/* Player Profile or Player Sign In Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/players/${user.username}`}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-surface-200 border border-border hover:border-brand-dark transition-colors"
                >
                  <div className="w-6 h-6 rounded bg-brand-dark text-white text-xs font-bold flex items-center justify-center font-mono">
                    {user.username ? user.username[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium text-white hidden sm:block">@{user.username}</span>
                </Link>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-surface-200 border border-border text-gray-400 hover:text-white hover:border-border-active transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setActiveLoginTab(profiles.length > 0 ? 'existing' : 'new');
                    setIsLoginModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-brand-dark hover:bg-brand-orange text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-orange-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Player Sign In</span>
                </button>

                <Link
                  to="/admin/login"
                  title="Staff Portal"
                  className="p-2 rounded-lg bg-surface-200 border border-border text-gray-400 hover:text-brand-orange hover:border-brand-dark transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Login / Registration Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-surface-200 border border-border rounded-2xl p-6 shadow-elevated space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-xl font-bold text-white uppercase">Competitor Access</h3>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-surface-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex rounded-xl bg-surface-300 p-1 border border-border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveLoginTab('new')}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                  activeLoginTab === 'new'
                    ? 'bg-surface-100 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Player Registration</span>
              </button>
              {profiles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveLoginTab('existing')}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                    activeLoginTab === 'existing'
                      ? 'bg-surface-100 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Existing Competitor</span>
                </button>
              )}
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                {loginError}
              </div>
            )}

            {activeLoginTab === 'new' ? (
              <form onSubmit={handleCreateNewPlayer} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="block text-gray-300 font-semibold">Gamer Handle / Tag *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. shadow_striker"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-300 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Reda Berrada"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-300 font-semibold">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="reda@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-300 font-semibold">Phone (Optional for SMS / Check-In)</label>
                  <input
                    type="tel"
                    placeholder="+212 600-000000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-surface-300 border border-border rounded-xl px-3.5 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-dark"
                  />
                </div>

                <div className="pt-2 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-surface-100 text-gray-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-brand-dark hover:bg-brand-orange text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-orange-sm"
                  >
                    {isSubmitting ? 'Creating...' : 'Create & Sign In'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePlayerLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-300">Choose Profile</label>
                  <select
                    value={selectedPlayerUsername}
                    onChange={(e) => setSelectedPlayerUsername(e.target.value)}
                    className="w-full bg-surface-300 border border-border rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-dark"
                    required
                  >
                    <option value="">-- Select Competitor --</option>
                    {profiles.map((p) => (
                      <option key={p.id} value={p.username}>
                        @{p.username} ({p.display_name}) - {p.wins} Wins
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-surface-100 text-gray-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedPlayerUsername}
                    className="flex-1 py-2.5 rounded-xl bg-brand-dark hover:bg-brand-orange text-white text-xs font-bold uppercase transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            <div className="border-t border-border pt-3 text-center">
              <Link
                to="/admin/login"
                onClick={() => setIsLoginModalOpen(false)}
                className="text-[11px] text-gray-400 hover:text-brand-orange transition-colors inline-flex items-center space-x-1"
              >
                <Shield className="w-3 h-3" />
                <span>Tournament Director / Staff Login</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
