import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export const translations: Translations = {
  // Brand & Slogans
  brandTitle: {
    en: 'TRIPLE STARS',
    ar: 'تريبل ستارز',
  },
  brandSubtitle: {
    en: 'ESPORTS CHAMPIONSHIP CIRCUIT',
    ar: 'دوري بطولات الرياضات الإلكترونية',
  },
  liveArenaStatus: {
    en: 'LIVE ARENA ACTIVE',
    ar: 'القاعة التنافسية المباشرة',
  },
  // HUD Navigation
  navScene1: {
    en: '01 // ARENA',
    ar: '01 // الساحة',
  },
  navScene2: {
    en: '02 // SHOWDOWNS',
    ar: '02 // البطولات',
  },
  navScene3: {
    en: '03 // LIVE BRACKET',
    ar: '03 // الشجرة الحية',
  },
  navScene4: {
    en: '04 // CHAMPIONS',
    ar: '04 // الأبطال والصدارة',
  },
  navScene5: {
    en: '05 // ARENA PASS',
    ar: '05 // بطاقة الدخول',
  },
  scrollHint: {
    en: 'SCROLL OR DRAG HORIZONTALLY',
    ar: 'اسحب أو مرر أفقياً للتنقل',
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
    en: 'ADMIN PORTAL',
    ar: 'بوابة الإدارة',
  },
  soundFx: {
    en: 'SOUND FX',
    ar: 'المؤثرات الصوتية',
  },
  // Hero Slide
  heroBadge: {
    en: 'MOROCCO PREMIER ESPORTS CIRCUIT',
    ar: 'دوري النخبة للرياضات الإلكترونية بالمغرب',
  },
  heroHeading1: {
    en: 'COMPETE.',
    ar: 'تنافس.',
  },
  heroHeading2: {
    en: 'DOMINATE.',
    ar: 'سيطر.',
  },
  heroHeading3: {
    en: 'CLAIM GLORY.',
    ar: 'احصد المجد.',
  },
  heroDesc: {
    en: 'Step into the arena. Instant direct tournament entry with zero registration barriers. Live bracket progression, real-time stage sync, and guaranteed MAD cash pools.',
    ar: 'ادخل الساحة التنافسية. تسجيل فوري ومباشر في أقوى البطولات بدون تعقيد. متابعة حية لشجرة المباريات وتوزيع مباشر لجوائز الدرهم المغربي.',
  },
  heroBtnRegister: {
    en: 'CLAIM ARENA PASS',
    ar: 'احصل على بطاقة البطولة',
  },
  heroBtnExplore: {
    en: 'EXPLORE TOURNAMENTS',
    ar: 'تصفح البطولات الحية',
  },
  heroNextMatchCountdown: {
    en: 'NEXT GRAND TOURNAMENT STARTS IN',
    ar: 'البطولة الكبرى القادمة تنطلق خلال',
  },
  days: {
    en: 'DAYS',
    ar: 'أيام',
  },
  hours: {
    en: 'HOURS',
    ar: 'ساعات',
  },
  mins: {
    en: 'MINS',
    ar: 'دقائق',
  },
  secs: {
    en: 'SECS',
    ar: 'ثواني',
  },
  statPrizeDistributed: {
    en: 'PRIZE POOL GUARANTEED',
    ar: 'مجموع الجوائز المضمونة',
  },
  statVerifiedWarriors: {
    en: 'REGISTERED FIGHTERS',
    ar: 'المقاتلون المسجلون',
  },
  statLiveShowdowns: {
    en: 'CHAMPIONSHIP EVENTS',
    ar: 'بطولات نشطة ومجدولة',
  },
  statArenaStations: {
    en: 'ARENA RIGS & STATIONS',
    ar: 'محطات اللعب التنافسية',
  },
  // Tournaments Slide
  tournamentsHeading: {
    en: 'ACTIVE & UPCOMING BATTLES',
    ar: 'البطولات النشطة والقادمة',
  },
  tournamentsSubtitle: {
    en: 'Select your battleground. Direct instant entry with phone & gamer tag.',
    ar: 'اختر ساحة معركتك. تسجيل فوري مباشر برقم الهاتف واسمك في اللعبة.',
  },
  filterAll: {
    en: 'ALL GAMES',
    ar: 'كل الألعاب',
  },
  entryFee: {
    en: 'ENTRY FEE',
    ar: 'رسوم الدخول',
  },
  prizePool: {
    en: 'PRIZE POOL',
    ar: 'مجموع الجوائز',
  },
  slots: {
    en: 'SLOTS',
    ar: 'المقاعد',
  },
  format: {
    en: 'FORMAT',
    ar: 'النظام',
  },
  location: {
    en: 'LOCATION',
    ar: 'الموقع',
  },
  btnDirectRegister: {
    en: 'INSTANT REGISTER',
    ar: 'تسجيل فوري',
  },
  btnViewBracket: {
    en: 'LIVE BRACKET',
    ar: 'شجرة المباريات',
  },
  statusLive: {
    en: 'LIVE NOW',
    ar: 'مباشر الآن',
  },
  statusOpen: {
    en: 'REGISTRATION OPEN',
    ar: 'التسجيل مفتوح',
  },
  statusClosed: {
    en: 'REGISTRATION CLOSED',
    ar: 'اكتمل التسجيل',
  },
  statusCheckIn: {
    en: 'CHECK-IN OPEN',
    ar: 'تأكيد الحضور مفتوح',
  },
  statusCompleted: {
    en: 'COMPLETED',
    ar: 'انتهت البطولة',
  },
  // Bracket Slide
  bracketHeading: {
    en: 'THE ARENA BRACKET MATRIX',
    ar: 'شجرة المباريات التنافسية الحية',
  },
  bracketSubtitle: {
    en: 'Real-time bracket synchronization, live scores, and instant advancement paths.',
    ar: 'مزامنة لحظية للنتائج، بطاقات اللاعبين، والمسار نحو الكأس الذهبية.',
  },
  selectTournament: {
    en: 'SELECT TOURNAMENT',
    ar: 'اختر البطولة',
  },
  roundQuarter: {
    en: 'QUARTERFINALS',
    ar: 'ربع النهائي',
  },
  roundSemi: {
    en: 'SEMIFINALS',
    ar: 'نصف النهائي',
  },
  roundFinal: {
    en: 'GRAND FINALS',
    ar: 'النهائي الكبير',
  },
  roundBronze: {
    en: '3RD PLACE BATTLE',
    ar: 'مباراة المركز الثالث',
  },
  winnerCrown: {
    en: 'TOURNAMENT CHAMPION',
    ar: 'بطل البطولة',
  },
  matchVs: {
    en: 'VS',
    ar: 'ضد',
  },
  tbd: {
    en: 'TBD',
    ar: 'قيد التحديد',
  },
  // Leaderboard / Hall of Champions
  hallHeading: {
    en: 'HALL OF LEGENDS & STANDINGS',
    ar: 'لوحة الأبطال والصدارة العالمية',
  },
  hallSubtitle: {
    en: 'The top ranked gladiators across the Moroccan esports championship series.',
    ar: 'أفضل اللاعبين والمحترفين في دوري تريبل ستارز للرياضات الإلكترونية.',
  },
  rankGold: {
    en: '1ST RANK // GRAND CHAMPION',
    ar: 'المركز الأول // البطل الذهبي',
  },
  rankSilver: {
    en: '2ND RANK // CONTENDER',
    ar: 'المركز الثاني // الوصيف',
  },
  rankBronze: {
    en: '3RD RANK // WARRIOR',
    ar: 'المركز الثالث // المحارب',
  },
  winRate: {
    en: 'WIN RATE',
    ar: 'نسبة الفوز',
  },
  matches: {
    en: 'MATCHES',
    ar: 'المباريات',
  },
  earnings: {
    en: 'TOTAL EARNINGS',
    ar: 'مجموع الأرباح',
  },
  streak: {
    en: 'WIN STREAK',
    ar: 'سلسلة الانتصارات',
  },
  // Arena Pass / Direct Registration Slide
  passHeading: {
    en: 'DIRECT ARENA PASS TERMINAL',
    ar: 'محطة التسجيل المباشر وبطاقة الساحة',
  },
  passSubtitle: {
    en: 'No login required. Submit your gamer tag and phone number to reserve your spot instantly.',
    ar: 'بدون الحاجة لإنشاء حساب. اكتب اسمك ورقم هاتفك لحجز مقعدك فورياً.',
  },
  fieldName: {
    en: 'FULL NAME / DISPLAY NAME',
    ar: 'الاسم الكامل',
  },
  fieldGamerTag: {
    en: 'GAMER TAG / IGN',
    ar: 'اسمك داخل اللعبة (IGN)',
  },
  fieldPhone: {
    en: 'PHONE NUMBER / WHATSAPP',
    ar: 'رقم الهاتف / الواتساب',
  },
  fieldTournament: {
    en: 'SELECT TOURNAMENT',
    ar: 'اختر البطولة المراد المشاركة بها',
  },
  fieldTeam: {
    en: 'TEAM / CLAN (OPTIONAL)',
    ar: 'اسم الفريق / الكلان (اختياري)',
  },
  btnSubmitPass: {
    en: 'ISSUE ARENA PASS & REGISTER',
    ar: 'إصدار بطاقة المشاركة والتسجيل',
  },
  passNotice: {
    en: 'Admin will confirm your registration via WhatsApp / SMS. Settle entry fee at the arena cash desk.',
    ar: 'سيتم مراجعة وتأكيد تسجيلك من قبل الإدارة عبر الواتساب. يتم دفع الرسوم في مكتب الاستقبال.',
  },
  registrationSuccess: {
    en: 'ARENA PASS ISSUED SUCCESSFULLY!',
    ar: 'تم إصدار بطاقة البطولة بنجاح!',
  },
  successDetail: {
    en: 'Your spot has been queued. Triple Stars staff will reach out to verify your registration.',
    ar: 'تم حجز مقعدك بنجاح. سيتواصل معك طاقم تريبل ستارز لتأكيد موعد المباراة.',
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
