'use client';

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { AdminDashboardShell } from '@/components/admin/AdminDashboardShell';

function PageEditorWrapper() {
  const params = useParams();
  const slug = (params?.slug as string) || 'home';

  return <AdminDashboardShell pageSlug={slug} />;
}

export default function AdminPageEditorRoute() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: 'var(--navy)' }}>Loading Page Editor…</div>}>
      <PageEditorWrapper />
    </Suspense>
  );
}
