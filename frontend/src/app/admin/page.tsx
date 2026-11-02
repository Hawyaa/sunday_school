'use client';

import React, { useState } from 'react';
import { AdminSidebar, AdminSection } from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { AdminDashboardView } from '@/components/admin/AdminDashboardView';
import { AdminSectionView } from '@/components/admin/AdminSectionView';
import { AdminUsersView } from '@/components/admin/AdminUsersView';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] font-sans text-[#2A354F]">
      {/* Persistent Left Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        currentUser={{
          name: 'Abebe Kebede',
          role:
            activeSection === 'dashboard' || activeSection === 'users'
              ? 'Super Admin'
              : `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Admin`,
          email: 'abebe.k@abunemedia.org',
        }}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Bar */}
        <AdminTopBar
          activeSection={activeSection}
          currentUser={{
            name: 'Abebe Kebede',
            role:
              activeSection === 'dashboard' || activeSection === 'users'
                ? 'Super Admin'
                : `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Admin`,
          }}
        />

        {/* Content Container */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeSection === 'dashboard' && (
            <AdminDashboardView
              onNavigateSection={(sec) => {
                setActiveSection(sec);
              }}
            />
          )}

          {activeSection === 'users' && <AdminUsersView />}

          {activeSection !== 'dashboard' && activeSection !== 'users' && (
            <AdminSectionView section={activeSection} />
          )}
        </main>
      </div>
    </div>
  );
}
