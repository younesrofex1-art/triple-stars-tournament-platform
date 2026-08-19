import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Shield, Globe, Radio } from 'lucide-react';
import { Logo } from './Logo';
import { soundManager } from '../utils/sound';
import { useLanguage } from '../context/LanguageContext';

interface HorizontalHUDProps {
  currentSlideIndex: number;
  totalSlides: number;
  onNavigateToSlide: (index: number) => void;
  scrollProgress: number; // 0 to 1
}

export const HorizontalHUD: React.FC<HorizontalHUDProps> = ({
  currentSlideIndex,
  totalSlides,
  onNavigateToSlide,
  scrollProgress,
}) => {
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());

  useEffect(() => {
    const handleSoundChange = (e: any) => {
      setIsMuted(e.detail?.muted ?? soundManager.isMuted());
    };
    window.addEventListener('ts-sound-change', handleSoundChange);
    return () => window.removeEventListener('ts-sound-change', handleSoundChange);
  }, []);

  const handleMuteToggle = () => {
    const next = soundManager.toggleMute();
    setIsMuted(next);
    if (!next) {
      soundManager.playClick();
    }
  };

  const navItems = [
    { label: t('navScene1'), index: 0 },
    { label: t('navScene2'), index: 1 },
    { label: t('navScene3'), index: 2 },
    { label: t('navScene4'), index: 3 },
    { label: t('navScene5'), index: 4 },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-3 sm:p-5 select-none">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Left: Brand / Logo & Live Ticker */}
        <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigateToSlide(0);
            }}
            className="flex items-center space-x-2.5 rtl:space-x-reverse group text-left cursor-pointer focus:outline-none"
          >
            <div className="p-1.5 rounded-xl bg-surface-200/90 border border-border/90 group-hover:border-brand-orange/60 backdrop-blur-xl shadow-lg transition-all duration-300">
              <Logo className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <span className="font-display text-sm sm:text-base font-extrabold tracking-wider text-white group-hover:text-brand-orange transition-colors">
                  {t('brandTitle')}
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 rounded bg-brand-orange/15 text-brand-orange border border-brand-orange/30 text-[9px] font-mono font-black">
                  ARENA OS
                </span>
              </div>
              <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                <span className="text-[10px] text-gray-400 tracking-wider font-mono uppercase">
                  {t('liveArenaStatus')}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Stage Navigator Pills (Desktop & Tablet) */}
        <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse p-1.5 rounded-2xl bg-surface-300/85 backdrop-blur-xl border border-white/10 shadow-elevated">
          {navItems.map((item) => {
            const isActive = currentSlideIndex === item.index;
            return (
              <button
                key={item.index}
                onClick={() => {
                  soundManager.playClick();
                  onNavigateToSlide(item.index);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-300 focus:outline-none ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-brand-dark to-brand-orange shadow-orange-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Controls (Sound, Language, Admin Gate) */}
        <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
          {/* Sound FX Toggle */}
          <button
            onClick={handleMuteToggle}
            onMouseEnter={() => soundManager.playHover()}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-200/90 hover:bg-surface-100 border border-border/80 backdrop-blur-xl text-gray-300 hover:text-white transition-all text-xs font-mono"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-gray-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-brand-orange animate-pulse" />
            )}
            <span className="hidden sm:inline text-[11px] font-bold">
              {isMuted ? 'MUTED' : 'AUDIO'}
            </span>
          </button>

          {/* Bilingual Language Switcher */}
          <button
            onClick={() => {
              soundManager.playClick();
              toggleLanguage();
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-200/90 hover:bg-surface-100 border border-border/80 backdrop-blur-xl text-gray-200 hover:text-white transition-all text-xs font-bold"
          >
            <Globe className="w-4 h-4 text-brand-orange" />
            <span className="font-mono text-xs font-extrabold uppercase">
              {language === 'en' ? 'العربية' : 'EN'}
            </span>
          </button>

          {/* Admin / Organizer Portal Portal Gate */}
          <Link
            to="/admin/login"
            onClick={() => soundManager.playClick()}
            onMouseEnter={() => soundManager.playHover()}
            title="Admin Login & Match Controller"
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-xl bg-surface-200/90 hover:border-brand-orange/60 border border-border/80 backdrop-blur-xl text-gray-300 hover:text-white transition-all text-xs font-mono group"
          >
            <Shield className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-orange transition-colors" />
            <span className="hidden md:inline text-[11px] font-bold">
              {t('adminPortal')}
            </span>
          </Link>
        </div>
      </div>

      {/* Futuristic Horizontal Scroll Progress Line */}
      <div className="max-w-[1700px] mx-auto mt-2 h-0.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-dark via-brand-orange to-cyan-400 transition-all duration-150 shadow-[0_0_10px_rgba(255,107,0,0.8)]"
          style={{ width: `${Math.max(0, Math.min(1, scrollProgress)) * 100}%` }}
        />
      </div>
    </header>
  );
};
