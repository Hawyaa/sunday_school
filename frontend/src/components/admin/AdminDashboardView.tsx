import React, { useState } from 'react';
import { AdminSection } from './AdminSidebar';
import {
  IconAnnouncement,
  IconEvents,
  IconReports,
  IconMezmur,
  IconTeachings,
  IconGallery,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
} from './AdminIcons';

interface SectionAdminRow {
  id: string;
  section: AdminSection;
  sectionLabel: string;
  adminName: string;
  adminEmail: string;
  canDo: string;
  status: 'Active' | 'Invited' | 'Suspended';
}

interface AdminDashboardViewProps {
  onNavigateSection: (section: AdminSection, openAdd?: boolean) => void;
}

export function AdminDashboardView({ onNavigateSection }: AdminDashboardViewProps) {
  const [admins, setAdmins] = useState<SectionAdminRow[]>([
    {
      id: '1',
      section: 'announcements',
      sectionLabel: 'Announcements',
      adminName: 'Tigist Mengistu',
      adminEmail: 'tigist.m@abunemedia.org',
      canDo: 'Create, edit, and publish parish notices & flash announcements',
      status: 'Active',
    },
    {
      id: '2',
      section: 'events',
      sectionLabel: 'Events',
      adminName: 'Daniel Kassaye',
      adminEmail: 'daniel.k@abunemedia.org',
      canDo: 'Manage calendar, banquet RSVP, venue details, and schedule',
      status: 'Active',
    },
    {
      id: '3',
      section: 'reports',
      sectionLabel: 'Reports',
      adminName: 'Abebe Kebede (Super)',
      adminEmail: 'abebe.k@abunemedia.org',
      canDo: 'Full administrative access: upload quarterly PDFs and audits',
      status: 'Active',
    },
    {
      id: '4',
      section: 'mezmur',
      sectionLabel: 'Mezmur',
      adminName: 'Yonas Berhanu',
      adminEmail: 'yonas.b@abunemedia.org',
      canDo: 'Upload hymn audio, edit Ge\'ez lyrics, categorize seasons',
      status: 'Active',
    },
    {
      id: '5',
      section: 'teachings',
      sectionLabel: 'Teachings',
      adminName: 'Deacon Ermias',
      adminEmail: 'ermias.d@abunemedia.org',
      canDo: 'Publish dogmatic teachings, audio lessons, and scripture studies',
      status: 'Active',
    },
    {
      id: '6',
      section: 'gallery',
      sectionLabel: 'Gallery',
      adminName: 'Selam Wolde',
      adminEmail: 'selam.w@abunemedia.org',
      canDo: 'Upload feast photography, organize albums and photo tags',
      status: 'Invited',
    },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    section: 'mezmur' as AdminSection,
    canDo: '',
  });

  const cards: {
    id: AdminSection;
    title: string;
    description: string;
    adminName: string;
    icon: React.ReactNode;
    stats: string;
  }[] = [
    {
      id: 'announcements',
      title: 'Announcements',
      description: 'News, urgent alerts, and weekly notices for the Sunday School community.',
      adminName: 'Tigist M.',
      icon: <IconAnnouncement className="w-6 h-6 text-[#C8952F]" />,
      stats: '3 active · 1 scheduled',
    },
    {
      id: 'events',
      title: 'Events',
      description: 'Feasts, seasonal celebrations, choir rehearsals, and general assemblies.',
      adminName: 'Daniel K.',
      icon: <IconEvents className="w-6 h-6 text-[#C8952F]" />,
      stats: '5 upcoming · 1 this week',
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Quarterly financial reports, annual audits, and Sunday School achievements.',
      adminName: 'Super Admin',
      icon: <IconReports className="w-6 h-6 text-[#C8952F]" />,
      stats: '12 published · 2 drafts',
    },
    {
      id: 'mezmur',
      title: 'Mezmur',
      description: 'Spiritual hymns with high-fidelity audio streams and complete Ge\'ez lyrics.',
      adminName: 'Yonas B.',
      icon: <IconMezmur className="w-6 h-6 text-[#C8952F]" />,
      stats: '48 hymns · 6 categories',
    },
    {
      id: 'teachings',
      title: 'Teachings',
      description: 'Spiritual articles, patristic studies, audio lectures, and PDF study guides.',
      adminName: 'Deacon Ermias',
      icon: <IconTeachings className="w-6 h-6 text-[#C8952F]" />,
      stats: '26 articles & audio',
    },
    {
      id: 'gallery',
      title: 'Gallery',
      description: 'High-resolution photo albums from church feasts, retreats, and parish life.',
      adminName: 'Selam W.',
      icon: <IconGallery className="w-6 h-6 text-[#C8952F]" />,
      stats: '120 photos · 8 albums',
    },
  ];

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) return;

    const sectionLabels: Record<AdminSection, string> = {
      dashboard: 'Dashboard',
      announcements: 'Announcements',
      events: 'Events',
      reports: 'Reports',
      mezmur: 'Mezmur',
      teachings: 'Teachings',
      gallery: 'Gallery',
      users: 'Users & Admins',
    };

    const newAdmin: SectionAdminRow = {
      id: Date.now().toString(),
      section: inviteForm.section,
      sectionLabel: sectionLabels[inviteForm.section],
      adminName: inviteForm.name,
      adminEmail: inviteForm.email,
      canDo: inviteForm.canDo || `Manage ${sectionLabels[inviteForm.section]} content and status`,
      status: 'Invited',
    };

    setAdmins((prev) => [...prev, newAdmin]);
    setShowInviteModal(false);
    setInviteForm({ name: '', email: '', section: 'mezmur', canDo: '' });
  };

  const handleRemoveAdmin = (id: string) => {
    if (confirm('Are you sure you want to revoke this admin access?')) {
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* 6 Section Management Cards */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-lg font-bold text-[#0F1B3E]">
            Content Management Modules
          </h2>
          <span className="text-xs text-[#6B7897]">
            Select a module to view, publish, or edit entries
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl border border-[#EAE6DF] p-5 shadow-[0_2px_8px_rgba(15,27,62,0.03)] hover:border-[#C8952F]/60 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header with Icon and Admin Badge */}
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#FAF4E6] border border-[#E9D9B2] flex items-center justify-center flex-shrink-0">
                    {card.icon}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F1F4F9] text-[#4A5568]">
                    {card.adminName}
                  </span>
                </div>

                {/* Card Title & Description */}
                <h3 className="font-serif text-lg font-bold text-[#0F1B3E] mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-[#6B7897] leading-relaxed mb-3">
                  {card.description}
                </p>
                <div className="text-[11px] font-semibold text-[#8B6E32] mb-5">
                  {card.stats}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#F2EFE9] flex items-center justify-between gap-3">
                <button
                  onClick={() => onNavigateSection(card.id, true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F1B3E] hover:text-[#C8952F] transition-colors"
                >
                  <IconPlus className="w-3.5 h-3.5" />
                  <span>+ Add new</span>
                </button>
                <button
                  onClick={() => onNavigateSection(card.id, false)}
                  className="px-4 py-1.5 rounded-lg bg-[#0F1B3E] hover:bg-[#1A2D66] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Admins Management Table */}
      <div className="bg-white rounded-xl border border-[#EAE6DF] shadow-[0_2px_8px_rgba(15,27,62,0.03)] overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4.5 border-b border-[#EAE6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0F1B3E]">
              Section admins
            </h3>
            <p className="text-xs text-[#6B7897]">
              Manage section admins and their assigned permissions
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#C8952F] hover:bg-[#D4A038] text-[#0A1329] text-xs font-bold transition-colors shadow-xs"
          >
            <IconPlus className="w-3.5 h-3.5 text-[#0A1329]" />
            <span>+ Invite admin</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2A354F]">
            <thead className="bg-[#FAF7F2] text-[#6B7897] font-semibold text-[11px] uppercase tracking-wider border-b border-[#EAE6DF]">
              <tr>
                <th className="py-3.5 px-6">SECTION</th>
                <th className="py-3.5 px-6">ADMIN</th>
                <th className="py-3.5 px-6">CAN DO</th>
                <th className="py-3.5 px-6">STATUS</th>
                <th className="py-3.5 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE9]">
              {admins.map((adm) => (
                <tr key={adm.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="py-4 px-6 font-semibold text-[#0F1B3E]">
                    <span className="capitalize">{adm.sectionLabel}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-[#0F1B3E]">{adm.adminName}</div>
                    <div className="text-[11px] text-[#7C88A8]">{adm.adminEmail}</div>
                  </td>
                  <td className="py-4 px-6 text-[#4A5568] max-w-xs truncate">
                    {adm.canDo}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        adm.status === 'Active'
                          ? 'bg-[#E6F4EA] text-[#137333]'
                          : 'bg-[#EEF0FA] text-[#3B5998]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          adm.status === 'Active' ? 'bg-[#137333]' : 'bg-[#3B5998]'
                        }`}
                      ></span>
                      {adm.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => onNavigateSection(adm.section)}
                      className="p-1.5 text-[#5A6479] hover:text-[#0F1B3E] hover:bg-[#F2EFE9] rounded-md transition-colors"
                      title="View section"
                    >
                      <IconEdit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemoveAdmin(adm.id)}
                      className="p-1.5 text-[#B3261E] hover:bg-[#FCE8E6] rounded-md transition-colors"
                      title="Revoke access"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Admin Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#EAE6DF] animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-serif text-xl font-bold text-[#0F1B3E] mb-1">
              Invite Section Admin
            </h3>
            <p className="text-xs text-[#6B7897] mb-5">
              Send an administrative invitation to collaborate on a specific module.
            </p>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deacon Ermias"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] focus:ring-1 focus:ring-[#C8952F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@abunemedia.org"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] focus:ring-1 focus:ring-[#C8952F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                  Assigned Section
                </label>
                <select
                  value={inviteForm.section}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, section: e.target.value as AdminSection })
                  }
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F] bg-white"
                >
                  <option value="announcements">Announcements</option>
                  <option value="events">Events</option>
                  <option value="reports">Reports</option>
                  <option value="mezmur">Mezmur</option>
                  <option value="teachings">Teachings</option>
                  <option value="gallery">Gallery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F1B3E] mb-1">
                  Custom Permissions Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Can publish hymns and edit lyrics"
                  value={inviteForm.canDo}
                  onChange={(e) => setInviteForm({ ...inviteForm, canDo: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#D5D0C7] focus:outline-none focus:border-[#C8952F]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F2EFE9]">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#D5D0C7] text-xs font-semibold text-[#5A6479] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0F1B3E] hover:bg-[#1A2D66] text-white text-xs font-semibold transition-colors"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
