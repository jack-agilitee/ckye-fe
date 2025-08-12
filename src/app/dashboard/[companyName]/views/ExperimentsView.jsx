'use client';

import { useState, useEffect } from 'react';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import ExperimentsTable from '@/components/templates/ExperimentsTable/ExperimentsTable';
import ExperimentsModal from '@/components/organisms/ExperimentsModal/ExperimentsModal';
import CreateExperimentModal from '@/components/organisms/CreateExperimentModal/CreateExperimentModal';
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

  // Fetch experiments and variants on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const workspaceName = companyName?.toUpperCase() || 'AE';
        
        // Fetch experiments and variants in parallel
        const [experimentsResponse, variantsResponse] = await Promise.all([
          getExperimentsByWorkspace(workspaceName),
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
  }, [companyName]);

  // Filter experiments based on search query
  const filteredExperiments = experiments.filter(experiment => {
    const query = searchQuery.toLowerCase();
    return (
      experiment.name.toLowerCase().includes(query) ||
      experiment.comparison.toLowerCase().includes(query) ||
      experiment.status.toLowerCase().includes(query)
    );
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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