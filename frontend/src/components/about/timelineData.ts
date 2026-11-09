/**
 * timelineData.ts   →  src/components/about/timelineData.ts
 *
 * Single source for the milestones. Used by:
 *   - JourneyTimeline.tsx  (short summary on the About page)
 *   - TimelineDetail.tsx   (full page at /about/timeline)
 *
 * To fill in a year:
 *   1. put its photo in  public/images/timeline/  (file names below)
 *   2. replace the placeholder strings in `detailEn` / `detailAm` with the real story
 *      (one string = one paragraph, add as many as you like)
 */

export interface Milestone {
    year: string;
    icon: string;
    tEn: string;
    tAm: string;
    en: string; // short summary (also the lead paragraph on the detail page)
    am: string;
    image: string; // file in /public
    detailEn: string[];
    detailAm: string[];
  }
  
  export const MILESTONES: Milestone[] = [
    {
      year: '1998', icon: 'church', tEn: 'The Beginning', tAm: 'ጅማሬ',
      en: 'The initiative began with a vision to use technology for the Church’s teachings.',
      am: 'የቤተክርስቲያኗን መንፈሳዊ ትምህርቶች በዘመናዊ ቴክኖሎጂ ለማዳረስ የመጀመሪያው ራዕይ ተጠነሰሰ።',
      image: '/images/timeline/1998.jpg',
      detailEn: ['Add the full story of 1998 here: who started it, where, and what the first steps were.'],
      detailAm: ['የ1998 ሙሉ ታሪክ እዚህ ይጨምሩ፤ ማን እንደጀመረው፣ የት እንደሆነና የመጀመሪያ እርምጃዎቹ ምን እንደነበሩ።'],
    },
    {
      year: '2005', icon: 'laptop', tEn: 'Digital Platform', tAm: 'ዲጂታል መድረክ',
      en: 'Abune Media was officially established as a digital platform for the Ethiopian Orthodox Community.',
      am: 'አቡነ ሚዲያ ለኢትዮጵያ ኦርቶዶክስ ምዕመናን ማኅበረሰብ ይፋዊ ዲጂታል መድረክ ሆኖ ተመሠረተ።',
      image: '/images/timeline/2005.jpg',
      detailEn: ['Add the full story of 2005 here: how the platform was established and what it offered.'],
      detailAm: ['የ2005 ሙሉ ታሪክ እዚህ ይጨምሩ፤ መድረኩ እንዴት እንደተመሠረተና ምን እንደሚያቀርብ።'],
    },
    {
      year: '2012', icon: 'book', tEn: 'Content Expansion', tAm: 'የይዘት መስፋፋት',
      en: 'We expanded our content to include Mezmur, Teachings, and cultural heritage.',
      am: 'አገልግሎታችንን በማስፋት መዝሙራትን፣ የስብከት ትምህርቶችንና ቅርሶችን ማካተት ተጀመረ።',
      image: '/images/timeline/2012.jpg',
      detailEn: ['Add the full story of 2012 here: the new content, who contributed, and what changed.'],
      detailAm: ['የ2012 ሙሉ ታሪክ እዚህ ይጨምሩ፤ አዳዲስ ይዘቶች፣ አስተዋጽኦ ያደረጉና ምን እንደተለወጠ።'],
    },
    {
      year: '2020', icon: 'mobile', tEn: 'Modern Platform', tAm: 'ዘመናዊ መድረክ',
      en: 'Launched our modern website and mobile platform to reach more people worldwide.',
      am: 'በዓለም ዙሪያ የሚገኙ ምዕመናንን በቀላሉ ለመድረስ ዘመናዊና ለተንቀሳቃሽ ስልክ ተስማሚ መድረክ ተዘረጋ።',
      image: '/images/timeline/2020.jpg',
      detailEn: ['Add the full story of 2020 here: the new website, the mobile experience, and who it reached.'],
      detailAm: ['የ2020 ሙሉ ታሪክ እዚህ ይጨምሩ፤ አዲሱ ድረ ገጽ፣ የሞባይል አገልግሎትና የደረሰባቸው ሰዎች።'],
    },
    {
      year: '2024', icon: 'team', tEn: 'Growing Together', tAm: 'በአንድነት ማደግ',
      en: 'Today, we serve a global community with new programs, events, and resources.',
      am: 'ዛሬ በአዳዲስ ፕሮግራሞች፣ ዝግጅቶችና ግብዓቶች ዓለም አቀፍ ማኅበረሰብን እናገለግላለን።',
      image: '/images/timeline/2024.jpg',
      detailEn: ['Add the full story of 2024 here: current programs, events, and what comes next.'],
      detailAm: ['የ2024 ሙሉ ታሪክ እዚህ ይጨምሩ፤ ወቅታዊ ፕሮግራሞች፣ ዝግጅቶችና የሚቀጥለው ምን እንደሆነ።'],
    },
  ];