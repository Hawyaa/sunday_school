'use client';

/**
 * lib/contentStore.ts
 * Unified local & persistent data store for all Sunday School content.
 * Synchronizes Admin changes with public pages (Reports, Mezmur, Gallery, Announcements, Events).
 */

import { ChurchReport } from '@/types/report';
import { MezmurItem } from '@/components/mezmur/mezmurData';

// --- REPORTS SEED DATA ---
export const INITIAL_REPORTS: ChurchReport[] = [
  {
    id: '1',
    title: 'Clergy Service Report',
    titleAm: 'የካህናትና አገልጋዮች የሥራ ሪፖርት',
    category: 'Administrative',
    dateStr: 'April 2025',
    description: 'Administrative and clergy service summary report.',
    descriptionAm: 'የአስተዳደራዊና የካህናት አገልግሎት አጠቃላይ የሥራ አፈጻጸም ሪፖርት።',
    fileSize: '2.4 MB',
    fileUrl: '#',
    isRestricted: false,
  },
  {
    id: '2',
    title: 'Education Department Activity Report',
    titleAm: 'የትምህርት ክፍል የሥራ አፈጻጸም ሪፖርት',
    category: 'Administrative',
    dateStr: 'Megabit 2025',
    description: 'Educational and student activity performance report.',
    descriptionAm: 'የትምህርትና የተማሪዎች እንቅስቃሴ የሥራ አፈጻጸም ሪፖርት።',
    fileSize: '1.8 MB',
    fileUrl: '#',
    isRestricted: false,
  },
  {
    id: '3',
    title: 'Choirs Service Performance Report',
    titleAm: 'የመዘምራን አገልግሎት አፈጻጸም ሪፖርት',
    category: 'Administrative',
    dateStr: 'Yekatit 2025',
    description: 'Sacred music and choir group ministry performance report.',
    descriptionAm: 'የያሬዳዊ ዜማና የመዘምራን ክፍል አገልግሎት አፈጻጸም ሪፖርት።',
    fileSize: '3.1 MB',
    fileUrl: '#',
    isRestricted: false,
  },
  {
    id: '4',
    title: 'Audit Financial Report',
    titleAm: 'የኦዲትና የሒሳብ ምርመራ ሪፖርት',
    category: 'Financial',
    dateStr: 'Tahsas 2024',
    description: 'Administrative and financial audit document summary.',
    descriptionAm: 'አጠቃላይ የሒሳብና የኦዲት ምርመራ ሰነድ ማጠቃለያ።',
    fileSize: '2.7 MB',
    fileUrl: '#',
    isRestricted: false,
  },
  {
    id: '5',
    title: 'Financial Management Report',
    titleAm: 'የበጀትና የፋይናንስ አስተዳደር ሪፖርት',
    category: 'Financial',
    dateStr: '2025',
    description: 'This report is restricted to authorized members only.',
    descriptionAm: 'ይህ ሪፖርት ለተፈቀደላቸው አባላት ብቻ ክፍት ነው።',
    fileSize: '1.2 MB',
    fileUrl: '',
    isRestricted: true,
  },
];

// --- MEZMUR SEED DATA ---
export const INITIAL_MEZMURS: MezmurItem[] = [
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
    lyrics: [
      'ቅዱስ እግዚአብሔር ቅዱስ ኃያል',
      'ቅዱስ ሕያው ዘኢይመውት',
      'ዘተወልደ እምቅድስት ድንግል ማርያም...',
    ],
  },
  {
    id: '3',
    title: 'ሰላም ለኪ ማርያም',
    titleEn: 'Hail Mary',
    category: 'choir',
    addedAt: '2025-02-01',
    lyrics: [
      'ሰላም ለኪ ማርያም እግዚአብሔር ምስሌኪ።',
      'ቡርክት አንቲ እምአንስት',
      'ወቡሩክ ፍሬ ከርሥኪ...',
    ],
  },
  {
    id: '4',
    title: 'እግዚአብሔር ይመስገን',
    titleEn: 'God Be Praised',
    category: 'sundayschool',
    addedAt: '2025-01-01',
    lyrics: [
      'እግዚአብሔር ይመስገን በሰማያት',
      'መንግሥቱ ኑላዊ ናሁ ለአለም',
      'አዘምር ወእሰብክ ስምከ...',
    ],
  },
  {
    id: '5',
    title: 'ንዒ ሠርግ ንዒ',
    titleEn: 'Come to the Wedding',
    category: 'choir',
    addedAt: '2024-12-01',
    lyrics: [
      'ንዒ ሠርግ ንዒ እም መርዓዊኪ',
      'ክርስቶስ ማኅደረ መለኮት',
      'ንዒ ኃቤነ ንዒ በሰላም...',
    ],
  },
];

