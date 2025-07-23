'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import SettingsModal from '@/components/organisms/SettingsModal/SettingsModal';
import { upsertPage } from '@/lib/api/pages';
import { useDashboard } from '@/context/DashboardContext';

export default function DashboardSidebar() {
  const router = useRouter();
  const { pages, selectedPageId, companyName, selectPage, addPage } = useDashboard();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleContextItemClick = (item) => {
    selectPage(item.id);
  };

  const handleAddNewClick = async () => {
    try {
      const newPageName = prompt('Enter page name:');
      if (!newPageName) return;

      const newPage = await upsertPage({
        name: newPageName.endsWith('.md') ? newPageName : `${newPageName}.md`,
        company: companyName,
        content: `# ${newPageName}\n\nStart writing your content here...`
      });

      // Update context state with new page
      addPage(newPage);
      
      // Select the newly created page
      selectPage(newPage.id);
      
      // Refresh the page to update server data
      router.refresh();
    } catch (err) {
      alert(`Failed to create page: ${err.message}`);
    }
  };

  const handleAccountClick = () => {
    setShowSettingsModal(true);
  };

  return (
    <div style={{ position: 'relative'}}>
      <Sidebar
        contextItems={pages}
        selectedItemId={selectedPageId}
        isAdmin={true}
        isAdminMode={false}
        accountName={companyName}
        accountInitial={companyName.charAt(0).toUpperCase()}
        onContextItemClick={handleContextItemClick}
        onAddNewClick={handleAddNewClick}
        onAccountClick={handleAccountClick}
        onNotesClick={handleAddNewClick}
      />
      {showSettingsModal && (
        <SettingsModal
          workspaces={[
            { id: '1', name: companyName, memberCount: 1 }
          ]}
          currentWorkspaceId="1"
          userEmail="user@example.com"
          onDismiss={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}