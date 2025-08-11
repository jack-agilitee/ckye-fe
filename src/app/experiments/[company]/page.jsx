'use client';

import { useState, useEffect } from 'react';
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import ExperimentsTable from '@/components/templates/ExperimentsTable/ExperimentsTable';
import ExperimentsModal from '@/components/organisms/ExperimentsModal/ExperimentsModal';
import CreateExperimentModal from '@/components/organisms/CreateExperimentModal/CreateExperimentModal';
import { getExperimentsByWorkspace, createExperiment } from '@/lib/api/experiments';
import { getVariants } from '@/lib/api/variants';
import { getPages } from '@/lib/api/pages';
import styles from './page.module.scss';

// Transform API data to match component expectations
const transformExperimentData = (apiExperiment) => {
  return {
    id: apiExperiment.id,
    name: apiExperiment.name,
    comparison: apiExperiment.description || 'No comparison available',
    status: apiExperiment.status === 'active' ? 'Active' : 
            apiExperiment.status === 'completed' ? 'Closed' : 'Inactive',
    createdDate: new Date(apiExperiment.createdAt).toISOString().split('T')[0],
    createdBy: {
      initial: 'C',
      name: 'Claude Code',
      email: 'Agent of: system@agilitee.com'
    }
  };
};

const ExperimentsPage = ({ params }) => {
  const company = params?.company || 'Agilitee';
  const [searchQuery, setSearchQuery] = useState('');
  const [experiments, setExperiments] = useState([]);
  const [pages, setPages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch experiments, pages, and variants from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use company param directly as workspaceName (from URL like /experiments/ae)
        const workspaceName = company?.toUpperCase() || 'AE';
        
        // Fetch experiments, pages, and variants in parallel
        const [experimentsResponse, pagesResponse, variantsResponse] = await Promise.all([
          getExperimentsByWorkspace(workspaceName),
          getPages(workspaceName),  // Using workspaceName as company name for pages
          getVariants({ workspaceName })
        ]);
        
        // Transform and set experiments
        const transformedExperiments = experimentsResponse.data.map(transformExperimentData);
        setExperiments(transformedExperiments);
        
        // Set pages and variants
        setPages(pagesResponse.data || []);
        setVariants(variantsResponse.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [company]);

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
      const workspaceName = company?.toUpperCase() || 'AE';
      
      // Create experiment with pageId and variantId from the form
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
      // TODO: Show error message to user
    }
  };

  const handleContextItemClick = (item) => {
    console.log('Context item clicked:', item);
  };

  const leftContent = (
    <Sidebar 
      accountName={company}
      selectedItemId="experiments"
      onContextItemClick={handleContextItemClick}
    />
  );

  const rightContent = (
    <>
      <SearchHeader
        title="Experiments"
        searchPlaceholder="Search Experiments by Name"
        onSearch={(query) => console.log('Searching:', query)}
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        buttonText="New Experiment"
        onButtonClick={handleNewExperiment}
      />
      {loading ? (
        <div className={styles['experiments-page__loading']}>
          Loading experiments...
        </div>
      ) : error ? (
        <div className={styles['experiments-page__error']}>
          Error: {error}
        </div>
      ) : (
        <ExperimentsTable 
          experiments={filteredExperiments}
          onViewReport={handleViewReport}
        />
      )}
    </>
  );

  return (
    <>
      <TwoColumnPage
        leftContent={leftContent}
        rightContent={rightContent}
        className={styles['experiments-page']}
      />
      
      {isModalOpen && selectedExperiment && (
        <ExperimentsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          experimentTitle={selectedExperiment.name}
          comparisonText={selectedExperiment.comparison}
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
};

export default ExperimentsPage;