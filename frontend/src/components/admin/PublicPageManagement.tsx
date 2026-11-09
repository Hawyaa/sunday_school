'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './public-pages.css';

interface FieldDef {
  l: string;
  v: string;
  am?: string;
  img?: boolean;
  a?: boolean;
  sel?: string[];
  type?: string;
  i?: number;
}

interface SubTableDef {
  l: string;
  cols: string[];
  items: string[][];
  max?: number;
}

interface SectionDef {
  id: string;
  n: string;
  k: 'text' | 'list' | 'auto' | 'module' | 'gallery';
  why?: string;
  vis?: boolean;
  nohide?: boolean;
  mv?: boolean;
  open?: boolean;
  f?: FieldDef[];
  intro?: FieldDef[];
  cols?: string[];
  items?: string[][];
  max?: number;
  sub?: SubTableDef;
  extra?: FieldDef[];
  info?: string;
  mod?: {
    cols: string[];
    rows: string[][];
    form: FieldDef[];
  };
}

interface PageDef {
  n: string;
  lock?: number;
  sup?: number;
  secs?: SectionDef[];
}

const SV = ['Draft', 'Published', 'Unpublished'];

const INITIAL_PAGES: Record<string, PageDef> = {
  home: { n: 'Home', lock: 1 },
  about: {
    n: 'About',
    secs: [
      {
        id: 'h',
        n: 'Hero (title & tagline)',
        k: 'text',
        why: 'Top banner of the About page',
        nohide: true,
        f: [
          { l: 'Title', v: 'About Us', am: 'ስለ እኛ' },
          { l: 'Tagline', v: 'Our Faith. Our Mission. Our Community.' },
        ],
      },
      {
        id: 'hs',
        n: 'Hero statistics',
        k: 'list',
        why: 'The 3 numbers beside the title',
        cols: ['Label', 'Value'],
        items: [
          ['Serving since', '1998'],
          ['Sunday school students', '200+'],
          ['Active ministries', '4'],
        ],
        max: 4,
      },
      {
        id: 'lg',
        n: 'The Legacy of Abune Diskoros',
        k: 'text',
        why: 'Photo, years, story and 3 pillars',
        mv: true,
        f: [
          { l: 'Heading', v: 'The Legacy of Abune Diskoros' },
          { l: 'Story paragraph', v: 'Abune Diskoros was a visionary bishop, a man of deep faith…', a: true },
          { l: 'Portrait photo', v: 'portrait.jpg', img: true },
          { l: 'Years caption', v: '1930 – 1986' },
          { l: 'Role caption', v: 'Shepherd & Teacher' },
          { l: 'Button label', v: 'Our journey' },
        ],
        sub: {
          l: 'Three pillars',
          cols: ['Title', 'Short text'],
          items: [
            ['Gospel', 'Spread the truth'],
            ['Church', 'Strengthened the faith'],
            ['Faithful', 'Uplifted the soul'],
          ],
        },
      },
      {
        id: 'tl',
        n: 'Timeline: A Path of Faith and Service',
        k: 'list',
        why: 'Years on the dotted line. Add, remove or reorder',
        mv: true,
        intro: [
          { l: 'Heading', v: 'A Path of Faith and Service' },
          { l: 'Intro text', v: 'Every milestone grew from love and service…', a: true },
        ],
        cols: ['Year', 'Title', 'Description'],
        items: [
          ['1998', 'The Beginning', 'Our ministry began, gathering the faithful in prayer and study.'],
          ['2006', 'Digital Platform', 'Teachings and sacred media reached the community online.'],
          ['2012', 'Constant Expansion', 'Hymns, scripture study and new classes were added to our work.'],
        ],
      },
      {
        id: 'mv',
        n: 'Mission · Vision · Values',
        k: 'list',
        why: 'The three cards under “Guided by Faith, Driven by Service”',
        mv: true,
        intro: [
          { l: 'Heading', v: 'Guided by Faith, Driven by Service' },
          { l: 'Intro text', v: 'We are committed to preserving and sharing the spiritual heritage…', a: true },
        ],
        cols: ['Card title', 'Text'],
        items: [
          ['Our Mission', 'To proclaim the Gospel, nurture the faithful…'],
          ['Our Vision', 'A united, learned and compassionate church family…'],
          ['Our Values', 'Faith, Knowledge, Integrity, Community, Compassion'],
        ],
        max: 3,
      },
      {
        id: 'sc',
        n: 'Scripture strip',
        k: 'text',
        mv: true,
        f: [
          { l: 'Verse', v: 'Faith, if it hath not works, is dead, being alone.' },
          { l: 'Reference', v: 'James 2:17' },
        ],
      },
      {
        id: 'ss',
        n: 'Sunday School Journey',
        k: 'text',
        why: 'Dark section with 3 numbers and the children quote',
        mv: true,
        f: [
          { l: 'Heading', v: 'Sunday School Journey' },
          { l: 'Subtitle', v: 'Teaching the next generation' },
          { l: 'Paragraph', v: 'Our Sunday School gives children and young people a place to learn…', a: true },
          { l: 'Quote', v: 'Let the little children come to me, and do not hinder them.', a: true },
          { l: 'Quote reference', v: 'Mark 10:14' },
        ],
        sub: {
          l: 'Numbers',
          cols: ['Label', 'Value'],
          items: [
            ['Students', '200+'],
            ['Teachers', '20'],
            ['Years', '15'],
          ],
        },
      },
      {
        id: 'mw',
        n: 'More Ways to Serve',
        k: 'list',
        why: '4 service cards',
        mv: true,
        intro: [
          { l: 'Heading', v: 'More Ways to Serve' },
          { l: 'Intro text', v: 'Through our ministries, education and community programs…', a: true },
        ],
        cols: ['Title', 'Description', 'Link'],
        items: [
          ['Worship & Spiritual Music', 'Join the choir and sacred music…', '/media/mezmur'],
          ['Community Service', 'Support families in need…', '/events'],
          ['Cultural Heritage', 'Preserving heritage, language…', '/about'],
          ['Events & Gatherings', 'Celebrate feasts, festivals…', '/events'],
        ],
        max: 6,
      },
      {
        id: 'cta',
        n: 'Closing banner',
        k: 'text',
        mv: true,
        f: [
          { l: 'Heading', v: 'Faith • Culture • Community' },
          { l: 'Text', v: 'Our mission is to share the teachings and heritage of the Church with every generation.', a: true },
          { l: 'Button 1', v: 'Start learning' },
          { l: 'Button 1 link', v: '/teachings' },
          { l: 'Button 2', v: 'Contact us' },
          { l: 'Button 2 link', v: '/contact' },
        ],
      },
    ],
  },
  events: {
    n: 'Events',
    secs: [
      {
        id: 'h',
        n: 'Hero',
        k: 'text',
        nohide: true,
        f: [
          { l: 'Eyebrow', v: 'Church Events.' },
          { l: 'Tagline', v: 'Gather. Worship. Serve together.' },
        ],
      },
      {
        id: 'ft',
        n: 'Featured “Next gathering” card',
        k: 'text',
        why: 'The navy card at the top right',
        f: [
          { l: 'Which event?', v: 'Automatic: next upcoming', sel: ['Automatic: next upcoming', 'Pick manually: Annual Church Gathering'] },
          { l: 'Button label', v: 'View details' },
        ],
      },
      {
        id: 'cal',
        n: 'Month calendar strip',
        k: 'auto',
        info: 'Built automatically from published events. Nothing to edit.',
      },
      {
        id: 'cat',
        n: 'Event categories (filter chips)',
        k: 'list',
        why: 'Church Programs, Teaching, Community Service, Church Building, Feast Celebration',
        cols: ['Category name'],
        items: [['Church Programs'], ['Teaching'], ['Community Service'], ['Church Building'], ['Feast Celebration']],
      },
      {
        id: 'ev',
        n: 'Event list',
        k: 'module',
        why: 'Every row on the page. Order is by date',
        mod: {
          cols: ['Date', 'Title', 'Category', 'Status'],
          rows: [
            ['Nov 5', 'Church Renovation Fundraising', 'Church Building', 'Published'],
            ['Nov 8', 'Spiritual Growth Seminar', 'Teaching', 'Published'],
            ['Nov 15', 'Youth Fellowship Gathering', 'Church Programs', 'Published'],
            ['Nov 22', 'Annual Church Gathering', 'Church Programs', 'Published'],
            ['Nov 22', 'Charity & Support Program', 'Community Service', 'Draft'],
            ['Nov 28', 'Feast Day Liturgy & Hymns', 'Feast Celebration', 'Published'],
          ],
          form: [
            { l: 'Title', v: '', i: 1 },
            { l: 'Date', v: '', i: 0, type: 'date' },
            { l: 'Time', v: '8:00 AM – 5:00 PM' },
            { l: 'Location', v: 'St. Gabriel Church, Addis Ababa' },
            { l: 'Category', v: '', i: 2, sel: ['Church Programs', 'Teaching', 'Community Service', 'Church Building', 'Feast Celebration'] },
            { l: 'Description', v: '', a: true },
            { l: 'Image', v: '', img: true },
            { l: 'Status', v: '', i: 3, sel: SV },
            { l: 'Show in “Next gathering” card', v: 'No', sel: ['No', 'Yes'] },
          ],
        },
      },
      {
        id: 'cta',
        n: '“Want to help?” banner',
        k: 'text',
        f: [
          { l: 'Heading', v: 'Want to help?' },
          { l: 'Text', v: 'Join or support an upcoming event or ministry.', a: true },
          { l: 'Button', v: 'Get involved' },
          { l: 'Button link', v: '/contact' },
        ],
      },
    ],
  },
  announcements: {
    n: 'Announcements',
    secs: [
      {
        id: 'h',
        n: 'Hero',
        k: 'text',
        nohide: true,
        f: [
          { l: 'Title', v: 'Announcements', am: 'ማስታወቂያ' },
          { l: 'Subtitle', v: 'News and notices from the church community.' },
        ],
      },
      {
        id: 'pin',
        n: 'Pinned top 3 cards',
        k: 'text',
        why: 'The three tilted cards under the title',
        f: [
          { l: 'Card 1', v: 'Feast of the Holy Cross preparation', sel: ['Feast of the Holy Cross preparation', 'New Sunday school registration', 'Community charity and outreach'] },
          { l: 'Card 2', v: 'New Sunday school registration', sel: ['Feast of the Holy Cross preparation', 'New Sunday school registration', 'Community charity and outreach'] },
          { l: 'Card 3', v: 'Community charity and outreach', sel: ['Feast of the Holy Cross preparation', 'New Sunday school registration', 'Community charity and outreach'] },
        ],
      },
      {
        id: 'cat',
        n: 'Categories',
        k: 'list',
        cols: ['Category name'],
        items: [['Church'], ['Education'], ['Community']],
      },
      {
        id: 'an',
        n: 'Announcement list',
        k: 'module',
        why: 'The big featured item, the side items and the numbered list',
        mod: {
          cols: ['Date', 'Title', 'Category', 'Status'],
          rows: [
            ['Meskerem 17', 'Feast of the Holy Cross preparation', 'Church', 'Published'],
            ['Meskerem 11', 'New Sunday school registration', 'Education', 'Published'],
            ['Meskerem 22', 'Community charity and outreach', 'Community', 'Published'],
            ['Meskerem 21', 'Announcement title 4', 'Church', 'Draft'],
          ],
          form: [
            { l: 'Title', v: '', i: 1 },
            { l: 'Date', v: '', i: 0 },
            { l: 'Category', v: '', i: 2, sel: ['Church', 'Education', 'Community'] },
            { l: 'Short summary', v: '', a: true },
            { l: 'Full text', v: '', a: true },
            { l: 'Image', v: '', img: true },
            { l: 'Status', v: '', i: 3, sel: SV },
            { l: 'Position on page', v: 'Normal list', sel: ['Big featured item', 'Side item', 'Pinned top card', 'Normal list'] },
          ],
        },
      },
    ],
  },
  reports: {
    n: 'Reports',
    secs: [
      {
        id: 'h',
        n: 'Reports Hub hero',
        k: 'text',
        nohide: true,
        f: [
          { l: 'Eyebrow', v: 'Reports Hub' },
          { l: 'Title', v: 'Reports' },
          { l: 'Intro', v: 'Access and review various official church and administrative reports…', a: true },
          { l: 'Button label', v: 'View all reports' },
          { l: 'Scripture quote', v: 'For where your treasure is, there your heart will be also.', a: true },
          { l: 'Reference', v: 'Matthew 6:21' },
        ],
      },
      {
        id: 'rl',
        n: 'Reports list',
        k: 'module',
        why: 'Rows with PDF buttons. The year filters are made automatically',
        mod: {
          cols: ['Year', 'Title', 'Access', 'Status'],
          rows: [
            ['2026', 'mariaym', 'Public', 'Published'],
            ['2025', 'Financial Management Report', 'Restricted', 'Published'],
            ['2025', 'Choirs Service Performance Report', 'Public', 'Published'],
            ['2025', 'Education Department Activity Report', 'Public', 'Published'],
            ['2024', 'Audit Financial Report', 'Restricted', 'Published'],
          ],
          form: [
            { l: 'Title', v: '', i: 1 },
            { l: 'Year / period label', v: '', i: 0 },
            { l: 'Short description', v: '', a: true },
            { l: 'PDF file', v: 'report.pdf', img: true },
            { l: 'Who can open it?', v: '', i: 2, sel: ['Public', 'Restricted'] },
            { l: 'Status', v: '', i: 3, sel: SV },
          ],
        },
      },
      {
        id: 'nb',
        n: '“Need a specific report?” box',
        k: 'text',
        f: [
          { l: 'Heading', v: 'Need a specific report?' },
          { l: 'Text', v: 'If you can’t find the report you’re looking for, please contact the church administration.', a: true },
          { l: 'Button', v: 'Contact Admin' },
        ],
      },
      {
        id: 'cq',
        n: 'Closing quote',
        k: 'text',
        f: [
          { l: 'Quote', v: 'May the Lord bless all who serve His Church with a pure heart.', a: true },
          { l: 'Source', v: 'Abune Media' },
        ],
      },
    ],
  },
  mezmur: {
    n: 'Mezmur',
    secs: [
      {
        id: 'h',
        n: 'Hero',
        k: 'text',
        nohide: true,
        f: [
          { l: 'Title', v: 'Mezmur', am: 'መዝሙር' },
          { l: 'Intro', v: 'Listen to spiritual hymns and sacred songs from the Ethiopian Orthodox tradition.', a: true },
          { l: 'Button', v: 'Browse all mezmur' },
        ],
      },
      {
        id: 'ft',
        n: 'Featured player card',
        k: 'text',
        why: 'The navy player card at the top right',
        f: [{ l: 'Which mezmur?', v: 'Automatic: latest published', sel: ['Automatic: latest published', 'Pick manually…'] }],
      },
      {
        id: 'ty',
        n: 'Types (filter chips)',
        k: 'list',
        why: 'Currently All · Track · Station · Mezmur',
        cols: ['Type name'],
        items: [['Track'], ['Station'], ['Mezmur']],
      },
      {
        id: 'ml',
        n: 'Mezmur list',
        k: 'module',
        why: 'Numbered rows with Lyrics button',
        mod: {
          cols: ['Title', 'Choir', 'Type', 'Status'],
          rows: [
            ['Holy God', 'Abune Diskoros Choir', 'Mezmur', 'Published'],
            ['Hail Mary', 'Abune Diskoros Choir', 'Mezmur', 'Published'],
            ['God Be Praised', 'Abune Diskoros Choir', 'Track', 'Published'],
            ['Come to the Wedding', 'Abune Diskoros Choir', 'Station', 'Published'],
          ],
          form: [
            { l: 'Title', v: '', i: 0 },
            { l: 'Amharic title', v: '', am: '' },
            { l: 'Choir', v: '', i: 1 },
            { l: 'Type', v: '', i: 2, sel: ['Track', 'Station', 'Mezmur'] },
            { l: 'Audio file', v: 'audio.mp3', img: true },
            { l: 'Lyrics (shown in the Lyrics panel)', v: '', a: true },
            { l: 'Status', v: '', i: 3, sel: SV },
          ],
        },
      },
      {
        id: 'cq',
        n: 'Closing quote',
        k: 'text',
        f: [
          { l: 'Quote', v: 'Sing to the Lord a new song, for He has done marvelous things.', a: true },
          { l: 'Source', v: 'Psalm 98:1' },
        ],
      },
    ],
  },
  teachings: {
    n: 'Teachings',
    secs: [
      {
        id: 'h',
        n: 'Hero',
        k: 'text',
        nohide: true,
        f: [
          { l: 'Eyebrow', v: 'Sunday School & Spiritual Teaching' },
          { l: 'Title', v: 'Teachings', am: 'ትምህርት' },
          { l: 'Intro', v: 'Watch lessons, read study guides, and grow in the Ethiopian Orthodox faith at every age.', a: true },
          { l: 'Button', v: 'Browse all teachings' },
        ],
      },
      {
        id: 'ft',
        n: 'Featured teaching card',
        k: 'text',
        why: 'Top-right “Latest teaching” card',
        f: [{ l: 'Which teaching?', v: 'Automatic: latest published', sel: ['Automatic: latest published', 'Pick manually: The Mystery of the Holy Trinity & Dogma'] }],
      },
      {
        id: 'ct',
        n: 'Categories (filter chips)',
        k: 'list',
        cols: ['Category name'],
        items: [['Dogma'], ['Holy Bible'], ['Church History'], ['Patristics']],
      },
      {
        id: 'tl',
        n: 'Teaching list',
        k: 'module',
        why: 'Rows with thumbnail, Watch and PDF buttons',
        mod: {
          cols: ['Title', 'Category', 'Formats', 'Status'],
          rows: [
            ['The Mystery of the Holy Trinity & Dogma', 'Dogma', 'Video · PDF', 'Published'],
            ['Spiritual Lessons from the Holy Bible', 'Holy Bible', 'PDF', 'Published'],
            ['Orthodox Church History Overview', 'Church History', 'Video', 'Published'],
            ['Faith and Salvation (Voice Sermon)', 'Dogma', 'Audio', 'Published'],
            ['ew', 'Dogma', 'PDF', 'Draft'],
          ],
          form: [
            { l: 'Title', v: '', i: 0 },
            { l: 'Category', v: '', i: 1, sel: ['Dogma', 'Holy Bible', 'Church History', 'Patristics'] },
            { l: 'Description', v: '', a: true },
            { l: 'Speaker / author', v: 'Abba Mikael' },
            { l: 'Duration or pages', v: '20 min' },
            { l: 'Thumbnail', v: 'thumb.jpg', img: true },
            { l: 'Video link or file', v: '' },
            { l: 'PDF file', v: 'lesson.pdf', img: true },
            { l: 'Audio file', v: '', img: true },
            { l: 'Status', v: '', i: 3, sel: SV },
          ],
        },
      },
      {
        id: 'cq',
        n: 'Closing quote',
        k: 'text',
        f: [{ l: 'Quote', v: 'Learn the faith, live the faith.', a: true }],
      },
    ],
  },
  gallery: {
    n: 'Gallery',
    secs: [
      {
        id: 'h',
        n: 'Hero text',
        k: 'text',
        nohide: true,
        f: [
          { l: 'Title', v: 'Gallery', am: 'ማዕከለ ስዕል' },
          { l: 'Intro', v: 'Photos from worship, celebrations, services and community life.', a: true },
        ],
      },
      {
        id: 'g',
        n: 'Photos, hero collage & categories',
        k: 'gallery',
        nohide: true,
        open: true,
      },
    ],
  },
  contact: {
    n: 'Contact',
    secs: [
      {
        id: 'h',
        n: 'Hero',
        k: 'text',
        nohide: true,
        f: [
          { l: 'Title', v: 'Contact', am: 'ያግኙን' },
          { l: 'Intro', v: 'Questions, prayer requests or ideas? Reach us on our channels or send a message below.', a: true },
        ],
      },
      {
        id: 'on',
        n: 'Find us online (navy card)',
        k: 'list',
        why: 'Telegram, YouTube, TikTok rows with Open buttons',
        cols: ['Name', 'Handle shown', 'Link'],
        items: [
          ['Telegram', '@abune_media', 'https://t.me/…'],
          ['YouTube', 'youtube.com/@abune_media', 'https://youtube.com/…'],
          ['TikTok', '@abune_media', 'https://tiktok.com/…'],
        ],
        max: 6,
      },
      {
        id: 'fm',
        n: 'Message form',
        k: 'text',
        why: 'Heading, topic dropdown and thank-you text',
        f: [
          { l: 'Heading', v: 'Send us a message' },
          { l: 'Intro', v: 'Tell us how we can help. We’ll reply as soon as we can.', a: true },
          { l: 'Thank-you message', v: 'Thank you. Your message was sent.', a: true },
        ],
        sub: {
          l: 'Topic dropdown options',
          cols: ['Topic'],
          items: [['General question'], ['Prayer request'], ['Volunteering']],
        },
      },
      {
        id: 'ot',
        n: 'Other ways to reach us',
        k: 'list',
        cols: ['Label', 'Text', 'Link (optional)'],
        items: [
          ['Visit', 'Addis Ababa, Akume Werreda', 'map link'],
          ['Call', '+251 977 123 456', 'tel:'],
          ['Telegram', 't.me/abune_media', 'https://t.me/…'],
        ],
        max: 6,
      },
      {
        id: 'cta',
        n: '“You are always welcome” banner',
        k: 'text',
        f: [
          { l: 'Text', v: 'You are always welcome.' },
          { l: 'Subtext', v: 'Addis Ababa, Akume Werreda' },
          { l: 'Button', v: 'Get Involved' },
        ],
      },
    ],
  },
  shared: {
    n: 'Header, footer & top bar',
    sup: 1,
    secs: [
      {
        id: 'tb',
        n: 'Top notice bar',
        k: 'text',
        why: 'The thin navy strip above the header',
        f: [
          { l: 'Message', v: 'Attention: This week’s Abune Media…' },
          { l: 'Link', v: '/announcements' },
          { l: 'Link label', v: 'View updates' },
        ],
      },
      {
        id: 'hd',
        n: 'Header menu',
        k: 'list',
        why: 'Order and visibility of menu items',
        mv: true,
        cols: ['Label', 'Link'],
        items: [
          ['Home', '/'],
          ['About', '/about'],
          ['Updates ▾', '/announcements'],
          ['Media ▾', '/gallery'],
          ['Contact', '/contact'],
        ],
        extra: [
          { l: 'Header button label', v: 'Get Involved' },
          { l: 'Header button link', v: '/contact' },
        ],
      },
      {
        id: 'ft',
        n: 'Footer',
        k: 'text',
        f: [
          { l: 'About text', v: 'A digital home for Sunday school teachings, spirituality, and Ethiopian Orthodox heritage.', a: true },
          { l: 'Tagline', v: 'Faith. Culture. Community.' },
          { l: 'Address', v: 'Addis Ababa, Akume Werreda' },
          { l: 'Phone', v: '+251 977 123 456' },
          { l: 'Email / Telegram', v: 't.me/abune_media' },
          { l: 'Copyright line', v: '© 2026 Abune Media.' },
        ],
        sub: {
          l: 'Footer links',
          cols: ['Label', 'Link'],
          items: [
            ['Home', '/'],
            ['About', '/about'],
            ['Events', '/events'],
            ['Reports', '/reports'],
            ['Mezmur', '/media/mezmur'],
            ['Teachings', '/teachings'],
            ['Gallery', '/gallery'],
            ['Contact', '/contact'],
          ],
        },
      },
    ],
  },
};

