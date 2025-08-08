'use client';

import { useState } from 'react';
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import ExperimentsTable from '@/components/templates/ExperimentsTable/ExperimentsTable';
import ExperimentsModal from '@/components/organisms/ExperimentsModal/ExperimentsModal';
import CreateExperimentModal from '@/components/organisms/CreateExperimentModal/CreateExperimentModal';
import styles from './page.module.scss';

// Hardcoded experiments data based on Figma design
// Updated to match the prop names expected by ExperimentsTable
const mockExperiments = [
  {
    id: '1',
    name: 'Claude.md version 2',
    comparison: 'master vs. version 2',
    status: 'Active',
    createdDate: '2025-08-28',
    createdBy: {
      initial: 'J',
      name: 'Jack Nichols',
      email: 'jack@agilitee.com'
    }
  },
  {
    id: '2',
    name: 'Claude.md version 3',
    comparison: 'master vs. version 3',
    status: 'Closed',
    createdDate: '2025-08-26',
    createdBy: {
      initial: 'J',
      name: 'Jack Nichols',
      email: 'jack@agilitee.com'
    }
  },
  {
    id: '3',
    name: 'Claude.md version 4',
    comparison: 'master vs. version 4',
    status: 'Closed',
    createdDate: '2025-08-26',
    createdBy: {
      initial: 'J',
      name: 'Jack Nichols',
      email: 'jack@agilitee.com'
    }
  },
  {
    id: '4',
    name: 'Commands.md version 2',
    comparison: 'master vs. version 2',
    status: 'Closed',
    createdDate: '2025-08-26',
    createdBy: {
      initial: 'J',
      name: 'Jack Nichols',
      email: 'jack@agilitee.com'
    }
  },
  {
    id: '5',
    name: 'Claude.md version 5',
    comparison: 'master vs. version 5',
    status: 'Closed',
    createdDate: '2025-08-26',
    createdBy: {
      initial: 'J',
      name: 'Jack Nichols',
      email: 'jack@agilitee.com'
    }
  }
];

const ExperimentsPage = ({ params }) => {
  const company = params?.company || 'Agilitee';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter experiments based on search query
  const filteredExperiments = mockExperiments.filter(experiment => {
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

  const handleCreateExperiment = (experimentData) => {
    console.log('Creating experiment:', experimentData);
    // TODO: Implement API call to create experiment
    setIsCreateModalOpen(false);
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
      <ExperimentsTable 
        experiments={filteredExperiments}
        onViewReport={handleViewReport}
      />
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
          experimentName={selectedExperiment.name}
          version={selectedExperiment.comparison}
        />
      )}
      
      {isCreateModalOpen && (
        <CreateExperimentModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onCreateExperiment={handleCreateExperiment}
        />
      )}
    </>
  );
};

export default ExperimentsPage;