'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import MarkdownEditor from '@/components/organisms/MarkdownEditor/MarkdownEditor';
import { getPages, addPage } from '@/lib/api/pages';

export default function DashboardPage() {
  const params = useParams();
  const companyName = params.companyName;
  
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPages();
  }, [companyName]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getPages(companyName);
      setPages(data);
      
      // Auto-select first page if available
      if (data.length > 0 && !selectedPageId) {
        setSelectedPageId(data[0].id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContextItemClick = (item) => {
    setSelectedPageId(item.id);
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

      // Refresh pages list
      await fetchPages();
      
      // Select the newly created page
      setSelectedPageId(newPage.id);
    } catch (err) {
      alert(`Failed to create page: ${err.message}`);
    }
  };

  const handleAccountClick = () => {
    console.log('Account clicked');
    // TODO: Implement account switching
  };

  const handleNotesClick = () => {
    console.log('Notes clicked');
    // TODO: Implement notes functionality
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <TwoColumnPage
      leftContent={
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
          onNotesClick={handleNotesClick}
        />
      }
      rightContent={
        <MarkdownEditor
          content=""
          placeholder="Select a page from the sidebar to start editing..."
          readOnly={false}
        />
      }
    />
  );
}