// --- GALLERY MOSAIC SEED DATA ---
export interface GalleryMosaicItem {
  id: string;
  slot: number; // 1 to 7
  src: string;
  alt: string;
  titleEn: string;
  titleAm: string;
  category: string;
  date?: string;
}

export const INITIAL_GALLERY_MOSAIC: GalleryMosaicItem[] = [
  {
    id: 'mosaic-1',
    slot: 1,
    src: 'https://i.pinimg.com/736x/3a/93/40/3a93404041ca22b153f4392a3d758541.jpg',
    alt: 'Holy Scripture and Cross',
    titleEn: 'Holy Scripture & Cross',
    titleAm: 'ቅዱስ መጽሐፍና መስቀል',
    category: 'Liturgy',
    date: '2025-04-10',
  },
  {
    id: 'mosaic-2',
    slot: 2,
    src: 'https://i.pinimg.com/474x/dd/8a/ac/dd8aacb498e705f0a0f5ed84adec2714.jpg',
    alt: 'Church Dome Sunset',
    titleEn: 'Church Dome at Sunset',
    titleAm: 'የቤተክርስቲያን ጉልላት ጀምበር ስትጠልቅ',
    category: 'Architecture',
    date: '2025-04-05',
  },
  {
    id: 'mosaic-3',
    slot: 3,
    src: 'https://i.pinimg.com/474x/01/07/1a/01071ab849ad7fa0f5d7f99da080ef72.jpg',
    alt: 'Church Interior Service',
    titleEn: 'Church Interior Liturgical Service',
    titleAm: 'የውስጠ መቅደስ ቅዳሴ አገልግሎት',
    category: 'Liturgy',
    date: '2025-03-25',
  },
  {
    id: 'mosaic-4',
    slot: 4,
    src: 'https://i.pinimg.com/736x/3a/93/40/3a93404041ca22b153f4392a3d758541.jpg',
    alt: 'Clergy Service',
    titleEn: 'Clergy & Deacon Fellowship',
    titleAm: 'የካህናትና ዲያቆናት አገልግሎት',
    category: 'Clergy',
    date: '2025-03-15',
  },
  {
    id: 'mosaic-5',
    slot: 5,
    src: 'https://i.pinimg.com/474x/01/07/1a/01071ab849ad7fa0f5d7f99da080ef72.jpg',
    alt: 'Orthodox Church Architecture',
    titleEn: 'Orthodox Church Architecture',
    titleAm: 'ጥንታዊ የኦርቶዶክስ ሕንፃ ጥበብ',
    category: 'Architecture',
    date: '2025-03-01',
  },
  {
    id: 'mosaic-6',
    slot: 6,
    src: 'https://i.pinimg.com/474x/dd/8a/ac/dd8aacb498e705f0a0f5ed84adec2714.jpg',
    alt: 'Audio Microphone Studio',
    titleEn: 'Audio Recording & Studio Mezmur',
    titleAm: 'የስቱዲዮ መዝሙር ዝግጅት',
    category: 'Choir',
    date: '2025-02-18',
  },
  {
    id: 'mosaic-7',
    slot: 7,
    src: 'https://i.pinimg.com/474x/01/07/1a/01071ab849ad7fa0f5d7f99da080ef72.jpg',
    alt: 'Church Exterior',
    titleEn: 'Parish Exterior & Congregation',
    titleAm: 'የቅጥር ግቢና የምእመናን ሕብረት',
    category: 'Parish Life',
    date: '2025-02-05',
  },
];

