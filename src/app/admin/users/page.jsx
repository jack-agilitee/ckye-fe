import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import UsersPageClient from './UsersPageClient';
import { getUsers } from '@/lib/api/users';

export const metadata = {
  title: 'Users | Ckye Admin',
  description: 'Manage system users and workspace assignments',
};

export default async function UsersPage() {
  // Server-side API call to fetch users
  const { data: users } = await getUsers();
  
  return (
    <TwoColumnPage
      leftContent={
        <Sidebar 
          isAdminMode={true}
        />
      }
      rightContent={
        <UsersPageClient initialUsers={users} />
      }
    />
  );
}