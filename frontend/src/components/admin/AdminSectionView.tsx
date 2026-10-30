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
  getStoredMezmurCategories,
  saveStoredMezmurCategories,
  getStoredTeachings,
  saveStoredTeachings,
  getStoredTeachingCategories,
  saveStoredTeachingCategories,
  INITIAL_TEACHINGS,
  GalleryMosaicItem,
  FeaturedAlbumData,
  AnnouncementItem,
  StoredEventItem,
} from '@/lib/contentStore';
import { ChurchReport } from '@/types/report';
import { MezmurItem, MezmurCategory } from '@/components/mezmur/mezmurData';
import { Teaching, TeachingCategory, DEFAULT_TEACHING_COVER } from '@/types/teaching';
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
  const [albumPosition, setAlbumPosition] = useState<'top' | 'end'>('end');
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
  const [mezmurCategories, setMezmurCategories] = useState<MezmurCategory[]>(() =>
    getStoredMezmurCategories()
  );

  // Mezmur Category Management State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatKey, setNewCatKey] = useState('');
  const [newCatEn, setNewCatEn] = useState('');
  const [newCatAm, setNewCatAm] = useState('');
  const [editingCatKey, setEditingCatKey] = useState<string | null>(null);
  const [editingCatEn, setEditingCatEn] = useState('');
  const [editingCatAm, setEditingCatAm] = useState('');

  // Teaching Category Management State
  const [teachingCategories, setTeachingCategories] = useState<TeachingCategory[]>(() =>
    getStoredTeachingCategories()
  );
  const [showTeachingCatModal, setShowTeachingCatModal] = useState(false);
  const [newTeachCatEn, setNewTeachCatEn] = useState('');
  const [newTeachCatAm, setNewTeachCatAm] = useState('');
  const [editingTeachCatKey, setEditingTeachCatKey] = useState<string | null>(null);
  const [editingTeachCatEn, setEditingTeachCatEn] = useState('');
  const [editingTeachCatAm, setEditingTeachCatAm] = useState('');

  // Teachings Specific Fields
  const [teachingFormat, setTeachingFormat] = useState<'both' | 'pdf' | 'video' | 'audio'>('both');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfPages, setPdfPages] = useState('');
  const [teachingDuration, setTeachingDuration] = useState('20');
  const [teachingOutline, setTeachingOutline] = useState('');

  const [teachingsList, setTeachingsList] = useState<Teaching[]>(() => getStoredTeachings());

  // Sync state when content store updates
  useEffect(() => {
    const handleUpdate = () => {
      setReportsList(getStoredReports());
      setMezmurList(getStoredMezmurs());
      setAnnouncementsList(getStoredAnnouncements());
      setEventsList(getStoredEvents());
      setMosaicList(getStoredGalleryMosaic());
      setFeaturedAlbum(getStoredFeaturedAlbum());
      setMezmurCategories(getStoredMezmurCategories());
      setTeachingsList(getStoredTeachings());
      setTeachingCategories(getStoredTeachingCategories());
    };
    window.addEventListener('abune_content_store_updated', handleUpdate);
    return () => {
      window.removeEventListener('abune_content_store_updated', handleUpdate);
    };
  }, []);

  // Teaching Category Management Handlers
  const handleAddTeachingCategory = () => {
    if (!newTeachCatEn.trim()) {
      alert('Please enter category name in English');
      return;
    }
    const cleanKey =
      newTeachCatEn.trim().toLowerCase().replace(/[^a-z0-9]/g, '-') ||
      `tcat-${Date.now()}`;
    if (
      teachingCategories.some(
        (c) =>
          c.key === cleanKey ||
          c.en.toLowerCase() === newTeachCatEn.trim().toLowerCase()
      )
    ) {
      alert('A category with this name already exists');
      return;
    }

    const newCat: TeachingCategory = {
      key: cleanKey,
      en: newTeachCatEn.trim(),
      am: newTeachCatAm.trim() || newTeachCatEn.trim(),
      icon: 'bible',
    };

    const updated = [...teachingCategories, newCat];
    setTeachingCategories(updated);
    saveStoredTeachingCategories(updated);
    setCategory(newCat.en);
    setNewTeachCatEn('');
    setNewTeachCatAm('');
    showToast(`Teaching Category "${newCat.en}" added and saved!`);
  };

  const handleStartEditTeachingCategory = (cat: TeachingCategory) => {
    setEditingTeachCatKey(cat.key);
    setEditingTeachCatEn(cat.en);
    setEditingTeachCatAm(cat.am);
  };

  const handleSaveEditTeachingCategory = () => {
    if (!editingTeachCatKey || !editingTeachCatEn.trim()) return;
    const updated = teachingCategories.map((c) => {
      if (c.key === editingTeachCatKey) {
        return {
          ...c,
          en: editingTeachCatEn.trim(),
          am: editingTeachCatAm.trim() || editingTeachCatEn.trim(),
        };
      }
      return c;
    });
    setTeachingCategories(updated);
    saveStoredTeachingCategories(updated);
    setEditingTeachCatKey(null);
    setEditingTeachCatEn('');
    setEditingTeachCatAm('');
    showToast('Teaching category updated successfully!');
  };

  const handleDeleteTeachingCategory = (key: string, name: string) => {
    if (teachingCategories.length <= 1) {
      alert('You must have at least one teaching category');
      return;
    }
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    const updated = teachingCategories.filter((c) => c.key !== key);
    setTeachingCategories(updated);
    saveStoredTeachingCategories(updated);
    if (category === name) {
      setCategory(updated[0]?.en || '');
    }
    showToast(`Category "${name}" deleted successfully!`);
  };

  // Category Management Handlers
  const handleAddCategory = () => {
    if (!newCatEn.trim()) {
      alert('Please enter category name in English');
      return;
    }
    const cleanKey =
      (newCatKey.trim() || newCatEn.trim().toLowerCase().replace(/[^a-z0-9]/g, '')) ||
      `cat-${Date.now()}`;
    if (mezmurCategories.some((c) => c.key === cleanKey)) {
      alert('A category with this key already exists');
      return;
    }

    const newCat: MezmurCategory = {
      key: cleanKey,
      en: newCatEn.trim(),
      am: newCatAm.trim() || newCatEn.trim(),
      icon: 'music',
    };

    const updated = [...mezmurCategories, newCat];
    setMezmurCategories(updated);
    saveStoredMezmurCategories(updated);
    setCategory(newCat.key);
    setNewCatKey('');
    setNewCatEn('');
    setNewCatAm('');
    showToast(`Category "${newCat.en}" added and saved!`);
  };

  const handleStartEditCategory = (cat: MezmurCategory) => {
    setEditingCatKey(cat.key);
    setEditingCatEn(cat.en);
    setEditingCatAm(cat.am);
  };

  const handleSaveEditCategory = () => {
    if (!editingCatKey || !editingCatEn.trim()) return;
    const updated = mezmurCategories.map((c) => {
      if (c.key === editingCatKey) {
        return {
          ...c,
          en: editingCatEn.trim(),
          am: editingCatAm.trim() || editingCatEn.trim(),
        };
      }
      return c;
    });
    setMezmurCategories(updated);
    saveStoredMezmurCategories(updated);
    setEditingCatKey(null);
    setEditingCatEn('');
    setEditingCatAm('');
    showToast('Category updated and synchronized!');
  };

  const handleDeleteCategory = (key: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    const updated = mezmurCategories.filter((c) => c.key !== key);
    setMezmurCategories(updated);
    saveStoredMezmurCategories(updated);
    if (category === key) {
      setCategory(updated[0]?.key || '');
    }
    showToast(`Category "${name}" deleted!`);
  };

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
      ...mezmurCategories.map((c) => ({
        label: `${c.en} (${c.key})`,
        value: c.key,
      })),
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
      ...teachingCategories.map((c) => ({
        label: `${c.en} (${c.am})`,
        value: c.en,
      })),
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
    setPdfFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFileUrl(result);
      setPdfUrl(result);
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
    setAlbumPosition('end');
    setFeaturedDate('Ter 19, 2011');
    setFeaturedThumbnails([]);
    setTeachingFormat('both');
    setVideoUrl('');
    setPdfUrl('');
    setPdfFileName('');
    setPdfPages('');
    setTeachingDuration('20');
    setTeachingOutline('');
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
        setTitleAm(itm.titleAm || '');
        setSubtitle(itm.author || '');
        setCategory(itm.category || 'Holy Bible');
        setContent(itm.content || '');
        setImageUrl(itm.imageUrl || '');
        setIsPublished(itm.isPublished !== false);
        setTeachingFormat(itm.format || 'both');
        setVideoUrl(itm.videoUrl || '');
        setPdfUrl(itm.pdfUrl || '');
        setPdfFileName(itm.pdfFileName || '');
        setPdfPages(itm.pdfPages ? String(itm.pdfPages) : '');
        setAudioUrl(itm.audioUrl || '');
        setAudioName(itm.audioFileName || '');
        setTeachingDuration(itm.durationMinutes ? String(itm.durationMinutes) : '20');
        setTeachingOutline(itm.outline ? itm.outline.join('\n') : '');
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
      const updatedThumbs =
        albumPosition === 'top'
          ? [imageUrl, ...featuredAlbum.thumbnails]
          : [...featuredAlbum.thumbnails, imageUrl];
      setFeaturedThumbnails(updatedThumbs);
      const updatedAlbum: FeaturedAlbumData = {
        ...featuredAlbum,
        thumbnails: updatedThumbs,
      };
      setFeaturedAlbum(updatedAlbum);
      saveStoredFeaturedAlbum(updatedAlbum);
      setImageUrl('');
      setImageName('');
      showToast(
        `Photo added to the ${albumPosition === 'top' ? 'top' : 'end'} of Complete Album! Total: ${updatedThumbs.length} photos on /gallery.`
      );
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
        audioUrl: audioUrl || undefined,
        audioName: audioName || undefined,
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
      const targetId = editingId || `teach-${Date.now()}`;
      const existingIdx = updated.findIndex((i) => i.id === targetId);

      const outlineArray = teachingOutline
        ? teachingOutline
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const newTeaching: Teaching = {
        id: targetId,
        title: title.trim(),
        titleAm: titleAm.trim() || undefined,
        content: content.trim() || 'Teaching study notes and scriptural analysis.',
        author: subtitle.trim() || 'Abune Media Teacher',
        category:
          category && category !== 'All'
            ? category
            : teachingCategories[0]?.en || 'Holy Bible',
        subject:
          category && category !== 'All'
            ? category
            : teachingCategories[0]?.en || 'Holy Bible',
        format: teachingFormat,
        videoUrl:
          teachingFormat === 'video' || teachingFormat === 'both'
            ? videoUrl.trim() || null
            : null,
        pdfUrl:
          teachingFormat === 'pdf' || teachingFormat === 'both'
            ? pdfUrl.trim() || null
            : null,
        pdfFileName: pdfFileName.trim() || (pdfUrl ? `${title.trim()}.pdf` : null),
        pdfPages: pdfPages ? Number(pdfPages) : null,
        audioUrl: teachingFormat === 'audio' ? audioUrl.trim() || null : null,
        audioFileName: audioName.trim() || (audioUrl ? `${title.trim()}.mp3` : null),
        durationMinutes: teachingDuration ? Number(teachingDuration) : 20,
        metaExtra:
          teachingFormat === 'both'
            ? `Video + Book (${teachingDuration || 20} min, ${pdfPages || 12} pages)`
            : teachingFormat === 'pdf'
            ? `PDF Book (${pdfPages || 12} Pages)`
            : teachingFormat === 'audio'
            ? `Audio Sermon (${teachingDuration || 25} min)`
            : `Video Lecture (${teachingDuration || 30} min)`,
        imageUrl: imageUrl.trim() || DEFAULT_TEACHING_COVER,
        outline: outlineArray.length > 0 ? outlineArray : undefined,
        isPublished,
        publishedAt: new Date().toISOString().slice(0, 10),
        createdAt:
          existingIdx >= 0
            ? updated[existingIdx].createdAt
            : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (existingIdx >= 0) {
        updated[existingIdx] = newTeaching;
      } else {
        updated.unshift(newTeaching);
      }

      setTeachingsList(updated);
      saveStoredTeachings(updated);

      try {
        if (existingIdx >= 0) {
          await apiClient.put(`/admin/teachings/${targetId}`, {
            title: newTeaching.title,
            content: newTeaching.content,
            author: newTeaching.author,
            category: newTeaching.category,
            mediaUrl:
              newTeaching.videoUrl || newTeaching.pdfUrl || newTeaching.audioUrl,
            isPublished: newTeaching.isPublished,
          });
        } else {
          await apiClient.post('/admin/teachings', {
            title: newTeaching.title,
            content: newTeaching.content,
            author: newTeaching.author,
            category: newTeaching.category,
            mediaUrl:
              newTeaching.videoUrl || newTeaching.pdfUrl || newTeaching.audioUrl,
            isPublished: newTeaching.isPublished,
          });
        }
      } catch (err) {}

      showToast('Teaching material saved & updated on /teachings!');
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
      const next = teachingsList.filter((i) => i.id !== String(id));
      setTeachingsList(next);
      saveStoredTeachings(next);
      try {
        await apiClient.delete(`/admin/teachings/${id}`);
      } catch (e) {}
      showToast('Teaching material deleted & updated on /teachings!');
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

    // Teachings
    const filtered = teachingsList.filter((i) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        i.title.toLowerCase().includes(q) ||
        (i.titleAm && i.titleAm.toLowerCase().includes(q)) ||
        (i.author && i.author.toLowerCase().includes(q));
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
            {i.imageUrl ? (
              <img
                src={i.imageUrl}
                alt={i.title}
                className="w-10 h-10 rounded-lg object-cover border border-[#EAE6DF]"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[#FAF4E6] flex items-center justify-center text-[#C8952F]">
                📖
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-[#0F1B3E] truncate max-w-[240px]">
                {i.title}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#7C88A8]">
                <span>{i.author || 'Abune Media'}</span>
                <span>•</span>
                <span className="font-medium text-[#b9852a]">
                  {i.format === 'both'
                    ? '🎥 Video + 📖 Book'
                    : i.format === 'pdf'
                    ? '📄 PDF Book'
                    : i.format === 'audio'
                    ? '🎧 Audio Sermon'
                    : '🎥 Video Lecture'}
                </span>
              </div>
            </div>
          </div>
        </td>

        <td className="py-3.5 px-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF4E6] text-[#8B6E32] border border-[#E9D9B2]">
            {i.category || 'General'}
          </span>
        </td>

        <td className="py-3.5 px-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              i.isPublished !== false
                ? 'bg-[#E6F4EA] text-[#137333]'
                : 'bg-[#FFF3E0] text-[#B76E00]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                i.isPublished !== false ? 'bg-[#137333]' : 'bg-[#B76E00]'
              }`}
            ></span>
            {i.isPublished !== false ? 'Published' : 'Draft'}
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-[#0F1B3E]">
                        Category (ምድብ)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCategoryModal(true)}
                        className="text-[11px] font-bold text-[#C8952F] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        ⚙️ Manage Categories ({mezmurCategories.length})
                      </button>
                    </div>
                    <select
                      value={category || (mezmurCategories[0]?.key || 'hymns')}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white font-medium"
                    >
                      {mezmurCategories.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.en} {c.am ? `(${c.am})` : ''}
                        </option>
                      ))}
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

              {/* === 5. GALLERY SECTION FORM (MOSAIC & COMPLETE ALBUM) === */}
              {section === 'gallery' && (
                <>
                  <div className="p-3 bg-[#FAF4E6]/60 rounded-xl border border-[#E9D9B2] space-y-2">
                    <label className="block text-xs font-bold text-[#0F1B3E]">
                      Select Gallery Destination
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryTarget('mosaic');
                          setTitle('');
                          setTitleAm('');
                          setImageUrl('');
                        }}
                        className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                          galleryTarget === 'mosaic'
                            ? 'bg-[#0F1B3E] text-white shadow-xs'
                            : 'bg-white text-[#505E7B] border border-[#D5D0C7]'
                        }`}
                      >
                        Mosaic Grid (7 Slots)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryTarget('addToAlbum');
                          setImageUrl('');
                        }}
                        className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                          galleryTarget === 'addToAlbum'
                            ? 'bg-[#0F1B3E] text-white shadow-xs'
                            : 'bg-white text-[#505E7B] border border-[#D5D0C7]'
                        }`}
                      >
                        ➕ Complete Album
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
                        className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
                          galleryTarget === 'featured'
                            ? 'bg-[#0F1B3E] text-white shadow-xs'
                            : 'bg-white text-[#505E7B] border border-[#D5D0C7]'
                        }`}
                      >
                        ⭐ Album Info
                      </button>
                    </div>
                  </div>

                  {/* Dropdown position selector - exactly matches what the user screenshotted */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      {galleryTarget === 'mosaic'
                        ? 'Mosaic Grid Slot Position'
                        : galleryTarget === 'addToAlbum'
                        ? 'Album Placement Position'
                        : 'Destination Position'}
                    </label>
                    <select
                      value={
                        galleryTarget === 'addToAlbum'
                          ? albumPosition === 'top'
                            ? 'album-top'
                            : 'album-end'
                          : galleryTarget === 'featured'
                          ? 'featured'
                          : String(mosaicSlot)
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'album-top') {
                          setGalleryTarget('addToAlbum');
                          setAlbumPosition('top');
                          setImageUrl('');
                        } else if (val === 'album-end') {
                          setGalleryTarget('addToAlbum');
                          setAlbumPosition('end');
                          setImageUrl('');
                        } else if (val === 'featured') {
                          setGalleryTarget('featured');
                          setTitle(featuredAlbum.titleEn);
                          setTitleAm(featuredAlbum.titleAm);
                          setFeaturedDate(featuredAlbum.dateStr);
                          setImageUrl(featuredAlbum.coverSrc);
                          setFeaturedThumbnails(featuredAlbum.thumbnails);
                        } else {
                          setGalleryTarget('mosaic');
                          const slotNum = Number(val);
                          setMosaicSlot(slotNum);
                          const item = mosaicList.find((m) => m.slot === slotNum);
                          if (item) {
                            setTitle(item.titleEn);
                            setTitleAm(item.titleAm);
                            setCategory(item.category);
                            setImageUrl(item.src);
                          }
                        }
                      }}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white font-medium cursor-pointer"
                    >
                      <optgroup label="🖼️ Mosaic Grid (7 Homepage Slots)">
                        <option value={1}>Slot 1: Tall Left (Col 1, Row 1-2)</option>
                        <option value={2}>Slot 2: Top Center (Col 2-3, Row 1)</option>
                        <option value={3}>Slot 3: Mid Center Left (Col 2, Row 2)</option>
                        <option value={4}>Slot 4: Mid Center Right (Col 3, Row 2)</option>
                        <option value={5}>Slot 5: Tall Right (Col 4, Row 1-2)</option>
                        <option value={6}>Slot 6: Bottom Left (Col 1, Row 3)</option>
                        <option value={7}>Slot 7: Bottom Mid Left (Col 2, Row 3)</option>
                      </optgroup>
                      <optgroup label="📚 Complete Album (All Photos Page)">
                        <option value="album-top">⬆️ Complete Album: Add at the Top / Beginning</option>
                        <option value="album-end">⬇️ Complete Album: Add at the End</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* BRANCH 1: MOSAIC SLOT */}
                  {galleryTarget === 'mosaic' && (
                    <>
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
                  )}

                  {/* BRANCH 2: ADD TO COMPLETE ALBUM (TOP OR END) */}
                  {galleryTarget === 'addToAlbum' && (
                    <div className="space-y-4">
                      {/* Placement Choice */}
                      <div>
                        <label className="block text-xs font-semibold text-[#0F1B3E] mb-1.5">
                          Where to Add Photo in Complete Album:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setAlbumPosition('top')}
                            className={`py-2 px-3 rounded-lg border text-xs font-bold text-center cursor-pointer transition-all ${
                              albumPosition === 'top'
                                ? 'bg-[#0F1B3E] text-white border-[#0F1B3E] shadow-sm'
                                : 'bg-white text-[#5A6479] border-[#D5D0C7] hover:bg-[#FAF9F5]'
                            }`}
                          >
                            ⬆️ At the Top (Beginning)
                          </button>
                          <button
                            type="button"
                            onClick={() => setAlbumPosition('end')}
                            className={`py-2 px-3 rounded-lg border text-xs font-bold text-center cursor-pointer transition-all ${
                              albumPosition === 'end'
                                ? 'bg-[#0F1B3E] text-white border-[#0F1B3E] shadow-sm'
                                : 'bg-white text-[#5A6479] border-[#D5D0C7] hover:bg-[#FAF9F5]'
                            }`}
                          >
                            ⬇️ At the End (Latest)
                          </button>
                        </div>
                        <p className="text-[11px] text-[#7C88A8] mt-1.5">
                          {albumPosition === 'top'
                            ? 'Will appear right after the cover photo at the start of /gallery/album.'
                            : 'Will appear at the very end of the /gallery/album photo grid.'}
                        </p>
                      </div>

                      {/* Photo Upload */}
                      <div>
                        <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                          Album Photo Upload
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

                      {/* Info Banner */}
                      <div className="p-3 bg-[#FAF4E6] border border-[#E9D9B2] rounded-xl text-xs text-[#0F1B3E]">
                        ℹ️ This photo will be added to the Complete Album page (<strong>/gallery/album</strong>). Currently has{' '}
                        <strong>{featuredAlbum.thumbnails.length} photos</strong>.
                      </div>
                    </div>
                  )}

                  {/* BRANCH 3: FEATURED ALBUM SETTINGS & PHOTOS */}
                  {galleryTarget === 'featured' && (
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

                      {/* Additional Album Photos Strip with DELETE buttons */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-semibold text-[#0F1B3E]">
                            Complete Album Photos ({featuredThumbnails.length} photos)
                          </label>
                          <span className="text-[10px] text-[#7C88A8]">Hover over photo to delete</span>
                        </div>
                        {featuredThumbnails.length === 0 ? (
                          <p className="text-xs text-[#7C88A8] italic p-3 border rounded-lg bg-[#FAF9F6]">
                            No additional photos added yet. Click &quot;+ Add More Photos&quot; or choose &quot;➕ Complete Album&quot; above.
                          </p>
                        ) : (
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-2 max-h-48 overflow-y-auto p-1 border rounded-lg bg-[#FAF9F6]">
                            {featuredThumbnails.map((src, i) => (
                              <div
                                key={i}
                                className="relative group aspect-square rounded-md overflow-hidden border border-[#D5D0C7] bg-white shadow-xs"
                              >
                                <img
                                  src={src}
                                  alt={`Album photo ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveAlbumThumbnail(i);
                                  }}
                                  className="absolute inset-0 bg-red-600/85 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold cursor-pointer"
                                  title="Delete this photo"
                                >
                                  <IconTrash className="w-4 h-4 mb-0.5" />
                                  <span className="text-[9px]">Delete</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => multiImageInputRef.current?.click()}
                          className="text-xs text-[#0F1B3E] font-bold border border-[#D5D0C7] px-3 py-1.5 rounded-lg hover:bg-[#FAF6EF] cursor-pointer"
                        >
                          + Add More Photos from Computer
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
                      Teaching Title (English / Ge&apos;ez)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The Mystery of the Holy Trinity & Dogma"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Teaching Title (Amharic)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ምሥጢረ ሥላሴ እና የኦርቶዶክስ ተዋሕዶ ሃይማኖት"
                      value={titleAm}
                      onChange={(e) => setTitleAm(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                        Teacher / Speaker / Preacher
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Abba Melke Sedek, Deacon Yared"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-[#0F1B3E]">
                          Category
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowTeachingCatModal(true)}
                          className="text-[11px] font-semibold text-[#C8952F] hover:text-[#9A701E] flex items-center gap-1 cursor-pointer"
                        >
                          ⚙️ Manage Categories
                        </button>
                      </div>
                      <select
                        value={category || teachingCategories[0]?.en || 'Holy Bible'}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                      >
                        {teachingCategories.map((c) => (
                          <option key={c.key} value={c.en}>
                            {c.en} {c.am ? `(${c.am})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Format Selector */}
                  <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#EAE6DF]">
                    <label className="block text-xs font-bold text-[#0F1B3E] mb-1">
                      Teaching Material Format
                    </label>
                    <p className="text-[11px] text-[#7C88A8] mb-2.5">
                      Select if this lesson has video, study book (PDF), audio sermon, or both.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => setTeachingFormat('both')}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          teachingFormat === 'both'
                            ? 'bg-[#0F1B3E] text-white border-[#0F1B3E] shadow-xs'
                            : 'bg-white text-[#5A6479] border-[#D5D0C7] hover:border-[#C8952F]'
                        }`}
                      >
                        🎥 Video + 📖 Book
                      </button>
                      <button
                        type="button"
                        onClick={() => setTeachingFormat('pdf')}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          teachingFormat === 'pdf'
                            ? 'bg-[#0F1B3E] text-white border-[#0F1B3E] shadow-xs'
                            : 'bg-white text-[#5A6479] border-[#D5D0C7] hover:border-[#C8952F]'
                        }`}
                      >
                        📄 PDF Book Only
                      </button>
                      <button
                        type="button"
                        onClick={() => setTeachingFormat('video')}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          teachingFormat === 'video'
                            ? 'bg-[#0F1B3E] text-white border-[#0F1B3E] shadow-xs'
                            : 'bg-white text-[#5A6479] border-[#D5D0C7] hover:border-[#C8952F]'
                        }`}
                      >
                        🎥 Video Only
                      </button>
                      <button
                        type="button"
                        onClick={() => setTeachingFormat('audio')}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          teachingFormat === 'audio'
                            ? 'bg-[#0F1B3E] text-white border-[#0F1B3E] shadow-xs'
                            : 'bg-white text-[#5A6479] border-[#D5D0C7] hover:border-[#C8952F]'
                        }`}
                      >
                        🎧 Audio Only
                      </button>
                    </div>
                  </div>

                  {/* Video URL Input (if both or video) */}
                  {(teachingFormat === 'both' || teachingFormat === 'video') && (
                    <div className="rounded-xl border border-[#D5D0C7] bg-white p-3 space-y-2">
                      <label className="block text-xs font-semibold text-[#0F1B3E]">
                        🎥 Video Lecture URL (YouTube or MP4)
                      </label>
                      <input
                        type="url"
                        placeholder="e.g. https://www.youtube.com/watch?v=... or MP4 direct link"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                      />
                      <p className="text-[10px] text-[#7C88A8]">
                        Supports direct YouTube links or MP4 video streaming URLs.
                      </p>
                    </div>
                  )}

                  {/* PDF Study Book Attachment (if both or pdf) */}
                  {(teachingFormat === 'both' || teachingFormat === 'pdf') && (
                    <div className="rounded-xl border border-[#D5D0C7] bg-white p-3 space-y-2">
                      <label className="block text-xs font-semibold text-[#0F1B3E]">
                        📖 Companion Study Book / PDF Document
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="PDF URL or upload file below..."
                          value={pdfUrl}
                          onChange={(e) => setPdfUrl(e.target.value)}
                          className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                        />
                        <button
                          type="button"
                          onClick={() => pdfInputRef.current?.click()}
                          className="px-3 py-2 rounded-lg bg-[#FAF4E6] border border-[#E9D9B2] text-[#8B6E32] hover:bg-[#F2E8CF] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <IconUpload className="w-3.5 h-3.5" />
                          <span>Upload PDF</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="block text-[10px] font-semibold text-[#7C88A8] mb-0.5">
                            PDF File Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Trinity_Study_Guide.pdf"
                            value={pdfFileName}
                            onChange={(e) => setPdfFileName(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[#D5D0C7]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-[#7C88A8] mb-0.5">
                            Page Count
                          </label>
                          <input
                            type="number"
                            placeholder="e.g. 18"
                            value={pdfPages}
                            onChange={(e) => setPdfPages(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-[#D5D0C7]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Audio Attachment (if audio) */}
                  {teachingFormat === 'audio' && (
                    <div className="rounded-xl border border-[#D5D0C7] bg-white p-3 space-y-2">
                      <label className="block text-xs font-semibold text-[#0F1B3E]">
                        🎧 Audio Sermon Track (MP3)
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Audio URL or upload below..."
                          value={audioUrl}
                          onChange={(e) => setAudioUrl(e.target.value)}
                          className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                        />
                        <button
                          type="button"
                          onClick={() => audioInputRef.current?.click()}
                          className="px-3 py-2 rounded-lg bg-[#FAF4E6] border border-[#E9D9B2] text-[#8B6E32] hover:bg-[#F2E8CF] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <IconUpload className="w-3.5 h-3.5" />
                          <span>Upload Audio</span>
                        </button>
                      </div>
                      {audioName && (
                        <p className="text-[11px] text-[#137333]">Attached: {audioName}</p>
                      )}
                    </div>
                  )}

                  {/* Duration & Banner Image */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                        Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 24"
                        value={teachingDuration}
                        onChange={(e) => setTeachingDuration(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                        Cover Image{' '}
                        <span className="text-[10px] font-normal text-[#7C88A8]">
                          (Optional — defaults to Holy Book image)
                        </span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Optional image URL (leave empty for default book cover)..."
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                        />
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-lg border border-[#D5D0C7] text-xs hover:bg-[#FAF6EF]"
                          title="Upload Image"
                        >
                          Upload
                        </button>
                      </div>
                      {imageUrl ? (
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-[#137333]">
                          <img
                            src={imageUrl}
                            alt="Preview"
                            className="h-7 w-10 rounded object-cover border"
                          />
                          <span>Custom cover attached</span>
                          <button
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="ml-auto text-xs text-[#B3261E] hover:underline"
                          >
                            Remove (Use Default Book)
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-[#7C88A8]">
                          <img
                            src={DEFAULT_TEACHING_COVER}
                            alt="Default Book"
                            className="h-7 w-10 rounded object-cover border opacity-80"
                          />
                          <span>Default Holy Book Cover will be used</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Key Study Topics / Outline (One per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="1. One Essence, Three Persons&#10;2. Biblical Basis from Genesis to the Gospels&#10;3. Sayings of the Church Fathers"
                      value={teachingOutline}
                      onChange={(e) => setTeachingOutline(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                      Teaching Content / Study Notes / Full Lecture Text
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Enter scriptural explanation, sermon transcription, or commentary..."
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
                  className="px-5 py-2 rounded-lg bg-[#0F1B3E] hover:bg-[#1A2D66] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {section === 'gallery' && galleryTarget === 'addToAlbum'
                    ? albumPosition === 'top'
                      ? '⬆️ Add to Top of Album'
                      : '⬇️ Add to End of Album'
                    : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setShowCategoryModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-[#EAE6DF] shadow-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0F1B3E]">
                  Manage Mezmur Categories (የመዝሙር ምድቦች)
                </h3>
                <p className="text-xs text-[#7C88A8]">
                  Add, edit, or delete categories used in the dropdown and on /mezmur.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF9F5] border border-[#EAE6DF] flex items-center justify-center text-[#5A6479] hover:text-[#0F1B3E] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Add New Category Form */}
            <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#EAE6DF] space-y-3">
              <h4 className="text-xs font-bold text-[#0F1B3E] uppercase tracking-wider">
                + Add New Category
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A6479] mb-1">
                    English Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Youth Fellowship Songs"
                    value={newCatEn}
                    onChange={(e) => {
                      setNewCatEn(e.target.value);
                      if (!newCatKey) {
                        setNewCatKey(
                          e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')
                        );
                      }
                    }}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A6479] mb-1">
                    Amharic Name (የምድቡ ስም)
                  </label>
                  <input
                    type="text"
                    placeholder="ምሳሌ፡ የወጣቶች መዝሙራት"
                    value={newCatAm}
                    onChange={(e) => setNewCatAm(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#5A6479] mb-1">
                  Category Key (Identifier, e.g. youth)
                </label>
                <input
                  type="text"
                  placeholder="e.g. youth"
                  value={newCatKey}
                  onChange={(e) => setNewCatKey(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleAddCategory}
                className="w-full py-2 bg-[#0F1B3E] hover:bg-[#19377D] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                + Add Category to Dropdown
              </button>
            </div>

            {/* List of Existing Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#0F1B3E] uppercase tracking-wider">
                Current Categories ({mezmurCategories.length})
              </h4>
              <div className="divide-y divide-[#EAE6DF] border border-[#EAE6DF] rounded-xl overflow-hidden bg-white">
                {mezmurCategories.map((c) => {
                  const isEditing = editingCatKey === c.key;
                  return (
                    <div
                      key={c.key}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-[#FAF9F5] transition-colors"
                    >
                      {isEditing ? (
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editingCatEn}
                            onChange={(e) => setEditingCatEn(e.target.value)}
                            placeholder="English Name"
                            className="text-xs px-2.5 py-1.5 border border-[#C8952F] rounded-md"
                          />
                          <input
                            type="text"
                            value={editingCatAm}
                            onChange={(e) => setEditingCatAm(e.target.value)}
                            placeholder="Amharic Name"
                            className="text-xs px-2.5 py-1.5 border border-[#C8952F] rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-[#0F1B3E]">
                              {c.en}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF4E6] text-[#8B6E32] font-mono">
                              {c.key}
                            </span>
                          </div>
                          {c.am && (
                            <p className="text-[11px] text-[#7C88A8] mt-0.5">
                              {c.am}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={handleSaveEditCategory}
                              className="px-2.5 py-1 bg-[#137333] text-white text-[11px] font-semibold rounded-md hover:bg-[#0e5c28] cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCatKey(null)}
                              className="px-2.5 py-1 bg-[#EAE6DF] text-[#5A6479] text-[11px] font-semibold rounded-md hover:bg-[#d8d2c6] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStartEditCategory(c)}
                              className="p-1.5 text-[#5A6479] hover:text-[#0F1B3E] hover:bg-[#F2EFE9] rounded-md transition-colors cursor-pointer"
                              title="Edit Category"
                            >
                              <IconEdit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(c.key, c.en)}
                              className="p-1.5 text-[#B3261E] hover:bg-[#FCE8E6] rounded-md transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <IconTrash className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teaching Category Management Modal */}
      {showTeachingCatModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setShowTeachingCatModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-[#EAE6DF] shadow-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#F2EFE9] pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0F1B3E]">
                  Manage Teaching Categories (የትምህርት ምድቦች)
                </h3>
                <p className="text-xs text-[#7C88A8]">
                  Add, edit, or delete categories displayed in the teachings filter and admin dropdown.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTeachingCatModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF9F5] border border-[#EAE6DF] flex items-center justify-center text-[#5A6479] hover:text-[#0F1B3E] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Add New Category Form */}
            <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#EAE6DF] space-y-3">
              <h4 className="text-xs font-bold text-[#0F1B3E] uppercase tracking-wider">
                + Add New Teaching Category
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A6479] mb-1">
                    English Category Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Patristics or Liturgy"
                    value={newTeachCatEn}
                    onChange={(e) => setNewTeachCatEn(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A6479] mb-1">
                    Amharic Category Name (የምድቡ ስም)
                  </label>
                  <input
                    type="text"
                    placeholder="ምሳሌ፡ የአበው ትምህርት ወይም ሥርዓተ ቤተክርስቲያን"
                    value={newTeachCatAm}
                    onChange={(e) => setNewTeachCatAm(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddTeachingCategory}
                className="w-full py-2 bg-[#0F1B3E] hover:bg-[#19377D] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                + Add Category to Teachings
              </button>
            </div>

            {/* List of Existing Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#0F1B3E] uppercase tracking-wider">
                Current Teaching Categories ({teachingCategories.length})
              </h4>
              <div className="divide-y divide-[#EAE6DF] border border-[#EAE6DF] rounded-xl overflow-hidden bg-white">
                {teachingCategories.map((c) => {
                  const isEditing = editingTeachCatKey === c.key;
                  return (
                    <div
                      key={c.key}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-[#FAF9F5] transition-colors"
                    >
                      {isEditing ? (
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editingTeachCatEn}
                            onChange={(e) => setEditingTeachCatEn(e.target.value)}
                            placeholder="English Name"
                            className="text-xs px-2.5 py-1.5 border border-[#C8952F] rounded-md"
                          />
                          <input
                            type="text"
                            value={editingTeachCatAm}
                            onChange={(e) => setEditingTeachCatAm(e.target.value)}
                            placeholder="Amharic Name"
                            className="text-xs px-2.5 py-1.5 border border-[#C8952F] rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-[#0F1B3E]">
                              {c.en}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF4E6] text-[#8B6E32] font-mono">
                              {c.key}
                            </span>
                          </div>
                          {c.am && (
                            <p className="text-[11px] text-[#7C88A8] mt-0.5">
                              {c.am}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={handleSaveEditTeachingCategory}
                              className="px-2.5 py-1 bg-[#137333] text-white text-[11px] font-semibold rounded-md hover:bg-[#0e5c28] cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingTeachCatKey(null)}
                              className="px-2.5 py-1 bg-[#EAE6DF] text-[#5A6479] text-[11px] font-semibold rounded-md hover:bg-[#d8d2c6] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStartEditTeachingCategory(c)}
                              className="p-1.5 text-[#5A6479] hover:text-[#0F1B3E] hover:bg-[#F2EFE9] rounded-md transition-colors cursor-pointer"
                              title="Edit Category"
                            >
                              <IconEdit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTeachingCategory(c.key, c.en)}
                              className="p-1.5 text-[#B3261E] hover:bg-[#FCE8E6] rounded-md transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <IconTrash className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
