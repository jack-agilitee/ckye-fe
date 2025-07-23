'use client';

import { DashboardProvider } from '@/context/DashboardContext';
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import DashboardSidebar from './DashboardSidebar';
import DashboardPageClient from './DashboardPageClient';

export default function DashboardClient({ initialPages, companyName, initialSelectedId }) {
  return (
    <DashboardProvider 
      initialPages={initialPages} 
      companyName={companyName}
      initialSelectedId={initialSelectedId}
    >
      <TwoColumnPage
        leftContent={<DashboardSidebar />}
        rightContent={<DashboardPageClient />}
      />
    </DashboardProvider>
  );
}