import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import ExperimentsPage from '../page';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock components
jest.mock('@/components/pages/TwoColumnPage/TwoColumnPage', () => ({
  __esModule: true,
  default: ({ leftContent, rightContent, className }) => (
    <div data-testid="two-column-page" className={className}>
      <div data-testid="left-content">{leftContent}</div>
      <div data-testid="right-content">{rightContent}</div>
    </div>
  ),
}));

jest.mock('@/components/templates/Sidebar/Sidebar', () => ({
  __esModule: true,
  default: ({ accountName, selectedItemId, onContextItemClick }) => (
    <div data-testid="sidebar">
      <span data-testid="account-name">{accountName}</span>
      <span data-testid="selected-item">{selectedItemId}</span>
      <button onClick={() => onContextItemClick({ id: 'test' })}>Click Context Item</button>
    </div>
  ),
}));

jest.mock('@/components/molecules/SearchHeader/SearchHeader', () => ({
  __esModule: true,
  default: ({ title, searchPlaceholder, onSearch, searchValue, onSearchChange, buttonText, onButtonClick }) => (
    <div data-testid="search-header">
      <h1>{title}</h1>
      <input 
        data-testid="search-input"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={onSearchChange}
      />
      <button data-testid="add-button" onClick={onButtonClick}>{buttonText}</button>
    </div>
  ),
}));

jest.mock('@/components/templates/ExperimentsTable/ExperimentsTable', () => ({
  __esModule: true,
  default: ({ experiments, company, onRowClick }) => (
    <div data-testid="experiments-table">
      <span data-testid="company">{company}</span>
      <div data-testid="experiments-count">{experiments.length} experiments</div>
      {experiments.map((experiment) => (
        <div 
          key={experiment.id} 
          data-testid={`experiment-${experiment.id}`}
          onClick={() => onRowClick(experiment)}
        >
          <span>{experiment.experimentName}</span>
          <span>{experiment.status}</span>
        </div>
      ))}
    </div>
  ),
}));

