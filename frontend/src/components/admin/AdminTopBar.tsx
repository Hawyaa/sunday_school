import React from 'react';
import { AdminSection } from './AdminSidebar';
import { IconPlus } from './AdminIcons';

interface AdminTopBarProps {
  activeSection: AdminSection;
  onAddNew?: () => void;
  currentUser?: {
    name: string;
    role: string;
  };
}

export function AdminTopBar({
  activeSection,
  onAddNew,
  currentUser = { name: 'Abebe Kebede', role: 'Super Admin' },
}: AdminTopBarProps) {
  const titles: Record<AdminSection, { title: string; subtitle: string; roleLabel: string }> = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Welcome back, Abebe. Here is what is happening today.',
      roleLabel: 'Super Admin',
    },
    announcements: {
      title: 'Announcements',
      subtitle: 'Manage news, parish notices, and official announcements.',
      roleLabel: 'Announcements Admin',
    },
    events: {
      title: 'Events',
      subtitle: 'Schedule upcoming liturgical feasts, conferences, and Sunday school events.',
      roleLabel: 'Events Admin',
    },
    reports: {
      title: 'Reports',
      subtitle: 'Publish annual, quarterly, and financial performance reports.',
      roleLabel: 'Reports Admin',
    },
    mezmur: {
      title: 'Mezmur',
      subtitle: 'Manage hymn recordings, lyrics, and metadata.',
      roleLabel: 'Mezmur Admin',
    },
    teachings: {
      title: 'Teachings',
      subtitle: 'Manage spiritual lectures, articles, audio, and PDF documents.',
      roleLabel: 'Teachings Admin',
    },
    gallery: {
      title: 'Gallery',
      subtitle: 'Organize photo albums, feast celebrations, and community media.',
      roleLabel: 'Gallery Admin',
    },
    users: {
      title: 'Users & Admins',
      subtitle: 'Manage system administrators, section permissions, and staff accounts.',
      roleLabel: 'Super Admin',
    },
  };

  const current = titles[activeSection] || titles.dashboard;

  return (
    <header className="bg-white border-b border-[#EAE6DF] px-8 py-5 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#7C88A8] mb-1">
          <span>Admin</span>
          <span>/</span>
          <span className="text-[#0F1B3E] font-semibold capitalize">
            {activeSection === 'users' ? 'Users & Admins' : activeSection}
          </span>
        </div>
        <h1 className="font-serif text-2xl font-bold text-[#0F1B3E] tracking-tight">
          {current.title}
        </h1>
        <p className="text-xs text-[#6B7897] mt-0.5">
          {current.subtitle}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Dynamic Role Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF4E6] text-[#A27B2C] border border-[#E9D9B2]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8952F]"></span>
          <span>{current.roleLabel}</span>
        </div>

        {/* Add New Button for Section Views */}
        {activeSection !== 'dashboard' && activeSection !== 'users' && onAddNew && (
          <button
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F1B3E] hover:bg-[#1A2D66] text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <IconPlus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        )}

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#0F1B3E] text-white text-xs font-bold flex items-center justify-center ring-2 ring-[#C8952F]/40 shadow-xs">
          {currentUser.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </div>
      </div>
    </header>
  );
}
