'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { upsertPage } from '@/lib/api/pages';
import { useDashboard } from '@/context/DashboardContext';

const MarkdownEditor = dynamic(
  () => import('../../../components/organisms/MarkdownEditor/MarkdownEditor'),
  {
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
)
import styles from './DashboardPageClient.module.scss';

export default function DashboardPageClient() {
  const { currentPage, companyName, updatePage } = useDashboard();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeoutRef = useRef(null);

  // Update content when page changes
  useEffect(() => {
    // Clear any pending save when switching pages
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (currentPage) {
      setLastSaved(null); // Reset last saved time for new page
    }
  }, [currentPage]);

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

      // Update the page in context
      updatePage(currentPage.id, { content: newContent });

      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save content:', error);
      // TODO: Show error notification to user
    } finally {
      setIsSaving(false);
    }
  }, [currentPage, companyName, updatePage]);

  // Debounced save handler
  const handleContentChange = useCallback((newContent) => {
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
        <h2 className={styles['dashboard-content__title']}>
          {currentPage ? currentPage.name : 'No page selected'}
        </h2>
        <div className={styles['dashboard-content__status-wrapper']}>
          {isSaving && <span className={styles['dashboard-content__status']}>Saving...</span>}
          {!isSaving && lastSaved && (
            <span className={styles['dashboard-content__status']}>
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      <div key={currentPage?.id}>
        <MarkdownEditor
          markdown={currentPage?.content || 'Select a page from the sidebar to start editing...'}
          onChange={handleContentChange}
        />
      </div>
    </div>
  );
}