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
  DollarSign,
} from 'lucide-react';

export const TournamentDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { tournament, matches, rounds, registrations } = useTournamentData(slug || '');
  const [activeTab, setActiveTab] = useState<'bracket' | 'stream' | 'players' | 'rules'>('bracket');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link
        to="/tournaments"
        className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Tournaments</span>
      </Link>

      {/* Hero Banner Card */}
      <div className="rounded-3xl bg-surface-200 border border-border overflow-hidden shadow-card">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-surface-300">
          <img
            src={tournament.banner_url}
            alt={tournament.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-200 via-surface-200/60 to-black/70" />

          {/* Badges Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-sm text-xs font-bold text-white uppercase border border-border">
              {tournament.game?.name}
            </span>
            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${badge.class}`}>
              {badge.label}
            </span>
          </div>

          {/* Details & CTA Bottom Strip */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
                {tournament.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-brand-orange" />
                  <span>{formatDate(tournament.start_at)}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-brand-orange" />
                  <span>{tournament.location}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Users className="w-4 h-4 text-brand-orange" />
                  <span>
                    {registrations.length} / {tournament.max_players} Registered
                  </span>
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              {isLive && tournament.stream_embed_url && (
                <button
                  onClick={() => setActiveTab('stream')}
                  className="px-5 py-3 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5"
                >
                  <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span>Watch Stream</span>
                </button>
              )}

              {tournament.status === 'REGISTRATION_OPEN' && (
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  disabled={isRegistered}
                  className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                    isRegistered
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800 cursor-default'
                      : 'bg-brand-dark hover:bg-brand-orange text-white shadow-orange-sm'
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
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border bg-surface-300 border-t border-border text-center p-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500">Entry Fee (MAD)</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">
              {formatMAD(tournament.entry_fee_mad)}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500">Prize Pool (MAD)</div>
            <div className="text-lg font-bold text-brand-orange font-mono mt-0.5">
              {formatMAD(tournament.prize_pool_mad)}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500">Format</div>
            <div className="text-sm font-semibold text-gray-200 capitalize mt-0.5">
              {tournament.format.replace('_', ' ')}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-500">Payment Method</div>
            <div className="text-sm font-semibold text-gray-300 mt-0.5">Cash Desk at Hall</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-border pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bracket')}
          className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
            activeTab === 'bracket'
              ? 'bg-surface-100 text-brand-orange border border-border'
              : 'bg-surface-200 text-gray-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Interactive Bracket</span>
        </button>

        <button
          onClick={() => setActiveTab('stream')}
          className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
            activeTab === 'stream'
              ? 'bg-surface-100 text-rose-400 border border-border'
              : 'bg-surface-200 text-gray-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Live Stream</span>
        </button>

        <button
          onClick={() => setActiveTab('players')}
          className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
            activeTab === 'players'
              ? 'bg-surface-100 text-brand-orange border border-border'
              : 'bg-surface-200 text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Participants ({registrations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
            activeTab === 'rules'
              ? 'bg-surface-100 text-brand-orange border border-border'
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
          <TournamentBracket rounds={rounds} matches={matches} />
        )}

        {activeTab === 'stream' && (
          <StreamEmbed
            embedUrl={tournament.stream_embed_url}
            streamUrl={tournament.stream_url}
            title={tournament.stream_title || tournament.name}
          />
        )}

        {activeTab === 'players' && (
          <div className="bg-surface-200 border border-border rounded-2xl p-6 overflow-x-auto">
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
                    <td className="p-3 font-semibold text-white">@{reg.player?.username}</td>
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
                    <td className="p-3 capitalize">{reg.check_in_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="bg-surface-200 border border-border rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-brand-orange" />
              <span>Official Tournament Rules</span>
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
              {tournament.rules || 'Standard competitive tournament rules apply at Triple Stars Gaming Hall.'}
            </p>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        tournament={tournament}
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
};
