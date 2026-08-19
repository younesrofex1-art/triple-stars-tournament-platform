import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none p-4 sm:p-6 select-none">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Left: Section Indicator */}
        <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-full bg-surface-200/80 backdrop-blur-xl border border-white/10 text-xs font-mono text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
          <span className="font-semibold text-white">0{currentSlideIndex + 1}</span>
          <span>/</span>
          <span>0{totalSlides}</span>
        </div>

        {/* Center: Clean Minimal Dots */}
        <div className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-2 rounded-full bg-surface-200/80 backdrop-blur-xl border border-white/10 shadow-pill">
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
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-6 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            );
          })}
        </div>

        {/* Right: Minimal Arrow Navigation & Direct CTA */}
        <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
          {/* Quick Register Trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenRegister();
            }}
            onMouseEnter={() => soundManager.playHover()}
            className="hidden md:flex items-center px-4 py-2 rounded-full bg-white hover:bg-gray-100 text-black text-xs font-mono font-semibold transition-all hover:scale-105"
          >
            <span>{t('btnClaimPass')}</span>
          </button>

          {/* Prev Arrow */}
          <button
            onClick={() => {
              soundManager.playSlide();
              onPrev();
            }}
            onMouseEnter={() => soundManager.playHover()}
            disabled={currentSlideIndex === 0}
            className="w-9 h-9 rounded-full bg-surface-200/80 hover:bg-surface-100/90 disabled:opacity-20 disabled:cursor-not-allowed border border-white/10 backdrop-blur-xl text-white flex items-center justify-center transition-all"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </button>

          {/* Next Arrow */}
          <button
            onClick={() => {
              soundManager.playSlide();
              onNext();
            }}
            onMouseEnter={() => soundManager.playHover()}
            disabled={currentSlideIndex === totalSlides - 1}
            className="w-9 h-9 rounded-full bg-surface-200/80 hover:bg-surface-100/90 disabled:opacity-20 disabled:cursor-not-allowed border border-white/10 backdrop-blur-xl text-white flex items-center justify-center transition-all"
          >
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
