// src/lib/heroSlides.ts
export interface HeroSlide {
    src: string;          // path in /public, or a full URL
    alt: string;
    position?: string;    // CSS object-position, e.g. 'center 35%'
  }
  
  export const HERO_INTERVAL_MS = 6000;
  
  // To change the hero images: replace the files in public/images/hero/
  // or edit/add/remove entries here. Two or more entries show the dots.
  export const HERO_SLIDES: HeroSlide[] = [
    {
      src: '/images/hero/hero-1.jpg',
      alt: 'Ethiopian Orthodox Church candlelit service',
      position: 'center 35%',
    },
    {
      src: '/images/hero/hero-2.jpg',
      alt: 'Ethiopian Orthodox Church celebration',
      position: 'center 40%',
    },
  ];