export interface FeaturedAlbumData {
  titleEn: string;
  titleAm: string;
  dateStr: string;
  coverSrc: string;
  thumbnails: string[];
}

export const INITIAL_FEATURED_ALBUM: FeaturedAlbumData = {
  titleEn: 'Saint Gabriel Church Event Album',
  titleAm: 'የቅዱስ ገብርኤል በዓል ፎቶ አልበም',
  dateStr: 'Ter 19, 2011',
  coverSrc: 'https://i.pinimg.com/736x/3a/93/40/3a93404041ca22b153f4392a3d758541.jpg',
  thumbnails: [
    'https://i.pinimg.com/474x/dd/8a/ac/dd8aacb498e705f0a0f5ed84adec2714.jpg',
    'https://i.pinimg.com/474x/01/07/1a/01071ab849ad7fa0f5d7f99da080ef72.jpg',
    'https://i.pinimg.com/736x/3a/93/40/3a93404041ca22b153f4392a3d758541.jpg',
    'https://i.pinimg.com/474x/25/f2/cf/25f2cf69f3228dff18d2e3b0105baeac.jpg',
  ],
};

// --- ANNOUNCEMENTS SEED DATA ---
export interface AnnouncementItem {
  id: string;
  title: string;
  titleAm?: string;
  summary: string;
  content: string;
  category: 'Parish Notices' | 'Sunday School' | 'Urgent Calls' | 'Feasts & Holidays';
  categoryAm?: string;
  priority: 'Urgent' | 'Notice' | 'Important' | 'General';
  dateStr: string;
  author: string;
  imageUrl?: string;
  isPinned: boolean;
  publishedAt: string;
}

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Timkat (Epiphany) Celebration Preparation Committee Meeting',
    titleAm: 'የዘንድሮው የጥምቀት በዓል አከባበር ዝግጅት ኮሚቴ ስብሰባ',
    summary: 'All Sunday School members and youth coordinators are requested to attend the general preparation meeting.',
    content: 'በመጪው ጥር 11 ቀን የሚከበረውን የጥምቀት በዓል በድምቀት ለማክበር የተዘጋጀው ዓመታዊ ዝግጅት ኮሚቴ እሁድ ከቀኑ 8:00 ጀምሮ በዋናው አዳራሽ ስብሰባ ያካሂዳል። አባላት ሁሉ በሰዓቱ እንድትገኙ እናሳስባለን።',
    category: 'Feasts & Holidays',
    categoryAm: 'የበዓላት ማስታወቂያ',
    priority: 'Urgent',
    dateStr: 'Oct 24, 2026',
    author: 'Executive Committee',
    imageUrl: 'https://i.pinimg.com/474x/53/d4/74/53d474d703be2c6a18c5e0e4af555787.jpg',
    isPinned: true,
    publishedAt: '2026-10-24T08:00:00.000Z',
  },
  {
    id: 'ann-2',
    title: 'Sunday School New Student Registration for 2017 E.C.',
    titleAm: 'ለ2017 ዓ.ም አዳዲስ የሰንበት ትምህርት ቤት ተማሪዎች ምዝገባ ጥሪ',
    summary: 'Spiritual and liturgical classes enrollment is now open for children and youth aged 6 and above.',
    content: 'የሰንበት ትምህርት ቤት የ2017 ዓ.ም አዲስ የትምህርት ዘመን ምዝገባ ተጀምሯል። መሠረተ እምነት፣ ሥርዓተ ቤተክርስቲያን፣ ያሬዳዊ ዜማና የቅዱሳት መጻሕፍት ጥናት ይካተታል።',
    category: 'Sunday School',
    categoryAm: 'የሰንበት ት/ቤት',
    priority: 'Important',
    dateStr: 'Oct 20, 2026',
    author: 'Education Department',
    imageUrl: 'https://i.pinimg.com/474x/25/f2/cf/25f2cf69f3228dff18d2e3b0105baeac.jpg',
    isPinned: false,
    publishedAt: '2026-10-20T08:00:00.000Z',
  },
  {
    id: 'ann-3',
    title: 'Saint Michael Annual Feast Eve Liturgical Schedule',
    titleAm: 'የቅዱስ ሚካኤል ዓመታዊ ንግሥ በዓል ዋዜማ ማኅሌት መርሐግብር',
    summary: 'Full night Mahlet chanting begins at 7:00 PM followed by Divine Liturgy in the morning.',
    content: 'የኅዳር 12 ቅዱስ ሚካኤል ንግሥ በዓል ዋዜማ ማኅሌተ ያሬድ ከምሽቱ 1:00 ጀምሮ ይካሄዳል። ምእመናን በሙሉ በበረከቱ ተሳታፊ እንድትሆኑ ተጠርታችኋል።',
    category: 'Feasts & Holidays',
    categoryAm: 'የበዓላት ማስታወቂያ',
    priority: 'Notice',
    dateStr: 'Oct 15, 2026',
    author: 'Liturgical Council',
    imageUrl: 'https://i.pinimg.com/474x/81/66/27/8166271ae8dd673a2b909b87fb5045a2.jpg',
    isPinned: false,
    publishedAt: '2026-10-15T08:00:00.000Z',
  },
  {
    id: 'ann-4',
    title: 'Parish Charity & Benevolence Support Program',
    titleAm: 'የማኅበራዊ አገልግሎትና የበጎ አድራጎት ድጋፍ ጥሪ',
    summary: 'Contributions and volunteer registration for elderly care and youth winter assistance.',
    content: 'ለተቸገሩ ወገኖች የሚሰጠው የበጎ አድራጎት ድጋፍ የተጀመረ ሲሆን፣ የገንዘብና የአልባሳት ድጋፍ ማድረግ ለምትፈልጉ በቢሮ ቁጥር 3 በኩል ማስረከብ ትችላላችሁ።',
    category: 'Parish Notices',
    categoryAm: 'ጠቅላላ ማስታወቂያ',
    priority: 'General',
    dateStr: 'Oct 10, 2026',
    author: 'Charity Committee',
    isPinned: false,
    publishedAt: '2026-10-10T08:00:00.000Z',
  },
];

