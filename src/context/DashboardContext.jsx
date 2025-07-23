'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Create the context
const DashboardContext = createContext();

// Custom hook to use the dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

// Provider component
export const DashboardProvider = ({ 
  children, 
  initialPages, 
  companyName,
  initialSelectedId 
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management
  const [pages, setPages] = useState(initialPages);
  
  // Always use URL as source of truth for selected page
  const pageIdFromUrl = searchParams.get('page') || initialSelectedId;
  const selectedPageId = pageIdFromUrl;
  
  // Get current page
  const currentPage = pages.find(p => p.id === selectedPageId);
  
  // Actions
  const selectPage = useCallback((pageId) => {
    router.push(`/dashboard/${companyName}?page=${pageId}`);
  }, [companyName, router]);
  
  const addPage = useCallback((newPage) => {
    setPages(prevPages => [...prevPages, newPage]);
  }, []);
  
  const updatePage = useCallback((pageId, updates) => {
    setPages(prevPages => 
      prevPages.map(page => 
        page.id === pageId 
          ? { ...page, ...updates }
          : page
      )
    );
  }, []);
  
  const deletePage = useCallback((pageId) => {
    setPages(prevPages => prevPages.filter(page => page.id !== pageId));
  }, []);
  
  // Context value
  const value = {
    pages,
    selectedPageId,
    currentPage,
    companyName,
    // Actions
    selectPage,
    addPage,
    updatePage,
    deletePage,
    setPages, // For bulk updates
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};