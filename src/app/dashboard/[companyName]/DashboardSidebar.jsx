'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import { addPage } from '@/lib/api/pages';

export default function DashboardSidebar({ 
  initialPages, 
  companyName,
  initialSelectedId 
}) {
  const router = useRouter();
  const [pages, setPages] = useState(initialPages);
  const [selectedPageId, setSelectedPageId] = useState(initialSelectedId);

  const handleContextItemClick = (item) => {
    setSelectedPageId(item.id);
    // Update URL with selected page
    router.push(`/dashboard/${companyName}?page=${item.id}`);
  };

  const handleAddNewClick = async () => {
    try {
      const newPageName = prompt('Enter page name:');
      if (!newPageName) return;

      const newPage = await addPage({
        name: newPageName.endsWith('.md') ? newPageName : `${newPageName}.md`,
        company: companyName,
        content: `# ${newPageName}\n\nStart writing your content here...`
      });

      // Update local state with new page
      setPages([...pages, newPage]);
      
      // Select the newly created page
      setSelectedPageId(newPage.id);
      
      // Refresh the page to update server data
      router.refresh();
    } catch (err) {
      alert(`Failed to create page: ${err.message}`);
    }
  };

  const handleAccountClick = () => {
    console.log('Account clicked');
    // TODO: Implement account switching
  };

  return (
    <Sidebar
      contextItems={pages}
      selectedItemId={selectedPageId}
      isAdmin={false}
      isAdminMode={false}
      accountName={companyName}
      accountInitial={companyName.charAt(0).toUpperCase()}
      onContextItemClick={handleContextItemClick}
      onAddNewClick={handleAddNewClick}
      onAccountClick={handleAccountClick}
      onNotesClick={handleAddNewClick}
    />
  );
}