// --- EVENTS SEED DATA ---
export interface StoredEventItem {
  id: number | string;
  title: string;
  cat: string;
  icon: 'cross' | 'users' | 'book' | 'heart' | 'church' | 'star';
  date: string;
  place: string;
  time: string;
  img: string;
  description: string;
}

export const INITIAL_EVENTS: StoredEventItem[] = [
  {
    id: 1,
    title: 'Timket Feast Celebration',
    cat: 'Feast Celebration',
    icon: 'cross',
    date: '2025-01-19',
    place: 'Holy Trinity Church, Addis Ababa',
    time: '10:00 AM – 04:00 PM',
    img: 'https://i.pinimg.com/474x/53/d4/74/53d474d703be2c6a18c5e0e4af555787.jpg',
    description:
      'The annual Epiphany (Timket) celebration commemorates the baptism of Jesus in the Jordan River with traditional processions, chanting, and ceremonial blessings.',
  },
  {
    id: 2,
    title: 'Youth Fellowship Gathering',
    cat: 'Church Program',
    icon: 'users',
    date: '2025-02-15',
    place: 'St. Gabriel Church Hall',
    time: '02:00 PM – 05:00 PM',
    img: 'https://i.pinimg.com/474x/25/f2/cf/25f2cf69f3228dff18d2e3b0105baeac.jpg',
    description:
      'Empowering young orthodox believers through scripture study, fellowship discussions, and community volunteer planning.',
  },
  {
    id: 3,
    title: 'Spiritual Growth Seminar',
    cat: 'Teaching',
    icon: 'book',
    date: '2025-03-08',
    place: 'Abune Media Center',
    time: '09:00 AM – 12:00 PM',
    img: 'https://i.pinimg.com/474x/81/66/27/8166271ae8dd673a2b909b87fb5045a2.jpg',
    description:
      'An educational workshop taught by clergy scholars on Ethiopian Orthodox Church history, theology, and saintly lives.',
  },
  {
    id: 4,
    title: 'Charity & Support Program',
    cat: 'Community Service',
    icon: 'heart',
    date: '2025-03-22',
    place: 'Kirkos Sub-City',
    time: '08:00 AM – 02:00 PM',
    img: 'https://i.pinimg.com/474x/53/d4/74/53d474d703be2c6a18c5e0e4af555787.jpg',
    description:
      'Spreading Christ’s love by distributing food baskets, clothing, and spiritual books to underprivileged families.',
  },
  {
    id: 5,
    title: 'Church Renovation Fundraising',
    cat: 'Church Building',
    icon: 'church',
    date: '2025-04-05',
    place: 'St. Gabriel Church',
    time: '10:00 AM – 04:00 PM',
    img: 'https://i.pinimg.com/474x/25/f2/cf/25f2cf69f3228dff18d2e3b0105baeac.jpg',
    description:
      'A community initiative to preserve our sacred church architecture, icon murals, and Sunday School facilities.',
  },
  {
    id: 6,
    title: 'Easter Choir Concert',
    cat: 'Special Event',
    icon: 'star',
    date: '2025-04-12',
    place: 'Main Church Hall',
    time: '06:00 PM – 09:00 PM',
    img: 'https://i.pinimg.com/474x/81/66/27/8166271ae8dd673a2b909b87fb5045a2.jpg',
    description:
      'An evening of majestic choral chants, begena hymns, and celebration of the Holy Resurrection (Fasika).',
  },
  {
    id: 7,
    title: 'Sunday School Annual Day',
    cat: 'Church Program',
    icon: 'users',
    date: '2025-05-10',
    place: 'St. Gabriel Church Hall',
    time: '09:00 AM – 01:00 PM',
    img: 'https://i.pinimg.com/474x/53/d4/74/53d474d703be2c6a18c5e0e4af555787.jpg',
    description:
      'Annual celebration highlighting student achievements, biblical drama, traditional hymns, and certificate awards.',
  },
  {
    id: 8,
    title: 'Mezmur Evening',
    cat: 'Special Event',
    icon: 'star',
    date: '2025-05-24',
    place: 'Main Church Hall',
    time: '05:00 PM – 08:00 PM',
    img: 'https://i.pinimg.com/474x/25/f2/cf/25f2cf69f3228dff18d2e3b0105baeac.jpg',
    description:
      'A soulful worship night filled with classic Ethiopian Orthodox spiritual hymns and choir ensemble performances.',
  },
  {
    id: 9,
    title: 'Bible Study Series',
    cat: 'Teaching',
    icon: 'book',
    date: '2025-06-07',
    place: 'Abune Media Center',
    time: '02:00 PM – 04:00 PM',
    img: 'https://i.pinimg.com/474x/81/66/27/8166271ae8dd673a2b909b87fb5045a2.jpg',
    description:
      'In-depth study of the Holy Scriptures guided by experienced clergy and theological teachers.',
  },
  {
    id: 10,
    title: 'Food Donation Drive',
    cat: 'Community Service',
    icon: 'heart',
    date: '2025-06-21',
    place: 'Kirkos Sub-City',
    time: '08:00 AM – 12:00 PM',
    img: 'https://i.pinimg.com/474x/53/d4/74/53d474d703be2c6a18c5e0e4af555787.jpg',
    description:
      'Community outreach providing staple meals, grain, and assistance to our elders and vulnerable neighbors.',
  },
  {
    id: 11,
    title: 'Meskel Feast Celebration',
    cat: 'Feast Celebration',
    icon: 'cross',
    date: '2025-09-27',
    place: 'Meskel Square, Addis Ababa',
    time: '02:00 PM – 07:00 PM',
    img: 'https://i.pinimg.com/474x/81/66/27/8166271ae8dd673a2b909b87fb5045a2.jpg',
    description:
      'Celebration of the Finding of the True Cross with the Demera bonfire, ceremonial vestments, and spiritual songs.',
  },
];

