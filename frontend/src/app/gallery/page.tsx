'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAppStore } from '@/lib/store';
import './gallery.css';

interface GalleryPhoto {
  id: string;
  album: 'Worship' | 'Celebrations' | 'Youth' | 'Community';
  albumAm: string;
  caption: string;
  captionAm: string;
  aspectRatio: string;
  src: string;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: '1',
    album: 'Worship',
    albumAm: 'አምልኮና ጸሎት',
    caption: 'Holy Scripture & Sacred Cross Ceremony',
    captionAm: 'ቅዱስ መጽሐፍና የክብር መስቀል ሥርዓት',
    aspectRatio: '4/5',
    src: '/images/gallery/gallery-worship-1.jpg',
  },
  {
    id: '2',
    album: 'Celebrations',
    albumAm: 'በዓላትና ዝክረ ቅዱሳን',
    caption: 'Clergy Procession with Traditional Umbrellas',
    captionAm: 'የካህናትና የዲያቆናት የበዓል ሥነ-ሥርዓት',
    aspectRatio: '1/1',
    src: '/images/gallery/gallery-celebration-1.jpg',
  },
  {
    id: '3',
    album: 'Youth',
    albumAm: 'የሰንበት ት/ቤት ወጣቶች',
    caption: 'Sunday School Students & Sacred Choir',
    captionAm: 'የሰንበት ት/ቤት ተማሪዎችና መዘምራን ሕብረት',
    aspectRatio: '4/3',
    src: '/images/gallery/gallery-youth-1.jpg',
  },
  {
    id: '4',
    album: 'Community',
    albumAm: 'ማህበረሰብና አንድነት',
    caption: 'Congregation Worship & Prayers',
    captionAm: 'የምእመናን የጋራ ጸሎትና መንፈሳዊ ጉባኤ',
    aspectRatio: '3/4',
    src: '/images/gallery/gallery-community-1.jpg',
  },
  {
    id: '5',
    album: 'Celebrations',
    albumAm: 'በዓላትና ዝክረ ቅዱሳን',
    caption: 'Church Dome Sunset & Golden Cross',
    captionAm: 'የቤተክርስቲያን ጉልላት ጀምበር ስትጠልቅ',
    aspectRatio: '16/10',
    src: '/images/gallery/gallery-architecture-1.jpg',
  },
  {
    id: '6',
    album: 'Worship',
    albumAm: 'አምልኮና ጸሎት',
    caption: 'Altar Service & Divine Liturgy',
    captionAm: 'የውስጠ መቅደስ ቅዳሴ አገልግሎት',
    aspectRatio: '4/5',
    src: '/images/gallery/gallery-worship-2.jpg',
  },
  {
    id: '7',
    album: 'Community',
    albumAm: 'ማህበረሰብና አንድነት',
    caption: 'Spiritual Teaching & Fellowship',
    captionAm: 'የሊቃውንት ትምህርትና የመንፈሳውያን ሕብረት',
    aspectRatio: '1/1',
    src: '/images/gallery/gallery-celebration-2.jpg',
  },
  {
    id: '8',
    album: 'Celebrations',
    albumAm: 'በዓላትና ዝክረ ቅዱሳን',
    caption: 'Feast of Saint Gabriel & Annual Celebration',
    captionAm: 'የቅዱስ ገብርኤል ዓመታዊ ክብረ በዓል',
    aspectRatio: '3/4',
    src: '/images/hero/hero-1.jpg',
  },
  {
    id: '9',
    album: 'Youth',
    albumAm: 'የሰንበት ት/ቤት ወጣቶች',
    caption: 'Youth Mezmur Practice & Sacred Chants',
    captionAm: 'የወጣቶች የዜማና የመዝሙር ልምምድ',
    aspectRatio: '16/10',
    src: '/images/hero/hero-2.jpg',
  },
  {
    id: '10',
    album: 'Worship',
    albumAm: 'አምልኮና ጸሎት',
    caption: 'Sunday Morning Liturgical Gathering',
    captionAm: 'የእሑድ ጠዋት የቅዳሴ ጸሎትና ቡራኬ',
    aspectRatio: '4/5',
    src: '/images/hero/hero-3.jpg',
  },
  {
    id: '11',
    album: 'Celebrations',
    albumAm: 'በዓላትና ዝክረ ቅዱሳን',
    caption: 'Timkat Epiphany Sacred Procession',
    captionAm: 'የጥምቀት በዓል ታቦተ ሕጉ ሲከብር',
    aspectRatio: '1/1',
    src: '/images/events/featured.jpg',
  },
  {
    id: '12',
    album: 'Community',
    albumAm: 'ማህበረሰብና አንድነት',
    caption: 'Parish Life & Fellowship Dinner',
    captionAm: 'የሰንበት ት/ቤት ማህበረሰብ ፍቅርና አንድነት',
    aspectRatio: '4/3',
    src: '/images/events/hero.jpg',
  },
  {
    id: '13',
    album: 'Youth',
    albumAm: 'የሰንበት ት/ቤት ወጣቶች',
    caption: 'Sunday School Bible Study Session',
    captionAm: 'የወጣቶች የመጽሐፍ ቅዱስ ጥናት መርሐ ግብር',
    aspectRatio: '3/4',
    src: '/images/events/event-1.jpg',
  },
  {
    id: '14',
    album: 'Worship',
    albumAm: 'አምልኮና ጸሎት',
    caption: 'Traditional Incense & Evening Prayer',
    captionAm: 'የማታ የዕጣን ጸሎትና ምስጋና',
    aspectRatio: '16/10',
    src: '/images/gallery/gallery-worship-1.jpg',
  },
  {
    id: '15',
    album: 'Celebrations',
    albumAm: 'በዓላትና ዝክረ ቅዱሳን',
    caption: 'Meskel Demera Lighting Ceremony',
    captionAm: 'የደመራ በዓል አከባበርና የብርሃን ምሥጢር',
    aspectRatio: '4/5',
    src: '/images/gallery/gallery-celebration-1.jpg',
  },
  {
    id: '16',
    album: 'Community',
    albumAm: 'ማህበረሰብና አንድነት',
    caption: 'Elders, Deacons & Families Assembled',
    captionAm: 'የአባቶች፣ እናቶችና ልጆች መንፈሳዊ ሕብረት',
    aspectRatio: '1/1',
    src: '/images/gallery/gallery-community-1.jpg',
  },
  {
    id: '17',
    album: 'Youth',
    albumAm: 'የሰንበት ት/ቤት ወጣቶች',
    caption: 'Choir Garments & Sacred Instruments',
    captionAm: 'የመዘምራን አልባሳትና የከበሮ ጸናጽል ዝማሬ',
    aspectRatio: '4/3',
    src: '/images/gallery/gallery-youth-1.jpg',
  },
  {
    id: '18',
    album: 'Worship',
    albumAm: 'አምልኮና ጸሎት',
    caption: 'Prayer of the Faithful at Dawn',
    captionAm: 'የንጋት ጸሎተ ማኅሌትና ምህላ',
    aspectRatio: '3/4',
    src: '/images/gallery/gallery-worship-2.jpg',
  },
];

