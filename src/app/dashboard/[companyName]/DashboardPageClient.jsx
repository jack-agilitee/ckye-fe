'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic'
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
  const [content, setContent] = useState('');
  
  const currentPage = initialPages.find(p => p.id === selectedPageId);
  
  const handleContentChange = (newContent) => {
    setContent(newContent);
    // TODO: Implement auto-save or save button functionality
    console.log('Content changed:', newContent);
  };

  return (
    <div className={styles['dashboard-content']}>
      <MarkdownEditor
        markdown={currentPage?.content || 'Select a page from the sidebar to start editing...'}
        onChange={handleContentChange}
      />
    </div>
  );
}