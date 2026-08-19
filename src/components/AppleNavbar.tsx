import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Shield, Radio, Trophy, Layers, Award } from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';

interface AppleNavbarProps {
  onScrollToSection: (sectionId: string) => void;
  activeSection?: string;
}

export const AppleNavbar: React.FC<AppleNavbarProps> = ({ onScrollToSection, activeSection = 'tournaments' }) => {
  const { language, toggleLanguage, t, isRTL } = useLanguage();

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/[0.08] select-none transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand / Logo */}
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            onScrollToSection('hero');
          }}
          className="flex items-center space-x-3 rtl:space-x-reverse group focus:outline-none"
        >
          <Logo className="w-8 h-8 transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="font-display font-bold text-sm sm:text-base tracking-wide text-white group-hover:text-brand-orange transition-colors">
                {t('brandTitle')}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-brand-orange/15 text-brand-orange border border-brand-orange/30 text-[9px] font-mono font-bold">
                ESPORTS
              </span>
            </div>
          </div>
        </Link>

        {/* Center: Clean Apple Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 rtl:space-x-reverse p-1 rounded-full bg-surface-200/60 border border-white/5">
          <button
            onClick={() => onScrollToSection('tournaments')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 rtl:space-x-reverse ${
              activeSection === 'tournaments'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-brand-orange" />
            <span>{t('navTournaments')}</span>
          </button>

          <button
            onClick={() => onScrollToSection('brackets')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 rtl:space-x-reverse ${
              activeSection === 'brackets'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-brand-gold" />
            <span>{t('navLiveBrackets')}</span>
          </button>

          <button
            onClick={() => onScrollToSection('leaderboard')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 rtl:space-x-reverse ${
              activeSection === 'leaderboard'
                ? 'bg-white/15 text-white font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('navLeaderboard')}</span>
          </button>
        </nav>

        {/* Right: Language Toggle & Admin Button */}
        <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-full bg-surface-200/80 hover:bg-surface-100 border border-white/10 text-gray-200 hover:text-white transition-all text-xs font-medium flex items-center space-x-1.5 rtl:space-x-reverse"
          >
            <Globe className="w-3.5 h-3.5 text-brand-orange" />
            <span className="font-semibold">
              {language === 'en' ? 'العربية' : 'English'}
            </span>
          </button>

          {/* Admin Portal */}
          <Link
            to="/admin/login"
            className="px-3 py-1.5 rounded-full bg-surface-200/80 hover:bg-surface-100 border border-white/10 text-gray-300 hover:text-white transition-all text-xs font-medium flex items-center space-x-1.5 rtl:space-x-reverse group"
          >
            <Shield className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-orange transition-colors" />
            <span className="hidden sm:inline">
              {t('adminPortal')}
            </span>
          </Link>
        </div>

      </div>
    </header>
  );
};
