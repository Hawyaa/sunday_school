import React, { useState, useRef, useEffect } from 'react';
import { AdminSection } from './AdminSidebar';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconUpload,
  IconCheck,
  IconReports,
  IconMezmur,
  IconGallery,
  IconAnnouncement,
  IconEvents,
} from './AdminIcons';
import {
  getStoredReports,
  saveStoredReports,
  getStoredMezmurs,
  saveStoredMezmurs,
  getStoredGalleryMosaic,
  saveStoredGalleryMosaic,
  getStoredFeaturedAlbum,
  saveStoredFeaturedAlbum,
  getStoredAnnouncements,
  saveStoredAnnouncements,
  getStoredEvents,
  saveStoredEvents,
  GalleryMosaicItem,
  FeaturedAlbumData,
  AnnouncementItem,
  StoredEventItem,
} from '@/lib/contentStore';
import { ChurchReport } from '@/types/report';
import { MezmurItem } from '@/components/mezmur/mezmurData';
import { apiClient } from '@/lib/api';

export interface AdminContentItem {
  id: string;
  section: AdminSection;
  title: string;
  titleAm?: string;
  subtitle?: string;
  category: string;
  status: 'Published' | 'Draft';
  date?: string;
  thumbnail?: string;
  audioUrl?: string;
  fileUrl?: string;
  fileSize?: string;
  isRestricted?: boolean;
  content?: string;
}

interface AdminSectionViewProps {
  section: AdminSection;
}

