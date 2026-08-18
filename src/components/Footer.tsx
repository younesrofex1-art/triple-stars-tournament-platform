import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Shield, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-300 border-t border-border mt-20 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-surface-200 border border-brand-dark/40 flex items-center justify-center font-display font-bold text-brand-orange text-sm">
                ★3
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                TRIPLE STARS
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Esports tournament platform for Triple Stars Gaming Hall. Brackets, real-time live match scores, cash check-in, and leaderboards.
            </p>
            <div className="text-[11px] font-semibold text-brand-orange">
              All Tournament Prices in Moroccan Dirham (MAD / DH)
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/tournaments" className="hover:text-brand-orange transition-colors">
                  Tournaments & Brackets
                </Link>
              </li>
              <li>
                <Link to="/live" className="hover:text-rose-400 transition-colors">
                  Live Match Arena
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-brand-orange transition-colors">
                  Hall Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Hall Location</h4>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-brand-orange flex-shrink-0 mt-0.5" />
                <span>Triple Stars Gaming Hall, Boulevard Mohammed V, Morocco</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" />
                <span>+212 522-100200</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" />
                <span>tournaments@triplestars.ma</span>
              </li>
            </ul>
          </div>

          {/* System & Staff Entry */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">System & Rules</h4>
            <div className="p-3.5 rounded-xl bg-surface-200 border border-border space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-[11px]">
                <Shield className="w-3.5 h-3.5" />
                <span>Realtime Synced System</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Matches and brackets update live in real-time without requiring manual page refresh.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with discreet Staff Portal access */}
        <div className="mt-10 pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-3">
          <div>© {new Date().getFullYear()} Triple Stars Gaming Hall. All rights reserved.</div>
          
          <div className="flex items-center space-x-4">
            <span>Moroccan Dirham (DH) Currency</span>
            <span className="text-gray-700">•</span>
            <Link
              to="/admin/login"
              className="flex items-center space-x-1 text-gray-500 hover:text-brand-orange transition-colors font-semibold"
            >
              <Lock className="w-3 h-3" />
              <span>Staff & Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
