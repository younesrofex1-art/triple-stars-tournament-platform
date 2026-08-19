import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  brandTitle: {
    en: 'TRIPLE STARS',
    ar: 'تريبل ستارز',
  },
  brandSubtitle: {
    en: 'ESPORTS CIRCUIT',
    ar: 'دوري الرياضات الإلكترونية',
  },
  liveBadge: {
    en: 'ARENA ONLINE',
    ar: 'الساحة المباشرة',
  },
  // HUD Navigation
  navScene1: {
    en: '01 // OVERVIEW',
    ar: '01 // نظرة عامة',
  },
  navScene2: {
    en: '02 // TOURNAMENTS',
    ar: '02 // البطولات',
  },
  navScene3: {
    en: '03 // BRACKET',
    ar: '03 // الشجرة التنافسية',
  },
  navScene4: {
    en: '04 // STANDINGS',
    ar: '04 // جدول الصدارة',
  },
  navScene5: {
    en: '05 // ACCESS PASS',
    ar: '05 // بطاقة المشاركة',
  },
  scrollHint: {
    en: 'HORIZONTAL DRAG / SCROLL',
    ar: 'التمرير الأفقي',
  },
  prev: {
    en: 'PREV',
    ar: 'السابق',
  },
  next: {
    en: 'NEXT',
    ar: 'التالي',
  },
  adminPortal: {
    en: 'ADMIN CONSOLE',
    ar: 'لوحة الإدارة',
  },
  audioToggle: {
    en: 'AUDIO',
    ar: 'الصوت',
  },
  // Hero Slide
  heroSubtitle: {
    en: 'CASABLANCA COMPETITIVE ESPORTS PLATFORM',
    ar: 'المنصة التنافسية الرسمية للرياضات الإلكترونية بالمغرب',
  },
  heroHeading1: {
    en: 'PRECISION.',
    ar: 'دقة.',
  },
  heroHeading2: {
    en: 'COMPETITION.',
    ar: 'منافسة.',
  },
  heroHeading3: {
    en: 'PERFORMANCE.',
    ar: 'أداء عالي.',
  },
  heroDesc: {
    en: 'Direct guest registration with zero friction. Live bracket telemetry, real-time stage progression, and guaranteed cash pools in Moroccan Dirham (MAD).',
    ar: 'تسجيل فوري ومباشر دون الحاجة لإنشاء حساب. متابعة لحظية لشجرة المباريات وتوزيع مضمون للجوائز بالدرهم المغربي.',
  },
  btnClaimPass: {
    en: 'GET PASS',
    ar: 'حجز بطاقة الدخول',
  },
  btnExploreShowdowns: {
    en: 'VIEW TOURNAMENTS',
    ar: 'استعراض البطولات',
  },
  nextEvent: {
    en: 'NEXT EVENT IN',
    ar: 'البطولة القادمة بعد',
  },
  days: {
    en: 'D',
    ar: 'يوم',
  },
  hours: {
    en: 'H',
    ar: 'ساعة',
  },
  mins: {
    en: 'M',
    ar: 'دقيقة',
  },
  secs: {
    en: 'S',
    ar: 'ثانية',
  },
  statPrizePool: {
    en: 'GUARANTEED PRIZES',
    ar: 'مجموع الجوائز المضمونة',
  },
  statTournaments: {
    en: 'ACTIVE EVENTS',
    ar: 'البطولات المجدولة',
  },
  statFighters: {
    en: 'REGISTERED PLAYERS',
    ar: 'اللاعبون المسجلون',
  },
  statStations: {
    en: 'ARENA STATIONS',
    ar: 'منصات اللعب',
  },
  // Tournaments Slide
  tournamentsTitle: {
    en: 'TOURNAMENT SCHEDULE',
    ar: 'جدول البطولات',
  },
  tournamentsDesc: {
    en: 'Select an event to register immediately with your gamer tag and phone number.',
    ar: 'اختر البطولة وسجل فورياً برقم هاتفك واسمك داخل اللعبة.',
  },
  filterAll: {
    en: 'ALL',
    ar: 'الكل',
  },
  entryFee: {
    en: 'ENTRY',
    ar: 'رسوم المشاركة',
  },
  prizePool: {
    en: 'PRIZE POOL',
    ar: 'الجوائز',
  },
  format: {
    en: 'FORMAT',
    ar: 'النظام',
  },
  location: {
    en: 'ARENA',
    ar: 'المقر',
  },
  btnRegisterNow: {
    en: 'REGISTER',
    ar: 'تسجيل فوري',
  },
  btnOpenBracket: {
    en: 'BRACKET',
    ar: 'الشجرة',
  },
  // Bracket Slide
  bracketTitle: {
    en: 'LIVE BRACKET MATRIX',
    ar: 'شجرة المباريات الحية',
  },
  bracketDesc: {
    en: 'Interactive stage telemetry and real-time match advancement.',
    ar: 'متابعة مباشرة ومزامنة لحظية لنتائج المباريات وتأهل الفرق.',
  },
  // Standings / Leaderboard Slide
  standingsTitle: {
    en: 'GLOBAL STANDINGS',
    ar: 'لوحة الصدارة والتصنيف',
  },
  standingsDesc: {
    en: 'Verified competitor performance rankings across all official circuits.',
    ar: 'ترتيب اللاعبين والفرق وفقاً لنسبة الانتصارات والأداء في البطولات.',
  },
  winRate: {
    en: 'WIN RATE',
    ar: 'نسبة الفوز',
  },
  rank1Title: {
    en: 'RANK 1 // LEADER',
    ar: 'المركز الأول // المتصدر',
  },
  rank2Title: {
    en: 'RANK 2 // CONTENDER',
    ar: 'المركز الثاني // الوصيف',
  },
  rank3Title: {
    en: 'RANK 3 // FINALIST',
    ar: 'المركز الثالث',
  },
  // Pass / Direct Registration
  passTitle: {
    en: 'ARENA PASS TERMINAL',
    ar: 'إصدار بطاقة المشاركة الفورية',
  },
  passDesc: {
    en: 'Guest registration. No account required. Provide your gamer tag and WhatsApp number.',
    ar: 'تسجيل مباشر للضيوف دون حساب. أدخل اسمك في اللعبة ورقم الواتساب فقط.',
  },
  fullName: {
    en: 'Full Name',
    ar: 'الاسم الكامل',
  },
  gamerTag: {
    en: 'Gamer Tag / IGN',
    ar: 'اسم اللاعب (IGN)',
  },
  phoneNumber: {
    en: 'Phone / WhatsApp',
    ar: 'رقم الهاتف / الواتساب',
  },
  tournamentSelect: {
    en: 'Tournament',
    ar: 'البطولة',
  },
  teamName: {
    en: 'Team / Clan (Optional)',
    ar: 'الفريق / الكلان (اختياري)',
  },
  submitPass: {
    en: 'CONFIRM REGISTRATION',
    ar: 'تأكيد التسجيل',
  },
  passNotice: {
    en: 'Registration confirmed directly with tournament desk upon check-in.',
    ar: 'يتم تأكيد وتفعيل التسجيل مباشرة في مكتب استقبال تريبل ستارز.',
  },
  successTitle: {
    en: 'PASS ISSUED',
    ar: 'تم تسجيلك بنجاح',
  },
  successDesc: {
    en: 'Your tournament entry has been queued in the system. Organizers will confirm your slot.',
    ar: 'تم تسجيل بياناتك بنجاح في قائمة الانتظار، وسيتواصل معك المنظمون للتأكيد.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ts_language') as Language;
      if (saved === 'en' || saved === 'ar') return saved;
    }
    return 'en';
  });

  const isRTL = language === 'ar';

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ts_language', lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, isRTL]);

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
