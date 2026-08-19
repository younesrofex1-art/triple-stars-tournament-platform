import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, Lock, Trophy, Radio, Users, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-300 border-t border-border mt-16 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3">
            <Logo size="md" />
            <p className="text-gray-400 leading-relaxed">
              Premier esports tournament platform for competitive gamers. Interactive live brackets, real-time match controller, and prize distributions.
            </p>
            <div className="text-[11px] font-semibold text-brand-orange font-mono">
              Official Moroccan Dirham (MAD / DH) Prize Pools
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Tournaments</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/tournaments" className="hover:text-brand-orange transition-colors flex items-center space-x-1.5">
                  <Trophy className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Championship Brackets</span>
                </Link>
              </li>
              <li>
                <Link to="/live" className="hover:text-rose-400 transition-colors flex items-center space-x-1.5">
                  <Radio className="w-3.5 h-3.5 text-rose-500" />
                  <span>Live Arena Stream</span>
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-brand-orange transition-colors flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Global Competitor Ranks</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Tournament Support */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Organizer Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" />
                <span>tournaments@triplestars.ma</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-500 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" />
                <span>Casablanca & National Tournament Series</span>
              </li>
            </ul>
          </div>

          {/* System Status */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Engine & Integrity</h4>
            <div className="p-3.5 rounded-xl bg-surface-200 border border-border space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-[11px]">
                <Shield className="w-3.5 h-3.5" />
                <span>Realtime Supabase Sync</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Bracket progression and scores sync instantly across all arena displays in real time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Organizer Portal link */}
        <div className="mt-8 pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-3">
          <div>© {new Date().getFullYear()} Triple Stars Esports Tournament Circuit. All rights reserved.</div>
          
          <div className="flex items-center space-x-4">
            <span className="font-mono">Moroccan Dirham (MAD / DH)</span>
            <span className="text-gray-700">•</span>
            <Link
              to="/admin/login"
              className="flex items-center space-x-1 text-gray-400 hover:text-brand-orange transition-colors font-semibold"
            >
              <Lock className="w-3 h-3" />
              <span>Organizer Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
