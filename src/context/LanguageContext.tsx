import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // Navigation
  brandTitle: {
    en: 'TRIPLE STARS',
    ar: 'تريبل ستارز',
  },
  brandSubtitle: {
    en: 'ESPORTS CIRCUIT',
    ar: 'دوري الرياضات الإلكترونية',
  },
  navTournaments: {
    en: 'Tournaments',
    ar: 'البطولات',
  },
  navLiveBrackets: {
    en: 'Live Brackets',
    ar: 'شجرة المباريات الحية',
  },
  navLeaderboard: {
    en: 'Leaderboard',
    ar: 'لوحة الصدارة',
  },
  adminPortal: {
    en: 'Admin Console',
    ar: 'لوحة الإدارة',
  },
  liveBadge: {
    en: 'LIVE MATCHES',
    ar: 'مباريات مباشرة',
  },
  // Hero
  heroTagline: {
    en: 'MOROCCO COMPETITIVE ESPORTS PLATFORM',
    ar: 'المنصة التنافسية الرسمية للرياضات الإلكترونية بالمغرب',
  },
  heroTitle: {
    en: 'Triple Stars Esports Championship',
    ar: 'دوري تريبل ستارز للبطولات التنافسية',
  },
  heroDesc: {
    en: 'Register directly with your phone number or follow live brackets in real time. Official cash prize pools distributed in Moroccan Dirham (MAD).',
    ar: 'سجل فورياً برقم هاتفك واسمك أو تابع شجرة المباريات لحظة بلحظة. جوائز مالية مضمونة بالدرهم المغربي لجميع البطولات.',
  },
  btnRegisterHero: {
    en: 'Register for Tournament',
    ar: 'تسجيل في البطولة',
  },
  btnViewLiveBrackets: {
    en: 'Explore Live Brackets',
    ar: 'استعراض شجرة المباريات',
  },
  // Stats
  statPrizes: {
    en: 'Guaranteed Prize Pool',
    ar: 'مجموع الجوائز المضمونة',
  },
  statTournaments: {
    en: 'Active Tournaments',
    ar: 'البطولات النشطة',
  },
  statPlayers: {
    en: 'Registered Competitors',
    ar: 'اللاعبون المسجلون',
  },
  statFormat: {
    en: 'Single & Double Elimination',
    ar: 'إقصاء مباشر ومزدوج',
  },
  // Tournaments Section
  tournamentsHeading: {
    en: 'Featured & Live Tournaments',
    ar: 'البطولات الحية والمجدولة',
  },
  tournamentsSubheading: {
    en: 'Click Register to sign up with your phone number, or View Bracket to follow live match progress.',
    ar: 'اضغط على "تسجيل" للمشاركة برقم هاتفك، أو "عرض الشجرة" لمتابعة المباريات الحية.',
  },
  filterAll: {
    en: 'All Games',
    ar: 'جميع الألعاب',
  },
  statusLive: {
    en: 'Live Now',
    ar: 'مباشر الآن',
  },
  statusOpen: {
    en: 'Registration Open',
    ar: 'التسجيل مفتوح',
  },
  statusClosed: {
    en: 'Registration Closed',
    ar: 'اكتمل التسجيل',
  },
  statusCompleted: {
    en: 'Completed',
    ar: 'انتهت البطولة',
  },
  entryFee: {
    en: 'Entry Fee',
    ar: 'رسوم الدخول',
  },
  prizePool: {
    en: 'Prize Pool',
    ar: 'الجوائز',
  },
  format: {
    en: 'Format',
    ar: 'نظام اللعب',
  },
  location: {
    en: 'Location',
    ar: 'المقر',
  },
  btnRegisterCard: {
    en: 'Register Now',
    ar: 'تسجيل الآن',
  },
  btnViewBracketCard: {
    en: 'View Live Bracket',
    ar: 'عرض شجرة المباريات',
  },
  // Bracket Section
  bracketHeading: {
    en: 'Live Tournament Bracket Matrix',
    ar: 'شجرة المباريات والنتائج الحية',
  },
  bracketSubheading: {
    en: 'Select a tournament to inspect real-time scores, player advancement, and championship matchups.',
    ar: 'اختر البطولة لمشاهدة نتائج المباريات، مسار المتأهلين، والمواجهات النهائية.',
  },
  selectTournament: {
    en: 'Select Tournament',
    ar: 'اختر البطولة',
  },
  // Leaderboard Section
  leaderboardHeading: {
    en: 'Competitor Leaderboard & Standings',
    ar: 'لوحة الصدارة وترتيب اللاعبين',
  },
  leaderboardSubheading: {
    en: 'Top ranked gladiators ranked by win rate and championship victories.',
    ar: 'ترتيب أفضل اللاعبين والمحترفين حسب نسبة الفوز والمشاركات.',
  },
  winRate: {
    en: 'Win Rate',
    ar: 'نسبة الفوز',
  },
  wins: {
    en: 'Wins',
    ar: 'فوز',
  },
  losses: {
    en: 'Losses',
    ar: 'خسارة',
  },
  // Quick Registration Modal
  modalTitle: {
    en: 'Direct Tournament Registration',
    ar: 'التسجيل المباشر في البطولة',
  },
  modalDesc: {
    en: 'No account needed. Enter your name and phone number. Our organizers will call or WhatsApp you to confirm your spot.',
    ar: 'بدون الحاجة لإنشاء حساب. أدخل اسمك ورقم هاتفك وسيتواصل معك المنظمون عبر الواتساب لتأكيد مشاركتك.',
  },
  fieldName: {
    en: 'Your Full Name / Gamer Tag',
    ar: 'الاسم الكامل أو اسمك في اللعبة (IGN)',
  },
  fieldPhone: {
    en: 'Phone Number / WhatsApp',
    ar: 'رقم الهاتف / الواتساب (للتأكيد)',
  },
  fieldTournament: {
    en: 'Target Tournament',
    ar: 'البطولة المراد التسجيل بها',
  },
  fieldTeam: {
    en: 'Team / Clan (Optional)',
    ar: 'اسم الفريق / الكلان (اختياري)',
  },
  btnSubmit: {
    en: 'Confirm & Submit',
    ar: 'تأكيد وإرسال طلب المشاركة',
  },
  btnSubmitting: {
    en: 'Submitting Registration...',
    ar: 'جاري تسجيل الطلب...',
  },
  successTitle: {
    en: 'Registration Received!',
    ar: 'تم استلام طلب التسجيل بنجاح!',
  },
  successDesc: {
    en: 'Your name and phone number have been queued for the tournament. Triple Stars admin will contact you to confirm check-in.',
    ar: 'تم تسجيل بياناتك بنجاح. سيتواصل معك طاقم تريبل ستارز عبر الهاتف / الواتساب لتأكيد موعد مباراتك.',
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
