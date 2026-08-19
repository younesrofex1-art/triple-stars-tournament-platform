import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTournamentData } from '../hooks/useRealtimeStore';
import { formatMAD, formatDate, getStatusBadge } from '../utils/formatters';
import { TournamentBracket } from '../components/TournamentBracket';
import { StreamEmbed } from '../components/StreamEmbed';
import { RegistrationModal } from '../components/RegistrationModal';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Radio,
  UserCheck,
  CheckCircle,
  FileText,
  ShieldAlert,
  ArrowLeft,
  Share2,
  Check,
} from 'lucide-react';

export const TournamentDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { tournament, matches, rounds, registrations } = useTournamentData(slug || '');
  const [activeTab, setActiveTab] = useState<'bracket' | 'stream' | 'players' | 'rules'>('bracket');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!tournament) {
    return (
      <div className="py-16 text-center space-y-4">
        <Trophy className="w-12 h-12 text-gray-500 mx-auto" />
        <h2 className="text-2xl font-bold font-display uppercase text-white">Tournament Not Found</h2>
        <p className="text-xs text-gray-400">
          The requested tournament could not be found or has concluded.
        </p>
        <Link
          to="/tournaments"
          className="inline-block px-5 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-border text-white text-xs font-semibold"
        >
          Return to Tournaments
        </Link>
      </div>
    );
  }

  const badge = getStatusBadge(tournament.status);
  const isRegistered = user ? registrations.some((r) => r.player_id === user.id) : false;
  const isLive = tournament.status === 'LIVE';

  const handleShare = async () => {
    const shareData = {
      title: `${tournament.name} - Triple Stars Gaming Hall`,
      text: `Join ${tournament.name} with ${formatMAD(tournament.prize_pool_mad)} prize pool at Triple Stars Gaming Hall!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (e) {
        // clipboard fail
      }
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Back button and Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/tournaments"
          className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tournaments</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-200 hover:bg-surface-100 border border-border text-xs text-gray-300 transition-colors"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-brand-orange" />
              <span>Share Event</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Banner Card */}
      <div className="rounded-3xl bg-surface-200 border border-border overflow-hidden shadow-card">
        <div className="relative min-h-[280px] sm:h-80 w-full overflow-hidden bg-surface-300 flex flex-col justify-between">
          <img
            src={tournament.banner_url}
            alt={tournament.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-200 via-surface-200/75 to-black/70" />

          {/* Badges Top Bar */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-lg bg-black/80 backdrop-blur-sm text-xs font-bold text-white uppercase border border-border font-mono">
              {tournament.game?.name}
            </span>
            <span className="px-3 py-1 rounded-lg bg-surface-100/90 backdrop-blur-sm text-xs font-bold text-brand-orange uppercase border border-border font-mono">
              {tournament.format === 'double_elimination' && 'Double Elimination'}
              {tournament.format === 'swiss' && 'Swiss System'}
              {tournament.format === 'round_robin' && 'Round Robin'}
              {(!tournament.format || tournament.format === 'single_elimination') && 'Single Elimination'}
            </span>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${badge.class}`}>
              {badge.label}
            </span>
          </div>

          {/* Details & CTA Bottom Strip */}
          <div className="relative z-10 p-5 sm:p-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {tournament.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-300">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                  <span>{formatDate(tournament.start_at)}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                  <span>{tournament.location}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-brand-orange" />
                  <span>
                    {registrations.length} / {tournament.max_players} Registered
                  </span>
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3 self-start md:self-auto">
              {isLive && tournament.stream_embed_url && (
                <button
                  onClick={() => setActiveTab('stream')}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-md"
                >
                  <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span>Watch Stream</span>
                </button>
              )}

              {tournament.status === 'REGISTRATION_OPEN' && (
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  disabled={isRegistered}
                  className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                    isRegistered
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800 cursor-default'
                      : 'bg-brand-dark hover:bg-brand-orange text-white shadow-orange-sm active:scale-95'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Registered</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Register ({formatMAD(tournament.entry_fee_mad)})</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border bg-surface-300 border-t border-border text-center p-3 sm:p-4">
          <div className="p-1">
            <div className="text-[10px] uppercase font-bold text-gray-400">Entry Fee (MAD)</div>
            <div className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">
              {formatMAD(tournament.entry_fee_mad)}
            </div>
          </div>
          <div className="p-1">
            <div className="text-[10px] uppercase font-bold text-gray-400">Prize Pool (MAD)</div>
            <div className="text-base sm:text-lg font-bold text-brand-orange font-mono mt-0.5">
              {formatMAD(tournament.prize_pool_mad)}
            </div>
          </div>
          <div className="p-1">
            <div className="text-[10px] uppercase font-bold text-gray-400">Format</div>
            <div className="text-xs sm:text-sm font-semibold text-gray-200 capitalize mt-0.5">
              {tournament.format.replace('_', ' ')}
            </div>
          </div>
          <div className="p-1">
            <div className="text-[10px] uppercase font-bold text-gray-400">Payment Method</div>
            <div className="text-xs sm:text-sm font-semibold text-gray-300 mt-0.5">Cash Desk at Hall</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-border pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('bracket')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
            activeTab === 'bracket'
              ? 'bg-surface-100 text-brand-orange border border-border shadow-sm'
              : 'bg-surface-200 text-gray-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Interactive Bracket</span>
        </button>

        <button
          onClick={() => setActiveTab('stream')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
            activeTab === 'stream'
              ? 'bg-surface-100 text-rose-400 border border-border shadow-sm'
              : 'bg-surface-200 text-gray-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-rose-500" />
          <span>Live Stream</span>
        </button>

        <button
          onClick={() => setActiveTab('players')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
            activeTab === 'players'
              ? 'bg-surface-100 text-brand-orange border border-border shadow-sm'
              : 'bg-surface-200 text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Participants ({registrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
            activeTab === 'rules'
              ? 'bg-surface-100 text-brand-orange border border-border shadow-sm'
              : 'bg-surface-200 text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Rules & Guidelines</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {activeTab === 'bracket' && (
          <TournamentBracket
            rounds={rounds}
            matches={matches}
            format={tournament.format}
            players={registrations.map((r) => r.player).filter(Boolean) as any}
          />
        )}

        {activeTab === 'stream' && (
          <StreamEmbed
            embedUrl={tournament.stream_embed_url}
            streamUrl={tournament.stream_url}
            title={tournament.stream_title || tournament.name}
          />
        )}

        {activeTab === 'players' && (
          <div className="space-y-4">
            {/* Mobile Participants Card View (< 768px) */}
            <div className="md:hidden space-y-2.5">
              {registrations.length === 0 ? (
                <div className="p-8 text-center bg-surface-200 border border-border rounded-2xl text-gray-400 text-xs">
                  No competitors registered yet.
                </div>
              ) : (
                registrations.map((reg, idx) => (
                  <div
                    key={reg.id}
                    className="p-3.5 rounded-2xl bg-surface-200 border border-border flex items-center justify-between space-x-3"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className="w-7 h-7 rounded-lg bg-surface-300 border border-border text-brand-orange font-bold text-xs flex items-center justify-center font-mono flex-shrink-0">
                        #{reg.seed || idx + 1}
                      </span>
                      <div className="truncate">
                        <Link
                          to={`/players/${reg.player?.username}`}
                          className="text-xs font-bold text-white hover:text-brand-orange transition-colors truncate block"
                        >
                          @{reg.player?.username}
                        </Link>
                        <div className="text-[10px] text-gray-400">{reg.player?.display_name}</div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 space-y-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          reg.payment_status === 'paid'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {reg.payment_status}
                      </span>
                      <div className="text-[10px] text-gray-400 capitalize">
                        {reg.check_in_status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Participants Table (>= 768px) */}
            <div className="hidden md:block bg-surface-200 border border-border rounded-2xl p-6 overflow-x-auto shadow-card">
              <h3 className="text-sm font-bold uppercase text-white mb-4">Registered Participants</h3>
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-surface-300 text-gray-400 uppercase font-bold text-[10px] border-b border-border">
                  <tr>
                    <th className="p-3">Seed</th>
                    <th className="p-3">Player</th>
                    <th className="p-3">Registered At</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Check-In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {registrations.map((reg, idx) => (
                    <tr key={reg.id} className="hover:bg-surface-100/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-brand-orange">#{reg.seed || idx + 1}</td>
                      <td className="p-3 font-semibold text-white">
                        <Link
                          to={`/players/${reg.player?.username}`}
                          className="hover:text-brand-orange transition-colors"
                        >
                          @{reg.player?.username} ({reg.player?.display_name})
                        </Link>
                      </td>
                      <td className="p-3 text-gray-400">{formatDate(reg.registered_at)}</td>
                      <td className="p-3">
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
                      <td className="p-3 capitalize font-medium">{reg.check_in_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="bg-surface-200 border border-border rounded-2xl p-5 sm:p-6 space-y-3 shadow-card">
            <h3 className="text-sm font-bold uppercase text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-brand-orange" />
              <span>Official Tournament Rules & Conduct</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
              {tournament.rules || 'Standard competitive tournament rules apply for all Triple Stars Esports events.'}
            </p>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        tournaments={[tournament]}
        initialTournamentId={tournament.id}
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};