jest.mock('@/components/organisms/ExperimentsModal/ExperimentsModal', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, experimentName, version }) => 
    isOpen ? (
      <div data-testid="experiments-modal">
        <span data-testid="modal-experiment-name">{experimentName}</span>
        <span data-testid="modal-version">{version}</span>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock('@/context/UserContext', () => ({
  useUser: () => ({
    user: { userType: 'Member' }
  })
}));

describe('ExperimentsPage', () => {
  const mockPush = jest.fn();
  const mockParams = { company: 'testcompany' };

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    usePathname.mockReturnValue('/experiments/testcompany');
    jest.clearAllMocks();
  });

  it('renders the page with correct structure', () => {
    render(<ExperimentsPage params={mockParams} />);
    
    expect(screen.getByTestId('two-column-page')).toBeInTheDocument();
    expect(screen.getByTestId('left-content')).toBeInTheDocument();
    expect(screen.getByTestId('right-content')).toBeInTheDocument();
  });

  it('renders the sidebar with correct company name', () => {
    render(<ExperimentsPage params={mockParams} />);
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('account-name')).toHaveTextContent('testcompany');
    expect(screen.getByTestId('selected-item')).toHaveTextContent('experiments');
  });

  it('renders the search header with correct props', () => {
    render(<ExperimentsPage params={mockParams} />);
    
    expect(screen.getByTestId('search-header')).toBeInTheDocument();
    expect(screen.getByText('Experiments')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Experiments by Name')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toHaveTextContent('New Experiment');
  });

  it('renders the experiments table with mock data', () => {
    render(<ExperimentsPage params={mockParams} />);
    
    expect(screen.getByTestId('experiments-table')).toBeInTheDocument();
    expect(screen.getByTestId('company')).toHaveTextContent('testcompany');
    expect(screen.getByTestId('experiments-count')).toHaveTextContent('5 experiments');
  });

  it('filters experiments when searching', () => {
    render(<ExperimentsPage params={mockParams} />);
    
    const searchInput = screen.getByTestId('search-input');
    
    // Initially shows all 5 experiments
    expect(screen.getByTestId('experiments-count')).toHaveTextContent('5 experiments');
    
    // Search for "Commands"
    fireEvent.change(searchInput, { target: { value: 'Commands' } });
    
    // Should show only 1 experiment
    expect(screen.getByTestId('experiments-count')).toHaveTextContent('1 experiments');
  });

  it('filters by experiment status', () => {
    render(<ExperimentsPage params={mockParams} />);
    
    const searchInput = screen.getByTestId('search-input');
    
    // Search for "Active"
    fireEvent.change(searchInput, { target: { value: 'Active' } });
    
    // Should show only experiments with Active status
    expect(screen.getByTestId('experiments-count')).toHaveTextContent('1 experiments');
  });

  it('handles new experiment button click', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<ExperimentsPage params={mockParams} />);
    
    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('New Experiment clicked');
    consoleSpy.mockRestore();
  });

  it('opens modal when experiment row is clicked', () => {
    render(<ExperimentsPage params={mockParams} />);
    
    // Initially no modal
    expect(screen.queryByTestId('experiments-modal')).not.toBeInTheDocument();
    
    // Click on first experiment
    const firstExperiment = screen.getByTestId('experiment-1');
    fireEvent.click(firstExperiment);
    
    // Modal should be open
    expect(screen.getByTestId('experiments-modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-experiment-name')).toHaveTextContent('Claude.md version 2');
    expect(screen.getByTestId('modal-version')).toHaveTextContent('master vs. version 2');
  });

  it('closes modal when close button is clicked', () => {
    render(<ExperimentsPage params={mockParams} />);
    
    // Open modal
    const firstExperiment = screen.getByTestId('experiment-1');
    fireEvent.click(firstExperiment);
    
    expect(screen.getByTestId('experiments-modal')).toBeInTheDocument();
    
    // Close modal
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('experiments-modal')).not.toBeInTheDocument();
  });

  it('handles context item click', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<ExperimentsPage params={mockParams} />);
    
    const contextButton = screen.getByText('Click Context Item');
    fireEvent.click(contextButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Context item clicked:', { id: 'test' });
    consoleSpy.mockRestore();
  });

  it('shows all experiments when search is cleared', () => {
    render(<ExperimentsPage params={mockParams} />);
    
    const searchInput = screen.getByTestId('search-input');
    
    // Search for something
    fireEvent.change(searchInput, { target: { value: 'Commands' } });
    expect(screen.getByTestId('experiments-count')).toHaveTextContent('1 experiments');
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByTestId('experiments-count')).toHaveTextContent('5 experiments');
  });

  it('uses default company name when not provided', () => {
    render(<ExperimentsPage params={{}} />);
    
    expect(screen.getByTestId('account-name')).toHaveTextContent('Agilitee');
  });

  it('renders correct experiment data', () => {
    render(<ExperimentsPage params={mockParams} />);
    
    // Check that experiments are rendered
    expect(screen.getByTestId('experiment-1')).toBeInTheDocument();
    expect(screen.getByTestId('experiment-2')).toBeInTheDocument();
    expect(screen.getByTestId('experiment-3')).toBeInTheDocument();
    expect(screen.getByTestId('experiment-4')).toBeInTheDocument();
    expect(screen.getByTestId('experiment-5')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<ExperimentsPage params={mockParams} />);
    
    // Check for heading
    const heading = screen.getByText('Experiments');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
    
    // Check for search input
    const searchInput = screen.getByPlaceholderText('Search Experiments by Name');
    expect(searchInput).toBeInTheDocument();
    
    // Check for buttons
    const addButton = screen.getByTestId('add-button');
    expect(addButton).toBeInTheDocument();
  });
});