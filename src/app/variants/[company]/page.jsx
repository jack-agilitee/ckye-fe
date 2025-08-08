'use client';

import { useState, useEffect } from 'react';
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import VariantsTable from '@/components/templates/VariantsTable/VariantsTable';
import VariantsModal from '@/components/organisms/VariantsModal/VariantsModal';
import { getVariants } from '@/lib/api/variants';
import styles from './page.module.scss';

// Transform API data to match component expectations
const transformVariantData = (apiVariant, index) => {
  // Extract variant number from summary or use index
  const variantNumber = index + 1; // Start from Variant 2
  
  return {
    id: apiVariant.id,
    fileName: 'Claude.md', // Default filename, could be extracted from content
    variant: `Variant ${variantNumber}`,
    createdDate: new Date(apiVariant.createdAt).toISOString().split('T')[0],
    createdBy: {
      initial: 'C',
      name: 'Claude Code',
      email: 'Agent of: system@agilitee.com'
    },
    summary: apiVariant.summary || 'No summary available',
    content: apiVariant.content || ''
  };
};

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
  const [variants, setVariants] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [selectedContextItem, setSelectedContextItem] = useState('suggested-variants');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch variants from API on component mount
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all variants (you can filter by workspaceId if needed)
        const response = await getVariants({ 
          limit: 50,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        
        // Transform API data to match component structure
        const transformedVariants = response.data.map((variant, index) => 
          transformVariantData(variant, index)
        );
        
        setVariants(transformedVariants);
        setFilteredVariants(transformedVariants);
      } catch (err) {
        console.error('Error fetching variants:', err);
        setError(err.message || 'Failed to fetch variants');
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, []);

  const handleSearch = (value) => {
    const filtered = variants.filter(variant => 
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

  const handleRowClick = (variant) => {
    setSelectedVariant(variant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVariant(null);
  };

  const handleSetToMaster = () => {
    console.log('Setting variant to master:', selectedVariant);
    // TODO: Implement API call to set variant as master
    handleCloseModal();
  };

  const handleCreateExperiment = () => {
    console.log('Creating experiment from variant:', selectedVariant);
    // TODO: Navigate to create experiment page or open experiment modal
    handleCloseModal();
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
      
      {loading ? (
        <div className={styles['variants-page__loading']}>
          Loading variants...
        </div>
      ) : error ? (
        <div className={styles['variants-page__error']}>
          Error: {error}
        </div>
      ) : (
        <VariantsTable 
          variants={filteredVariants}
          onRowClick={handleRowClick}
          className={styles['variants-page__table']}
        />
      )}
    </div>
  );

  return (
    <>
      <TwoColumnPage
        leftContent={sidebarContent}
        rightContent={mainContent}
        className={styles['variants-page__wrapper']}
      />
      
      <VariantsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedVariant?.fileName || ''}
        version={selectedVariant?.variant || ''}
        codeContent={selectedVariant?.content || ''}
        onSetToMaster={handleSetToMaster}
        onCreateExperiment={handleCreateExperiment}
      />
    </>
  );
}