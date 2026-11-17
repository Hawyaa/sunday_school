import dotenv from 'dotenv';
import { PrismaClient, AdminRole, AgeDivision, RegistrationType, Gender, MemberStatus } from '@prisma/client';
import { hashPassword } from '../src/utils/bcrypt';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Comprehensive Sunday School Database Seeding ---');

  // 1. Initial Administrator
  const email = (process.env.ADMIN_INITIAL_EMAIL || 'admin@abunemedia.org').toLowerCase().trim();
  const password = process.env.ADMIN_INITIAL_PASSWORD || 'SecureAdminPassword123!';
  const name = process.env.ADMIN_INITIAL_NAME || 'System Administrator';
  const roleInput = process.env.ADMIN_INITIAL_ROLE || 'SUPER_ADMIN';
  const role = roleInput in AdminRole ? (roleInput as AdminRole) : AdminRole.SUPER_ADMIN;

  let admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    const passwordHash = await hashPassword(password);
    admin = await prisma.admin.create({
      data: {
        email,
        passwordHash,
        name,
        role,
        isActive: true,
        canTakeAttendance: true,
        assignedClasses: 'Grade 3, Grade 7, Mezmur A',
      },
    });
    console.log(`[Seed] Administrator created: ${admin.email}`);
  } else {
    admin = await prisma.admin.update({
      where: { id: admin.id },
      data: { canTakeAttendance: true, assignedClasses: 'Grade 3, Grade 7, Mezmur A' },
    });
    console.log(`[Seed] Administrator updated with attendance permissions: ${admin.email}`);
  }

  // 2. Announcements
  const existingAnnouncements = await prisma.announcement.count();
  if (existingAnnouncements === 0) {
    console.log('[Seed] Seeding announcements...');
    const announcementsData = [
      {
        title: 'Feast of the Holy Cross Preparation & Sacred Liturgy',
        summary: 'Annual liturgical arrangements, deacon schedule, and choir preparations for the upcoming feast.',
        content: `የመስቀል ደመራ በዓል አከባበርና መንፈሳዊ ዝግጅት አስመልክቶ ለተማሪዎችና ለምእመናን የተላለፈ ማስታወቂያ።

ሁሉንም የሰንበት ትምህርት ቤት ተማሪዎች፣ መዘምራንና ወጣቶች በበዓለ መስቀል ዋዜማ በሚካሄደው ልዩ የዝማሬና የስብከተ ወንጌል ጉባኤ ላይ በሰዓቱ እንድትገኙ እናሳስባለን።

የመርሐ ግብሩ ሰዓት፦ ከቀኑ 8:00 ጀምሮ
ቦታ፦ በደብረ ዲዮስቆሮስ ቤተክርስቲያን ዋና አዳራሽ`,
        category: 'Culture',
        imageUrl: '/images/announcement-1.jpg',
        isPinned: true,
        isPublished: true,
        publishedAt: new Date(Date.now() - 2 * 86400000),
        createdById: admin.id,
      },
      {
        title: 'New Sunday School Youth Registration and Orientation',
        summary: 'Registration is now open for new students across Children, Intermediate, and Youth divisions.',
        content: `ለአዲሱ የትምህርት ዘመን የሰንበት ትምህርት ቤት ምዝገባ ተጀምሯል።

በሕፃናት፣ በማዕከላውያንና በወጣቶች ክፍሎች ለመመዝገብ የምትፈልጉ አዳዲስ ተማሪዎች በድረ-ገጻችን የምዝገባ ቅጽ (/register) በመሙላት ወይም በቢሮ በአካል በመቅረብ መመዝገብ ትችላላችሁ።

የምዝገባ ጊዜ፦ እስከ ጥቅምት 30 ቀን ድረስ
ለበለጠ መረጃ፦ በስልክ ቁጥር +251 911 123 456 ያነጋግሩን።`,
        category: 'Education',
        imageUrl: '/images/announcement-2.jpg',
        isPinned: true,
        isPublished: true,
        publishedAt: new Date(Date.now() - 5 * 86400000),
        createdById: admin.id,
      },
      {
        title: 'Community Charity and Humanitarian Outreach',
        summary: 'Join our welfare ministry in providing food, clothing, and support to families in need.',
        content: `የበጎ አድራጎትና የማኅበራዊ አገልግሎት ክፍል ያዘጋጀው የበዓል መረዳጃ ፕሮግራም።

የተቸገሩ ወገኖቻችንን ለመርዳት የሚደረገውን የልብስና የምግብ ድጋፍ ማሰባሰብ በቤተክርስቲያናችን ቅጥር ግቢ በመካሄድ ላይ ይገኛል። ምእመናን የበረከቱ ተካፋይ እንድትሆኑ በታላቅ ክርስቲያናዊ አክብሮት እንጋብዛለን።`,
        category: 'Community',
        imageUrl: '/images/gallery/gallery-community-1.jpg',
        isPinned: false,
        isPublished: true,
        publishedAt: new Date(Date.now() - 8 * 86400000),
        createdById: admin.id,
      },
      {
        title: 'Saint Yared Sacred Music and Hymnody Seminar',
        summary: 'Special vocal training and hymnody study for all registered church choir members.',
        content: `የቅዱስ ያሬድ ዜማና የዝማሬ ጥናት ሴሚናር።

የመዘምራን ክፍል አባላት የድምፅና የዜማ ጥበብ ክህሎታቸውን የሚያዳብሩበት ሳምንታዊ ሥልጠና ዘወትር ቅዳሜ ከቀኑ 9:00 ጀምሮ ይሰጣል።`,
        category: 'Topics',
        imageUrl: '/images/gallery/gallery-celebration-1.jpg',
        isPinned: false,
        isPublished: true,
        publishedAt: new Date(Date.now() - 11 * 86400000),
        createdById: admin.id,
      },
      {
        title: 'Spiritual Fellowship and Youth Leadership Conference',
        summary: 'Engaging discussions on Christian ethics, digital evangelism, and community building.',
        content: `የወጣቶች መንፈሳዊ ሕብረትና የአመራር ክህሎት አውደ-ጥናት።

ወጣቶች በእምነት ጸንተው እንዲኖሩና ለማኅበረሰባቸው የበኩላቸውን አስተዋፅዖ እንዲያበረክቱ የሚያግዝ ልዩ የውይይት መድረክ ይካሄዳል።`,
        category: 'Conference',
        imageUrl: '/images/events/featured.jpg',
        isPinned: false,
        isPublished: true,
        publishedAt: new Date(Date.now() - 14 * 86400000),
        createdById: admin.id,
      },
      {
        title: 'Parish Renewal and Church Sanctuary Expansion Milestone',
        summary: 'Progress report on the restoration work of the main sanctuary and compound development.',
        content: `የቤተ መቅደስ እድሳትና የማስፋፊያ ሥራ የደረሰበት ደረጃ ሪፖርት።

የምእመናን ተሳትፎና ድጋፍ ተጠናክሮ እንዲቀጥል ጥሪ እያቀረብን የተከናወኑ ተግባራትን በዝርዝር እናሳውቃለን።`,
        category: 'Business',
        imageUrl: '/images/about-church.jpg',
        isPinned: false,
        isPublished: true,
        publishedAt: new Date(Date.now() - 18 * 86400000),
        createdById: admin.id,
      },
    ];

    for (const item of announcementsData) {
      await prisma.announcement.create({ data: item });
    }
  }

  // 3. Events
  const existingEvents = await prisma.event.count();
  if (existingEvents === 0) {
    console.log('[Seed] Seeding events...');
    const eventsData = [
      {
        title: 'Feast of the Holy Cross (Meskel Celebration)',
        description: 'Parish gathering, bonfire lighting ceremony, choral presentations, and spiritual liturgy.',
        location: 'Debre Dioskoros Sanctuary Grounds, Addis Ababa',
        startDate: new Date(Date.now() + 3 * 86400000),
        endDate: new Date(Date.now() + 3 * 86400000 + 4 * 3600000),
        isPublished: true,
        imageUrl: '/images/events/hero.jpg',
        category: 'Celebration',
      },
      {
        title: 'Youth Fellowship & Spiritual Seminar',
        description: 'An inspiring interactive gathering for youth exploring living faith and biblical values.',
        location: 'Main Auditorium, Hall 1',
        startDate: new Date(Date.now() + 7 * 86400000),
        endDate: new Date(Date.now() + 7 * 86400000 + 3 * 3600000),
        isPublished: true,
        imageUrl: '/images/events/event-1.jpg',
        category: 'Youth',
      },
      {
        title: 'Bible Study & Catechism Teaching',
        description: 'In-depth scripture reflection on Church Dogma and Patristic teachings.',
        location: 'Sunday School Lecture Hall',
        startDate: new Date(Date.now() + 10 * 86400000),
        endDate: new Date(Date.now() + 10 * 86400000 + 2 * 3600000),
        isPublished: true,
        imageUrl: '/images/teaching.jpg',
        category: 'Teaching',
      },
      {
        title: 'Spiritual Guidance & Confession Weekend',
        description: 'Pastoral counseling, spiritual consultation, and prayers with church elders and fathers.',
        location: 'Counseling Office & Chapel',
        startDate: new Date(Date.now() + 14 * 86400000),
        endDate: new Date(Date.now() + 14 * 86400000 + 5 * 3600000),
        isPublished: true,
        imageUrl: '/images/gallery/gallery-worship-1.jpg',
        category: 'Spiritual',
      },
      {
        title: 'Sunday School Term Celebration & Student Awards',
        description: 'End-of-term student hymn performances, certificates distribution, and community luncheon.',
        location: 'Parish Cultural Hall',
        startDate: new Date(Date.now() + 21 * 86400000),
        endDate: new Date(Date.now() + 21 * 86400000 + 4 * 3600000),
        isPublished: true,
        imageUrl: '/images/gallery/gallery-youth-1.jpg',
        category: 'Sunday School',
      },
    ];

    for (const ev of eventsData) {
      await prisma.event.create({ data: ev });
    }
  }

  // 4. Reports
  const existingReports = await prisma.report.count();
  if (existingReports === 0) {
    console.log('[Seed] Seeding reports...');
    const reportsData = [
      {
        title: 'Clergy & Pastoral Ministry Performance Report',
        summary: 'Administrative and pastoral summary detailing liturgical services and parish outreach.',
        content: `የካህናትና አገልጋዮች የሥራ አፈጻጸም ዓመታዊ ሪፖርት።
በዓመቱ የተከናወኑ የቅዳሴ፣ የትምህርተ ወንጌል፣ የምስጢራተ ቤተክርስቲያን አፈጻጸም እና የምእመናን አገልግሎት በዝርዝር ቀርቧል።`,
        category: 'Administrative',
        fileUrl: '#',
        reportDate: new Date('2026-04-15'),
        isPublished: true,
      },
      {
        title: 'Sunday School Education Department Annual Report',
        summary: 'Comprehensive progress on student enrollment, curriculum completion, and youth ministries.',
        content: `የትምህርት ክፍል የሥራ አፈጻጸም ሪፖርት።
በሕፃናት፣ ማዕከላውያንና ወጣቶች ክፍሎች የተሰጡ ትምህርቶች፣ የተማሪዎች ውጤት እና የክረምት መርሐ ግብሮች ዝርዝር ሪፖርት።`,
        category: 'Educational',
        fileUrl: '#',
        reportDate: new Date('2026-03-20'),
        isPublished: true,
      },
      {
        title: 'Sacred Choir and Music Ministry Performance Report',
        summary: 'Choir activities, hymn recordings, and feast-day liturgical participation summary.',
        content: `የመዘምራን አገልግሎት አፈጻጸም ሪፖርት።
በያሬዳዊ ዜማና በመንፈሳዊ መዝሙራት ዙሪያ የተከናወኑ ስልጠናዎችና የበዓላት አገልግሎት የተካተቱበት ሰነድ።`,
        category: 'Ministry',
        fileUrl: '#',
        reportDate: new Date('2026-02-10'),
        isPublished: true,
      },
      {
        title: 'Parish Financial and Sanctuary Development Audit',
        summary: 'Annual audited financial statement and sanctuary restoration funding breakdown.',
        content: `የበጀትና የልማት ሂሳብ ኦዲት ሪፖርት።
የምእመናን መዋጮ፣ ስጦታዎችና ለቤተ መቅደስ ማስዋቢያ የዋሉ ወጪዎች የተሟላ የሂሳብ መግለጫ።`,
        category: 'Financial',
        fileUrl: '#',
        reportDate: new Date('2026-01-25'),
        isPublished: true,
      },
    ];

    for (const r of reportsData) {
      await prisma.report.create({ data: r });
    }
  }

  // 5. Mezmurs
  const existingMezmurs = await prisma.mezmur.count();
  if (existingMezmurs === 0) {
    console.log('[Seed] Seeding mezmurs...');
    const mezmurData = [
      {
        title: 'አቡነ ዘበሰማያት (Our Father)',
        originalTitle: 'Abune Zebesemayat',
        lyrics: `አቡነ ዘበሰማያት፡ ይትቀደስ ስምከ።
ትምጻእ መንግሥትከ። ወይኩን ፈቃድከ
በሰማይ ከመ በምድር።
ሲሳይነ ዘለለ ዕለትነ ሀበነ ዮም።
ኅድግ ለነ አበሳነ ወጌጋይነ፡
ከመ ንሕነኒ ንኅድግ ለዘአበሰ ለነ።
ኢታብአነ እግዚኦ ውስተ መንሱት፡
አላ አድኅነነ ወባልሐነ እምኩሉ እኩይ።
እስመ ዚአከ ይእቲ መንግሥት ኃይል ወስብሐት ለዓለመ ዓለም አሜን።`,
        category: 'Praise',
        artistChoir: 'Debre Dioskoros Sunday School Choir',
        audioUrl: 'https://cdn.freesound.org/previews/612/612089_11861866-lq.mp3',
        isPublished: true,
      },
      {
        title: 'መስቀል አብርሃ (The Cross Shone)',
        originalTitle: 'Meskel Abreha',
        lyrics: `መስቀል አብርሃ በከዋክብት አሠርገወ ሰማየ።
ሰማየ ፀሐየ ወርኃ አብርሃ።
በመስቀሉ ደመነ ኲሉ ዓለም ተፈሥሐ።`,
        category: 'Meskel',
        artistChoir: 'St. Stephen Choir',
        audioUrl: 'https://cdn.freesound.org/previews/612/612089_11861866-lq.mp3',
        isPublished: true,
      },
      {
        title: 'ሰላም ለኪ ማርያም (Hail Mary)',
        originalTitle: 'Selam Leki Mariam',
        lyrics: `ሰላም ለኪ ማርያም እግዚአብሔር ምስሌኪ።
ቡርክት አንቲ እምአንስት ወቡሩክ ፍሬ ከርሥኪ።
ተፈሥሒ ፍሥሕት ኦ ምልእተ ጸጋ፡
እግዚአብሔር ምስሌኪ።
ጸልዪ ወስእሊ ምሕረተ ወሣህለ፡
ቅድመ መንበረ ጸጋሁ ለአምላክነ።`,
        category: 'Mariam',
        artistChoir: 'St. Mary Choir',
        audioUrl: 'https://cdn.freesound.org/previews/612/612089_11861866-lq.mp3',
        isPublished: true,
      },
      {
        title: 'ጾም ወጸሎት (Fasting and Prayer)',
        originalTitle: 'Tsom WeTselot',
        lyrics: `ጾም ትፌውስ ቍስለ ነፍስ።
ጸሎት ታቀርብ ኀበ እግዚአብሔር።
በትዕግሥት ጸንተን በሃይማኖት ቆመን
የአምላካችንን ቸርነት እናመሰግናለን።`,
        category: 'Fasting',
        artistChoir: 'Youth Fellowship Ensemble',
        audioUrl: 'https://cdn.freesound.org/previews/612/612089_11861866-lq.mp3',
        isPublished: true,
      },
    ];

    for (const m of mezmurData) {
      await prisma.mezmur.create({ data: m });
    }
  }

  // 6. Teachings
  const existingTeachings = await prisma.teaching.count();
  if (existingTeachings === 0) {
    console.log('[Seed] Seeding teachings...');
    const teachingsData = [
      {
        title: 'The Mystery of the Holy Trinity & Orthodox Dogma',
        author: 'Abba Melke Sedek',
        category: 'Faith',
        content: `ስለ ምሥጢረ ሥላሴ አንድነትና ሦስትነት እንዲሁም የኦርቶዶክስ ተዋሕዶ ሃይማኖት ዶግማ የተዘጋጀ ጥልቅ ትምህርት።
እግዚአብሔር በስም፣ በአካል፣ በግብር ሦስት ሲሆን በባሕርይ፣ በህልውና፣ በመለኮት፣ በፈቃድ፣ በሥልጣን አንድ ነው። ይህ ትምህርት እያንዳንዱ ክርስቲያን የሃይማኖቱን መሠረት በሚገባ እንዲረዳ ያግዛል።`,
        mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        isPublished: true,
        publishedAt: new Date(Date.now() - 5 * 86400000),
      },
      {
        title: 'Spiritual Lessons from the Holy Scriptures',
        author: 'Abune Yohannes',
        category: 'Scripture',
        content: `ለዕለታዊ መንፈሳዊ ሕይወት የሚረዱ መሠረታዊ የመጽሐፍ ቅዱስ ትምህርቶችና የሕይወት መመሪያዎች።
ቅዱሳት መጻሕፍት የእግዚአብሔርን ሕያው ቃል የያዙ የመዳናችን መመሪያዎች ናቸው። በጸሎትና በትህትና መመርመር የመንፈሳዊ ዕውቀት መጀመሪያ ነው።`,
        mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        isPublished: true,
        publishedAt: new Date(Date.now() - 12 * 86400000),
      },
      {
        title: 'The Spiritual Discipline of Fasting & Prayer',
        author: 'Teacher Samuel',
        category: 'Fasting',
        content: `የጾምና የጸሎት መንፈሳዊ ሥርዓት እንዲሁም ሰባቱ አጽዋማት ለነፍስ ድኅነት ያላቸው ፋይዳ።
ጾም ሥጋን ለነፍስ ማስገዛት ሲሆን በጸሎትና በምጽዋት ሲታጀብ ወደ እግዚአብሔር የሚያደርስ ኃያል መንፈሳዊ መሣሪያ ነው።`,
        mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        isPublished: true,
        publishedAt: new Date(Date.now() - 20 * 86400000),
      },
    ];

    for (const t of teachingsData) {
      await prisma.teaching.create({ data: t });
    }
  }

  // 7. Gallery Albums & Photos
  const existingAlbums = await prisma.galleryAlbum.count();
  if (existingAlbums === 0) {
    console.log('[Seed] Seeding gallery albums & photos...');
    const albums = [
      {
        title: 'Sacred Worship & Liturgy',
        description: 'Venerated moments during the Divine Liturgy and Eucharistic service.',
        coverImageUrl: '/images/gallery/gallery-worship-1.jpg',
        eventDate: new Date('2026-03-15'),
        isPublished: true,
        photos: [
          { imageUrl: '/images/gallery/gallery-worship-1.jpg', title: 'Holy Scripture & Sacred Cross Ceremony', caption: 'ቅዱስ መጽሐፍና የክብር መስቀል ሥርዓት', sortOrder: 1 },
          { imageUrl: '/images/gallery/gallery-worship-2.jpg', title: 'Altar Service & Divine Liturgy', caption: 'የውስጠ መቅደስ ቅዳሴ አገልግሎት', sortOrder: 2 },
        ],
      },
      {
        title: 'Feast Day Celebrations',
        description: 'Parish processions and traditional liturgical umbrellas honoring our patron saint.',
        coverImageUrl: '/images/gallery/gallery-celebration-1.jpg',
        eventDate: new Date('2026-02-28'),
        isPublished: true,
        photos: [
          { imageUrl: '/images/gallery/gallery-celebration-1.jpg', title: 'Clergy Procession with Traditional Umbrellas', caption: 'የካህናትና የዲያቆናት የበዓል ሥነ-ሥርዓት', sortOrder: 1 },
          { imageUrl: '/images/gallery/gallery-celebration-2.jpg', title: 'Sanctuary Gathering & Chants', caption: 'የበዓለ ንግሥ ጉባኤና ዝማሬ', sortOrder: 2 },
        ],
      },
      {
        title: 'Sunday School Youth Fellowship',
        description: 'Students engaged in scripture study, hymn practices, and service.',
        coverImageUrl: '/images/gallery/gallery-youth-1.jpg',
        eventDate: new Date('2026-01-20'),
        isPublished: true,
        photos: [
          { imageUrl: '/images/gallery/gallery-youth-1.jpg', title: 'Sunday School Students & Sacred Choir', caption: 'የሰንበት ት/ቤት ተማሪዎችና መዘምራን ሕብረት', sortOrder: 1 },
          { imageUrl: '/images/gallery/gallery-community-1.jpg', title: 'Congregation Fellowship & Prayer', caption: 'የምእመናን የጋራ ጸሎትና መንፈሳዊ ጉባኤ', sortOrder: 2 },
        ],
      },
    ];

    for (const alb of albums) {
      const { photos, ...albumData } = alb;
      const createdAlbum = await prisma.galleryAlbum.create({ data: albumData });
      for (const p of photos) {
        await prisma.galleryPhoto.create({
          data: {
            albumId: createdAlbum.id,
            imageUrl: p.imageUrl,
            title: p.title,
            caption: p.caption,
            sortOrder: p.sortOrder,
          },
        });
      }
    }
  }

  // 8. Weekly Schedules
  const existingSchedules = await prisma.schedule.count();
  if (existingSchedules === 0) {
    console.log('[Seed] Seeding service schedules...');
    const schedulesData = [
      { title: 'Morning Prayer', activity: 'የጠዋት ጸሎት', dayOfWeek: 'Sunday', startTime: '8:00 AM', endTime: '9:00 AM', targetGroup: 'All Faithful', location: 'Church Grounds, Addis Ababa', isPublished: true },
      { title: 'Holy Liturgy (Divine Mass)', activity: 'ቅዳሴ (ቅድስት ቁርባን)', dayOfWeek: 'Sunday', startTime: '9:00 AM', endTime: '11:30 AM', targetGroup: 'All Faithful', location: 'Main Altar Sanctuary', isPublished: true },
      { title: 'Bible Study & Teaching', activity: 'መጽሐፍ ቅዱስ ጥናትና ትምህርት', dayOfWeek: 'Tuesday', startTime: '3:00 PM', endTime: '4:30 PM', targetGroup: 'Youth & Adults', location: 'Church Hall 1', isPublished: true },
      { title: 'Vespers (Evening Prayer)', activity: 'ማህሌት (የምሽት ጸሎት)', dayOfWeek: 'Wednesday', startTime: '5:00 PM', endTime: '6:30 PM', targetGroup: 'All Faithful', location: 'Chapel', isPublished: true },
      { title: 'Youth Fellowship', activity: 'የወጣቶች ኅብረት', dayOfWeek: 'Thursday', startTime: '3:00 PM', endTime: '5:00 PM', targetGroup: 'Youth Division', location: 'Church Hall 2', isPublished: true },
      { title: 'Confession & Spiritual Guidance', activity: 'ኑዛዜና መንፈሳዊ ምክር', dayOfWeek: 'Friday', startTime: '3:00 PM', endTime: '6:00 PM', targetGroup: 'All Faithful', location: 'Pastoral Office', isPublished: true },
      { title: 'Sacred Choir Rehearsal', activity: 'የዝማሬ ልምምድ', dayOfWeek: 'Saturday', startTime: '3:00 PM', endTime: '5:30 PM', targetGroup: 'Choir Members', location: 'Church Hall 3', isPublished: true },
    ];

    for (const s of schedulesData) {
      await prisma.schedule.create({ data: s });
    }
  }

  // 9. Member Registrations (Students & Portal Users)
  const existingMembers = await prisma.memberRegistration.count();
  let sampleStudent1: any;

  if (existingMembers === 0) {
    console.log('[Seed] Seeding member registrations...');
    const memberPasswordHash = await hashPassword('Student123!');

    sampleStudent1 = await prisma.memberRegistration.create({
      data: {
        registrationNumber: 'HMD-2026-0101',
        registrationType: RegistrationType.LONG_TERM,
        division: AgeDivision.INTERMEDIATE,
        status: MemberStatus.APPROVED,
        fullName: 'Meron Tesfaye',
        christianName: 'ማርያም ወልደ',
        gender: Gender.FEMALE,
        age: 16,
        motherName: 'ወለተ ማርያም',
        phoneNumber: '+251911000101',
        schoolOrOccupation: 'Grade 10 Student',
        passwordHash: memberPasswordHash,
        confessionFather: 'ቀሲስ ዘካርያስ',
        confessionChurch: 'ደብረ ዲዮስቆሮስ',
        address: 'Addis Ababa',
        kebele: '05',
        houseNumber: '214',
        assignedClass: 'Grade 7',
        groupType: 'Sunday School',
        preferredDepartment: 'መዝሙር እና ኪነ-ጥበብ',
        emergencyContactName: 'Almaz Haile',
        emergencyRelationship: 'Mother',
        emergencyContactPhone: '+251922000101',
        parentName: 'Haile Tesfaye',
        parentConsent: true,
        youthCovenantAccepted: true,
      },
    });

    await prisma.memberRegistration.create({
      data: {
        registrationNumber: 'HMD-2026-0102',
        registrationType: RegistrationType.LONG_TERM,
        division: AgeDivision.CHILDREN,
        status: MemberStatus.APPROVED,
        fullName: 'Ruth Tadesse',
        christianName: 'ወለተ ጊዮርጊስ',
        gender: Gender.FEMALE,
        age: 9,
        motherName: 'ብርቱካን ገብሬ',
        phoneNumber: '+251911000102',
        schoolOrOccupation: 'Grade 3 Student',
        passwordHash: memberPasswordHash,
        confessionFather: 'ቀሲስ ዘካርያስ',
        confessionChurch: 'ደብረ ዲዮስቆሮስ',
        address: 'Addis Ababa',
        kebele: '03',
        houseNumber: '118',
        assignedClass: 'Grade 3',
        groupType: 'Sunday School',
        emergencyContactName: 'Tadesse Bekele',
        emergencyRelationship: 'Father',
        emergencyContactPhone: '+251922000102',
        parentName: 'Tadesse Bekele',
        parentConsent: true,
      },
    });

    await prisma.memberRegistration.create({
      data: {
        registrationNumber: 'HMD-2026-0103',
        registrationType: RegistrationType.LONG_TERM,
        division: AgeDivision.YOUTH,
        status: MemberStatus.APPROVED,
        fullName: 'Samuel Girma',
        christianName: 'ገብረ መስቀል',
        gender: Gender.MALE,
        age: 21,
        phoneNumber: '+251911000103',
        schoolOrOccupation: 'University Student',
        passwordHash: memberPasswordHash,
        confessionFather: 'ቀሲስ ዮሐንስ',
        confessionChurch: 'ደብረ ዲዮስቆሮስ',
        address: 'Addis Ababa',
        kebele: '08',
        assignedClass: 'Mezmur A',
        groupType: 'Choir',
        preferredDepartment: 'መዝሙር',
        emergencyContactName: 'Girma Alemayehu',
        emergencyRelationship: 'Father',
        emergencyContactPhone: '+251922000103',
        youthCovenantAccepted: true,
      },
    });
    console.log('[Seed] Seeded approved members Meron, Ruth, and Samuel');
  } else {
    sampleStudent1 = await prisma.memberRegistration.findFirst();
  }

  // 10. Attendance Sessions & Records
  const existingSessions = await prisma.attendanceSession.count();
  if (existingSessions === 0 && sampleStudent1) {
    console.log('[Seed] Seeding attendance sessions & records...');
    const session1 = await prisma.attendanceSession.create({
      data: {
        date: new Date('2026-10-25'),
        sessionType: 'Sunday School Regular',
        className: 'Grade 7',
        academicYear: '2026/2027',
        recordedById: admin.id,
        status: 'FINALIZED',
        notes: 'Regular Sunday class roll call completed.',
      },
    });

    await prisma.attendanceRecord.create({
      data: {
        sessionId: session1.id,
        memberId: sampleStudent1.id,
        status: 'PRESENT',
        remarks: 'On time',
      },
    });

    const session2 = await prisma.attendanceSession.create({
      data: {
        date: new Date('2026-11-01'),
        sessionType: 'Sunday School Regular',
        className: 'Grade 7',
        academicYear: '2026/2027',
        recordedById: admin.id,
        status: 'FINALIZED',
        notes: 'Feast day fellowship.',
      },
    });

    await prisma.attendanceRecord.create({
      data: {
        sessionId: session2.id,
        memberId: sampleStudent1.id,
        status: 'PRESENT',
      },
    });

    const session3 = await prisma.attendanceSession.create({
      data: {
        date: new Date('2026-11-08'),
        sessionType: 'Sunday School Regular',
        className: 'Grade 7',
        academicYear: '2026/2027',
        recordedById: admin.id,
        status: 'FINALIZED',
        notes: 'Midterm lesson review.',
      },
    });

    await prisma.attendanceRecord.create({
      data: {
        sessionId: session3.id,
        memberId: sampleStudent1.id,
        status: 'LATE',
        remarks: 'Arrived at 8:15 AM',
      },
    });
  }

  // 11. Student Notices
  const existingNotices = await prisma.studentNotice.count();
  if (existingNotices === 0 && sampleStudent1) {
    console.log('[Seed] Seeding student notices...');
    await prisma.studentNotice.create({
      data: {
        title: 'Welcome to the New Sunday School Term',
        content: 'Dear students, the new academic term has officially started. Please ensure you attend all scheduled sessions on time with your lesson notebook.',
        category: 'Academic',
        priority: 'HIGH',
        targetDivision: AgeDivision.INTERMEDIATE,
        targetClass: 'Grade 7',
        createdById: admin.id,
      },
    });

    await prisma.studentNotice.create({
      data: {
        title: 'Choir Rehearsal Time Adjustment',
        content: 'Choir practice on Saturday will begin at 3:00 PM in Church Hall 3. Please review the hymns assigned for the upcoming liturgy.',
        category: 'Event',
        priority: 'NORMAL',
        targetDivision: AgeDivision.INTERMEDIATE,
        createdById: admin.id,
      },
    });

    await prisma.studentNotice.create({
      data: {
        title: 'Your Registration Has Been Approved',
        content: 'Congratulations! Your Sunday School member registration has been officially approved by the parish administration. Welcome to our spiritual family!',
        category: 'General',
        priority: 'NORMAL',
        targetMemberId: sampleStudent1.id,
        createdById: admin.id,
      },
    });
  }

  // 12. Contact Messages
  const existingMessages = await prisma.contactMessage.count();
  if (existingMessages === 0) {
    console.log('[Seed] Seeding contact messages...');
    await prisma.contactMessage.create({
      data: {
        fullName: 'Kidus Worku',
        contactInfo: '+251 911 556 789',
        topic: 'Sunday School Inquiry',
        message: 'Hello, I would like to inquire about registering my younger brother for the intermediate Sunday school class.',
        isRead: false,
      },
    });
    await prisma.contactMessage.create({
      data: {
        fullName: 'Hana Bekele',
        contactInfo: 'hana.bekele@gmail.com',
        topic: 'Prayer Request',
        message: 'Please keep our family in your prayers during the upcoming Holy Liturgy service.',
        isRead: true,
      },
    });
  }

  console.log('--- Database Seeding Completed Successfully! ---');
}

main()
  .catch((e) => {
    console.error('[Seed Error] Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