// Helper to broadcast storage changes
function notifyStoreUpdate(key: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('abune_content_store_updated', { detail: { key } }));
  }
}

// Reports
export function getStoredReports(): ChurchReport[] {
  if (typeof window === 'undefined') return INITIAL_REPORTS;
  try {
    const raw = localStorage.getItem('abune_admin_reports');
    if (!raw) return INITIAL_REPORTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REPORTS;
  } catch (e) {
    return INITIAL_REPORTS;
  }
}

export function saveStoredReports(reports: ChurchReport[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('abune_admin_reports', JSON.stringify(reports));
  notifyStoreUpdate('reports');
}

// Mezmur
export function getStoredMezmurs(): MezmurItem[] {
  if (typeof window === 'undefined') return INITIAL_MEZMURS;
  try {
    const raw = localStorage.getItem('abune_admin_mezmurs');
    if (!raw) return INITIAL_MEZMURS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MEZMURS;
  } catch (e) {
    return INITIAL_MEZMURS;
  }
}

export function saveStoredMezmurs(mezmurs: MezmurItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('abune_admin_mezmurs', JSON.stringify(mezmurs));
  notifyStoreUpdate('mezmur');
}

// Gallery Mosaic
export function getStoredGalleryMosaic(): GalleryMosaicItem[] {
  if (typeof window === 'undefined') return INITIAL_GALLERY_MOSAIC;
  try {
    const raw = localStorage.getItem('abune_admin_gallery_mosaic');
    if (!raw) return INITIAL_GALLERY_MOSAIC;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_GALLERY_MOSAIC;
  } catch (e) {
    return INITIAL_GALLERY_MOSAIC;
  }
}

export function saveStoredGalleryMosaic(items: GalleryMosaicItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('abune_admin_gallery_mosaic', JSON.stringify(items));
  notifyStoreUpdate('gallery_mosaic');
}

// Featured Album
export function getStoredFeaturedAlbum(): FeaturedAlbumData {
  if (typeof window === 'undefined') return INITIAL_FEATURED_ALBUM;
  try {
    const raw = localStorage.getItem('abune_admin_featured_album');
    if (!raw) return INITIAL_FEATURED_ALBUM;
    const parsed = JSON.parse(raw);
    return parsed && parsed.titleEn ? parsed : INITIAL_FEATURED_ALBUM;
  } catch (e) {
    return INITIAL_FEATURED_ALBUM;
  }
}

export function saveStoredFeaturedAlbum(album: FeaturedAlbumData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('abune_admin_featured_album', JSON.stringify(album));
  notifyStoreUpdate('featured_album');
}

// Announcements
export function getStoredAnnouncements(): AnnouncementItem[] {
  if (typeof window === 'undefined') return INITIAL_ANNOUNCEMENTS;
  try {
    const raw = localStorage.getItem('abune_admin_announcements');
    if (!raw) return INITIAL_ANNOUNCEMENTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ANNOUNCEMENTS;
  } catch (e) {
    return INITIAL_ANNOUNCEMENTS;
  }
}

export function saveStoredAnnouncements(items: AnnouncementItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('abune_admin_announcements', JSON.stringify(items));
  notifyStoreUpdate('announcements');
}

// Events
export function getStoredEvents(): StoredEventItem[] {
  if (typeof window === 'undefined') return INITIAL_EVENTS;
  try {
    const raw = localStorage.getItem('abune_admin_events');
    if (!raw) return INITIAL_EVENTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_EVENTS;
  } catch (e) {
    return INITIAL_EVENTS;
  }
}

export function saveStoredEvents(items: StoredEventItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('abune_admin_events', JSON.stringify(items));
  notifyStoreUpdate('events');
}
