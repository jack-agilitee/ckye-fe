import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getWorkspace } from '@/lib/api/workspaces';
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import WorkspaceDetailsClient from './WorkspaceDetailsClient';

export default async function WorkspaceDetailsPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Get cookies from the request headers
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  let workspace;
  try {
    const response = await getWorkspace(params.id, cookieHeader);
    workspace = response.data;
  } catch (error) {
    console.error('Error fetching workspace:', error);
    redirect('/admin/workspaces');
  }

  return (
    <TwoColumnPage
      leftContent={<Sidebar isAdminMode={true} />}
      rightContent={<WorkspaceDetailsClient workspace={workspace} />}
    />
  );
}