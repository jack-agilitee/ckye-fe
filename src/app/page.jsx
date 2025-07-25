'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useUser } from '@/context/UserContext';

export default function Home() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { workspaces, isLoading: userLoading, error } = useUser();

  useEffect(() => {
    // Wait for session to load
    if (sessionStatus === 'loading' || userLoading) {
      return;
    }

    // If not authenticated, redirect to login
    if (sessionStatus === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // If authenticated and workspaces are loaded
    if (session && workspaces) {
      if (workspaces.length > 0) {
        // Redirect to the first workspace
        const firstWorkspace = workspaces[0];
        if (firstWorkspace.shortName) {
          router.push(`/dashboard/${firstWorkspace.shortName}`);
        }
      } else {
        // User has no workspaces - could redirect to a setup page
        // For now, we'll show a message
        console.warn('User has no workspaces');
      }
    }
  }, [session, sessionStatus, workspaces, userLoading, router]);

  // Handle different states
  if (sessionStatus === 'loading' || userLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show error if user data failed to load
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Error loading user data. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Show message if user has no workspaces
  if (session && workspaces && workspaces.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Welcome to Ckye</h1>
          <p>You don't have any workspaces yet.</p>
          <p>Please contact your administrator to be added to a workspace.</p>
        </div>
      </div>
    );
  }

  // Default loading state (should not reach here in normal flow)
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#ffffff'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}