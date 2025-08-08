import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExperimentsTable from './ExperimentsTable';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock User component
jest.mock('@/components/molecules/User/User', () => ({
  __esModule: true,
  default: ({ name, email, initial, className }) => (
    <div data-testid="user" className={className}>
      <span data-testid="user-name">{name}</span>
      {email && <span data-testid="user-email">{email}</span>}
      {initial && <span data-testid="user-initial">{initial}</span>}
    </div>
  ),
}));

// Mock Button component
jest.mock('@/components/atoms/Button/Button', () => ({
  __esModule: true,
  default: ({ children, onClick, className, ...props }) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

describe('ExperimentsTable', () => {
  const mockExperiments = [
    {
      id: 1,
      name: 'Clade.md version 2',
      comparison: 'master vs. version 2',
      status: 'Active',
      createdDate: '2025-08-26',
      createdBy: {
        name: 'Jack Nichols',
        email: 'jack@agilitee.com',
        initial: 'J'
      }
    },
    {
      id: 2,
      name: 'Commands.md version 3',
      comparison: 'master vs. version 3',
      status: 'Closed',
      createdDate: '2025-08-27',
      createdBy: {
        name: 'Sarah Williams',
        email: 'sarah@agilitee.com',
        initial: 'S'
      }
    }
  ];

  const mockOnViewReport = jest.fn();

  beforeEach(() => {
    mockOnViewReport.mockClear();
  });

  it('renders table with experiments', () => {
    render(
      <ExperimentsTable 
        experiments={mockExperiments}
        onViewReport={mockOnViewReport}
      />
    );

    // Check headers
    expect(screen.getByText('Experiment')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Created Date')).toBeInTheDocument();
    expect(screen.getByText('Created By')).toBeInTheDocument();

    // Check data
    expect(screen.getByText('Clade.md version 2')).toBeInTheDocument();
    expect(screen.getByText('Commands.md version 3')).toBeInTheDocument();
    expect(screen.getByText('master vs. version 2')).toBeInTheDocument();
    expect(screen.getByText('master vs. version 3')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(
      <ExperimentsTable 
        experiments={[]}
        loading={true}
      />
    );

    expect(screen.getByText('Loading experiments...')).toBeInTheDocument();
  });

  it('displays empty state when no experiments', () => {
    render(
      <ExperimentsTable 
        experiments={[]}
        loading={false}
      />
    );

    expect(screen.getByText('No experiments found')).toBeInTheDocument();
  });

  it('handles view report click with callback', () => {
    render(
      <ExperimentsTable 
        experiments={mockExperiments}
        onViewReport={mockOnViewReport}
      />
    );

    const viewReportButtons = screen.getAllByText('View Report');
    fireEvent.click(viewReportButtons[0]);

    expect(mockOnViewReport).toHaveBeenCalledWith(mockExperiments[0]);
  });

  it('logs to console when no callback provided', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(
      <ExperimentsTable 
        experiments={mockExperiments}
      />
    );

    const viewReportButtons = screen.getAllByText('View Report');
    fireEvent.click(viewReportButtons[0]);

    expect(consoleSpy).toHaveBeenCalledWith('View report for experiment:', mockExperiments[0]);
    
    consoleSpy.mockRestore();
  });

  it('formats dates correctly', () => {
    render(
      <ExperimentsTable 
        experiments={mockExperiments}
      />
    );

    expect(screen.getByText('Aug 26, 2025')).toBeInTheDocument();
    expect(screen.getByText('Aug 27, 2025')).toBeInTheDocument();
  });

  it('displays correct status styling', () => {
    render(
      <ExperimentsTable 
        experiments={mockExperiments}
      />
    );

    const activeStatus = screen.getByText('Active');
    const closedStatus = screen.getByText('Closed');

    expect(activeStatus).toHaveClass('experiments-table__status--active');
    expect(closedStatus).toHaveClass('experiments-table__status--closed');
  });

  it('handles missing experiment data gracefully', () => {
    const experimentWithMissingData = {
      id: 3,
      name: null,
      comparison: null,
      status: null,
      createdDate: null,
      createdBy: null
    };

    render(
      <ExperimentsTable 
        experiments={[experimentWithMissingData]}
      />
    );

    expect(screen.getByText('Unnamed Experiment')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(screen.getByText('Unknown User')).toBeInTheDocument();
  });

  it('applies hover state on mouse enter', () => {
    render(
      <ExperimentsTable 
        experiments={mockExperiments}
      />
    );

    const firstRow = screen.getByText('Clade.md version 2').closest('[class*="experiments-table__row"]');
    
    fireEvent.mouseEnter(firstRow);
    expect(firstRow).toHaveClass('experiments-table__row--hovered');
    
    fireEvent.mouseLeave(firstRow);
    expect(firstRow).not.toHaveClass('experiments-table__row--hovered');
  });

  it('renders users with correct names and emails', () => {
    render(
      <ExperimentsTable 
        experiments={mockExperiments}
      />
    );

    const userNames = screen.getAllByTestId('user-name');
    expect(userNames[0]).toHaveTextContent('Jack Nichols');
    expect(userNames[1]).toHaveTextContent('Sarah Williams');

    const userEmails = screen.getAllByTestId('user-email');
    expect(userEmails[0]).toHaveTextContent('jack@agilitee.com');
    expect(userEmails[1]).toHaveTextContent('sarah@agilitee.com');
  });

  it('renders action buttons with proper accessibility', () => {
    render(
      <ExperimentsTable 
        experiments={mockExperiments}
      />
    );

    const actionButtons = screen.getAllByRole('button');
    expect(actionButtons[0]).toHaveAttribute('aria-label', 'View report for Clade.md version 2');
    expect(actionButtons[1]).toHaveAttribute('aria-label', 'View report for Commands.md version 3');
  });

  it('handles experiments without IDs', () => {
    const experimentsWithoutIds = mockExperiments.map(({ id, ...rest }) => rest);
    
    render(
      <ExperimentsTable 
        experiments={experimentsWithoutIds}
      />
    );

    expect(screen.getByText('Clade.md version 2')).toBeInTheDocument();
    expect(screen.getByText('Commands.md version 3')).toBeInTheDocument();
  });

  it('handles all view report button clicks correctly', () => {
    render(
      <ExperimentsTable 
        experiments={mockExperiments}
        onViewReport={mockOnViewReport}
      />
    );

    const viewReportButtons = screen.getAllByText('View Report');
    
    fireEvent.click(viewReportButtons[0]);
    expect(mockOnViewReport).toHaveBeenCalledWith(mockExperiments[0]);
    
    fireEvent.click(viewReportButtons[1]);
    expect(mockOnViewReport).toHaveBeenCalledWith(mockExperiments[1]);
    
    expect(mockOnViewReport).toHaveBeenCalledTimes(2);
  });

  it('normalizes status to lowercase for comparison', () => {
    const experimentsWithMixedCase = [
      { ...mockExperiments[0], status: 'ACTIVE' },
      { ...mockExperiments[1], status: 'closed' }
    ];

    render(
      <ExperimentsTable 
        experiments={experimentsWithMixedCase}
      />
    );

    const activeStatus = screen.getByText('ACTIVE');
    const closedStatus = screen.getByText('closed');

    expect(activeStatus).toHaveClass('experiments-table__status--active');
    expect(closedStatus).toHaveClass('experiments-table__status--closed');
  });
});