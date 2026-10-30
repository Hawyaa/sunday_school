import { create } from 'zustand';
import { Locale, translations, TranslationDictionary } from './i18n';

interface AppState {
  locale: Locale;
  isEthiopicCalendarFirst: boolean;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  toggleCalendarPreference: () => void;
  t: TranslationDictionary;
}

export const useAppStore = create<AppState>((set, get) => ({
  locale: 'en',
  isEthiopicCalendarFirst: true,
  t: translations['en'],
  setLocale: (locale: Locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('abune_locale', locale);
    }
    set({ locale, t: translations[locale] });
  },
  toggleLocale: () => {
    const nextLocale: Locale = get().locale === 'en' ? 'am' : 'en';
    if (typeof window !== 'undefined') {
      localStorage.setItem('abune_locale', nextLocale);
    }
    set({ locale: nextLocale, t: translations[nextLocale] });
  },
  toggleCalendarPreference: () => {
    const nextPref = !get().isEthiopicCalendarFirst;
    if (typeof window !== 'undefined') {
      localStorage.setItem('abune_eth_cal_first', String(nextPref));
    }
    set({ isEthiopicCalendarFirst: nextPref });
  },
}));
