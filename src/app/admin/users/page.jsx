import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import UsersPageClient from './UsersPageClient';
import { getUsers } from '@/lib/api/users';
import { getWorkspaces } from '@/lib/api/workspaces';
import { cookies } from 'next/headers';

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Users | Ckye Admin',
  description: 'Manage system users and workspace assignments',
};

export default async function UsersPage() {
  // Get cookies from the request headers
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();
  
  // Server-side API calls to fetch users and workspaces
  const [usersResponse, workspacesResponse] = await Promise.all([
    getUsers(cookieHeader),
    getWorkspaces(cookieHeader)
  ]);
  
  const users = usersResponse.data;
  const workspaces = workspacesResponse.data;
  
  return (
    <TwoColumnPage
      leftContent={
        <Sidebar 
          isAdminMode={true}
        />
      }
      rightContent={
        <UsersPageClient initialUsers={users} workspaces={workspaces} />
      }
    />
  );
}