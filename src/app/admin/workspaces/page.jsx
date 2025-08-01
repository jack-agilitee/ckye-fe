import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import WorkspacesPageClient from './WorkspacesPageClient';
import { getWorkspaces } from '@/lib/api/workspaces';
import { getUsers } from '@/lib/api/users';
import { cookies } from 'next/headers';

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Workspaces | Ckye Admin',
  description: 'Manage workspaces and users in the Ckye platform',
};

export default async function WorkspacesPage() {
  // Get cookies from the request headers
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();
  
  // Server-side API calls to fetch workspaces and users
  const [workspacesResponse, usersResponse] = await Promise.all([
    getWorkspaces(cookieHeader),
    getUsers(cookieHeader)
  ]);
  
  const workspaces = workspacesResponse.data;
  const users = usersResponse.data;
  
  return (
    <TwoColumnPage
      leftContent={<Sidebar isAdminMode={true} />}
      rightContent={
        <WorkspacesPageClient 
          initialWorkspaces={workspaces} 
          initialUsers={users} 
        />
      }
    />
  );
}