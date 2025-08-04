'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import SettingsModal from '@/components/organisms/SettingsModal/SettingsModal';
import { upsertPage } from '@/lib/api/pages';
import { useDashboard } from '@/context/DashboardContext';

export default function DashboardSidebar() {
  const router = useRouter();
  const { pages, selectedPageId, companyName, selectPage, addPage, updatePage } = useDashboard();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isAddingNewPage, setIsAddingNewPage] = useState(false);

  const handleContextItemClick = (item) => {
    selectPage(item.id);
  };

  const handleAddNewClick = () => {
    setIsAddingNewPage(true);
  };

  const handleCreatePage = async (pageName) => {
    if (!pageName || !pageName.trim()) {
      setIsAddingNewPage(false);
      return;
    }

    try {
      const newPage = await upsertPage({
        name: pageName.endsWith('.md') ? pageName : `${pageName}.md`,
        company: companyName,
        content: `# ${pageName}\n\nStart writing your content here...`
      });

      // Update context state with new page
      addPage(newPage);
      
      // Select the newly created page
      selectPage(newPage.id);
      
      // Reset the adding state
      setIsAddingNewPage(false);
      
      // Refresh the page to update server data
      router.refresh();
    } catch (err) {
      alert(`Failed to create page: ${err.message}`);
      setIsAddingNewPage(false);
    }
  };

  const handleCancelCreate = () => {
    setIsAddingNewPage(false);
  };

  const handleAccountClick = () => {
    setShowSettingsModal(true);
  };

  const handleRenameItem = async (pageId, newName) => {
    try {
      // Find the page to rename
      const pageToRename = pages.find(p => p.id === pageId);
      if (!pageToRename) return;

      // Ensure the new name has .md extension
      const formattedName = newName.endsWith('.md') ? newName : `${newName}.md`;

      // Optimistically update the UI
      updatePage(pageId, { name: formattedName });

      // Update the page in the database
      const updatedPage = await upsertPage({
        id: pageId,
        name: formattedName,
        company: companyName,
        content: pageToRename.content
      });

      // Refresh the page to ensure consistency with server data
      router.refresh();
    } catch (err) {
      // Revert the optimistic update on error
      updatePage(pageId, { name: pageToRename.name });
      alert(`Failed to rename page: ${err.message}`);
    }
  };

  return (
    <div style={{ position: 'relative'}}>
      <Sidebar
        contextItems={pages}
        selectedItemId={selectedPageId}
        isAdminMode={false}
        accountName={companyName}
        accountInitial={companyName.charAt(0).toUpperCase()}
        onContextItemClick={handleContextItemClick}
        onAddNewClick={handleAddNewClick}
        onAccountClick={handleAccountClick}
        onNotesClick={handleAddNewClick}
        isAddingNew={isAddingNewPage}
        onCreateNew={handleCreatePage}
        onCancelNew={handleCancelCreate}
        onRenameItem={handleRenameItem}
      />
      {showSettingsModal && (
        <SettingsModal onDismiss={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}