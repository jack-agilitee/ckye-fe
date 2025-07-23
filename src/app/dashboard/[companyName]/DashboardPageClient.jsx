'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic'
const MarkdownEditor = dynamic(() => import('../../../components/organisms/MarkdownEditor/MarkdownEditor'), { ssr: false })
import styles from './DashboardPageClient.module.scss';

export default function DashboardPageClient({ 
  initialPages, 
  companyName,
  selectedPageId 
}) {
  const [currentPageId, setCurrentPageId] = useState(selectedPageId);
  const currentPage = initialPages.find(p => p.id === currentPageId);

  return (
    <div className={styles['dashboard-content']}>
      <MarkdownEditor
        markdown={currentPage?.content || 'Select a page from the sidebar to start editing...'}
        readOnly={false}
      />
    </div>
  );
}