const ALBUMS = ['Worship', 'Celebrations', 'Youth', 'Community'] as const;

export default function GalleryPage() {
  const { locale } = useAppStore();
  const isAm = locale === 'am';

  const [selectedAlbum, setSelectedAlbum] = useState<string>('');
  const [displayLimit, setDisplayLimit] = useState<number>(12);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return GALLERY_PHOTOS.filter((p) => !selectedAlbum || p.album === selectedAlbum);
  }, [selectedAlbum]);

  const visiblePhotos = useMemo(() => {
    return filteredPhotos.slice(0, displayLimit);
  }, [filteredPhotos, displayLimit]);

  // Reset pagination limit on album switch
  const handleSelectAlbum = (album: string) => {
    setSelectedAlbum(album);
    setDisplayLimit(12);
  };

  const handleShowMore = () => {
    setDisplayLimit((prev) => prev + 12);
  };

  // Lightbox navigation
  const openLightbox = (indexInFiltered: number) => {
    setActivePhotoIndex(indexInFiltered);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setActivePhotoIndex(null);
    document.body.style.overflow = '';
  }, []);

  const stepLightbox = useCallback(
    (delta: number) => {
      if (activePhotoIndex === null || filteredPhotos.length === 0) return;
      const count = filteredPhotos.length;
      const nextIndex = (activePhotoIndex + delta + count) % count;
      setActivePhotoIndex(nextIndex);
    },
    [activePhotoIndex, filteredPhotos]
  );

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, closeLightbox, stepLightbox]);

  const currentPhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  return (
    <div className="gallery-page">
      <Header />

      <main>
        {/* Hero Section with 3-Photo Triptych */}
        <section className="hero">
          <div className="w">
            <div className="crumb">
              <Link href="/">{isAm ? 'መነሻ' : 'Home'}</Link> › <b>{isAm ? 'ማዕከለ ስዕል' : 'Gallery'}</b>
            </div>

            <div className="hg">
              <div>
                <span className="kick">
                  {isAm ? 'የማህበረሰባችን አበይት ጊዜያት' : 'MOMENTS OF OUR COMMUNITY'}
                </span>
                <h1>
                  <em>Gallery</em>
                </h1>
                <span className="am sub">ማዕከለ ስዕል</span>
                <p className="l">
                  {isAm
                    ? 'ከቅዳሴ፣ ከአበይት በዓላት፣ ከአገልግሎትና ከማህበረሰብ ሕይወት የተሰነዱ ውብ ምስሎች።'
                    : 'Photos from worship, celebrations, services and community life.'}
                </p>
              </div>

              {/* Triptych Showcase */}
              <div className="tri" id="tri">
                {GALLERY_PHOTOS.slice(0, 3).map((photo, i) => (
                  <button
                    key={photo.id}
                    type="button"
                    aria-label={`Open photo ${i + 1}: ${photo.caption}`}
                    onClick={() => {
                      setSelectedAlbum('');
                      setDisplayLimit(12);
                      const idx = filteredPhotos.findIndex((p) => p.id === photo.id);
                      openLightbox(idx !== -1 ? idx : 0);
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                      priority={i === 0}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar & Album Filter Tabs */}
        <div className="w" id="list">
          <div className="bar">
            <div className="tabs" id="tabs" role="group" aria-label="Albums">
              <button
                type="button"
                className={selectedAlbum === '' ? 'sel' : ''}
                onClick={() => handleSelectAlbum('')}
              >
                {isAm ? 'ሁሉም' : 'All'}
                <i>{GALLERY_PHOTOS.length}</i>
              </button>

              {ALBUMS.map((alb) => {
                const count = GALLERY_PHOTOS.filter((p) => p.album === alb).length;
                const albumLabelAm =
                  alb === 'Worship'
                    ? 'አምልኮ'
                    : alb === 'Celebrations'
                    ? 'በዓላት'
                    : alb === 'Youth'
                    ? 'ወጣቶች'
                    : 'ማህበረሰብ';

                return (
                  <button
                    key={alb}
                    type="button"
                    className={selectedAlbum === alb ? 'sel' : ''}
                    onClick={() => handleSelectAlbum(alb)}
                  >
                    {isAm ? albumLabelAm : alb}
                    <i>{count}</i>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photos Counter */}
          <div className="cnt" id="cnt">
            {isAm
              ? `ከ${filteredPhotos.length} ፎቶዎች ውስጥ ${visiblePhotos.length} እየታዩ ነው${
                  selectedAlbum ? ` በ${selectedAlbum} አልበም` : ''
                }`
              : `Showing ${visiblePhotos.length} of ${filteredPhotos.length} photos${
                  selectedAlbum ? ` in ${selectedAlbum}` : ''
                }`}
          </div>

          {/* Masonry Grid */}
          <div className="ms" id="ms">
            {visiblePhotos.length > 0 ? (
              visiblePhotos.map((photo, n) => (
                <div
                  key={photo.id}
                  className="tile"
                  role="button"
                  tabIndex={0}
                  style={
                    {
                      aspectRatio: photo.aspectRatio,
                      '--d': `${(n % 6) * 0.07}s`,
                    } as React.CSSProperties
                  }
                  aria-label={`Open: ${isAm ? photo.captionAm : photo.caption}`}
                  onClick={() => openLightbox(n)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openLightbox(n);
                    }
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={isAm ? photo.captionAm : photo.caption}
                    fill
                    sizes="(max-width: 480px) 100vw, (max-width: 900px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                  <span className="cp">
                    <small>{isAm ? photo.albumAm : photo.album}</small>
                    <span>{isAm ? photo.captionAm : photo.caption}</span>
                  </span>
                </div>
              ))
            ) : (
              <p className="empty">
                {isAm
                  ? 'በዚህ አልበም ውስጥ እስካሁን ፎቶዎች አልተካተቱም።'
                  : 'No photos in this album yet.'}
              </p>
            )}
          </div>

          {/* Pagination */}
          <div className="more" id="more">
            {filteredPhotos.length > displayLimit && (
              <button
                type="button"
                className="btn bn"
                id="mb"
                onClick={handleShowMore}
              >
                {isAm
                  ? `ተጨማሪ ፎቶዎችን አሳይ · የቀሩት ${filteredPhotos.length - displayLimit}`
                  : `Show more photos · ${filteredPhotos.length - displayLimit} left`}
              </button>
            )}
          </div>
        </div>

        {/* Sacred Quote Section */}
        <section className="qb">
          <div className="w">
            <h2>
              {isAm ? (
                <>
                  እምነት። ባህል።
                  <br />
                  ማህበረሰብ።
                </>
              ) : (
                <>
                  Faith. Culture.
                  <br />
                  Community.
                </>
              )}
            </h2>
            <Link className="btn bg" href="/contact">
              {isAm ? 'ያግኙን' : 'Contact us'}
            </Link>
          </div>
        </section>
      </main>

      <Footer compact={false} />

      {/* Lightbox Modal */}
      <div
        className={`lb ${activePhotoIndex !== null ? 'on' : ''}`}
        id="lb"
        role="dialog"
        aria-modal="true"
        aria-label="Photo viewer"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLightbox();
        }}
      >
        <button className="x" id="lx" aria-label="Close" onClick={closeLightbox}>
          ✕
        </button>

        <button className="p" id="lp" aria-label="Previous photo" onClick={() => stepLightbox(-1)}>
          ←
        </button>

        <button className="nx" id="ln" aria-label="Next photo" onClick={() => stepLightbox(1)}>
          →
        </button>

        {currentPhoto && (
          <>
            <div
              className="fr"
              id="lf"
              style={{
                aspectRatio: currentPhoto.aspectRatio,
              }}
            >
              <Image
                src={currentPhoto.src}
                alt={isAm ? currentPhoto.captionAm : currentPhoto.caption}
                fill
                sizes="(max-width: 900px) 100vw, 860px"
                className="object-contain"
                priority
              />
            </div>

            <div className="cap">
              <div>
                <small id="la">{isAm ? currentPhoto.albumAm : currentPhoto.album}</small>
                <h3 id="lc">{isAm ? currentPhoto.captionAm : currentPhoto.caption}</h3>
              </div>
              <span className="n" id="lm">
                {String((activePhotoIndex || 0) + 1).padStart(2, '0')} /{' '}
                {String(filteredPhotos.length).padStart(2, '0')}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
