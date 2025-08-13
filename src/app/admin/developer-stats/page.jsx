import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import DeveloperStatsPageClient from './DeveloperStatsPageClient';
import { getWorkspaces } from '@/lib/api/workspaces';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Developer Statistics | Ckye Admin',
  description: 'View developer statistics and PR metrics by workspace',
};

export default async function DeveloperStatsPage() {
  // Get cookies from the request headers
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();
  
  // Server-side API call to fetch workspaces
  const workspacesResponse = await getWorkspaces(cookieHeader);
  const workspaces = workspacesResponse.data;
  
  return (
    <TwoColumnPage
      leftContent={
        <Sidebar 
          isAdminMode={true}
        />
      }
      rightContent={
        <DeveloperStatsPageClient workspaces={workspaces} />
      }
    />
  );
}