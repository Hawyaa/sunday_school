export type Locale = 'en' | 'am';

export interface TranslationDictionary {
  appName: string;
  subTitle: string;
  tagline: string;
  nav: {
    home: string;
    schedule: string;
    announcements: string;
    events: string;
    reports: string;
    mezmur: string;
    teachings: string;
    gallery: string;
    about: string;
    contact: string;
    admin: string;
    more: string;
  };
  home: {
    urgentNotice: string;
    welcomeHeading: string;
    welcomeText: string;
    viewScheduleCta: string;
    quickServices: string;
    shortcuts: string;
    featuredAnnouncements: string;
    upcomingEvents: string;
    viewAll: string;
    readMore: string;
    hubBadge: string;
  };
  admin: {
    portalTitle: string;
    consoleSubtitle: string;
    welcomeGreeting: string;
    onlineStatus: string;
    secureStatus: string;
    announcementsCount: string;
    eventsCount: string;
    reportsCount: string;
    newAnnouncement: string;
    newEvent: string;
    newReport: string;
    quickActions: string;
    recentActivities: string;
    logout: string;
  };
  common: {
    loading: string;
    error: string;
    empty: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    search: string;
    category: string;
    published: string;
    draft: string;
    ethiopianCalendar: string;
    gregorianCalendar: string;
  };
}

export const translations: Record<Locale, TranslationDictionary> = {
  en: {
    appName: 'Abune Media',
    subTitle: 'Sunday School Platform',
    tagline: 'Ethiopian Orthodox Tewahedo Church Spiritual & Educational Portal',
    nav: {
      home: 'Home',
      schedule: 'Schedule',
      announcements: 'Announcements',
      events: 'Events',
      reports: 'Reports',
      mezmur: 'Mezmur',
      teachings: 'Teachings',
      gallery: 'Gallery',
      about: 'About Us',
      contact: 'Contact',
      admin: 'Admin Portal',
      more: 'More',
    },
    home: {
      urgentNotice: 'URGENT NOTICE',
      welcomeHeading: 'Welcome to Abune Media',
      welcomeText:
        'Official Sunday School platform for Ethiopian Orthodox Tewahedo teachings, liturgy, and spiritual curriculum.',
      viewScheduleCta: 'View Full Schedule',
      quickServices: 'Quick Services',
      shortcuts: 'Shortcuts',
      featuredAnnouncements: 'Featured Announcements',
      upcomingEvents: 'Upcoming Events & Liturgies',
      viewAll: 'View All',
      readMore: 'Read More',
      hubBadge: 'Spiritual Hub',
    },
    admin: {
      portalTitle: 'Admin Portal',
      consoleSubtitle: 'Abune Media • Executive Console',
      welcomeGreeting: 'Welcome back, Administrator 👋',
      onlineStatus: 'Online · Active',
      secureStatus: 'Secured Session',
      announcementsCount: 'Announcements',
      eventsCount: 'Events & Feasts',
      reportsCount: 'Reports & Logs',
      newAnnouncement: 'New Announcement',
      newEvent: 'New Event',
      newReport: 'Upload Report',
      quickActions: 'Quick Actions',
      recentActivities: 'Recent Church Content',
      logout: 'Log Out',
    },
    common: {
      loading: 'Loading content...',
      error: 'An error occurred. Please try again.',
      empty: 'No items found at this time.',
      save: 'Save Changes',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search...',
      category: 'Category',
      published: 'Published',
      draft: 'Draft',
      ethiopianCalendar: 'Ethiopian Calendar',
      gregorianCalendar: 'Gregorian Calendar',
    },
  },
  am: {
    appName: 'አቡነ ሚዲያ',
    subTitle: 'ሰንበት ትምህርት ቤት · መድረክ',
    tagline: 'የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ እምነት፣ ሥርዓትና ትውፊት ማስተማሪያ ይፋዊ የሰንበት ትምህርት ቤት መድረክ',
    nav: {
      home: 'ዋና ገጽ',
      schedule: 'መርሐ ግብር',
      announcements: 'ማስታወቂያዎች',
      events: 'ሁነቶች',
      reports: 'ሪፖርቶች',
      mezmur: 'መዝሙር',
      teachings: 'ትምህርት',
      gallery: 'ማኅደር',
      about: 'ስለ እኛ',
      contact: 'አድራሻ',
      admin: 'አስተዳዳሪ ገጽ',
      more: 'ተጨማሪ',
    },
    home: {
      urgentNotice: 'አስቸኳይ',
      welcomeHeading: 'እንኳን ወደ አቡነ ሚዲያ በደህና መጡ',
      welcomeText: 'የኦርቶዶክስ ተዋሕዶ እምነት፣ ሥርዓትና ትውፊት ማስተማሪያ ይፋዊ የሰንበት ትምህርት ቤት መድረክ።',
      viewScheduleCta: 'መርሐ ግብር ይመልከቱ',
      quickServices: 'ፈጣን አገልግሎቶች',
      shortcuts: 'አቋራጮች',
      featuredAnnouncements: 'ዋና ዋና ማስታወቂያዎች',
      upcomingEvents: 'የሚመጡ ሁነቶችና በዓላት',
      viewAll: 'ሁሉንም ይመልከቱ',
      readMore: 'ሙሉውን ያንብቡ',
      hubBadge: 'መንፈሳዊ መድረክ',
    },
    admin: {
      portalTitle: 'የአስተዳዳሪ ፖርታል',
      consoleSubtitle: 'አቡነ ሚዲያ • Executive Console',
      welcomeGreeting: 'ሰላም፣ አስተዳዳሪ 👋',
      onlineStatus: 'Online · ዝግጁ',
      secureStatus: 'ደህንነቱ የተጠበቀ',
      announcementsCount: 'ማስታወቂያዎች',
      eventsCount: 'መርሐ ግብራት',
      reportsCount: 'ሪፖርቶች',
      newAnnouncement: 'አዲስ ማስታወቂያ',
      newEvent: 'አዲስ ሁነት',
      newReport: 'ሪፖርት ጫን',
      quickActions: 'ፈጣን ተግባራት',
      recentActivities: 'የቅርብ ጊዜ እንቅስቃሴዎች',
      logout: 'ውጣ',
    },
    common: {
      loading: 'በመጫን ላይ ነው...',
      error: 'ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።',
      empty: 'ምንም መረጃ አልተገኘም።',
      save: 'መዝግብ',
      cancel: 'ሰርዝ',
      delete: 'አጥፋ',
      edit: 'አስተካክል',
      search: 'ፈልግ...',
      category: 'ምድብ',
      published: 'የተለቀቀ',
      draft: 'ረቂቅ',
      ethiopianCalendar: 'የኢትዮጵያ ዘመን አቆጣጠር',
      gregorianCalendar: 'የፈረንጆች ዘመን አቆጣጠር',
    },
  },
};
