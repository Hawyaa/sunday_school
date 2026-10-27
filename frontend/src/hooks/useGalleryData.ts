'use client';

/**
 * hooks/useGalleryData.ts
 */

import { useState, useMemo } from 'react';
import type { GalleryAlbum } from '@/types/gallery';

export const FALLBACK_ALBUMS: GalleryAlbum[] = [
  {
    id: '1',
    title: 'Meskel Demera Annual Feast',
    titleAm: 'የመስቀል ደመራ ዓመታዊ በዓል',
    category: 'Feasts',
    categoryAm: 'በዓላት',
    photoCount: 48,
    coverUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80',
    ],
    date: 'Meskerem 17, 2017',
    description: 'Joyful celebrations of the Finding of the True Cross with clergy and faithful gathered in praise.',
    descriptionAm: 'የተቀደሰ የመስቀል ደመራ በዓል በካህናት እና በምዕመናን ታላቅ ዝማሬና ምስጋና ሲከበር።',
  },
  {
    id: '2',
    title: 'Sunday School Annual Graduation',
    titleAm: 'የሰንበት ትምህርት ቤት ዓመታዊ ምረቃ',
    category: 'Sunday School',
    categoryAm: 'ሰንበት ትምህርት ቤት',
    photoCount: 36,
    coverUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
    ],
    date: 'Sene 25, 2016',
    description: 'Congratulating students who completed advanced courses in Dogma, Church History, and Liturgy.',
    descriptionAm: 'የነገረ መለኮት፣ የቤተክርስቲያን ታሪክና የዜማ ትምህርታቸውን ያጠናቀቁ ተማሪዎች የምረቃ ሥነ ሥርዓት።',
  },
  {
    id: '3',
    title: 'Saint Yared Choir Presentation',
    titleAm: 'የቅዱስ ያሬድ መዘምራን የዝማሬ መርሐግብር',
    category: 'Choir',
    categoryAm: 'መዘምራን',
    photoCount: 24,
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    ],
    date: 'Hidar 21, 2017',
    description: 'Spiritual hymn service commemorating the feast of Saint Mary with ancient Ethiopian notation.',
    descriptionAm: 'በጽዮን ማርያም በዓል ላይ የቀረበ መንፈሳዊ የዝማሬና የማኅሌት አገልግሎት።',
  },
  {
    id: '4',
    title: 'Timkat Epiphany Baptismal Blessing',
    titleAm: 'የጥምቀት በዓለ ኤጲፋንያ',
    category: 'Feasts',
    categoryAm: 'በዓላት',
    photoCount: 52,
    coverUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600&q=80',
    ],
    date: 'Tir 11, 2017',
    description: 'Solemn liturgical procession of the Tabot to the water basin and holy blessings.',
    descriptionAm: 'የታቦተ ሕጉ ወደ ባሕረ ጥምቀት መውረድና የውሃው ቡራኬ ሥነ ሥርዓት።',
  },
  {
    id: '5',
    title: 'Parish Youth Charity Outreach',
    titleAm: 'የወጣቶች የፍቅርና የበጎ አድራጎት ጉብኝት',
    category: 'Charity',
    categoryAm: 'በጎ አድራጎት',
    photoCount: 19,
    coverUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80',
    ],
    date: 'Tikimt 05, 2017',
    description: 'Delivering nutritional support and warm clothing to elder parishioners and orphanages.',
    descriptionAm: 'በአረጋውያንና ሕፃናት ማሳደጊያ ማዕከላት የተደረገ የምግብና የልብስ ድጋፍ አሰጣጥ።',
  },
  {
    id: '6',
    title: 'Historical Monastic Pilgrimage',
    titleAm: 'የገዳማት መንፈሳዊ ጉዞ',
    category: 'Liturgical',
    categoryAm: 'ቅዳሴና ሥርዓት',
    photoCount: 41,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    previewImages: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    ],
    date: 'Nehase 16, 2016',
    description: 'Youth fellowship visit to ancient mountain monasteries for prayer and monastic guidance.',
    descriptionAm: 'ወደ ጥንታውያን ገዳማት የተደረገ የጸሎትና የበረከት ጉዞ።',
  },
];

export function useGalleryData(activeCategory: string) {
  const [albums] = useState<GalleryAlbum[]>(FALLBACK_ALBUMS);

  const filteredAlbums = useMemo(() => {
    if (!activeCategory || activeCategory === 'All') {
      return albums;
    }
    return albums.filter(
      (a) => a.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [albums, activeCategory]);

  const featuredAlbum = albums[0];

  return { albums: filteredAlbums, featuredAlbum };
}
