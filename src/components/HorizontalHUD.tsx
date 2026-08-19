import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Shield, Globe } from 'lucide-react';
import { Logo } from './Logo';
import { soundManager } from '../utils/sound';
import { useLanguage } from '../context/LanguageContext';

interface HorizontalHUDProps {
  currentSlideIndex: number;
  totalSlides: number;
  onNavigateToSlide: (index: number) => void;
  scrollProgress: number;
}

export const HorizontalHUD: React.FC<HorizontalHUDProps> = ({
  currentSlideIndex,
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
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none p-4 sm:p-6 select-none">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Left: Brand Identity */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigateToSlide(0);
          }}
          className="flex items-center space-x-3 rtl:space-x-reverse text-left rtl:text-right group focus:outline-none cursor-pointer"
        >
          <Logo className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105" />
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span className="font-display text-sm sm:text-base font-bold tracking-wider text-white">
                {t('brandTitle')}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase block -mt-0.5">
              {t('brandSubtitle')}
            </span>
          </div>
        </button>

        {/* Center: Clean Architectural Nav Pills */}
        <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse px-2 py-1.5 rounded-full bg-surface-200/80 backdrop-blur-xl border border-white/10 shadow-pill">
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
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 focus:outline-none ${
                  isActive
                    ? 'text-white bg-white/10 shadow-sm font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Controls (Language, Sound, Admin) */}
        <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
          {/* Sound FX Toggle */}
          <button
            onClick={handleMuteToggle}
            onMouseEnter={() => soundManager.playHover()}
            title="Toggle Sound"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-surface-200/80 hover:bg-surface-100/90 border border-white/10 backdrop-blur-xl text-gray-300 hover:text-white transition-all text-xs font-mono flex items-center space-x-1.5 rtl:space-x-reverse"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-gray-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-white" />
            )}
            <span className="hidden sm:inline text-[11px] font-mono">
              {isMuted ? 'OFF' : 'ON'}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => {
              soundManager.playClick();
              toggleLanguage();
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="px-3 py-1.5 rounded-full bg-surface-200/80 hover:bg-surface-100/90 border border-white/10 backdrop-blur-xl text-gray-200 hover:text-white transition-all text-xs font-mono flex items-center space-x-1.5 rtl:space-x-reverse"
          >
            <Globe className="w-3.5 h-3.5 text-brand-orange" />
            <span className="font-semibold text-xs">
              {language === 'en' ? 'العربية' : 'EN'}
            </span>
          </button>

          {/* Admin Console Gate */}
          <Link
            to="/admin/login"
            onClick={() => soundManager.playClick()}
            onMouseEnter={() => soundManager.playHover()}
            title={t('adminPortal')}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-surface-200/80 hover:border-white/20 border border-white/10 backdrop-blur-xl text-gray-300 hover:text-white transition-all text-xs font-mono flex items-center space-x-1.5 rtl:space-x-reverse"
          >
            <Shield className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden md:inline text-[11px]">
              {t('adminPortal')}
            </span>
          </Link>
        </div>
      </div>

      {/* Razor-thin Minimal Progress Line */}
      <div className="max-w-[1600px] mx-auto mt-2 h-[1px] bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-white/70 transition-all duration-150"
          style={{ width: `${Math.max(0, Math.min(1, scrollProgress)) * 100}%` }}
        />
      </div>
    </header>
  );
};
