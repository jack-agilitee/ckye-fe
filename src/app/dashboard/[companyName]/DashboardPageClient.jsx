'use client';

import { useState } from 'react';
import MarkdownEditor from '@/components/organisms/MarkdownEditor/MarkdownEditor';
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
        content={currentPage?.content || ''}
        placeholder="Select a page from the sidebar to start editing..."
        readOnly={false}
      />
    </div>
  );
}