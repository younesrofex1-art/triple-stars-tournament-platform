import React from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Compass } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { useLanguage } from '../context/LanguageContext';

interface HorizontalControlsProps {
  currentSlideIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectSlide: (index: number) => void;
  onOpenRegister: () => void;
}

export const HorizontalControls: React.FC<HorizontalControlsProps> = ({
  currentSlideIndex,
  totalSlides,
  onPrev,
  onNext,
  onSelectSlide,
  onOpenRegister,
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none p-3 sm:p-5 select-none">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Left: Scroll / Drag Hint */}
        <div className="hidden md:flex items-center space-x-2.5 rtl:space-x-reverse px-3.5 py-1.5 rounded-xl bg-surface-300/80 backdrop-blur-xl border border-white/5 text-[11px] font-mono text-gray-400">
          <Compass className="w-3.5 h-3.5 text-brand-orange animate-spin [animation-duration:8s]" />
          <span className="tracking-widest uppercase">{t('scrollHint')}</span>
        </div>

        {/* Center: Slide Indicator Numbers & Quick Jump */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-2xl bg-surface-300/85 backdrop-blur-xl border border-white/10 shadow-elevated">
          {Array.from({ length: totalSlides }).map((_, idx) => {
            const isActive = currentSlideIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  soundManager.playClick();
                  onSelectSlide(idx);
                }}
                onMouseEnter={() => soundManager.playHover()}
                className={`transition-all duration-300 rounded-lg flex items-center justify-center font-mono font-black ${
                  isActive
                    ? 'w-7 sm:w-9 h-6 sm:h-7 bg-brand-orange text-white text-xs shadow-orange-sm scale-105'
                    : 'w-6 sm:w-7 h-6 sm:h-7 text-gray-500 hover:text-gray-300 hover:bg-white/5 text-[11px]'
                }`}
              >
                0{idx + 1}
              </button>
            );
          })}
        </div>

        {/* Right: Prev / Next Buttons & Quick CTA */}
        <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
          {/* Quick Register Trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenRegister();
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-dark to-brand-orange hover:from-brand-orange hover:to-amber-500 text-white text-xs font-bold font-display uppercase tracking-wider shadow-orange-sm transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{t('heroBtnRegister')}</span>
          </button>

          {/* Prev Slide Arrow */}
          <button
            onClick={() => {
              soundManager.playSlide();
              onPrev();
            }}
            onMouseEnter={() => soundManager.playHover()}
            disabled={currentSlideIndex === 0}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-surface-200/90 hover:bg-surface-100 disabled:opacity-30 disabled:cursor-not-allowed border border-border/80 backdrop-blur-xl text-gray-200 hover:text-white transition-all flex items-center space-x-1 rtl:space-x-reverse text-xs font-mono font-bold"
          >
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span className="hidden sm:inline">{t('prev')}</span>
          </button>

          {/* Next Slide Arrow */}
          <button
            onClick={() => {
              soundManager.playSlide();
              onNext();
            }}
            onMouseEnter={() => soundManager.playHover()}
            disabled={currentSlideIndex === totalSlides - 1}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-surface-200/90 hover:bg-surface-100 disabled:opacity-30 disabled:cursor-not-allowed border border-border/80 backdrop-blur-xl text-gray-200 hover:text-white transition-all flex items-center space-x-1 rtl:space-x-reverse text-xs font-mono font-bold"
          >
            <span className="hidden sm:inline">{t('next')}</span>
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
