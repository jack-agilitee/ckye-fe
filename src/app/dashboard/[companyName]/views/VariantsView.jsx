'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import VariantsTable from '@/components/templates/VariantsTable/VariantsTable';
import MarkdownEditor from '@/components/organisms/MarkdownEditor/MarkdownEditor';
import TextField from '@/components/atoms/TextField/TextField';
import Button from '@/components/atoms/Button/Button';
import { getVariants, setVariantToMaster, createVariant, updateVariantContent } from '@/lib/api/variants';
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
  const [isDetailsMode, setIsDetailsMode] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [variantSummary, setVariantSummary] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeoutRef = useRef(null);

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
    setIsDetailsMode(true);
  };

  const handleBackToVariants = () => {
    setIsDetailsMode(false);
    setSelectedVariant(null);
    // Clear save timeout when leaving details mode
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
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

  // Auto-save function for details mode
  const saveContent = useCallback(async (newContent) => {
    if (!selectedVariant) return;

    try {
      setIsSaving(true);
      await updateVariantContent(selectedVariant.id, newContent);
      
      // Update the local state
      const updatedVariant = { ...selectedVariant, content: newContent };
      setSelectedVariant(updatedVariant);
      
      // Update in the main variants list
      setVariants(prev => prev.map(v => 
        v.id === selectedVariant.id ? updatedVariant : v
      ));
      setFilteredVariants(prev => prev.map(v => 
        v.id === selectedVariant.id ? updatedVariant : v
      ));
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save variant content:', error);
    } finally {
      setIsSaving(false);
    }
  }, [selectedVariant]);

  // Debounced save handler for details mode
  const handleContentChange = useCallback((newContent) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (2 seconds after user stops typing)
    saveTimeoutRef.current = setTimeout(() => {
      saveContent(newContent);
    }, 2000);
  }, [saveContent]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Combine details and edit modes since they share the same layout
  if (isDetailsMode || isEditMode) {
    const isViewing = isDetailsMode && selectedVariant;
    const isEditing = isEditMode;
    
    return (
      <div className={styles['variants-view__fullscreen']}>
        <div className={styles['variants-view__fullscreen-header']}>
          <button
            onClick={isViewing ? handleBackToVariants : handleCancelEdit}
            className={styles['variants-view__back-button']}
          >
            <img src="/chevron-left.svg" alt="" width={16} height={16} />
            Back to All Variants
          </button>
        </div>
        
        <div className={styles['variants-view__fullscreen-info']}>
          {isViewing ? (
            <>
              <h1 className={styles['variants-view__fullscreen-title']}>{selectedVariant.fileName}</h1>
              <span className={styles['variants-view__fullscreen-version']}>{selectedVariant.variant}</span>
              <div className={styles['variants-view__save-status']}>
                {isSaving && <span>Saving...</span>}
                {!isSaving && lastSaved && (
                  <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                )}
              </div>
            </>
          ) : (
            <TextField
              placeholder="Enter variant summary..."
              value={variantSummary}
              onChange={(e) => setVariantSummary(e.target.value)}
              className={styles['variants-view__summary-field']}
            />
          )}
        </div>
        
        <div className={styles['variants-view__fullscreen-editor']}>
          <MarkdownEditor
            markdown={isViewing ? selectedVariant.content : (editorContent || '# Start typing to create your variant\n\nBegin writing your CLAUDE.md variant content here.\n\n## Tips:\n- Use markdown formatting for better structure\n- Include clear instructions and context\n- Add examples when helpful')}
            onChange={isViewing ? handleContentChange : (isEditing ? setEditorContent : undefined)}
          />
        </div>
        
        <div className={styles['variants-view__fullscreen-actions']}>
          <Button
            variant="secondary"
            icon={null}
            onClick={isViewing ? handleSetToMaster : handleSaveVariant}
            className={styles['variants-view__action-button']}
          >
            {isViewing ? 'Set to Master' : 'Save Variant'}
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