import DashboardClient from './DashboardClient';
import { getPages } from '@/lib/api/pages';
import { cookies } from 'next/headers';

export async function generateMetadata({ params }) {
  const { companyName } = params;
  
  // Force uppercase for the display name
  const displayName = companyName.toUpperCase();
  
  return {
    title: `${displayName} Dashboard | Ckye`,
    description: `Manage ${displayName} pages and documentation in the Ckye dashboard`,
    keywords: ['dashboard', 'markdown', 'pages', displayName, 'Ckye'],
    openGraph: {
      title: `${displayName} Dashboard | Ckye`,
      description: `Manage ${displayName} pages and documentation`,
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
    // Get cookies from the request headers
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();
    
    const response = await getPages(companyName, cookieHeader);
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
    <DashboardClient 
      initialPages={pages} 
      companyName={companyName}
      initialSelectedId={selectedPageId}
    />
  );
}