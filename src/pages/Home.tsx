import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRealtimeStore } from '../hooks/useRealtimeStore';
import { HorizontalHUD } from '../components/HorizontalHUD';
import { HorizontalControls } from '../components/HorizontalControls';
import { TeslaBackground } from '../components/TeslaBackground';
import { ArenaPassModal } from '../components/ArenaPassModal';
import { HeroSlide } from '../components/slides/HeroSlide';
import { TournamentsSlide } from '../components/slides/TournamentsSlide';
import { BracketArenaSlide } from '../components/slides/BracketArenaSlide';
import { LeaderboardSlide } from '../components/slides/LeaderboardSlide';
import { DirectPassSlide } from '../components/slides/DirectPassSlide';
import { useLanguage } from '../context/LanguageContext';
import { soundManager } from '../utils/sound';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_SLIDES = 5;

export const Home: React.FC = () => {
  const { tournaments, matches, rounds, profiles } = useRealtimeStore();
  const { isRTL } = useLanguage();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [modalTournamentId, setModalTournamentId] = useState<string | undefined>(undefined);
  const [activeBracketTrnId, setActiveBracketTrnId] = useState<string | undefined>(undefined);

  const currentSlideRef = useRef(0);
  currentSlideRef.current = currentSlideIndex;

  const isAnimatingRef = useRef(false);

  const navigateToSlide = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= TOTAL_SLIDES) return;
    if (!trackRef.current) return;

    isAnimatingRef.current = true;
    setCurrentSlideIndex(targetIndex);
    setScrollProgress(targetIndex / (TOTAL_SLIDES - 1));

    const slideWidth = window.innerWidth;
    const directionFactor = isRTL ? 1 : -1;
    const targetX = targetIndex * slideWidth * directionFactor;

    gsap.to(trackRef.current, {
      x: targetX,
      duration: 0.85,
      ease: 'power3.out',
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });
  };

  const nextSlide = () => {
    if (currentSlideRef.current < TOTAL_SLIDES - 1) {
      navigateToSlide(currentSlideRef.current + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideRef.current > 0) {
      navigateToSlide(currentSlideRef.current - 1);
    }
  };

  // Wheel listener
  useEffect(() => {
    let lastWheelTime = 0;
    const wheelThreshold = 35;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      const isInsideScrollable = target?.closest('.overflow-y-auto, .overflow-x-auto');
      if (isInsideScrollable) {
        const el = isInsideScrollable as HTMLElement;
        const isVertScroll = Math.abs(e.deltaY) > Math.abs(e.deltaX);
        if (isVertScroll && ((e.deltaY > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 2) || (e.deltaY < 0 && el.scrollTop > 2))) {
          return;
        }
      }

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const now = Date.now();

      if (Math.abs(delta) > wheelThreshold && now - lastWheelTime > 450) {
        lastWheelTime = now;
        if (delta > 0) {
          if (currentSlideRef.current < TOTAL_SLIDES - 1) {
            soundManager.playSlide();
            navigateToSlide(currentSlideRef.current + 1);
          }
        } else {
          if (currentSlideRef.current > 0) {
            soundManager.playSlide();
            navigateToSlide(currentSlideRef.current - 1);
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isRTL]);

  // Touch swipe support
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const deltaTime = Date.now() - touchStartTime;

      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.3 && Math.abs(deltaX) > 40 && deltaTime < 400) {
        const isSwipingNext = isRTL ? deltaX > 0 : deltaX < 0;
        if (isSwipingNext) {
          if (currentSlideRef.current < TOTAL_SLIDES - 1) {
            soundManager.playSlide();
            navigateToSlide(currentSlideRef.current + 1);
          }
        } else {
          if (currentSlideRef.current > 0) {
            soundManager.playSlide();
            navigateToSlide(currentSlideRef.current - 1);
          }
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isRTL]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        soundManager.playSlide();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        soundManager.playSlide();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        soundManager.playSlide();
        navigateToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        soundManager.playSlide();
        navigateToSlide(TOTAL_SLIDES - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      if (!trackRef.current) return;
      const slideWidth = window.innerWidth;
      const directionFactor = isRTL ? 1 : -1;
      const targetX = currentSlideRef.current * slideWidth * directionFactor;
      gsap.set(trackRef.current, { x: targetX });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isRTL]);

  useEffect(() => {
    if (!trackRef.current) return;
    const slideWidth = window.innerWidth;
    const directionFactor = isRTL ? 1 : -1;
    const targetX = currentSlideRef.current * slideWidth * directionFactor;
    gsap.set(trackRef.current, { x: targetX });
  }, [isRTL]);

  const handleOpenRegister = (tournamentId?: string) => {
    setModalTournamentId(tournamentId);
    setIsPassModalOpen(true);
  };

  const handleViewBracket = (tournamentId: string) => {
    setActiveBracketTrnId(tournamentId);
    navigateToSlide(2);
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-screen h-screen overflow-hidden bg-background text-gray-200 selection:bg-white/20 selection:text-white ${
        isRTL ? 'font-arabic' : 'font-sans'
      }`}
    >
      <TeslaBackground />

      <HorizontalHUD
        currentSlideIndex={currentSlideIndex}
        totalSlides={TOTAL_SLIDES}
        onNavigateToSlide={navigateToSlide}
        scrollProgress={scrollProgress}
      />

      <div
        ref={trackRef}
        className="flex flex-row h-screen w-[500vw] relative z-10 will-change-transform"
      >
        <HeroSlide
          tournaments={tournaments}
          onOpenRegister={handleOpenRegister}
          onExploreTournaments={() => navigateToSlide(1)}
        />

        <TournamentsSlide
          tournaments={tournaments}
          onOpenRegister={handleOpenRegister}
          onViewBracket={handleViewBracket}
        />

        <BracketArenaSlide
          tournaments={tournaments}
          selectedTournamentId={activeBracketTrnId}
          onSelectTournament={setActiveBracketTrnId}
          matches={matches}
          rounds={rounds}
          profiles={profiles}
          onOpenRegister={handleOpenRegister}
        />

        <LeaderboardSlide players={profiles} />

        <DirectPassSlide tournaments={tournaments} />
      </div>

      <HorizontalControls
        currentSlideIndex={currentSlideIndex}
        totalSlides={TOTAL_SLIDES}
        onPrev={prevSlide}
        onNext={nextSlide}
        onSelectSlide={navigateToSlide}
        onOpenRegister={() => handleOpenRegister()}
      />

      <ArenaPassModal
        tournaments={tournaments}
        initialTournamentId={modalTournamentId}
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />
    </div>
  );
};