const GALLERY_PALETTES = [
  '#C99A3B,#1E2A5E',
  '#8A6414,#2F5D9E',
  '#1E2A5E,#C99A3B',
  '#2F5D9E,#E3EEF8',
  '#b3262e,#1E2A5E',
  '#C99A3B,#8A6414',
  '#1E2A5E,#2F5D9E',
  '#C99A3B,#2F5D9E',
];

interface GalleryPhotoItem {
  id: number;
  t: string;
  cat: string;
  alt: string;
  c: string;
  h: number;
  nw?: boolean;
  st?: string;
}

const INITIAL_GALLERY: GalleryPhotoItem[] = [
  { id: 1, t: 'Divine Liturgy', cat: 'Worship', alt: 'Faithful gathered for the Divine Liturgy', c: GALLERY_PALETTES[0], h: 110 },
  { id: 2, t: 'Procession in red', cat: 'Celebrations', alt: 'Priests in a festive procession', c: GALLERY_PALETTES[1], h: 150 },
  { id: 3, t: 'Hilltop church at dusk', cat: 'Community', alt: 'Church on a hill at sunset', c: GALLERY_PALETTES[2], h: 90 },
  { id: 4, t: 'The Last Supper icon', cat: 'Worship', alt: 'Icon of the Last Supper', c: GALLERY_PALETTES[3], h: 130 },
  { id: 5, t: 'Candles and incense', cat: 'Worship', alt: 'Candles lit before an icon', c: GALLERY_PALETTES[4], h: 170 },
  { id: 6, t: 'Icon of Mary', cat: 'Worship', alt: 'Icon of the Virgin Mary', c: GALLERY_PALETTES[5], h: 110 },
  { id: 7, t: 'Feast crowd', cat: 'Celebrations', alt: 'Crowd at a feast day', c: GALLERY_PALETTES[6], h: 150 },
  { id: 8, t: 'Youth choir', cat: 'Youth', alt: 'Young choir members singing', c: GALLERY_PALETTES[7], h: 90 },
  { id: 9, t: 'Church interior', cat: 'Worship', alt: 'Painted church interior', c: GALLERY_PALETTES[0], h: 130 },
];

