import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import UsersPageClient from './UsersPageClient';
import { getUsers } from '@/lib/api/users';
import { getWorkspaces } from '@/lib/api/workspaces';

export const metadata = {
  title: 'Users | Ckye Admin',
  description: 'Manage system users and workspace assignments',
};

export default async function UsersPage() {
  // Server-side API calls to fetch users and workspaces
  const [usersResponse, workspacesResponse] = await Promise.all([
    getUsers(),
    getWorkspaces()
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