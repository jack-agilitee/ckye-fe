'use client';

import { useState, useEffect } from 'react';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import VariantsTable from '@/components/templates/VariantsTable/VariantsTable';
import MarkdownEditor from '@/components/organisms/MarkdownEditor/MarkdownEditor';
import TextField from '@/components/atoms/TextField/TextField';
import Button from '@/components/atoms/Button/Button';
import { getVariants, setVariantToMaster, createVariant } from '@/lib/api/variants';
import styles from './VariantsView.module.scss';

// Transform API data to match component expectations
const transformVariantData = (apiVariant, index) => {
  const variantNumber = index + 1;
  
  let createdBy;
  if (apiVariant.user) {
    createdBy = {
      initial: apiVariant.user.name ? apiVariant.user.name.charAt(0).toUpperCase() : 'U',
      name: apiVariant.user.name || 'Unknown User',
      email: apiVariant.user.email || 'No email'
    };
  } else {
    createdBy = {
      initial: 'C',
      name: 'Claude Code',
      email: 'Agent of: system@agilitee.com'
    };
  }
  
  return {
    id: apiVariant.id,
    fileName: 'Claude.md',
    variant: `Variant ${variantNumber}`,
    createdDate: new Date(apiVariant.createdAt).toISOString().split('T')[0],
    createdBy: createdBy,
    summary: apiVariant.summary || 'No summary available',
    content: apiVariant.content || ''
  };
};

export default function VariantsView({ companyName }) {
  const [searchValue, setSearchValue] = useState('');
  const [variants, setVariants] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [variantSummary, setVariantSummary] = useState('');

  // Fetch variants on mount
  useEffect(() => {
    const fetchVariants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const workspaceName = companyName?.toUpperCase() || 'AE';
        const response = await getVariants({ workspaceName });
        
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
  }, [companyName]);

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
    setIsEditMode(true);
    setEditorContent('# New Variant\n\nStart writing your variant content here...\n\n## Instructions\n\n## Context\n\n## Examples');
    setVariantSummary('');
  };
  
  const handleSaveVariant = async () => {
    try {
      const workspaceName = companyName?.toUpperCase() || 'AE';
      
      const variantData = {
        content: editorContent,
        summary: variantSummary || 'Untitled Variant',
        workspaceName: workspaceName
      };
      
      await createVariant(variantData);
      
      // Refresh the variants list
      const response = await getVariants({ workspaceName });
      const transformedVariants = response.data.map((variant, index) => 
        transformVariantData(variant, index)
      );
      setVariants(transformedVariants);
      setFilteredVariants(transformedVariants);
      
      setIsEditMode(false);
      setEditorContent('');
      setVariantSummary('');
    } catch (error) {
      console.error('Error saving variant:', error);
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditorContent('');
    setVariantSummary('');
  };

  const handleRowClick = (variant) => {
    setSelectedVariant(variant);
    setIsViewMode(true);
  };

  const handleBackToVariants = () => {
    setIsViewMode(false);
    setSelectedVariant(null);
  };

  const handleSetToMaster = async () => {
    if (!selectedVariant) return;
    
    try {
      const companyNameUpper = companyName?.toUpperCase() || 'AE';
      const originalVariant = variants.find(v => v.id === selectedVariant.id);
      
      if (!originalVariant || !originalVariant.id) {
        console.error('Could not find variant ID');
        return;
      }
      
      const pageName = selectedVariant.fileName || 'Claude.md';
      await setVariantToMaster(originalVariant.id, companyNameUpper, pageName);
      
      // Refresh variants list
      const response = await getVariants({ workspaceName: companyNameUpper });
      const transformedVariants = response.data.map((variant, index) => 
        transformVariantData(variant, index)
      );
      setVariants(transformedVariants);
      setFilteredVariants(transformedVariants);
      
      handleBackToVariants();
    } catch (error) {
      console.error('Error setting variant to master:', error);
    }
  };

  if (isViewMode && selectedVariant) {
    return (
      <div className={styles['variants-view__fullscreen']}>
        <div className={styles['variants-view__fullscreen-header']}>
          <button
            onClick={handleBackToVariants}
            className={styles['variants-view__back-button']}
          >
            <img src="/chevron-left.svg" alt="" width={16} height={16} />
            Back to All Variants
          </button>
        </div>
        
        <div className={styles['variants-view__fullscreen-info']}>
          <h1 className={styles['variants-view__fullscreen-title']}>{selectedVariant.fileName}</h1>
          <span className={styles['variants-view__fullscreen-version']}>{selectedVariant.variant}</span>
        </div>
        
        <div className={styles['variants-view__fullscreen-editor']}>
          <MarkdownEditor
            markdown={selectedVariant.content}
            readOnly={true}
          />
        </div>
        
        <div className={styles['variants-view__fullscreen-actions']}>
          <Button
            variant="secondary"
            icon={null}
            onClick={handleSetToMaster}
            className={styles['variants-view__action-button']}
          >
            Set to Master
          </Button>
        </div>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className={styles['variants-view__fullscreen']}>
        <div className={styles['variants-view__fullscreen-header']}>
          <button
            onClick={handleCancelEdit}
            className={styles['variants-view__back-button']}
          >
            <img src="/chevron-left.svg" alt="" width={16} height={16} />
            Back to All Variants
          </button>
        </div>
        
        <div className={styles['variants-view__fullscreen-info']}>
          <TextField
            placeholder="Enter variant summary..."
            value={variantSummary}
            onChange={(e) => setVariantSummary(e.target.value)}
            className={styles['variants-view__summary-field']}
          />
        </div>
        
        <div className={styles['variants-view__fullscreen-editor']}>
          <MarkdownEditor
            markdown={editorContent || '# Start typing to create your variant\n\nBegin writing your CLAUDE.md variant content here.\n\n## Tips:\n- Use markdown formatting for better structure\n- Include clear instructions and context\n- Add examples when helpful'}
            onChange={setEditorContent}
          />
        </div>
        
        <div className={styles['variants-view__fullscreen-actions']}>
          <Button
            variant="secondary"
            icon={null}
            onClick={handleSaveVariant}
            className={styles['variants-view__action-button']}
          >
            Save Variant
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['variants-view']}>
      <SearchHeader
        title="Variants"
        searchPlaceholder="Search Variants by Name"
        onSearch={handleSearch}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        buttonText="Add Variant"
        onButtonClick={handleAddVariant}
        className={styles['variants-view__header']}
      />
      
      {loading ? (
        <div className={styles['variants-view__loading']}>
          Loading variants...
        </div>
      ) : error ? (
        <div className={styles['variants-view__error']}>
          Error: {error}
        </div>
      ) : (
        <VariantsTable 
          variants={filteredVariants}
          onRowClick={handleRowClick}
          className={styles['variants-view__table']}
        />
      )}
    </div>
  );
}