export function AdminSectionView({ section }: AdminSectionViewProps) {
  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Currently editing item ID (null = new)
  const [editingId, setEditingId] = useState<string | null>(null);

  // Common Form Fields
  const [title, setTitle] = useState('');
  const [titleAm, setTitleAm] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Section Specific Fields:
  // Reports
  const [reportDate, setReportDate] = useState('April 2025');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [fileUrl, setFileUrl] = useState('#');
  const [fileName, setFileName] = useState('');
  const [isRestricted, setIsRestricted] = useState(false);

  // Mezmur
  const [audioUrl, setAudioUrl] = useState('');
  const [audioName, setAudioName] = useState('');

  // Announcements
  const [priority, setPriority] = useState<'Urgent' | 'Important' | 'Notice' | 'General'>('Notice');

  // Events (tailored to /events page)
  const [eventDate, setEventDate] = useState('2025-05-15');
  const [eventTime, setEventTime] = useState('10:00 AM – 04:00 PM');
  const [eventPlace, setEventPlace] = useState('St. Gabriel Church, Addis Ababa');
  const [eventIcon, setEventIcon] = useState<'cross' | 'users' | 'book' | 'heart' | 'church' | 'star'>('cross');

  // Gallery
  const [galleryTarget, setGalleryTarget] = useState<'mosaic' | 'featured' | 'addToAlbum'>('mosaic');
  const [mosaicSlot, setMosaicSlot] = useState<number>(1);
  const [featuredDate, setFeaturedDate] = useState('Ter 19, 2011');
  const [featuredThumbnails, setFeaturedThumbnails] = useState<string[]>([]);

  // Images
  const [imageUrl, setImageUrl] = useState('');
  const [imageName, setImageName] = useState('');

  // Hidden File Input Refs
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const multiImageInputRef = useRef<HTMLInputElement>(null);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Section items state from synchronized store
  const [reportsList, setReportsList] = useState<ChurchReport[]>(() => getStoredReports());
  const [mezmurList, setMezmurList] = useState<MezmurItem[]>(() => getStoredMezmurs());
  const [announcementsList, setAnnouncementsList] = useState<AnnouncementItem[]>(() =>
    getStoredAnnouncements()
  );
  const [eventsList, setEventsList] = useState<StoredEventItem[]>(() => getStoredEvents());
  const [mosaicList, setMosaicList] = useState<GalleryMosaicItem[]>(() => getStoredGalleryMosaic());
  const [featuredAlbum, setFeaturedAlbum] = useState<FeaturedAlbumData>(() =>
    getStoredFeaturedAlbum()
  );

  const [teachingsList, setTeachingsList] = useState<AdminContentItem[]>([
    {
      id: 'teach-1',
      section: 'teachings',
      title: 'Spiritual Lessons from the Holy Bible',
      subtitle: 'Abba Melke Sedek',
      category: 'Holy Bible',
      status: 'Published',
      date: 'Megabit 12, 2017',
      thumbnail:
        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      content: 'Deep insights from the Holy Scriptures that guide us in our spiritual journey...',
    },
  ]);

  // Sync state when content store updates
  useEffect(() => {
    const handleUpdate = () => {
      setReportsList(getStoredReports());
      setMezmurList(getStoredMezmurs());
      setAnnouncementsList(getStoredAnnouncements());
      setEventsList(getStoredEvents());
      setMosaicList(getStoredGalleryMosaic());
      setFeaturedAlbum(getStoredFeaturedAlbum());
    };
    window.addEventListener('abune_content_store_updated', handleUpdate);
    return () => {
      window.removeEventListener('abune_content_store_updated', handleUpdate);
    };
  }, []);

  // Section categories definitions
  const categoriesBySection: Record<AdminSection, { label: string; value: string }[]> = {
    dashboard: [{ label: 'All', value: 'All' }],
    reports: [
      { label: 'All Categories', value: 'All' },
      { label: 'Administrative', value: 'Administrative' },
      { label: 'Financial', value: 'Financial' },
    ],
    mezmur: [
      { label: 'All Categories', value: 'All' },
      { label: 'Ethiopian Orthodox Hymns (hymns)', value: 'hymns' },
      { label: 'Sunday School Songs (sundayschool)', value: 'sundayschool' },
      { label: 'Choir Songs (choir)', value: 'choir' },
      { label: 'Special Occasions (special)', value: 'special' },
      { label: 'Traditional Mezmur (traditional)', value: 'traditional' },
      { label: 'Fast & Prayer (fasting)', value: 'fasting' },
    ],
    announcements: [
      { label: 'All Categories', value: 'All' },
      { label: 'Feasts & Holidays', value: 'Feasts & Holidays' },
      { label: 'Sunday School', value: 'Sunday School' },
      { label: 'Parish Notices', value: 'Parish Notices' },
      { label: 'Urgent Calls', value: 'Urgent Calls' },
    ],
    events: [
      { label: 'All Categories', value: 'All' },
      { label: 'Feast Celebration', value: 'Feast Celebration' },
      { label: 'Church Program', value: 'Church Program' },
      { label: 'Teaching', value: 'Teaching' },
      { label: 'Community Service', value: 'Community Service' },
      { label: 'Church Building', value: 'Church Building' },
      { label: 'Special Event', value: 'Special Event' },
    ],
    gallery: [
      { label: 'All Categories', value: 'All' },
      { label: 'Liturgy', value: 'Liturgy' },
      { label: 'Architecture', value: 'Architecture' },
      { label: 'Clergy', value: 'Clergy' },
      { label: 'Choir', value: 'Choir' },
      { label: 'Parish Life', value: 'Parish Life' },
    ],
    teachings: [
      { label: 'All Categories', value: 'All' },
      { label: 'Holy Bible', value: 'Holy Bible' },
      { label: 'Dogma', value: 'Dogma' },
      { label: 'Church History', value: 'Church History' },
    ],
    users: [{ label: 'All', value: 'All' }],
  };

  const currentCategories = categoriesBySection[section] || categoriesBySection.reports;

  // Real File Upload Handlers
  const handlePdfUpload = (file: File) => {
    if (!file) return;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setFileSize(sizeMb);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFileUrl(result);
      showToast(`Uploaded PDF: ${file.name} (${sizeMb})`);
    };
    reader.readAsDataURL(file);
  };

  const handleAudioUpload = (file: File) => {
    if (!file) return;
    setAudioName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAudioUrl(result);
      showToast(`Uploaded Audio: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (file: File) => {
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageUrl(result);
      showToast(`Attached image: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  const handleMultiImageUpload = (files: FileList) => {
    if (!files || files.length === 0) return;
    const newThumbs: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newThumbs.push(e.target.result as string);
          if (newThumbs.length === files.length) {
            setFeaturedThumbnails((prev) => [...prev, ...newThumbs]);
            showToast(`Added ${files.length} photos to album`);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Reset form
  const handleResetForm = () => {
    setEditingId(null);
    setTitle('');
    setTitleAm('');
    setSubtitle('');
    setCategory(currentCategories.find((c) => c.value !== 'All')?.value || '');
    setContent('');
    setIsPublished(true);
    setReportDate('April 2025');
    setFileSize('2.4 MB');
    setFileUrl('#');
    setFileName('');
    setIsRestricted(false);
    setAudioUrl('');
    setAudioName('');
    setImageUrl('');
    setImageName('');
    setPriority('Notice');
    setEventDate('2025-05-15');
    setEventTime('10:00 AM – 04:00 PM');
    setEventPlace('St. Gabriel Church, Addis Ababa');
    setEventIcon('cross');
    setGalleryTarget('mosaic');
    setMosaicSlot(1);
    setFeaturedDate('Ter 19, 2011');
    setFeaturedThumbnails([]);
  };

  // Populate form for editing
  const handleSelectEdit = (id: string | number) => {
    setEditingId(String(id));

    if (section === 'reports') {
      const rep = reportsList.find((r) => r.id === String(id));
      if (rep) {
        setTitle(rep.title);
        setTitleAm(rep.titleAm || '');
        setReportDate(rep.dateStr);
        setCategory(rep.category);
        setContent(rep.description || '');
        setFileSize(rep.fileSize || '2.4 MB');
        setFileUrl(rep.fileUrl || '#');
        setFileName(rep.fileUrl && rep.fileUrl !== '#' ? 'Attached Report Document.pdf' : '');
        setIsRestricted(!!rep.isRestricted);
        setIsPublished(true);
      }
    } else if (section === 'mezmur') {
      const mez = mezmurList.find((m) => m.id === String(id));
      if (mez) {
        setTitle(mez.title);
        setTitleAm(mez.titleEn || '');
        setCategory(mez.category);
        setContent(mez.lyrics.join('\n'));
        setAudioUrl(mez.audioUrl || '');
        setAudioName(mez.audioName || (mez.audioUrl ? 'Attached Audio Recording.mp3' : ''));
        setIsPublished(true);
      }
    } else if (section === 'announcements') {
      const ann = announcementsList.find((a) => a.id === String(id));
      if (ann) {
        setTitle(ann.title);
        setTitleAm(ann.titleAm || '');
        setSubtitle(ann.author || '');
        setCategory(ann.category);
        setPriority(ann.priority);
        setContent(ann.content || ann.summary);
        setImageUrl(ann.imageUrl || '');
        setIsPublished(true);
      }
    } else if (section === 'events') {
      const evt = eventsList.find((e) => String(e.id) === String(id));
      if (evt) {
        setTitle(evt.title);
        setCategory(evt.cat);
        setEventCatSelection(evt.cat);
        setEventDate(evt.date);
        setEventTime(evt.time);
        setEventPlace(evt.place);
        setEventIcon(evt.icon || 'cross');
        setImageUrl(evt.img);
        setContent(evt.description);
        setIsPublished(true);
      }
    } else if (section === 'gallery') {
      if (String(id) === 'featured-album') {
        setGalleryTarget('featured');
        setTitle(featuredAlbum.titleEn);
        setTitleAm(featuredAlbum.titleAm);
        setFeaturedDate(featuredAlbum.dateStr);
        setImageUrl(featuredAlbum.coverSrc);
        setFeaturedThumbnails(featuredAlbum.thumbnails);
      } else {
        const item = mosaicList.find((m) => m.id === String(id));
        if (item) {
          setGalleryTarget('mosaic');
          setMosaicSlot(item.slot);
          setTitle(item.titleEn);
          setTitleAm(item.titleAm);
          setCategory(item.category);
          setImageUrl(item.src);
        }
      }
    } else {
      const itm = teachingsList.find((i) => i.id === String(id));
      if (itm) {
        setTitle(itm.title);
        setSubtitle(itm.subtitle || '');
        setCategory(itm.category);
        setContent(itm.content || '');
        setImageUrl(itm.thumbnail || '');
        setIsPublished(itm.status === 'Published');
      }
    }
  };

  const handleRemoveAlbumThumbnail = (index: number) => {
    const updatedThumbs = featuredAlbum.thumbnails.filter((_, i) => i !== index);
    setFeaturedThumbnails(updatedThumbs);
    const updatedAlbum: FeaturedAlbumData = {
      ...featuredAlbum,
      thumbnails: updatedThumbs,
    };
    setFeaturedAlbum(updatedAlbum);
    saveStoredFeaturedAlbum(updatedAlbum);
    showToast('Photo removed from album & updated on /gallery!');
  };

  const setEventCatSelection = (cat: string) => {
    setCategory(cat);
    if (cat.includes('Feast')) setEventIcon('cross');
    else if (cat.includes('Program') || cat.includes('Youth')) setEventIcon('users');
    else if (cat.includes('Teaching') || cat.includes('Bible')) setEventIcon('book');
    else if (cat.includes('Community') || cat.includes('Charity')) setEventIcon('heart');
    else if (cat.includes('Building')) setEventIcon('church');
    else setEventIcon('star');
  };

  // Save handler with live sync
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (section === 'gallery' && galleryTarget === 'addToAlbum') {
      if (!imageUrl) {
        alert('Please choose or upload a photo to add to the album');
        return;
      }
      const updatedThumbs = [...featuredAlbum.thumbnails, imageUrl];
      setFeaturedThumbnails(updatedThumbs);
      const updatedAlbum: FeaturedAlbumData = {
        ...featuredAlbum,
        thumbnails: updatedThumbs,
      };
      setFeaturedAlbum(updatedAlbum);
      saveStoredFeaturedAlbum(updatedAlbum);
      setImageUrl('');
      setImageName('');
      showToast(`Photo added to end of album! Total: ${updatedThumbs.length} photos on /gallery.`);
      handleResetForm();
      return;
    }

    if (!title.trim() && section !== 'gallery') {
      alert('Please provide a title');
      return;
    }

    if (section === 'reports') {
      const targetCategory = (
        category && category !== 'All' ? category : 'Administrative'
      ) as 'Administrative' | 'Financial';
      const updatedReports = [...reportsList];
      const targetId = editingId || `report-${Date.now()}`;
      const existingIdx = updatedReports.findIndex((r) => r.id === targetId);

      const reportItem: ChurchReport = {
        id: targetId,
        title: title.trim(),
        titleAm: titleAm.trim() || undefined,
        category: targetCategory,
        dateStr: reportDate.trim() || '2025',
        description: content.trim() || 'Summary report.',
        descriptionAm: titleAm ? `${titleAm} ማጠቃለያ ሪፖርት።` : undefined,
        fileSize: fileSize || '2.4 MB',
        fileUrl: fileUrl || '#',
        isRestricted: isRestricted,
      };

      if (existingIdx >= 0) {
        updatedReports[existingIdx] = reportItem;
      } else {
        updatedReports.unshift(reportItem);
      }

      setReportsList(updatedReports);
      saveStoredReports(updatedReports);

      try {
        await apiClient.post('/admin/reports', {
          title: reportItem.title,
          summary: reportItem.description,
          content: reportItem.description,
          category: reportItem.category,
          fileUrl: reportItem.fileUrl,
          reportDate: new Date().toISOString(),
          isPublished: true,
        });
      } catch (err) {}

      showToast(editingId ? 'Report updated & synced with /reports!' : 'New report published on /reports!');
      handleResetForm();
    } else if (section === 'mezmur') {
      const targetCategory = category && category !== 'All' ? category : 'hymns';
      const lyricsArray = content
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      const updatedMezmurs = [...mezmurList];
      const targetId = editingId || `mezmur-${Date.now()}`;
      const existingIdx = updatedMezmurs.findIndex((m) => m.id === targetId);

      const mezmurItem: MezmurItem = {
        id: targetId,
        title: title.trim(),
        titleEn: titleAm.trim() || title.trim(),
        category: targetCategory,
        addedAt: new Date().toISOString().slice(0, 10),
        lyrics: lyricsArray.length > 0 ? lyricsArray : [title.trim()],
      };

      if (existingIdx >= 0) {
        updatedMezmurs[existingIdx] = mezmurItem;
      } else {
        updatedMezmurs.unshift(mezmurItem);
      }

      setMezmurList(updatedMezmurs);
      saveStoredMezmurs(updatedMezmurs);

      try {
        await apiClient.post('/admin/mezmur', {
          title: mezmurItem.title,
          originalTitle: mezmurItem.titleEn,
          lyrics: mezmurItem.lyrics.join('\n'),
          category: mezmurItem.category,
          audioUrl: audioUrl || undefined,
          isPublished: true,
        });
      } catch (err) {}

      showToast(editingId ? 'Mezmur updated & synced with /mezmur!' : 'New Mezmur published on /mezmur!');
      handleResetForm();
    } else if (section === 'events') {
      const updated = [...eventsList];
      const targetId = editingId || `event-${Date.now()}`;
      const existingIdx = updated.findIndex((ev) => String(ev.id) === targetId);

      const eventItem: StoredEventItem = {
        id: targetId,
        title: title.trim(),
        cat: category && category !== 'All' ? category : 'Feast Celebration',
        icon: eventIcon,
        date: eventDate.trim() || '2025-05-15',
        place: eventPlace.trim() || 'St. Gabriel Church, Addis Ababa',
        time: eventTime.trim() || '10:00 AM – 04:00 PM',
        img:
          imageUrl ||
          'https://i.pinimg.com/474x/53/d4/74/53d474d703be2c6a18c5e0e4af555787.jpg',
        description:
          content.trim() ||
          'Sacred gathering and church event celebration with liturgical fellowship.',
      };

      if (existingIdx >= 0) {
        updated[existingIdx] = eventItem;
      } else {
        updated.unshift(eventItem);
      }

      setEventsList(updated);
      saveStoredEvents(updated);

      try {
        await apiClient.post('/admin/events', {
          title: eventItem.title,
          description: eventItem.description,
          location: eventItem.place,
          startDate: new Date(eventItem.date).toISOString(),
          category: eventItem.cat,
          imageUrl: eventItem.img,
          isPublished: true,
        });
      } catch (err) {}

      showToast('Event saved & synced with /events page!');
      handleResetForm();
    } else if (section === 'announcements') {
      const updated = [...announcementsList];
      const targetId = editingId || `ann-${Date.now()}`;
      const existingIdx = updated.findIndex((a) => a.id === targetId);

      const item: AnnouncementItem = {
        id: targetId,
        title: title.trim(),
        titleAm: titleAm.trim() || title.trim(),
        summary: content.slice(0, 120),
        content: content.trim(),
        category: (category && category !== 'All' ? category : 'Parish Notices') as any,
        categoryAm: category,
        priority: priority,
        dateStr: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        author: subtitle.trim() || 'Church Administration',
        imageUrl: imageUrl || undefined,
        isPinned: priority === 'Urgent',
        publishedAt: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        updated[existingIdx] = item;
      } else {
        updated.unshift(item);
      }

      setAnnouncementsList(updated);
      saveStoredAnnouncements(updated);

      try {
        await apiClient.post('/admin/announcements', {
          title: item.title,
          content: item.content,
          summary: item.summary,
          category: item.category,
          imageUrl: item.imageUrl,
          isPinned: item.isPinned,
          isPublished: true,
        });
      } catch (err) {}

      showToast('Announcement saved & synced with /announcements!');
      handleResetForm();
    } else if (section === 'gallery') {
      if (galleryTarget === 'featured') {
        const updatedAlbum: FeaturedAlbumData = {
          titleEn: title.trim(),
          titleAm: titleAm.trim() || title.trim(),
          dateStr: featuredDate.trim(),
          coverSrc:
            imageUrl ||
            'https://i.pinimg.com/736x/3a/93/40/3a93404041ca22b153f4392a3d758541.jpg',
          thumbnails:
            featuredThumbnails.length > 0
              ? featuredThumbnails
              : featuredAlbum.thumbnails,
        };
        setFeaturedAlbum(updatedAlbum);
        saveStoredFeaturedAlbum(updatedAlbum);
        showToast('Featured Album updated on /gallery!');
      } else {
        const updatedMosaic = [...mosaicList];
        const existingIdx = updatedMosaic.findIndex((m) => m.slot === mosaicSlot);
        const mosaicItem: GalleryMosaicItem = {
          id: `mosaic-${mosaicSlot}`,
          slot: mosaicSlot,
          src:
            imageUrl ||
            'https://i.pinimg.com/736x/3a/93/40/3a93404041ca22b153f4392a3d758541.jpg',
          alt: title.trim(),
          titleEn: title.trim(),
          titleAm: titleAm.trim() || title.trim(),
          category: category || 'Liturgy',
          date: new Date().toISOString().slice(0, 10),
        };

        if (existingIdx >= 0) {
          updatedMosaic[existingIdx] = mosaicItem;
        } else {
          updatedMosaic.push(mosaicItem);
        }

        setMosaicList(updatedMosaic);
        saveStoredGalleryMosaic(updatedMosaic);
        showToast(`Mosaic Slot ${mosaicSlot} updated on /gallery!`);
      }
      handleResetForm();
    } else {
      const updated = [...teachingsList];
      const targetId = editingId || `${section}-${Date.now()}`;
      const existingIdx = updated.findIndex((i) => i.id === targetId);

      const genericItem: AdminContentItem = {
        id: targetId,
        section,
        title: title.trim(),
        subtitle: subtitle.trim(),
        category: category && category !== 'All' ? category : currentCategories[1]?.value || 'General',
        status: isPublished ? 'Published' : 'Draft',
        thumbnail:
          imageUrl ||
          'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=400&q=80',
        content: content.trim(),
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      if (existingIdx >= 0) {
        updated[existingIdx] = genericItem;
      } else {
        updated.unshift(genericItem);
      }

      setTeachingsList(updated);
      showToast('Teaching saved successfully!');
      handleResetForm();
    }
  };

  // Delete handler
  const handleDelete = async (id: string | number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    if (section === 'reports') {
      const next = reportsList.filter((r) => r.id !== String(id));
      setReportsList(next);
      saveStoredReports(next);
      try {
        await apiClient.delete(`/admin/reports/${id}`);
      } catch (e) {}
      showToast('Report deleted & updated on /reports!');
    } else if (section === 'mezmur') {
      const next = mezmurList.filter((m) => m.id !== String(id));
      setMezmurList(next);
      saveStoredMezmurs(next);
      try {
        await apiClient.delete(`/admin/mezmur/${id}`);
      } catch (e) {}
      showToast('Mezmur removed & updated on /mezmur!');
    } else if (section === 'events') {
      const next = eventsList.filter((e) => String(e.id) !== String(id));
      setEventsList(next);
      saveStoredEvents(next);
      try {
        await apiClient.delete(`/admin/events/${id}`);
      } catch (e) {}
      showToast('Event removed & updated on /events!');
    } else if (section === 'announcements') {
      const next = announcementsList.filter((a) => a.id !== String(id));
      setAnnouncementsList(next);
      saveStoredAnnouncements(next);
      try {
        await apiClient.delete(`/admin/announcements/${id}`);
      } catch (e) {}
      showToast('Announcement removed & updated on /announcements!');
    } else {
      setTeachingsList((prev) => prev.filter((i) => i.id !== String(id)));
      showToast('Item deleted successfully!');
    }

    if (editingId === String(id)) handleResetForm();
  };

  // Filtered rows for left table
  const renderTableRows = () => {
    if (section === 'reports') {
      const filtered = reportsList.filter((r) => {
        const matchesSearch =
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.titleAm && r.titleAm.includes(searchQuery)) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || r.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });

      return filtered.map((r) => (
        <tr
          key={r.id}
          className={`hover:bg-[#FAF9F5] transition-colors ${
            editingId === r.id ? 'bg-[#FAF4E6]/50' : ''
          }`}
        >
          <td className="py-3.5 px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAF4E6] border border-[#E9D9B2] flex items-center justify-center flex-shrink-0 text-[#C8952F]">
                <IconReports className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#0F1B3E] truncate max-w-[240px]">
                  {r.title}
                </p>
                <p className="text-[11px] text-[#7C88A8] truncate max-w-[240px]">
                  📅 {r.dateStr} · 📎 {r.fileSize}
                </p>
              </div>
            </div>
          </td>

          <td className="py-3.5 px-4">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF4E6] text-[#8B6E32] border border-[#E9D9B2]">
              {r.category}
            </span>
          </td>

          <td className="py-3.5 px-4">
            {r.isRestricted ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF3E0] text-[#B76E00]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B76E00]"></span>
                Restricted
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6F4EA] text-[#137333]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#137333]"></span>
                Public PDF
              </span>
            )}
          </td>

          <td className="py-3.5 px-4 text-right space-x-1">
            <button
              onClick={() => handleSelectEdit(r.id)}
              className="p-1.5 text-[#5A6479] hover:text-[#0F1B3E] hover:bg-[#F2EFE9] rounded-md transition-colors"
              title="Edit"
            >
              <IconEdit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(r.id, r.title)}
              className="p-1.5 text-[#B3261E] hover:bg-[#FCE8E6] rounded-md transition-colors"
              title="Delete"
            >
              <IconTrash className="w-3.5 h-3.5" />
            </button>
          </td>
        </tr>
      ));
    }

    if (section === 'mezmur') {
      const filtered = mezmurList.filter((m) => {
        const matchesSearch =
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.lyrics.join(' ').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || m.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });

      return filtered.map((m) => (
        <tr
          key={m.id}
          className={`hover:bg-[#FAF9F5] transition-colors ${
            editingId === m.id ? 'bg-[#FAF4E6]/50' : ''
          }`}
        >
          <td className="py-3.5 px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAF4E6] border border-[#E9D9B2] flex items-center justify-center flex-shrink-0 text-[#C8952F]">
                <IconMezmur className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#0F1B3E] truncate max-w-[240px]">
                  {m.title}
                </p>
                <p className="text-[11px] text-[#7C88A8] truncate max-w-[240px]">
                  {m.titleEn}
                </p>
              </div>
            </div>
          </td>

          <td className="py-3.5 px-4">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF4E6] text-[#8B6E32] border border-[#E9D9B2]">
              {m.category}
            </span>
          </td>

          <td className="py-3.5 px-4">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6F4EA] text-[#137333]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#137333]"></span>
              Published
            </span>
          </td>

          <td className="py-3.5 px-4 text-right space-x-1">
            <button
              onClick={() => handleSelectEdit(m.id)}
              className="p-1.5 text-[#5A6479] hover:text-[#0F1B3E] hover:bg-[#F2EFE9] rounded-md transition-colors"
              title="Edit"
            >
              <IconEdit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(m.id, m.title)}
              className="p-1.5 text-[#B3261E] hover:bg-[#FCE8E6] rounded-md transition-colors"
              title="Delete"
            >
              <IconTrash className="w-3.5 h-3.5" />
            </button>
          </td>
        </tr>
      ));
    }

    if (section === 'events') {
      const filtered = eventsList.filter((e) => {
        const matchesSearch =
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.place.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || e.cat === selectedCategory;
        return matchesSearch && matchesCategory;
      });

      return filtered.map((e) => (
        <tr
          key={e.id}
          className={`hover:bg-[#FAF9F5] transition-colors ${
            editingId === String(e.id) ? 'bg-[#FAF4E6]/50' : ''
          }`}
        >
          <td className="py-3.5 px-4">
            <div className="flex items-center gap-3">
              <img
                src={e.img}
                alt={e.title}
                className="w-10 h-10 rounded-lg object-cover border border-[#EAE6DF]"
              />
              <div className="min-w-0">
                <p className="font-semibold text-[#0F1B3E] truncate max-w-[240px]">
                  {e.title}
                </p>
                <p className="text-[11px] text-[#7C88A8] truncate max-w-[240px]">
                  📅 {e.date} · 📍 {e.place}
                </p>
              </div>
            </div>
          </td>

          <td className="py-3.5 px-4">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF4E6] text-[#8B6E32] border border-[#E9D9B2]">
              {e.cat}
            </span>
          </td>

          <td className="py-3.5 px-4">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6F4EA] text-[#137333]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#137333]"></span>
              Live on /events
            </span>
          </td>

          <td className="py-3.5 px-4 text-right space-x-1">
            <button
              onClick={() => handleSelectEdit(e.id)}
              className="p-1.5 text-[#5A6479] hover:text-[#0F1B3E] hover:bg-[#F2EFE9] rounded-md transition-colors"
              title="Edit Event"
            >
              <IconEdit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(e.id, e.title)}
              className="p-1.5 text-[#B3261E] hover:bg-[#FCE8E6] rounded-md transition-colors"
              title="Delete Event"
            >
              <IconTrash className="w-3.5 h-3.5" />
            </button>
          </td>
        </tr>
      ));
    }

    if (section === 'announcements') {
      const filtered = announcementsList.filter((a) => {
        const matchesSearch =
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (a.titleAm && a.titleAm.includes(searchQuery)) ||
          a.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || a.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });

      return filtered.map((a) => (
        <tr
          key={a.id}
          className={`hover:bg-[#FAF9F5] transition-colors ${
            editingId === a.id ? 'bg-[#FAF4E6]/50' : ''
          }`}
        >
          <td className="py-3.5 px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAF4E6] border border-[#E9D9B2] flex items-center justify-center flex-shrink-0 text-[#C8952F]">
                <IconAnnouncement className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#0F1B3E] truncate max-w-[240px]">
                  {a.title}
                </p>
                <p className="text-[11px] text-[#7C88A8] truncate max-w-[240px]">
                  📅 {a.dateStr} · 👤 {a.author}
                </p>
              </div>
            </div>
          </td>

          <td className="py-3.5 px-4">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF4E6] text-[#8B6E32] border border-[#E9D9B2]">
              {a.category}
            </span>
          </td>

          <td className="py-3.5 px-4">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                a.priority === 'Urgent'
                  ? 'bg-[#FCE8E6] text-[#B3261E]'
                  : 'bg-[#E6F4EA] text-[#137333]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  a.priority === 'Urgent' ? 'bg-[#B3261E]' : 'bg-[#137333]'
                }`}
              ></span>
              {a.priority}
            </span>
          </td>

          <td className="py-3.5 px-4 text-right space-x-1">
            <button
              onClick={() => handleSelectEdit(a.id)}
              className="p-1.5 text-[#5A6479] hover:text-[#0F1B3E] hover:bg-[#F2EFE9] rounded-md transition-colors"
              title="Edit"
            >
              <IconEdit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDelete(a.id, a.title)}
              className="p-1.5 text-[#B3261E] hover:bg-[#FCE8E6] rounded-md transition-colors"
              title="Delete"
            >
              <IconTrash className="w-3.5 h-3.5" />
            </button>
          </td>
        </tr>
      ));
    }

    if (section === 'gallery') {
      const slotLabels: Record<number, string> = {
        1: 'Slot 1: Tall Left (Col 1, Row 1-2)',
        2: 'Slot 2: Top Center (Col 2-3, Row 1)',
        3: 'Slot 3: Mid Center Left (Col 2, Row 2)',
        4: 'Slot 4: Mid Center Right (Col 3, Row 2)',
        5: 'Slot 5: Tall Right (Col 4, Row 1-2)',
        6: 'Slot 6: Bottom Left (Col 1, Row 3)',
        7: 'Slot 7: Bottom Mid Left (Col 2, Row 3)',
      };

      return (
        <>
          {/* Featured Album Row */}
          <tr
            className={`hover:bg-[#FAF9F5] transition-colors border-b-2 border-[#E9D9B2] ${
              editingId === 'featured-album' ? 'bg-[#FAF4E6]/50' : 'bg-[#FAF4E6]/20'
            }`}
          >
            <td className="py-3.5 px-4">
              <div className="flex items-center gap-3">
                <img
                  src={featuredAlbum.coverSrc}
                  alt={featuredAlbum.titleEn}
                  className="w-10 h-10 rounded-lg object-cover border border-[#C99A3B]"
                />
                <div className="min-w-0">
                  <p className="font-bold text-[#0F1B3E] truncate max-w-[240px]">
                    ⭐ Featured Album: {featuredAlbum.titleEn}
                  </p>
                  <p className="text-[11px] text-[#7C88A8] truncate max-w-[240px]">
                    {featuredAlbum.titleAm} · {featuredAlbum.thumbnails.length} photos
                  </p>
                </div>
              </div>
            </td>
            <td className="py-3.5 px-4">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#C99A3B] text-[#0F1B3E]">
                Featured Album
              </span>
            </td>
            <td className="py-3.5 px-4">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6F4EA] text-[#137333]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#137333]"></span>
                Live on /gallery
              </span>
            </td>
            <td className="py-3.5 px-4 text-right">
              <button
                onClick={() => handleSelectEdit('featured-album')}
                className="p-1.5 text-[#5A6479] hover:text-[#0F1B3E] hover:bg-[#F2EFE9] rounded-md transition-colors"
                title="Edit Album"
              >
                <IconEdit className="w-3.5 h-3.5" />
              </button>
            </td>
          </tr>

          {/* 7 Mosaic Slots */}
          {mosaicList.map((m) => (
            <tr
              key={m.id}
              className={`hover:bg-[#FAF9F5] transition-colors ${
                editingId === m.id ? 'bg-[#FAF4E6]/50' : ''
              }`}
            >
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <img
                    src={m.src}
                    alt={m.alt}
                    className="w-10 h-10 rounded-lg object-cover border border-[#EAE6DF]"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0F1B3E] truncate max-w-[240px]">
                      {slotLabels[m.slot] || `Slot ${m.slot}`}
                    </p>
                    <p className="text-[11px] text-[#7C88A8] truncate max-w-[240px]">
                      {m.titleEn} ({m.titleAm})
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF4E6] text-[#8B6E32] border border-[#E9D9B2]">
                  {m.category}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6F4EA] text-[#137333]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#137333]"></span>
                  Active Slot
                </span>
              </td>
              <td className="py-3.5 px-4 text-right">
                <button
                  onClick={() => handleSelectEdit(m.id)}
                  className="p-1.5 text-[#5A6479] hover:text-[#0F1B3E] hover:bg-[#F2EFE9] rounded-md transition-colors"
                  title="Replace Photo"
                >
                  <IconEdit className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </>
      );
    }

    // Generic (teachings)
    const filtered = teachingsList.filter((i) => {
      const matchesSearch =
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (i.subtitle && i.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === 'All' || i.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.map((i) => (
      <tr
        key={i.id}
        className={`hover:bg-[#FAF9F5] transition-colors ${
          editingId === i.id ? 'bg-[#FAF4E6]/50' : ''
        }`}
      >
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-3">
            {i.thumbnail ? (
              <img
                src={i.thumbnail}
                alt={i.title}
                className="w-10 h-10 rounded-lg object-cover border border-[#EAE6DF]"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#FAF4E6] flex items-center justify-center text-[#C8952F]">
                📁
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-[#0F1B3E] truncate max-w-[240px]">
                {i.title}
              </p>
              {i.subtitle && (
                <p className="text-[11px] text-[#7C88A8] truncate max-w-[240px]">
                  {i.subtitle}
                </p>
              )}
            </div>
          </div>
        </td>

        <td className="py-3.5 px-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF4E6] text-[#8B6E32] border border-[#E9D9B2]">
            {i.category}
          </span>
        </td>

        <td className="py-3.5 px-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              i.status === 'Published'
                ? 'bg-[#E6F4EA] text-[#137333]'
                : 'bg-[#FFF3E0] text-[#B76E00]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                i.status === 'Published' ? 'bg-[#137333]' : 'bg-[#B76E00]'
              }`}
            ></span>
            {i.status}
          </span>
        </td>

        <td className="py-3.5 px-4 text-right space-x-1">
          <button
            onClick={() => handleSelectEdit(i.id)}
            className="p-1.5 text-[#5A6479] hover:text-[#0F1B3E] hover:bg-[#F2EFE9] rounded-md transition-colors"
            title="Edit"
          >
            <IconEdit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDelete(i.id, i.title)}
            className="p-1.5 text-[#B3261E] hover:bg-[#FCE8E6] rounded-md transition-colors"
            title="Delete"
          >
            <IconTrash className="w-3.5 h-3.5" />
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#0F1B3E] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-[#C8952F]/40 animate-in fade-in slide-in-from-bottom-2">
          <IconCheck className="w-4 h-4 text-[#C8952F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Upload Inputs */}
      <input
        type="file"
        ref={pdfInputRef}
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handlePdfUpload(e.target.files[0]);
        }}
      />
      <input
        type="file"
        ref={audioInputRef}
        accept="audio/*,.mp3,.wav"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleAudioUpload(e.target.files[0]);
        }}
      />
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
        }}
      />
      <input
        type="file"
        ref={multiImageInputRef}
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleMultiImageUpload(e.target.files);
        }}
      />

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List and Filter (Approx 7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-[#EAE6DF] shadow-[0_2px_8px_rgba(15,27,62,0.03)] space-y-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7C88A8]">
                <IconSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder={`Search ${section}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] focus:ring-1 focus:ring-[#C8952F] bg-[#FAF9F6]/50"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-[#D5D0C7] bg-white text-[#2A354F] focus:outline-none focus:border-[#C8952F]"
                >
                  {currentCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-[11px] text-[#7C88A8] font-medium">
                Live sync enabled with public site
              </span>
            </div>
          </div>

          {/* Table of Records */}
          <div className="bg-white rounded-xl border border-[#EAE6DF] shadow-[0_2px_8px_rgba(15,27,62,0.03)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2A354F]">
                <thead className="bg-[#FAF7F2] text-[#6B7897] font-semibold text-[11px] uppercase tracking-wider border-b border-[#EAE6DF]">
                  <tr>
                    <th className="py-3 px-4">
                      {section === 'gallery' ? 'PHOTO / SLOT' : 'TITLE'}
                    </th>
                    <th className="py-3 px-4">CATEGORY</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE9]">{renderTableRows()}</tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Add / Edit Form (Approx 5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-[#EAE6DF] shadow-[0_2px_8px_rgba(15,27,62,0.03)] p-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2EFE9] mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0F1B3E] capitalize">
                  {editingId ? `Edit ${section}` : `Add New ${section}`}
                </h3>
                <p className="text-[11px] text-[#7C88A8]">
                  Matches the exact requirements for the {section} page.
                </p>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs font-semibold text-[#C8952F] hover:underline"
                >
                  + New
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* === 1. REPORTS SECTION FORM === */}
              {section === 'reports' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Report Title (English)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Clergy Service Report"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Amharic Title (የሪፖርቱ ርዕስ)
                    </label>
                    <input
                      type="text"
                      placeholder="ምሳሌ፡ የካህናትና አገልጋዮች የሥራ ሪፖርት"
                      value={titleAm}
                      onChange={(e) => setTitleAm(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                        Period / Date
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. April 2025"
                        value={reportDate}
                        onChange={(e) => setReportDate(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                        Category
                      </label>
                      <select
                        value={category || 'Administrative'}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                      >
                        <option value="Administrative">Administrative</option>
                        <option value="Financial">Financial</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      PDF Document Upload
                    </label>
                    <div
                      onClick={() => pdfInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files?.[0]) handlePdfUpload(e.dataTransfer.files[0]);
                      }}
                      className="border-2 border-dashed border-[#D5D0C7] hover:border-[#C8952F] rounded-xl p-5 text-center bg-[#FAF9F6] cursor-pointer transition-colors flex flex-col items-center justify-center gap-1.5"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#FAF4E6] flex items-center justify-center text-[#C8952F]">
                        <IconUpload className="w-5 h-5" />
                      </div>
                      {fileName ? (
                        <div className="text-center">
                          <p className="text-xs font-bold text-[#137333] flex items-center justify-center gap-1">
                            <IconCheck className="w-3.5 h-3.5" />
                            <span>{fileName}</span>
                          </p>
                          <p className="text-[10px] text-[#7C88A8]">
                            File size: {fileSize} · Click to replace
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs font-semibold text-[#2A354F]">
                            Drop PDF report here, or{' '}
                            <span className="text-[#C8952F] underline">browse</span>
                          </p>
                          <p className="text-[10px] text-[#7C88A8]">
                            Standard PDF documents up to 25MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Report Summary Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Administrative and clergy service summary report."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#FAF9F6] border border-[#EAE6DF]">
                    <div>
                      <span className="block text-xs font-semibold text-[#0F1B3E]">
                        Restricted Access
                      </span>
                      <span className="block text-[10px] text-[#7C88A8]">
                        Shows &quot;Restricted Access&quot; button instead of direct PDF download
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsRestricted(!isRestricted)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                        isRestricted ? 'bg-[#C8952F]' : 'bg-[#D5D0C7]'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                          isRestricted ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </>
              )}

              {/* === 2. MEZMUR SECTION FORM === */}
              {section === 'mezmur' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Ge&apos;ez / Amharic Title (የመዝሙር ርዕስ)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ምሳሌ፡ አቡነ ዘበሰማያት"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      English Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Our Father"
                      value={titleAm}
                      onChange={(e) => setTitleAm(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Category
                    </label>
                    <select
                      value={category || 'hymns'}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                    >
                      <option value="hymns">Ethiopian Orthodox Hymns (የኢትዮጵያ ኦርቶዶክስ መዝሙራት)</option>
                      <option value="sundayschool">Sunday School Songs (የሰንበት ት/ቤት መዝሙራት)</option>
                      <option value="choir">Choir Songs (የመዘምራን መዝሙራት)</option>
                      <option value="special">Special Occasions (ልዩ በዓላት)</option>
                      <option value="traditional">Traditional Mezmur (ባህላዊ መዝሙር)</option>
                      <option value="fasting">Fast & Prayer (ጾምና ጸሎት)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Mezmur Audio Track
                    </label>
                    <div
                      onClick={() => audioInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files?.[0]) handleAudioUpload(e.dataTransfer.files[0]);
                      }}
                      className="border-2 border-dashed border-[#D5D0C7] hover:border-[#C8952F] rounded-xl p-5 text-center bg-[#FAF9F6] cursor-pointer transition-colors flex flex-col items-center justify-center gap-1.5"
                    >
                      <div className="w-9 h-9 rounded-full bg-[#FAF4E6] flex items-center justify-center text-[#C8952F]">
                        <IconUpload className="w-5 h-5" />
                      </div>
                      {audioName || audioUrl ? (
                        <div className="text-center w-full">
                          <p className="text-xs font-bold text-[#137333] flex items-center justify-center gap-1 mb-2">
                            <IconCheck className="w-3.5 h-3.5" />
                            <span>{audioName || 'Audio Track Attached'}</span>
                          </p>
                          {audioUrl && (
                            <audio controls src={audioUrl} className="w-full h-8 mx-auto" />
                          )}
                          <p className="text-[10px] text-[#7C88A8] mt-1">
                            Click to change audio track
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs font-semibold text-[#2A354F]">
                            Drop audio recording here, or{' '}
                            <span className="text-[#C8952F] underline">browse</span>
                          </p>
                          <p className="text-[10px] text-[#7C88A8]">MP3, WAV up to 50MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Lyrics (ግጥም / ቃላት)
                    </label>
                    <textarea
                      rows={5}
                      placeholder={
                        'አቡነ ዘበሰማያት፡ ይትቀደስ ስምከ።\nትምጻእ መንግሥትከ። ወይኩን ፈቃድከ\nበሰማይ መሬትኒ...'
                      }
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] leading-relaxed"
                    />
                  </div>
                </>
              )}

              {/* === 3. EVENTS SECTION FORM (MATCHING /events EXACTLY) === */}
              {section === 'events' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Timket Feast Celebration"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                        Category
                      </label>
                      <select
                        value={category || 'Feast Celebration'}
                        onChange={(e) => setEventCatSelection(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white font-medium"
                      >
                        <option value="Feast Celebration">Feast Celebration (የንግሥ በዓል)</option>
                        <option value="Church Program">Church Program (የሰንበት ት/ቤት)</option>
                        <option value="Teaching">Teaching (መንፈሳዊ ትምህርት)</option>
                        <option value="Community Service">Community Service (በጎ አድራጎት)</option>
                        <option value="Church Building">Church Building (የሕንፃ ልማት)</option>
                        <option value="Special Event">Special Event (ልዩ መርሐግብር)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                        Event Icon Style
                      </label>
                      <select
                        value={eventIcon}
                        onChange={(e) => setEventIcon(e.target.value as any)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                      >
                        <option value="cross">✝️ Cross (Feasts)</option>
                        <option value="users">👥 Fellowship / Sunday School</option>
                        <option value="book">📖 Bible / Teaching</option>
                        <option value="heart">❤️ Heart / Charity</option>
                        <option value="church">⛪ Church Building</option>
                        <option value="star">⭐ Star / Choir / Concert</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                        Event Date (YYYY-MM-DD)
                      </label>
                      <input
                        type="date"
                        required
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                        Time / Hours
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10:00 AM – 04:00 PM"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Location / Church Place
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Holy Trinity Church, Addis Ababa"
                      value={eventPlace}
                      onChange={(e) => setEventPlace(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  {/* Real Event Image Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Event Photo / Flyer
                    </label>
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0]);
                      }}
                      className="border-2 border-dashed border-[#D5D0C7] hover:border-[#C8952F] rounded-xl p-4 text-center bg-[#FAF9F6] cursor-pointer transition-colors"
                    >
                      {imageUrl ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={imageUrl}
                            alt="Event Cover"
                            className="w-16 h-16 object-cover rounded-lg border border-[#EAE6DF]"
                          />
                          <div className="text-left">
                            <p className="text-xs font-bold text-[#137333] flex items-center gap-1">
                              <IconCheck className="w-3.5 h-3.5" />
                              <span>Event Image Attached</span>
                            </p>
                            <p className="text-[10px] text-[#7C88A8]">Click to replace image</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-[#FAF4E6] flex items-center justify-center text-[#C8952F] mx-auto mb-1">
                            <IconUpload className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-semibold text-[#2A354F]">
                            Drop event image here, or{' '}
                            <span className="text-[#C8952F] underline">browse</span>
                          </p>
                          <p className="text-[10px] text-[#7C88A8]">PNG, JPG up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Event Description & Highlights
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Detailed schedule and description of the event..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>
                </>
              )}

              {/* === 4. ANNOUNCEMENTS SECTION FORM === */}
              {section === 'announcements' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Announcement Title (English)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Timkat Celebration Committee Meeting"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Amharic Title (የማስታወቂያው ርዕስ)
                    </label>
                    <input
                      type="text"
                      placeholder="ምሳሌ፡ የጥምቀት በዓል አከባበር ዝግጅት ኮሚቴ ስብሰባ"
                      value={titleAm}
                      onChange={(e) => setTitleAm(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                        Category
                      </label>
                      <select
                        value={category || 'Parish Notices'}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                      >
                        <option value="Parish Notices">Parish Notices (ጠቅላላ)</option>
                        <option value="Sunday School">Sunday School (የሰንበት ት/ቤት)</option>
                        <option value="Feasts & Holidays">Feasts & Holidays (የበዓላት)</option>
                        <option value="Urgent Calls">Urgent Calls (አስቸኳይ ጥሪ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                        Priority Level
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                      >
                        <option value="Notice">Notice</option>
                        <option value="Urgent">Urgent (Pinned Top)</option>
                        <option value="Important">Important</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Author / Ministry Office
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Executive Committee, Education Department"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Optional Banner / Flyer Image
                    </label>
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-[#D5D0C7] hover:border-[#C8952F] rounded-xl p-3 text-center bg-[#FAF9F6] cursor-pointer transition-colors"
                    >
                      {imageUrl ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={imageUrl}
                            alt="Attached"
                            className="w-10 h-10 object-cover rounded-md border"
                          />
                          <span className="text-xs font-semibold text-[#137333]">
                            Image Attached (click to replace)
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-[#7C88A8]">Click to attach notice flyer image</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Notice Body & Details
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Enter full announcement message..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>
                </>
              )}

              {/* === 5. GALLERY SECTION FORM (MOSAIC & FEATURED ALBUM) === */}
              {section === 'gallery' && (
                <>
                  <div className="p-3 bg-[#FAF4E6]/60 rounded-xl border border-[#E9D9B2] space-y-2">
                    <label className="block text-xs font-bold text-[#0F1B3E]">
                      Select Gallery Destination
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryTarget('mosaic');
                          setTitle('');
                          setTitleAm('');
                          setImageUrl('');
                        }}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          galleryTarget === 'mosaic'
                            ? 'bg-[#0F1B3E] text-white shadow-xs'
                            : 'bg-white text-[#505E7B] border'
                        }`}
                      >
                        Mosaic Grid (7 Slots)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryTarget('featured');
                          setTitle(featuredAlbum.titleEn);
                          setTitleAm(featuredAlbum.titleAm);
                          setFeaturedDate(featuredAlbum.dateStr);
                          setImageUrl(featuredAlbum.coverSrc);
                          setFeaturedThumbnails(featuredAlbum.thumbnails);
                        }}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          galleryTarget === 'featured'
                            ? 'bg-[#0F1B3E] text-white shadow-xs'
                            : 'bg-white text-[#505E7B] border'
                        }`}
                      >
                        ⭐ Featured Album
                      </button>
                    </div>
                  </div>

                  {galleryTarget === 'mosaic' ? (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                          Mosaic Grid Slot Position
                        </label>
                        <select
                          value={mosaicSlot}
                          onChange={(e) => {
                            const slotNum = Number(e.target.value);
                            setMosaicSlot(slotNum);
                            const item = mosaicList.find((m) => m.slot === slotNum);
                            if (item) {
                              setTitle(item.titleEn);
                              setTitleAm(item.titleAm);
                              setCategory(item.category);
                              setImageUrl(item.src);
                            }
                          }}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white font-medium"
                        >
                          <option value={1}>Slot 1: Tall Left (Col 1, Row 1-2)</option>
                          <option value={2}>Slot 2: Top Center (Col 2-3, Row 1)</option>
                          <option value={3}>Slot 3: Mid Center Left (Col 2, Row 2)</option>
                          <option value={4}>Slot 4: Mid Center Right (Col 3, Row 2)</option>
                          <option value={5}>Slot 5: Tall Right (Col 4, Row 1-2)</option>
                          <option value={6}>Slot 6: Bottom Left (Col 1, Row 3)</option>
                          <option value={7}>Slot 7: Bottom Mid Left (Col 2, Row 3)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                            Title (English)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Holy Scripture & Cross"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                            Title (Amharic)
                          </label>
                          <input
                            type="text"
                            placeholder="ምሳሌ፡ ቅዱስ መጽሐፍና መስቀል"
                            value={titleAm}
                            onChange={(e) => setTitleAm(e.target.value)}
                            className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                          Photo Category
                        </label>
                        <select
                          value={category || 'Liturgy'}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                        >
                          <option value="Liturgy">Liturgy (ሥርዓተ ቅዳሴ)</option>
                          <option value="Architecture">Architecture (ሕንፃ ጥበብ)</option>
                          <option value="Clergy">Clergy (ካህናትና ዲያቆናት)</option>
                          <option value="Choir">Choir (መዘምራን)</option>
                          <option value="Parish Life">Parish Life (ምእመናን)</option>
                        </select>
                      </div>

                      {/* Real Image Upload */}
                      <div>
                        <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                          Slot Photo Upload
                        </label>
                        <div
                          onClick={() => imageInputRef.current?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0]);
                          }}
                          className="border-2 border-dashed border-[#D5D0C7] hover:border-[#C8952F] rounded-xl p-4 text-center bg-[#FAF9F6] cursor-pointer transition-colors"
                        >
                          {imageUrl ? (
                            <div className="flex items-center gap-3">
                              <img
                                src={imageUrl}
                                alt="Preview"
                                className="w-16 h-16 object-cover rounded-lg border border-[#EAE6DF]"
                              />
                              <div className="text-left">
                                <p className="text-xs font-bold text-[#137333] flex items-center gap-1">
                                  <IconCheck className="w-3.5 h-3.5" />
                                  <span>Photo Selected</span>
                                </p>
                                <p className="text-[10px] text-[#7C88A8]">Click to replace image</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="w-8 h-8 rounded-full bg-[#FAF4E6] flex items-center justify-center text-[#C8952F] mx-auto mb-1">
                                <IconUpload className="w-4 h-4" />
                              </div>
                              <p className="text-xs font-semibold text-[#2A354F]">
                                Drop photo here, or <span className="text-[#C8952F] underline">browse</span>
                              </p>
                              <p className="text-[10px] text-[#7C88A8]">PNG, JPG up to 10MB</p>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                          Featured Album Title (English)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Saint Gabriel Church Event Album"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                          Album Title (Amharic)
                        </label>
                        <input
                          type="text"
                          placeholder="ምሳሌ፡ የቅዱስ ገብርኤል በዓል ፎቶ አልበም"
                          value={titleAm}
                          onChange={(e) => setTitleAm(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                          Event Date / Period
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Ter 19, 2011"
                          value={featuredDate}
                          onChange={(e) => setFeaturedDate(e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                        />
                      </div>

                      {/* Main Cover Image */}
                      <div>
                        <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                          Featured Album Main Cover Photo
                        </label>
                        <div
                          onClick={() => imageInputRef.current?.click()}
                          className="border-2 border-dashed border-[#D5D0C7] hover:border-[#C8952F] rounded-xl p-4 text-center bg-[#FAF9F6] cursor-pointer transition-colors"
                        >
                          {imageUrl ? (
                            <div className="flex items-center gap-3">
                              <img
                                src={imageUrl}
                                alt="Cover"
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                              <span className="text-xs font-semibold text-[#137333]">
                                Cover Image Selected (click to change)
                              </span>
                            </div>
                          ) : (
                            <p className="text-xs text-[#7C88A8]">Click to upload album cover</p>
                          )}
                        </div>
                      </div>

                      {/* Additional Album Photos Strip */}
                      <div>
                        <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                          Additional Photos in this Album ({featuredThumbnails.length} photos)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {featuredThumbnails.map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              alt=""
                              className="w-12 h-10 object-cover rounded-md border"
                            />
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => multiImageInputRef.current?.click()}
                          className="text-xs text-[#0F1B3E] font-bold border border-[#D5D0C7] px-3 py-1.5 rounded-lg hover:bg-[#FAF6EF]"
                        >
                          + Add More Photos to Album
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* === 6. TEACHINGS SECTION FORM === */}
              {section === 'teachings' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Teaching Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Spiritual Lessons from the Holy Bible"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Teacher / Speaker / Author
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Abba Melke Sedek, Deacon Ermias"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Category
                    </label>
                    <select
                      value={category || 'Holy Bible'}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                    >
                      <option value="Holy Bible">Holy Bible (መጽሐፍ ቅዱስ)</option>
                      <option value="Dogma">Dogma (ነገረ መለኮት)</option>
                      <option value="Church History">Church History (የቤተክርስቲያን ታሪክ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Cover Banner Image
                    </label>
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-[#D5D0C7] hover:border-[#C8952F] rounded-xl p-4 text-center bg-[#FAF9F6] cursor-pointer transition-colors"
                    >
                      {imageUrl ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={imageUrl}
                            alt="Preview"
                            className="w-14 h-14 object-cover rounded-lg border"
                          />
                          <span className="text-xs font-semibold text-[#137333]">
                            Image attached
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-[#7C88A8]">Click to upload banner image</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Teaching Content / Study Notes
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Enter scriptural explanation or sermon transcription..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>
                </>
              )}

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F2EFE9]">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 rounded-lg border border-[#D5D0C7] text-xs font-semibold text-[#5A6479] hover:bg-[#FAF7F2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0F1B3E] hover:bg-[#1A2D66] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
