'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { upsertPage } from '@/lib/api/pages';

const MarkdownEditor = dynamic(
  () => import('../../../components/organisms/MarkdownEditor/MarkdownEditor'), 
  { 
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
)
import styles from './DashboardPageClient.module.scss';

export default function DashboardPageClient({ 
  initialPages, 
  companyName,
  selectedPageId 
}) {
  const currentPage = initialPages.find(p => p.id === selectedPageId);
  const [content, setContent] = useState(currentPage?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeoutRef = useRef(null);
  
  // Update content when page changes
  useEffect(() => {
    if (currentPage) {
      setContent(currentPage.content);
    }
  }, [selectedPageId, currentPage]);
  
  // Auto-save function
  const saveContent = useCallback(async (newContent) => {
    if (!currentPage) return;
    
    try {
      setIsSaving(true);
      await upsertPage({
        id: currentPage.id,
        name: currentPage.name,
        company: companyName,
        content: newContent
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save content:', error);
      // TODO: Show error notification to user
    } finally {
      setIsSaving(false);
    }
  }, [currentPage, companyName]);
  
  // Debounced save handler
  const handleContentChange = useCallback((newContent) => {
    setContent(newContent);
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for auto-save (2 seconds after user stops typing)
    saveTimeoutRef.current = setTimeout(() => {
      saveContent(newContent);
    }, 2000);
  }, [saveContent]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles['dashboard-content']}>
      <div className={styles['dashboard-content__header']}>
        {isSaving && <span className={styles['dashboard-content__status']}>Saving...</span>}
        {!isSaving && lastSaved && (
          <span className={styles['dashboard-content__status']}>
            Last saved: {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>
      <MarkdownEditor
        markdown={content || 'Select a page from the sidebar to start editing...'}
        onChange={handleContentChange}
      />
    </div>
  );
}