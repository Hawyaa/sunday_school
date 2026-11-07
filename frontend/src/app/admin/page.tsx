'use client';

import React, { Suspense } from 'react';
import { AdminDashboardShell } from '@/components/admin/AdminDashboardShell';

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--navy)' }}>Loading Admin Studio…</div>}>
      <AdminDashboardShell />
    </Suspense>
  );
}