export function PublicPageManagement({ isSuper = false }: { isSuper?: boolean }) {
  // Role switcher simulation or actual role
  const [activeRole, setActiveRole] = useState<'s' | 'a'>(isSuper ? 's' : 'a');
  const [curPage, setCurPage] = useState<string>('about');
  const [pages, setPages] = useState<Record<string, PageDef>>(INITIAL_PAGES);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ 'gallery.g': true });
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const [dirtyCount, setDirtyCount] = useState<number>(0);

  // Gallery State
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoItem[]>(INITIAL_GALLERY);
  const [galleryCategories, setGalleryCategories] = useState<string[]>(['Worship', 'Celebrations', 'Youth', 'Community']);
  const [heroPhotoIds, setHeroPhotoIds] = useState<number[]>([1, 3, 5]);
  const [galleryFilter, setGalleryFilter] = useState<string>('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalOkText, setModalOkText] = useState<string | null>(null);
  const [modalOnOk, setModalOnOk] = useState<(() => void) | null>(null);

  // Toast State
  const [toastText, setToastText] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 2800);
  };

  const markDirty = () => setDirtyCount((c) => c + 1);

  const closeModal = () => setModalOpen(false);

  // Role permissions
  const isSimSuper = activeRole === 's';
  const rolePermissions = isSimSuper
    ? { hide: [] as string[], view: [] as string[] }
    : { hide: ['shared'] as string[], view: ['reports'] as string[] };

  const isViewOnly = rolePermissions.view.includes(curPage);

  // Section toggle open
  const toggleSectionOpen = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Section toggle visibility
  const toggleSectionVis = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVisibleSections((prev) => ({ ...prev, [key]: prev[key] === undefined ? false : !prev[key] }));
    markDirty();
  };

  // Section Reorder
  const moveSection = (pageKey: string, idx: number, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPages((prev) => {
      const page = prev[pageKey];
      if (!page || !page.secs) return prev;
      const secs = [...page.secs];
      const targetIdx = idx + delta;
      if (targetIdx < 1 || targetIdx >= secs.length) return prev;
      const temp = secs[idx];
      secs[idx] = secs[targetIdx];
      secs[targetIdx] = temp;
      markDirty();
      return { ...prev, [pageKey]: { ...page, secs } };
    });
  };

  // List Item Reorder
  const moveListItem = (pageKey: string, secId: string, idx: number, delta: number) => {
    setPages((prev) => {
      const page = prev[pageKey];
      if (!page || !page.secs) return prev;
      const secs = page.secs.map((s) => {
        if (s.id !== secId || !s.items) return s;
        const items = [...s.items];
        const targetIdx = idx + delta;
        if (targetIdx < 0 || targetIdx >= items.length) return s;
        const temp = items[idx];
        items[idx] = items[targetIdx];
        items[targetIdx] = temp;
        return { ...s, items };
      });
      markDirty();
      return { ...prev, [pageKey]: { ...page, secs } };
    });
  };

  // Remove List Item
  const removeListItem = (pageKey: string, secId: string, idx: number) => {
    setPages((prev) => {
      const page = prev[pageKey];
      if (!page || !page.secs) return prev;
      const s = page.secs.find((x) => x.id === secId);
      if (s?.items && s.items.length < 2) {
        showToast('At least one item is needed. Hide the section instead.');
        return prev;
      }
      const secs = page.secs.map((sec) => {
        if (sec.id !== secId || !sec.items) return sec;
        const items = sec.items.filter((_, i) => i !== idx);
        return { ...sec, items };
      });
      markDirty();
      return { ...prev, [pageKey]: { ...page, secs } };
    });
  };

  // Add List Item
  const addListItem = (pageKey: string, secId: string) => {
    setPages((prev) => {
      const page = prev[pageKey];
      if (!page || !page.secs) return prev;
      const secs = page.secs.map((s) => {
        if (s.id !== secId || !s.items || !s.cols) return s;
        return { ...s, items: [...s.items, s.cols.map(() => '')] };
      });
      markDirty();
      return { ...prev, [pageKey]: { ...page, secs } };
    });
  };

  // SubTable Reorder / Add / Remove
  const moveSubItem = (pageKey: string, secId: string, idx: number, delta: number) => {
    setPages((prev) => {
      const page = prev[pageKey];
      if (!page || !page.secs) return prev;
      const secs = page.secs.map((s) => {
        if (s.id !== secId || !s.sub) return s;
        const items = [...s.sub.items];
        const targetIdx = idx + delta;
        if (targetIdx < 0 || targetIdx >= items.length) return s;
        const temp = items[idx];
        items[idx] = items[targetIdx];
        items[targetIdx] = temp;
        return { ...s, sub: { ...s.sub, items } };
      });
      markDirty();
      return { ...prev, [pageKey]: { ...page, secs } };
    });
  };

  const removeSubItem = (pageKey: string, secId: string, idx: number) => {
    setPages((prev) => {
      const page = prev[pageKey];
      if (!page || !page.secs) return prev;
      const secs = page.secs.map((s) => {
        if (s.id !== secId || !s.sub) return s;
        return { ...s, sub: { ...s.sub, items: s.sub.items.filter((_, i) => i !== idx) } };
      });
      markDirty();
      return { ...prev, [pageKey]: { ...page, secs } };
    });
  };

  const addSubItem = (pageKey: string, secId: string) => {
    setPages((prev) => {
      const page = prev[pageKey];
      if (!page || !page.secs) return prev;
      const secs = page.secs.map((s) => {
        if (s.id !== secId || !s.sub) return s;
        return { ...s, sub: { ...s.sub, items: [...s.sub.items, s.sub.cols.map(() => '')] } };
      });
      markDirty();
      return { ...prev, [pageKey]: { ...page, secs } };
    });
  };

  // Module row form modal
  const openModuleForm = (pageKey: string, secId: string, rowIdx: number) => {
    const s = pages[pageKey]?.secs?.find((x) => x.id === secId);
    if (!s || !s.mod) return;

    const row = rowIdx >= 0 ? s.mod.rows[rowIdx] : null;

    setModalTitle(rowIdx >= 0 ? 'Edit item' : 'Add new item');
    setModalContent(
      <div>
        <div className="ppm-fg">
          {s.mod.form.map((f, i) => (
            <div key={i}>
              <label>{f.l}</label>
              {f.img ? (
                <div className="ppm-img-upload">
                  ⬆ {row && f.i !== undefined ? row[f.i] : f.v ? `Replace · ${f.v}` : 'Upload'}
                </div>
              ) : f.a ? (
                <textarea
                  rows={3}
                  defaultValue={row && f.i !== undefined ? row[f.i] : f.v}
                  onChange={markDirty}
                />
              ) : f.sel ? (
                <select
                  defaultValue={row && f.i !== undefined ? row[f.i] : f.v}
                  onChange={markDirty}
                >
                  {f.sel.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || 'text'}
                  defaultValue={row && f.i !== undefined ? row[f.i] : f.v}
                  onChange={markDirty}
                />
              )}
            </div>
          ))}
        </div>
        <div className="ppm-note" style={{ marginTop: 14 }}>
          Saved as a draft until you publish. Public page updates the moment it’s published.
        </div>
      </div>
    );
    setModalOkText('Save');
    setModalOnOk(() => () => {
      closeModal();
      showToast('Saved. Published items now appear on the public page');
      markDirty();
    });
    setModalOpen(true);
  };

  const deleteModuleRow = (pageKey: string, secId: string, rowIdx: number) => {
    const s = pages[pageKey]?.secs?.find((x) => x.id === secId);
    if (!s || !s.mod) return;

    setModalTitle('Delete this item?');
    setModalContent(
      <p style={{ color: 'var(--slate)' }}>
        “{s.mod.rows[rowIdx][1] || s.mod.rows[rowIdx][0]}” will be removed from the public page. This can’t be undone.
      </p>
    );
    setModalOkText('Delete');
    setModalOnOk(() => () => {
      setPages((prev) => {
        const page = prev[pageKey];
        if (!page || !page.secs) return prev;
        const secs = page.secs.map((sec) => {
          if (sec.id !== secId || !sec.mod) return sec;
          const rows = sec.mod.rows.filter((_, i) => i !== rowIdx);
          return { ...sec, mod: { ...sec.mod, rows } };
        });
        return { ...prev, [pageKey]: { ...page, secs } };
      });
      closeModal();
      showToast('Deleted');
    });
    setModalOpen(true);
  };

  // Gallery Actions
  const moveGalleryPhoto = (idx: number, dir: 'top' | 'bot' | number) => {
    setGalleryPhotos((prev) => {
      const next = [...prev];
      const [photo] = next.splice(idx, 1);
      const targetIdx =
        dir === 'top' ? 0 : dir === 'bot' ? next.length : Math.max(0, Math.min(next.length, idx + dir));
      next.splice(targetIdx, 0, photo);
      markDirty();
      return next;
    });
  };

  const deleteGalleryPhoto = (idx: number) => {
    const photo = galleryPhotos[idx];
    setModalTitle('Delete this photo?');
    setModalContent(
      <p style={{ color: 'var(--slate)' }}>
        “{photo.t}” disappears from the public gallery. If it’s used in the hero collage you’ll be asked to pick another.
      </p>
    );
    setModalOkText('Delete');
    setModalOnOk(() => () => {
      setGalleryPhotos((prev) => prev.filter((_, i) => i !== idx));
      setHeroPhotoIds((prev) => prev.map((h) => (h === photo.id ? galleryPhotos[0].id : h)));
      closeModal();
      showToast('Photo deleted');
      markDirty();
    });
    setModalOpen(true);
  };

  const editGalleryPhoto = (idx: number) => {
    const photo = galleryPhotos[idx];
    setModalTitle('Edit photo');
    setModalContent(
      <div>
        <div className="ppm-fg">
          <div>
            <label>Title</label>
            <input defaultValue={photo.t} onChange={markDirty} />
          </div>
          <div>
            <label>Category</label>
            <select defaultValue={photo.cat} onChange={markDirty}>
              {galleryCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <label>Alt text (describes the photo for screen readers) *</label>
        <input defaultValue={photo.alt} onChange={markDirty} />
        <label>Replace image</label>
        <div className="ppm-img-upload">⬆ Upload a new file (keeps its position #{idx + 1})</div>
      </div>
    );
    setModalOkText('Save');
    setModalOnOk(() => () => {
      closeModal();
      showToast('Photo updated');
      markDirty();
    });
    setModalOpen(true);
  };

  const addCategory = () => {
    setModalTitle('New category');
    setModalContent(
      <div>
        <label>Name</label>
        <input id="newCatInput" placeholder="e.g. Feasts" />
      </div>
    );
    setModalOkText('Add');
    setModalOnOk(() => () => {
      const input = document.getElementById('newCatInput') as HTMLInputElement;
      const v = input?.value?.trim();
      if (!v) {
        showToast('Enter a name');
        return;
      }
      setGalleryCategories((prev) => [...prev, v]);
      closeModal();
      showToast(`Category "${v}" added`);
      markDirty();
    });
    setModalOpen(true);
  };

  const pickHeroCollage = () => {
    setModalTitle('Hero collage');
    setModalContent(
      <div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <label>{['Large photo', 'Small photo (top)', 'Small photo (bottom)'][i]}</label>
            <select
              id={`heroPick${i}`}
              defaultValue={heroPhotoIds[i]}
              style={{ width: '100%', padding: '8px' }}
            >
              {galleryPhotos.map((g) => (
                <option key={g.id} value={g.id}>
                  #{g.id} · {g.t}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
    setModalOkText('Save');
    setModalOnOk(() => () => {
      const newHero = [0, 1, 2].map(
        (i) => +((document.getElementById(`heroPick${i}`) as HTMLSelectElement)?.value || galleryPhotos[0].id)
      );
      setHeroPhotoIds(newHero);
      closeModal();
      showToast('Hero collage photos updated');
      markDirty();
    });
    setModalOpen(true);
  };

  // Upload modal state
  const openUploadModal = () => {
    let pendingFiles = [
      { t: `photo-${galleryPhotos.length + 1}`, alt: 'Worship celebration' },
      { t: `photo-${galleryPhotos.length + 2}`, alt: 'Church choir singing' },
    ];
    let pos: 'top' | 'bot' | 'aft' = 'top';
    let afterIdx = 0;
    let selectedCat = galleryCategories[0];
    let selectedStatus = 'Published';

    const renderUploadBody = () => (
      <div>
        <div
          className="ppm-img-upload"
          style={{ height: 80, cursor: 'pointer' }}
          onClick={() => showToast('File dialog opened')}
        >
          ⬆ Click to choose images (JPG, PNG, WebP · max 5 MB each)
        </div>
        <div style={{ marginTop: 12 }}>
          {pendingFiles.map((f, i) => (
            <div
              key={i}
              className="ppm-lr"
              style={{ gridTemplateColumns: '60px 1fr 1fr auto', marginBottom: 8 }}
            >
              <div
                style={{
                  height: 44,
                  borderRadius: 6,
                  background: `linear-gradient(135deg, ${GALLERY_PALETTES[(i + 3) % 8]})`,
                }}
              />
              <input placeholder="Title" defaultValue={f.t} />
              <input placeholder="Alt text *" defaultValue={f.alt} />
              <button
                className="ppm-ib"
                onClick={() => {
                  pendingFiles = pendingFiles.filter((_, idx) => idx !== i);
                  setModalContent(renderUploadBody());
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="ppm-fg" style={{ marginTop: 12 }}>
          <div>
            <label>Category</label>
            <select
              defaultValue={selectedCat}
              onChange={(e) => {
                selectedCat = e.target.value;
              }}
            >
              {galleryCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select
              defaultValue={selectedStatus}
              onChange={(e) => {
                selectedStatus = e.target.value;
              }}
            >
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        <label style={{ marginTop: 14 }}>Where should these photos appear in the gallery?</label>
        <div className="ppm-pos">
          <label className={`o ${pos === 'top' ? 'on' : ''}`}>
            <input
              type="radio"
              name="pp"
              checked={pos === 'top'}
              onChange={() => {
                pos = 'top';
                setModalContent(renderUploadBody());
              }}
            />
            <span>
              <b>Add at the top</b>
              <br />
              <small style={{ color: 'var(--slate)' }}>Becomes the first photo(s) on the page</small>
            </span>
          </label>
          <label className={`o ${pos === 'bot' ? 'on' : ''}`}>
            <input
              type="radio"
              name="pp"
              checked={pos === 'bot'}
              onChange={() => {
                pos = 'bot';
                setModalContent(renderUploadBody());
              }}
            />
            <span>
              <b>Add at the bottom</b>
              <br />
              <small style={{ color: 'var(--slate)' }}>Becomes the last photo(s)</small>
            </span>
          </label>
          <label className={`o ${pos === 'aft' ? 'on' : ''}`}>
            <input
              type="radio"
              name="pp"
              checked={pos === 'aft'}
              onChange={() => {
                pos = 'aft';
                setModalContent(renderUploadBody());
              }}
            />
            <span style={{ flex: 1 }}>
              <b>Insert after a specific photo</b>
              {pos === 'aft' && (
                <select
                  style={{ marginTop: 6 }}
                  defaultValue={afterIdx}
                  onChange={(e) => {
                    afterIdx = +e.target.value;
                  }}
                >
                  {galleryPhotos.map((g, i) => (
                    <option key={g.id} value={i}>
                      #{i + 1} · {g.t}
                    </option>
                  ))}
                </select>
              )}
            </span>
          </label>
        </div>
      </div>
    );

    setModalTitle('Upload photos');
    setModalContent(renderUploadBody());
    setModalOkText('Add to gallery');
    setModalOnOk(() => () => {
      const newItems: GalleryPhotoItem[] = pendingFiles.map((f, i) => ({
        id: Date.now() + i,
        t: f.t,
        cat: selectedCat,
        alt: f.alt,
        c: GALLERY_PALETTES[(galleryPhotos.length + i) % 8],
        h: [110, 150, 130][i % 3],
        nw: true,
        st: selectedStatus,
      }));

      setGalleryPhotos((prev) => {
        const next = [...prev];
        if (pos === 'top') next.unshift(...newItems);
        else if (pos === 'bot') next.push(...newItems);
        else next.splice(afterIdx + 1, 0, newItems[0], ...newItems.slice(1));
        return next;
      });

      closeModal();
      showToast(`${newItems.length} photos added to gallery`);
      markDirty();
    });
    setModalOpen(true);
  };

  const curPageDef = pages[curPage] || pages.about;

  return (
    <div className="ppm-root">
      {/* ── Top Simulator Toolbar ───────────────────────────────────────── */}
      <div className="ppm-pv">
        <b>DESIGN PREVIEW &amp; STUDIO</b>
        <label style={{ margin: 0, font: '600 12px Inter', textTransform: 'none', color: '#1E2A5E' }}>
          Signed in as{' '}
          <select
            value={activeRole}
            onChange={(e) => {
              const r = e.target.value as 's' | 'a';
              setActiveRole(r);
              if (r === 'a' && (curPage === 'shared' || curPage === 'acc')) {
                setCurPage('about');
              }
            }}
          >
            <option value="s">Super Admin</option>
            <option value="a">Admin (Content Editor)</option>
          </select>
        </label>
        <span style={{ fontWeight: 500, color: '#1E2A5E' }}>
          {activeRole === 'a'
            ? 'Admin sees only the pages the Super Admin granted. Reports is view-only here.'
            : 'Super Admin has full access to chrome, permissions, and all modules.'}
        </span>
      </div>

      {/* ── Abune Media Header Bar ───────────────────────────────────────── */}
      <div className="ppm-bar">
        <b>Abune Media</b>
        <span>Website · Pages &amp; sections</span>
        <div className="sp" />
        <span className="ppm-role-badge">
          {activeRole === 's' ? '🛡 Super Admin' : '📊 Admin · Content Editor'}
        </span>
      </div>

      {/* ── Main Shell (Sidebar + Editor Area) ───────────────────────────── */}
      <div className="ppm-shell">
        {/* Left Subnav */}
        <aside className="ppm-pl">
          <div className="g">Public pages</div>
          {Object.entries(pages)
            .filter(([k, v]) => !v.sup && !rolePermissions.hide.includes(k))
            .map(([k, v]) => (
              <button
                key={k}
                className={`ppm-pi ${curPage === k ? 'on' : ''}`}
                onClick={() => setCurPage(k)}
              >
                {v.n}
                {v.lock ? <em>🔒</em> : rolePermissions.view.includes(k) ? <em>view</em> : null}
              </button>
            ))}

          {!rolePermissions.hide.includes('shared') && (
            <>
              <div className="g">Shared</div>
              <button
                className={`ppm-pi ${curPage === 'shared' ? 'on' : ''}`}
                onClick={() => setCurPage('shared')}
              >
                Header, footer &amp; top bar
              </button>
            </>
          )}

          {isSimSuper && (
            <>
              <div className="g">Permissions</div>
              <button
                className={`ppm-pi ${curPage === 'acc' ? 'on' : ''}`}
                onClick={() => setCurPage('acc')}
              >
                Who can edit what
              </button>
            </>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="ppm-main">
          {/* View 1: Permissions Matrix ("Who can edit what") */}
          {curPage === 'acc' && isSimSuper ? (
            <div>
              <div className="ppm-top">
                <div>
                  <h1>Who can edit what</h1>
                  <p>Page-level access per role. Enforced on the server. Super Admin only.</p>
                </div>
              </div>
              <div className="ppm-card ppm-wrap" style={{ padding: '12px 16px' }}>
                <table className="ppm-table">
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Super Admin</th>
                      <th>Admin (Content Editor)</th>
                      <th>Events Manager</th>
                      <th>Media Manager</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(pages)
                      .filter(([k]) => k !== 'home')
                      .map(([k, v]) => (
                        <tr key={k}>
                          <td>
                            <b>{v.n}</b>
                          </td>
                          <td>
                            <select disabled defaultValue="Edit">
                              <option>Edit</option>
                            </select>
                          </td>
                          <td>
                            <select
                              defaultValue={k === 'shared' ? '—' : k === 'reports' ? 'View' : 'Edit'}
                              onChange={() => showToast(`Permissions for ${v.n} updated`)}
                            >
                              <option>Edit</option>
                              <option>View</option>
                              <option>—</option>
                            </select>
                          </td>
                          <td>
                            <select
                              defaultValue={k === 'events' || k === 'announcements' ? 'Edit' : '—'}
                              onChange={() => showToast(`Permissions for ${v.n} updated`)}
                            >
                              <option>Edit</option>
                              <option>View</option>
                              <option>—</option>
                            </select>
                          </td>
                          <td>
                            <select
                              defaultValue={k === 'gallery' ? 'Edit' : '—'}
                              onChange={() => showToast(`Permissions for ${v.n} updated`)}
                            >
                              <option>Edit</option>
                              <option>View</option>
                              <option>—</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="ppm-note" style={{ marginTop: 14 }}>
                “—” hides the page from that role completely. “View” shows it read-only. Super Admin always has full access.
              </div>
            </div>
          ) : curPageDef.lock ? (
            /* View 2: Locked Home Page */
            <div>
              <div className="ppm-top">
                <div>
                  <h1>Home</h1>
                  <p>The approved homepage design is locked.</p>
                </div>
              </div>
              <div className="ppm-card" style={{ padding: 20 }}>
                <div className="ppm-note w">
                  Home isn’t editable here. Its three live lists update by themselves from the modules:
                </div>
                {[
                  ['Upcoming events', 'Events page records'],
                  ['Gallery highlights', 'Gallery photos (first ones in order)'],
                  ['Latest announcements', 'Announcements records'],
                ].map(([feed, source], i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    <b>{feed}</b>
                    <span className="ppm-tag ppm-t-auto">Automatic · {source}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* View 3: Standard Page Section Studio */
            <div>
              <div className="ppm-top">
                <div>
                  <h1>{curPageDef.n}</h1>
                  <p>
                    Everything you can change on the public{' '}
                    {curPageDef.n === 'Header, footer & top bar' ? 'site chrome' : `${curPageDef.n} page`}, in the same
                    order as the page.
                  </p>
                </div>
                <Link
                  href={curPage === 'shared' ? '/' : `/${curPage}`}
                  target="_blank"
                  className="ppm-btn o"
                >
                  View live page ↗
                </Link>
              </div>

              {isViewOnly ? (
                <div className="ppm-note w">
                  View only. You don’t have permission to edit this page. Ask the Super Admin.
                </div>
              ) : (
                <div className="ppm-sticky">
                  <span className={`ppm-tag ${dirtyCount ? 'ppm-dr' : 'ppm-pub'}`}>
                    {dirtyCount ? `${dirtyCount} unsaved change${dirtyCount > 1 ? 's' : ''}` : 'All changes saved'}
                  </span>
                  <span className="sp" />
                  <button
                    className="ppm-btn o"
                    onClick={() => showToast('Opening draft preview in a new window')}
                  >
                    Preview draft
                  </button>
                  <button
                    className="ppm-btn o"
                    onClick={() => {
                      setDirtyCount(0);
                      showToast('Draft saved successfully');
                    }}
                  >
                    Save draft
                  </button>
                  <button
                    className="ppm-btn g"
                    onClick={() => {
                      setModalTitle('Publish changes?');
                      setModalContent(
                        <p style={{ color: 'var(--slate)' }}>
                          Your edits go live on the public {curPageDef.n} page immediately.
                        </p>
                      );
                      setModalOkText('Publish');
                      setModalOnOk(() => () => {
                        closeModal();
                        setDirtyCount(0);
                        showToast(`Published. The public ${curPageDef.n} page is updated.`);
                      });
                      setModalOpen(true);
                    }}
                  >
                    Publish
                  </button>
                </div>
              )}

              {/* Sections List */}
              <div className={isViewOnly ? 'ppm-ro' : ''}>
                {curPageDef.secs?.map((s, i) => {
                  const key = `${curPage}.${s.id}`;
                  const isOpen = openSections[key] ?? s.open ?? false;
                  const isVis = visibleSections[key] ?? true;

                  const tagConfig = {
                    text: { label: 'Text', cls: 'ppm-t-text' },
                    list: { label: 'List', cls: 'ppm-t-list' },
                    auto: { label: 'Automatic', cls: 'ppm-t-auto' },
                    module: { label: 'Records', cls: 'ppm-t-mod' },
                    gallery: { label: 'Photos', cls: 'ppm-t-gal' },
                  }[s.k];

                  return (
                    <div key={s.id} className="ppm-card ppm-sec">
                      <div className="ppm-sh" onClick={() => toggleSectionOpen(key)}>
                        <span style={{ color: 'var(--slate)', width: 14 }}>{isOpen ? '▾' : '▸'}</span>
                        <div className="nm">
                          <b>{s.n}</b>
                          {s.why && <small>{s.why}</small>}
                        </div>
                        <span className={`ppm-tag ${tagConfig.cls}`}>{tagConfig.label}</span>

                        {s.mv && (
                          <div style={{ display: 'inline-flex', gap: 3 }}>
                            <button
                              className="ppm-ib"
                              onClick={(e) => moveSection(curPage, i, -1, e)}
                              title="Move section up"
                            >
                              ↑
                            </button>
                            <button
                              className="ppm-ib"
                              onClick={(e) => moveSection(curPage, i, 1, e)}
                              title="Move section down"
                            >
                              ↓
                            </button>
                          </div>
                        )}

                        {!s.nohide && s.k !== 'auto' && (
                          <span
                            className={`ppm-sw ${isVis ? 'on' : ''}`}
                            onClick={(e) => toggleSectionVis(key, e)}
                            title={isVis ? 'Visible on page' : 'Hidden from page'}
                          />
                        )}
                      </div>

                      {isOpen && (
                        <div className="ppm-body">
                          {/* 1. TEXT SECTION */}
                          {s.k === 'text' && (
                            <>
                              <div className="ppm-fg">
                                {s.f?.map((field, fIdx) => (
                                  <div key={fIdx}>
                                    <label>{field.l}</label>
                                    {field.img ? (
                                      <div className="ppm-img-upload">
                                        ⬆ {field.v ? `Replace · ${field.v}` : 'Upload'}
                                      </div>
                                    ) : field.a ? (
                                      <textarea
                                        rows={3}
                                        defaultValue={field.v}
                                        onChange={markDirty}
                                      />
                                    ) : field.sel ? (
                                      <select defaultValue={field.v} onChange={markDirty}>
                                        {field.sel.map((o) => (
                                          <option key={o}>{o}</option>
                                        ))}
                                      </select>
                                    ) : (
                                      <input
                                        type={field.type || 'text'}
                                        defaultValue={field.v}
                                        onChange={markDirty}
                                      />
                                    )}
                                    {field.am !== undefined && (
                                      <input
                                        className="am"
                                        style={{ marginTop: 6 }}
                                        defaultValue={field.am}
                                        placeholder="አማርኛ"
                                        onChange={markDirty}
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Text Sub-table */}
                              {s.sub && (
                                <div style={{ marginTop: 14 }}>
                                  <label>{s.sub.l}</label>
                                  {s.sub.items.map((row, rIdx) => (
                                    <div
                                      key={rIdx}
                                      className="ppm-lr"
                                      style={{
                                        gridTemplateColumns: `repeat(${s.sub?.cols.length || 1}, 1fr) auto`,
                                      }}
                                    >
                                      {s.sub?.cols.map((col, cIdx) => (
                                        <div key={cIdx}>
                                          <label style={{ margin: '0 0 2px', fontSize: 10 }}>{col}</label>
                                          <input defaultValue={row[cIdx] || ''} onChange={markDirty} />
                                        </div>
                                      ))}
                                      <div className="ac">
                                        <button
                                          className="ppm-ib"
                                          onClick={() => moveSubItem(curPage, s.id, rIdx, -1)}
                                        >
                                          ↑
                                        </button>
                                        <button
                                          className="ppm-ib"
                                          onClick={() => moveSubItem(curPage, s.id, rIdx, 1)}
                                        >
                                          ↓
                                        </button>
                                        <button
                                          className="ppm-ib"
                                          onClick={() => removeSubItem(curPage, s.id, rIdx)}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                  <button
                                    className="ppm-btn o s"
                                    style={{ marginTop: 8 }}
                                    onClick={() => addSubItem(curPage, s.id)}
                                  >
                                    + Add {s.sub.l}
                                  </button>
                                </div>
                              )}
                            </>
                          )}

                          {/* 2. LIST SECTION */}
                          {s.k === 'list' && (
                            <>
                              {s.intro && (
                                <div className="ppm-fg">
                                  {s.intro.map((f, iIdx) => (
                                    <div key={iIdx}>
                                      <label>{f.l}</label>
                                      {f.a ? (
                                        <textarea rows={3} defaultValue={f.v} onChange={markDirty} />
                                      ) : (
                                        <input defaultValue={f.v} onChange={markDirty} />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              <label style={{ marginTop: 14 }}>Items (shown in this order)</label>
                              {s.items?.map((r, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="ppm-lr"
                                  style={{
                                    gridTemplateColumns: `repeat(${s.cols?.length || 1}, 1fr) auto`,
                                  }}
                                >
                                  {s.cols?.map((c, cIdx) => (
                                    <div key={cIdx}>
                                      <label style={{ margin: '0 0 2px', fontSize: 10 }}>{c}</label>
                                      <input defaultValue={r[cIdx] || ''} onChange={markDirty} />
                                    </div>
                                  ))}
                                  <div className="ac">
                                    <button
                                      className="ppm-ib"
                                      onClick={() => moveListItem(curPage, s.id, rIdx, -1)}
                                    >
                                      ↑
                                    </button>
                                    <button
                                      className="ppm-ib"
                                      onClick={() => moveListItem(curPage, s.id, rIdx, 1)}
                                    >
                                      ↓
                                    </button>
                                    <button
                                      className="ppm-ib"
                                      onClick={() => removeListItem(curPage, s.id, rIdx)}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ))}

                              {!s.max || (s.items && s.items.length < s.max) ? (
                                <button
                                  className="ppm-btn o s"
                                  style={{ marginTop: 8 }}
                                  onClick={() => addListItem(curPage, s.id)}
                                >
                                  + Add item
                                </button>
                              ) : (
                                <small style={{ color: 'var(--slate)', display: 'block', marginTop: 8 }}>
                                  Maximum reached for this layout.
                                </small>
                              )}

                              {s.extra && (
                                <div className="ppm-fg" style={{ marginTop: 12 }}>
                                  {s.extra.map((f, eIdx) => (
                                    <div key={eIdx}>
                                      <label>{f.l}</label>
                                      <input defaultValue={f.v} onChange={markDirty} />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}

                          {/* 3. AUTOMATIC SECTION */}
                          {s.k === 'auto' && <div className="ppm-note">{s.info}</div>}

                          {/* 4. MODULE (TABLE / RECORDS) */}
                          {s.k === 'module' && s.mod && (
                            <>
                              <div className="ppm-note w">
                                Edit text here or manage the full records. Anything published here appears on the public
                                page
                                {curPage === 'events' || curPage === 'announcements'
                                  ? ' and in the member portal'
                                  : ''}
                                .
                              </div>
                              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                <button
                                  className="ppm-btn g s"
                                  onClick={() => openModuleForm(curPage, s.id, -1)}
                                >
                                  + Add new
                                </button>
                              </div>
                              <div className="ppm-wrap">
                                <table className="ppm-table">
                                  <thead>
                                    <tr>
                                      {s.mod.cols.map((col) => (
                                        <th key={col}>{col}</th>
                                      ))}
                                      <th style={{ width: 120 }}>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {s.mod.rows.map((row, rIdx) => (
                                      <tr key={rIdx}>
                                        {row.map((cell, cIdx) => (
                                          <td key={cIdx}>
                                            {SV.includes(cell) ? (
                                              <span
                                                className={`ppm-tag ${cell === 'Published' ? 'ppm-pub' : 'ppm-dr'}`}
                                              >
                                                {cell}
                                              </span>
                                            ) : (
                                              cell
                                            )}
                                          </td>
                                        ))}
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                          <button
                                            className="ppm-btn o s"
                                            onClick={() => openModuleForm(curPage, s.id, rIdx)}
                                          >
                                            Edit
                                          </button>{' '}
                                          <button
                                            className="ppm-btn r s"
                                            onClick={() => deleteModuleRow(curPage, s.id, rIdx)}
                                          >
                                            Delete
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </>
                          )}

                          {/* 5. GALLERY MANAGER */}
                          {s.k === 'gallery' && (
                            <div>
                              <div className="ppm-note w">
                                <b>Order matters.</b> The photos below appear on the public Gallery in exactly this order
                                (1 = top-left). New uploads let you choose where they go.
                              </div>

                              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 14 }}>
                                <div>
                                  <label style={{ marginTop: 0 }}>Hero collage (top right of page)</label>
                                  <div className="ppm-hero3">
                                    {heroPhotoIds.map((hid, hIdx) => {
                                      const p = galleryPhotos.find((x) => x.id === hid) || galleryPhotos[0];
                                      return (
                                        <div
                                          key={hIdx}
                                          style={{ background: `linear-gradient(135deg, ${p.c})` }}
                                        >
                                          {hIdx === 0 ? 'Large' : 'Small'}: {p.t}
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <button
                                    className="ppm-btn o s"
                                    style={{ marginTop: 8 }}
                                    onClick={pickHeroCollage}
                                  >
                                    Change hero photos
                                  </button>
                                </div>

                                <div style={{ flex: 1, minWidth: 220 }}>
                                  <label style={{ marginTop: 0 }}>Categories (filter chips on the page)</label>
                                  <div className="ppm-chips">
                                    {galleryCategories.map((cat, catIdx) => (
                                      <span key={cat} className="ppm-chip">
                                        {cat}{' '}
                                        <b
                                          style={{ cursor: 'pointer', marginLeft: 6, color: 'var(--red)' }}
                                          onClick={() => {
                                            setGalleryCategories((prev) => prev.filter((_, i) => i !== catIdx));
                                            markDirty();
                                          }}
                                        >
                                          ✕
                                        </b>
                                      </span>
                                    ))}
                                    <span
                                      className="ppm-chip on"
                                      style={{ cursor: 'pointer' }}
                                      onClick={addCategory}
                                    >
                                      + Add category
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Upload bar & Filters */}
                              <div
                                style={{
                                  display: 'flex',
                                  gap: 12,
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  marginTop: 18,
                                  paddingTop: 14,
                                  borderTop: '1px solid var(--line)',
                                }}
                              >
                                <button className="ppm-btn g" onClick={openUploadModal}>
                                  ⬆ Upload photos
                                </button>
                                <div className="ppm-chips" style={{ flex: 1 }}>
                                  {['All', ...galleryCategories].map((cat) => (
                                    <span
                                      key={cat}
                                      className={`ppm-chip ${galleryFilter === cat ? 'on' : ''}`}
                                      onClick={() => setGalleryFilter(cat)}
                                    >
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                                <small style={{ color: 'var(--slate)' }}>
                                  {galleryPhotos.length} photos
                                </small>
                              </div>

                              {/* Photos Masonry Columns */}
                              <div className="ppm-gal">
                                {galleryPhotos
                                  .filter((g) => galleryFilter === 'All' || g.cat === galleryFilter)
                                  .map((g, pIdx) => (
                                    <div key={g.id} className="ppm-gt">
                                      <div
                                        className="ph"
                                        style={{
                                          height: g.h,
                                          background: `linear-gradient(135deg, ${g.c})`,
                                        }}
                                      >
                                        <span className="nb">#{pIdx + 1}</span>
                                        {g.nw && <span className="nw">NEW</span>}
                                        {g.t}
                                      </div>
                                      <div className="ft">
                                        <b>{g.t}</b>
                                        <small>
                                          {g.cat} ·{' '}
                                          {g.alt ? (
                                            'alt ✓'
                                          ) : (
                                            <span style={{ color: 'var(--red)' }}>no alt text</span>
                                          )}
                                        </small>
                                      </div>
                                      <div className="bt">
                                        <button
                                          className="ppm-ib"
                                          title="Move to top"
                                          onClick={() => moveGalleryPhoto(pIdx, 'top')}
                                        >
                                          ⤒
                                        </button>
                                        <button
                                          className="ppm-ib"
                                          title="Move up"
                                          onClick={() => moveGalleryPhoto(pIdx, -1)}
                                        >
                                          ↑
                                        </button>
                                        <button
                                          className="ppm-ib"
                                          title="Move down"
                                          onClick={() => moveGalleryPhoto(pIdx, 1)}
                                        >
                                          ↓
                                        </button>
                                        <button
                                          className="ppm-ib"
                                          title="Move to bottom"
                                          onClick={() => moveGalleryPhoto(pIdx, 'bot')}
                                        >
                                          ⤓
                                        </button>
                                        <button
                                          className="ppm-ib"
                                          onClick={() => editGalleryPhoto(pIdx)}
                                        >
                                          Edit
                                        </button>
                                        <button
                                          className="ppm-ib"
                                          style={{ color: 'var(--red)' }}
                                          onClick={() => deleteGalleryPhoto(pIdx)}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Generic Modal ─────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="ppm-modal" onClick={closeModal}>
          <div className="card" onClick={(e) => e.stopPropagation()}>
            <h3>{modalTitle}</h3>
            <div>{modalContent}</div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 18 }}>
              <button className="ppm-btn o" onClick={closeModal}>
                Cancel
              </button>
              {modalOkText && (
                <button
                  className="ppm-btn g"
                  onClick={() => {
                    if (modalOnOk) modalOnOk();
                  }}
                >
                  {modalOkText}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Toast Notification ───────────────────────────────────────────── */}
      {toastText && <div className="ppm-toast">{toastText}</div>}
    </div>
  );
}
