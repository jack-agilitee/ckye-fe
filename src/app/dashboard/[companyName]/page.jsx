import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import DashboardSidebar from './DashboardSidebar';
import DashboardPageClient from './DashboardPageClient';
import { getPages } from '@/lib/api/pages';

export async function generateMetadata({ params }) {
  const { companyName } = params;
  
  return {
    title: `${companyName} Dashboard | Ckye`,
    description: `Manage ${companyName} pages and documentation in the Ckye dashboard`,
    keywords: ['dashboard', 'markdown', 'pages', companyName, 'Ckye'],
    openGraph: {
      title: `${companyName} Dashboard | Ckye`,
      description: `Manage ${companyName} pages and documentation`,
      type: 'website',
    },
  };
}

export default async function DashboardPage({ params, searchParams }) {
  const { companyName } = params;
  
  // Server-side API call to fetch pages
  let pages = [];
  let error = null;
  
  try {
    const response = await getPages(companyName);
    pages = response.data;
  } catch (err) {
    error = err.message;
  }
  
  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>Error: {error}</p>
      </div>
    );
  }
  
  // Get selected page from URL or default to first page
  const selectedPageId = searchParams?.page || (pages.length > 0 ? pages[0].id : null);
  
  return (
    <TwoColumnPage
      leftContent={
        <DashboardSidebar 
          initialPages={pages} 
          companyName={companyName}
          initialSelectedId={selectedPageId}
        />
      }
      rightContent={
        <DashboardPageClient 
          initialPages={pages} 
          companyName={companyName}
          selectedPageId={selectedPageId}
        />
      }
    />
  );
}