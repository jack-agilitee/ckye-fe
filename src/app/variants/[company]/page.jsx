'use client';

import { useState } from 'react';
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import VariantsTable from '@/components/templates/VariantsTable/VariantsTable';
import styles from './page.module.scss';

// Hardcoded variants data based on Figma design
const mockVariants = [
  {
    id: '1',
    fileName: 'Claude.md',
    variant: 'Variant 2',
    createdDate: '2025-08-07',
    createdBy: {
      initial: 'C',
      name: 'Claude Code',
      email: 'Agent of: andrew@agilitee.com'
    },
    summary: 'Updated examples to use React function components with hooks instead of class components, following current React best practices and community standards.'
  },
  {
    id: '2',
    fileName: 'Claude.md',
    variant: 'Variant 3',
    createdDate: '2025-08-08',
    createdBy: {
      initial: 'C',
      name: 'Claude Code',
      email: 'Agent of: dave@agilitee.com'
    },
    summary: 'Migrated from Pages Router to App Router examples, showcasing server components and new file-based routing conventions.'
  },
  {
    id: '3',
    fileName: 'Claude.md',
    variant: 'Variant 4',
    createdDate: '2025-08-10',
    createdBy: {
      initial: 'C',
      name: 'Claude Code',
      email: 'Agent of: jack@agilitee.com'
    },
    summary: 'Replaced prop drilling examples with Context API and custom hooks pattern for better state management across components.'
  },
  {
    id: '4',
    fileName: 'Commands.md',
    variant: 'Variant 2',
    createdDate: '2025-08-13',
    createdBy: {
      initial: 'C',
      name: 'Claude Code',
      email: 'Agent of: james@agilitee.com'
    },
    summary: 'Changed data fetching examples from useEffect + fetch to Next.js server actions and React Query for better performance.'
  },
  {
    id: '5',
    fileName: 'Claude.md',
    variant: 'Variant 5',
    createdDate: '2025-08-17',
    createdBy: {
      initial: 'J',
      name: 'Jack Nichols',
      email: 'jack@agilitee.com'
    },
    summary: 'Updated import statements to use absolute imports with path mapping (@/components, @/utils) instead of relative imports for cleaner code organization.'
  }
];

// Sidebar context items - matching Figma design
const contextItems = [
  { id: '1', name: 'Claude.md' },
  { id: '2', name: 'Claude.md' },
  { id: '3', name: 'Claude.md' },
  { id: '4', name: 'Claude.md' }
];

export default function VariantsPage({ params }) {
  const { company } = params;
  const [searchValue, setSearchValue] = useState('');
  const [filteredVariants, setFilteredVariants] = useState(mockVariants);
  const [selectedContextItem, setSelectedContextItem] = useState('suggested-variants');

  const handleSearch = (value) => {
    const filtered = mockVariants.filter(variant => 
      variant.fileName.toLowerCase().includes(value.toLowerCase()) ||
      variant.variant.toLowerCase().includes(value.toLowerCase()) ||
      variant.summary.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredVariants(filtered);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    handleSearch(value);
  };

  const handleAddVariant = () => {
    console.log('Add Variant clicked');
    // TODO: Open modal or navigate to create variant page
  };

  const handleContextItemClick = (item) => {
    console.log('Context item clicked:', item);
    setSelectedContextItem(item.id);
  };


  const sidebarContent = (
    <Sidebar
      contextItems={contextItems}
      selectedItemId={selectedContextItem}
      accountName={company || 'Agilitee'}
      accountInitial={company ? company.charAt(0).toUpperCase() : 'A'}
      onContextItemClick={handleContextItemClick}
      isAdminMode={false}
    />
  );

  const mainContent = (
    <div className={styles['variants-page']}>
      <SearchHeader
        title="Suggested Document Variants"
        searchPlaceholder="Search Suggestions by Name"
        onSearch={handleSearch}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        buttonText="Add Variant"
        onButtonClick={handleAddVariant}
        className={styles['variants-page__header']}
      />
      
      <VariantsTable 
        variants={filteredVariants}
        company={company}
        className={styles['variants-page__table']}
      />
    </div>
  );

  return (
    <TwoColumnPage
      leftContent={sidebarContent}
      rightContent={mainContent}
      className={styles['variants-page__wrapper']}
    />
  );
}