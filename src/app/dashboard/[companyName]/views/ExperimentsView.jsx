'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import ExperimentsTable from '@/components/templates/ExperimentsTable/ExperimentsTable';
import ExperimentsModal from '@/components/organisms/ExperimentsModal/ExperimentsModal';
import CreateExperimentModal from '@/components/organisms/CreateExperimentModal/CreateExperimentModal';
import FilterModal from '@/components/organisms/FilterModal/FilterModal';
import { getExperimentsByWorkspace, createExperiment, deactivateExperiment } from '@/lib/api/experiments';
import { getVariants } from '@/lib/api/variants';
import styles from './ExperimentsView.module.scss';

// Transform API data to match component expectations
const transformExperimentData = (apiExperiment) => {
  let comparison;
  
  if (apiExperiment.pageName && apiExperiment.variantName) {
    comparison = `${apiExperiment.pageName} vs. ${apiExperiment.variantName}`;
  } else {
    comparison = apiExperiment.description || 'No comparison available';
  }
  
  let createdBy;
  if (apiExperiment.createdByUser) {
    const user = apiExperiment.createdByUser;
    createdBy = {
      initial: user.avatar || user.name?.charAt(0)?.toUpperCase() || 'U',
      name: user.name || 'Unknown User',
      email: user.email || 'unknown@agilitee.com'
    };
  } else {
    createdBy = {
      initial: 'S',
      name: 'System',
      email: 'system@agilitee.com'
    };
  }
  
  return {
    id: apiExperiment.id,
    name: apiExperiment.name,
    comparison: comparison,
    status: apiExperiment.status === 'active' ? 'Active' : 
            apiExperiment.status === 'completed' ? 'Closed' : 'Inactive',
    createdDate: new Date(apiExperiment.createdAt).toISOString().split('T')[0],
    createdBy: createdBy,
    pageName: apiExperiment.pageName,
    variantName: apiExperiment.variantName,
    pageStats: apiExperiment.pageStats,
    variantStats: apiExperiment.variantStats
  };
};

export default function ExperimentsView({ companyName, pages }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [experiments, setExperiments] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });
  const filterButtonRef = useRef(null);

  // Define filter configuration
  const filterConfig = {
    variantName: {
      label: 'Variant Summary',
      type: 'text',
      placeholder: 'Contains...'
    }
  };

  // Fetch experiments and variants with filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const workspaceName = companyName?.toUpperCase() || 'AE';
        
        // Build params with filters
        const params = {
          search: searchQuery,
          variantName: filterValues.variantName || ''
        };
        
        // Fetch experiments and variants in parallel
        const [experimentsResponse, variantsResponse] = await Promise.all([
          getExperimentsByWorkspace(workspaceName, params),
          getVariants({ workspaceName })
        ]);
        
        const transformedExperiments = experimentsResponse.data.map(transformExperimentData);
        setExperiments(transformedExperiments);
        setVariants(variantsResponse.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyName, searchQuery, filterValues]);

  // Experiments are already filtered by the API, so we just use them directly
  const filteredExperiments = experiments;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = () => {
    if (filterButtonRef.current) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      
      // Calculate position with viewport boundary checks
      const modalWidth = 350; // max-width from CSS
      const viewportWidth = window.innerWidth;
      
      let left = rect.left;
      // If modal would go off right edge, align it to the right of the button
      if (left + modalWidth > viewportWidth) {
        left = rect.right - modalWidth;
      }
      
      setFilterPosition({
        top: rect.bottom + 8,
        left: Math.max(10, left) // Ensure at least 10px from left edge
      });
    }
    setShowFilterModal(!showFilterModal);
  };

  const handleFilterChange = (newValues) => {
    setFilterValues(newValues);
  };

  const handleFilterClose = () => {
    setShowFilterModal(false);
  };

  const handleNewExperiment = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewReport = (experiment) => {
    setSelectedExperiment(experiment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExperiment(null);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateExperiment = async (experimentData) => {
    try {
      const workspaceName = companyName?.toUpperCase() || 'AE';
      
      await createExperiment({
        name: experimentData.name,
        description: experimentData.description,
        pageId: experimentData.pageId,
        variantId: experimentData.variantId,
        workspaceName,
        status: 'inactive'
      });
      
      // Refresh experiments list
      const response = await getExperimentsByWorkspace(workspaceName);
      const transformedExperiments = response.data.map(transformExperimentData);
      setExperiments(transformedExperiments);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating experiment:', error);
    }
  };

  const handleEndExperiment = async () => {
    if (!selectedExperiment) return;
    
    try {
      await deactivateExperiment(selectedExperiment.id);
      
      // Refresh experiments list
      const workspaceName = companyName?.toUpperCase() || 'AE';
      const response = await getExperimentsByWorkspace(workspaceName);
      const transformedExperiments = response.data.map(transformExperimentData);
      setExperiments(transformedExperiments);
      handleCloseModal();
    } catch (error) {
      console.error('Error ending experiment:', error);
    }
  };

  return (
    <>
      <div className={styles['experiments-view']}>
        <div className={styles['experiments-view__header-wrapper']}>
          <SearchHeader
            title="Experiments"
            searchPlaceholder="Search Experiments by Name"
            onSearch={(query) => console.log('Searching:', query)}
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            buttonText="New Experiment"
            onButtonClick={handleNewExperiment}
            className={styles['experiments-view__header']}
          />
          <button
            ref={filterButtonRef}
            className={styles['experiments-view__filter-button']}
            onClick={handleFilterClick}
            aria-label="Filter experiments"
          >
            <Image
              src="/filter.svg"
              alt="Filter"
              width={16}
              height={16}
            />
          </button>
        </div>
        
        {showFilterModal && (
          <FilterModal
            filters={filterConfig}
            values={filterValues}
            onChange={handleFilterChange}
            onClose={handleFilterClose}
            position={filterPosition}
          />
        )}
        
        {loading ? (
          <div className={styles['experiments-view__loading']}>
            Loading experiments...
          </div>
        ) : error ? (
          <div className={styles['experiments-view__error']}>
            Error: {error}
          </div>
        ) : (
          <ExperimentsTable 
            experiments={filteredExperiments}
            onViewReport={handleViewReport}
            className={styles['experiments-view__table']}
          />
        )}
      </div>
      
      {isModalOpen && selectedExperiment && (
        <ExperimentsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          experimentId={selectedExperiment.id}
          experimentTitle={selectedExperiment.name}
          experimentStatus={selectedExperiment.status}
          comparisonText={selectedExperiment.comparison}
          pageName={selectedExperiment.pageName}
          variantName={selectedExperiment.variantName}
          pageStats={selectedExperiment.pageStats}
          variantStats={selectedExperiment.variantStats}
          onEndExperiment={handleEndExperiment}
        />
      )}
      
      {isCreateModalOpen && (
        <CreateExperimentModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onCreateExperiment={handleCreateExperiment}
          pages={pages}
          variants={variants}
        />
      )}
    </>
  );
}