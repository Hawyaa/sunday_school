/**
 * mezmurData.ts — sample data + category list for the Mezmur page.
 * Swap MEZMUR_ITEMS / SPOTLIGHT for your real data source when ready.
 */

export type MezmurIconKey = 'music' | 'users' | 'star' | 'building' | 'pray';

export interface MezmurCategory {
  key: string;
  en: string;
  am: string;
  icon?: MezmurIconKey | string;
}

export const INITIAL_MEZMUR_CATEGORIES: MezmurCategory[] = [
  { key: 'hymns', en: 'Ethiopian Orthodox Hymns', am: 'የኢትዮጵያ ኦርቶዶክስ መዝሙራት', icon: 'music' },
  { key: 'sundayschool', en: 'Sunday School Songs', am: 'የሰንበት ት/ቤት መዝሙራት', icon: 'users' },
  { key: 'choir', en: 'Choir Songs', am: 'የመዘምራን መዝሙራት', icon: 'music' },
  { key: 'special', en: 'Special Occasions', am: 'ልዩ በዓላት', icon: 'star' },
  { key: 'traditional', en: 'Traditional Mezmur', am: 'ባህላዊ መዝሙር', icon: 'building' },
  { key: 'fasting', en: 'Fast & Prayer', am: 'ጾምና ጸሎት', icon: 'pray' },
];

export const CATEGORIES = INITIAL_MEZMUR_CATEGORIES;

export interface MezmurItem {
  id: string;
  title: string; // Ge'ez / Amharic
  titleEn: string;
  category: string; // CATEGORIES key
  addedAt: string; // ISO date, used for Latest / Oldest sorting
  lyrics: string[];
  audioUrl?: string;
  audioName?: string;
}

export const MEZMUR_ITEMS: MezmurItem[] = [
  {
    id: '1',
    title: 'አቡነ ዘበሰማያት',
    titleEn: 'Our Father',
    category: 'hymns',
    addedAt: '2025-04-01',
    audioUrl: 'https://cdn.freesound.org/previews/612/612089_11861866-lq.mp3',
    audioName: 'Abune_Zebesemayat_Hymn.mp3',
    lyrics: [
      'አቡነ ዘበሰማያት፡ ይትቀደስ ስምከ።',
      'ትምጻእ መንግሥትከ። ወይኩን ፈቃድከ',
      'በሰማይ መሬትኒ። ሲዖል አትረፍርፍ...',
      'ሲዖል አትረፍርፍ ወአድኅነን ከመ ጽድቅነ።',
      'አሜን።',
    ],
  },
  {
    id: '2',
    title: 'ቅዱስ እግዚአብሔር',
    titleEn: 'Holy God',
    category: 'hymns',
    addedAt: '2025-03-01',
    audioUrl: 'https://cdn.freesound.org/previews/612/612089_11861866-lq.mp3',
    audioName: 'Kedus_Egziabher.mp3',
    lyrics: ['ቅዱስ እግዚአብሔር ቅዱስ ኃያል', 'ቅዱስ ሕያው ዘኢይመውት', 'ዘተወልደ እምቅድስት ድንግል...'],
  },
  {
    id: '3',
    title: 'ሰላም ለኪ ማርያም',
    titleEn: 'Hail Mary',
    category: 'choir',
    addedAt: '2025-02-01',
    lyrics: ['ሰላም ለኪ ማርያም እግዚአብሔር ምስሌኪ።', 'ቡርክት አንቲ እምአንስት', 'ወቡሩክ ፍሬ ከርሥኪ...'],
  },
  {
    id: '4',
    title: 'እግዚአብሔር ይመስገን',
    titleEn: 'God Be Praised',
    category: 'sundayschool',
    addedAt: '2025-01-01',
    lyrics: ['እግዚአብሔር ይመስገን በሰማያት', 'መንግሥቱ ኑላዊ ናሁ ለአለም', 'አዘምር ወእሰብክ ስምከ...'],
  },
  {
    id: '5',
    title: 'ንዒ ሠርግ ንዒ',
    titleEn: 'Come to the Wedding',
    category: 'choir',
    addedAt: '2024-12-01',
    lyrics: ['ንዒ ሠርግ ንዒ እም መርዓዊኪ', 'ክርስቶስ ማኅደረ መለኮት', 'ንዒ ኃቤነ ንዒ በሰላም...'],
  },
];

export const SPOTLIGHT = {
  image: 'https://i.pinimg.com/736x/b6/a3/d4/b6a3d41bc93303fa3d5f6dbdfc4bcb1e.jpg',
  title: 'St. Gabriel Sunday School Choir',
  titleAm: 'የቅዱስ ገብርኤል ሰ/ት/ቤት መዘምራን',
  artist: 'Ephrem Alemu',
  artistAm: 'ዘማሪ ኤፍሬም አለሙ',
};
