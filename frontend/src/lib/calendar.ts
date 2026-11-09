/**
 * Ethiopian Calendar Conversion and Formatter Utilities
 * Follows the 7-8 year difference and 13-month calendar structure (12 months of 30 days + Pagume of 5 or 6 days).
 */

export const ETHIOPIC_MONTHS = [
  { am: 'መስከረም', en: 'Meskerem', index: 1 },
  { am: 'ጥቅምት', en: 'Tikimt', index: 2 },
  { am: 'ኅዳር', en: 'Hidar', index: 3 },
  { am: 'ታኅሣሥ', en: 'Tahsas', index: 4 },
  { am: 'ጥር', en: 'Tir', index: 5 },
  { am: 'የካቲት', en: 'Yekatit', index: 6 },
  { am: 'መጋቢት', en: 'Megabit', index: 7 },
  { am: 'ሚያዝያ', en: 'Miyazya', index: 8 },
  { am: 'ግንቦት', en: 'Ginbot', index: 9 },
  { am: 'ሰኔ', en: 'Sene', index: 10 },
  { am: 'ሐምሌ', en: 'Hamle', index: 11 },
  { am: 'ነሐሴ', en: 'Nehase', index: 12 },
  { am: 'ጳጉሜን', en: 'Pagume', index: 13 },
];

export const ETHIOPIC_DAYS = [
  { am: 'እሑድ', en: 'Sunday' },
  { am: 'ሰኞ', en: 'Monday' },
  { am: 'ማክሰኞ', en: 'Tuesday' },
  { am: 'ረቡዕ', en: 'Wednesday' },
  { am: 'ሐሙስ', en: 'Thursday' },
  { am: 'ዓርብ', en: 'Friday' },
  { am: 'ቅዳሜ', en: 'Saturday' },
];

/**
 * Approximate conversion from Gregorian date to Ethiopian date
 */
export function toEthiopicDate(gregorianDate: Date | string | number): {
  year: number;
  month: number;
  date: number;
  monthNameAm: string;
  monthNameEn: string;
} {
  const dateObj = new Date(gregorianDate);
  if (isNaN(dateObj.getTime())) {
    return { year: 2017, month: 1, date: 1, monthNameAm: 'መስከረም', monthNameEn: 'Meskerem' };
  }

  const grgYear = dateObj.getFullYear();
  const grgMonth = dateObj.getMonth() + 1; // 1-12
  const grgDay = dateObj.getDate();

  // Simple and precise Julian day algorithm for Ethiopian calendar
  const a = Math.floor((14 - grgMonth) / 12);
  const y = grgYear + 4800 - a;
  const m = grgMonth + 12 * a - 3;
  const jdn =
    grgDay +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const ethYear = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const ethMonth = Math.floor(n / 30) + 1;
  const ethDay = (n % 30) + 1;

  const safeMonth = Math.min(13, Math.max(1, ethMonth));
  const monthInfo = ETHIOPIC_MONTHS[safeMonth - 1];

  return {
    year: ethYear,
    month: safeMonth,
    date: ethDay,
    monthNameAm: monthInfo.am,
    monthNameEn: monthInfo.en,
  };
}

/**
 * Format date display according to language setting and calendar mode
 */
export function formatCalendarDate(
  dateValue: Date | string | number | null | undefined,
  options?: {
    isEthiopicFirst?: boolean;
    locale?: 'en' | 'am';
    includeTime?: boolean;
  }
): string {
  if (!dateValue) return '';

  const dateObj = new Date(dateValue);
  if (isNaN(dateObj.getTime())) return '';

  const isEthiopicFirst = options?.isEthiopicFirst ?? true;
  const locale = options?.locale ?? 'en';
  const eth = toEthiopicDate(dateObj);

  const ethFormatted = `${locale === 'am' ? eth.monthNameAm : eth.monthNameEn} ${eth.date}, ${eth.year} ${locale === 'am' ? 'ዓ.ም' : 'E.C.'}`;

  const grgFormatted = dateObj.toLocaleDateString(locale === 'am' ? 'am-ET' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (isEthiopicFirst) {
    return `${ethFormatted} (${grgFormatted})`;
  } else {
    return `${grgFormatted} (${ethFormatted})`;
  }
}
