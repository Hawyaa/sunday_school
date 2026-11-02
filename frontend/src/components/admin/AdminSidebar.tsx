import React from 'react';
import Link from 'next/link';
import {
  IconDashboard,
  IconAnnouncement,
  IconEvents,
  IconReports,
  IconMezmur,
  IconTeachings,
  IconGallery,
  IconUsers,
  IconArrowLeft,
  IconMoreVertical,
} from './AdminIcons';

export type AdminSection =
  | 'dashboard'
  | 'announcements'
  | 'events'
  | 'reports'
  | 'mezmur'
  | 'teachings'
  | 'gallery'
  | 'users';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  currentUser?: {
    name: string;
    role: string;
    email: string;
  };
}

export function AdminSidebar({
  activeSection,
  onSelectSection,
  currentUser = {
    name: 'Abebe Kebede',
    role: 'Super Admin',
    email: 'abebe.k@abunemedia.org',
  },
}: AdminSidebarProps) {
  const contentNavItems: { id: AdminSection; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard className="w-[18px] h-[18px]" /> },
    { id: 'announcements', label: 'Announcements', icon: <IconAnnouncement className="w-[18px] h-[18px]" />, count: 3 },
    { id: 'events', label: 'Events', icon: <IconEvents className="w-[18px] h-[18px]" />, count: 5 },
    { id: 'reports', label: 'Reports', icon: <IconReports className="w-[18px] h-[18px]" />, count: 12 },
    { id: 'mezmur', label: 'Mezmur', icon: <IconMezmur className="w-[18px] h-[18px]" />, count: 48 },
    { id: 'teachings', label: 'Teachings', icon: <IconTeachings className="w-[18px] h-[18px]" />, count: 26 },
    { id: 'gallery', label: 'Gallery', icon: <IconGallery className="w-[18px] h-[18px]" />, count: 120 },
  ];

  const systemNavItems: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
    { id: 'users', label: 'Users & Admins', icon: <IconUsers className="w-[18px] h-[18px]" /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0A1329] text-[#9AA1B5] min-h-screen flex flex-col justify-between border-r border-[#162344]">
      {/* Top Header & Navigation */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-5 pb-6 border-b border-[#162344]/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-[#C8952F] bg-[#111C38] flex items-center justify-center shadow-md">
            <span className="font-serif font-bold text-[#C8952F] text-base leading-none">
              አሚ
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-[#FFFFFF] text-[17px] tracking-tight leading-tight">
              አቡነ ሚዲያ
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-[#C8952F] uppercase mt-0.5">
              ADMIN PANEL
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="py-4 px-3 space-y-6">
          {/* CONTENT group */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-[#6B7897] uppercase">
              CONTENT
            </div>
            <nav className="space-y-1">
              {contentNavItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#C8952F] text-[#0A1329] font-semibold shadow-sm'
                        : 'text-[#9AA1B5] hover:bg-[#14203D] hover:text-[#FFFFFF]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-[#0A1329]' : 'text-[#6B7897]'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && !isActive && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#14203D] text-[#818DA9]">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* SYSTEM group */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-[#6B7897] uppercase">
              SYSTEM
            </div>
            <nav className="space-y-1">
              {systemNavItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSection(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#C8952F] text-[#0A1329] font-semibold shadow-sm'
                        : 'text-[#9AA1B5] hover:bg-[#14203D] hover:text-[#FFFFFF]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-[#0A1329]' : 'text-[#6B7897]'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Profile and Return */}
      <div className="p-3 border-t border-[#162344] flex flex-col gap-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#7C88A8] hover:text-[#FFFFFF] hover:bg-[#14203D] rounded-lg transition-colors"
        >
          <IconArrowLeft className="w-4 h-4" />
          <span>Back to public website</span>
        </Link>

        {/* User Card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111C38] border border-[#1C2C55]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#C8952F] text-[#0A1329] font-bold text-xs flex items-center justify-center flex-shrink-0">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-[#FFFFFF] truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#C8952F] font-medium truncate">
                {currentUser.role}
              </span>
            </div>
          </div>
          <button
            title="Account options"
            className="text-[#6B7897] hover:text-[#FFFFFF] p-1 rounded-md transition-colors"
          >
            <IconMoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
