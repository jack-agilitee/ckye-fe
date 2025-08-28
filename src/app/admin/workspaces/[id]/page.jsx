import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import WorkspaceDetailsClient from './WorkspaceDetailsClient';

async function getWorkspace(id) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/workspaces/${id}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch workspace');
  }

  const data = await response.json();
  return data.data;
}

export default async function WorkspaceDetailsPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  let workspace;
  try {
    workspace = await getWorkspace(params.id);
  } catch (error) {
    console.error('Error fetching workspace:', error);
    redirect('/admin/workspaces');
  }

  return <WorkspaceDetailsClient workspace={workspace} />;
}