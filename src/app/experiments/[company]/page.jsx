'use client';

import { useState } from 'react';
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import Sidebar from '@/components/templates/Sidebar/Sidebar';
import SearchHeader from '@/components/molecules/SearchHeader/SearchHeader';
import ExperimentsTable from '@/components/templates/ExperimentsTable/ExperimentsTable';
import ExperimentsModal from '@/components/organisms/ExperimentsModal/ExperimentsModal';
import styles from './page.module.scss';

// Hardcoded experiments data based on Figma design
const mockExperiments = [
  {
    id: '1',
    experimentName: 'Claude.md version 2',
    version: 'master vs. version 2',
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
    experimentName: 'Claude.md version 3',
    version: 'master vs. version 3',
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
    experimentName: 'Claude.md version 4',
    version: 'master vs. version 4',
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
    experimentName: 'Commands.md version 2',
    version: 'master vs. version 2',
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
    experimentName: 'Claude.md version 5',
    version: 'master vs. version 5',
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

  // Filter experiments based on search query
  const filteredExperiments = mockExperiments.filter(experiment => {
    const query = searchQuery.toLowerCase();
    return (
      experiment.experimentName.toLowerCase().includes(query) ||
      experiment.version.toLowerCase().includes(query) ||
      experiment.status.toLowerCase().includes(query)
    );
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNewExperiment = () => {
    console.log('New Experiment clicked');
    // TODO: Implement new experiment modal/flow
  };

  const handleRowClick = (experiment) => {
    setSelectedExperiment(experiment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExperiment(null);
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
        company={company}
        onRowClick={handleRowClick}
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
          experimentName={selectedExperiment.experimentName}
          version={selectedExperiment.version}
        />
      )}
    </>
  );
};

export default ExperimentsPage;