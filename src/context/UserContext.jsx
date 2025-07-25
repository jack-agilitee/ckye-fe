'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getUserByEmail } from '@/lib/api/users';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // Reset state when session changes
      setIsLoading(true);
      setError(null);
      
      if (status === 'loading') {
        return; // Wait for session to load
      }
      
      if (!session?.user?.email) {
        setUserData(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await getUserByEmail(session.user.email);
        setUserData(response.data);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError(err.message);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, status]);

  const value = {
    user: userData,
    workspaces: userData?.workspaces || [],
    isLoading,
    error,
    refetch: async () => {
      if (session?.user?.email) {
        setIsLoading(true);
        try {
          const response = await getUserByEmail(session.user.email);
          setUserData(response.data);
          setError(null);
        } catch (err) {
          console.error('Failed to refetch user data:', err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};