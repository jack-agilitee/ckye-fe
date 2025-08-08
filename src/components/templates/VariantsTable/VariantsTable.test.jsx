import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VariantsTable from './VariantsTable';

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

describe('VariantsTable', () => {
  const mockVariants = [
    {
      id: 1,
      fileName: 'Clade.md',
      variant: 'Variant 2',
      createdDate: '2025-08-07',
      createdBy: {
        name: 'Claude Code',
        email: 'agent@agilitee.com',
        initial: 'C'
      },
      summary: 'Updated examples to use React function components with hooks instead of class components, following current React best practices and community standards.'
    },
    {
      id: 2,
      fileName: 'Commands.md',
      variant: 'Variant 3',
      createdDate: '2025-08-13',
      createdBy: {
        name: 'Jack Nichols',
        email: 'jack@agilitee.com',
        initial: 'J'
      },
      summary: 'Changed data fetching examples from useEffect + fetch to Next.js server actions and React Query for better performance.'
    }
  ];

  const mockOnRowClick = jest.fn();

  beforeEach(() => {
    mockOnRowClick.mockClear();
  });

  it('renders table with suggestions', () => {
    render(
      <VariantsTable 
        variants={mockVariants}
        onRowClick={mockOnRowClick}
      />
    );

    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Created Date')).toBeInTheDocument();
    expect(screen.getByText('Created By')).toBeInTheDocument();
    expect(screen.getByText('Suggestion Summary')).toBeInTheDocument();

    // Check data
    expect(screen.getByText('Clade.md')).toBeInTheDocument();
    expect(screen.getByText('Commands.md')).toBeInTheDocument();
    expect(screen.getByText('Variant 2')).toBeInTheDocument();
    expect(screen.getByText('Variant 3')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(
      <VariantsTable 
        variants={[]}
        loading={true}
      />
    );

    expect(screen.getByText('Loading suggestions...')).toBeInTheDocument();
  });

  it('displays empty state when no suggestions', () => {
    render(
      <VariantsTable 
        variants={[]}
        loading={false}
      />
    );

    expect(screen.getByText('No suggestions found')).toBeInTheDocument();
  });

  it('handles row click with callback', () => {
    render(
      <VariantsTable 
        variants={mockVariants}
        onRowClick={mockOnRowClick}
      />
    );

    const firstRow = screen.getByText('Clade.md').closest('[class*="variants-table__row"]');
    fireEvent.click(firstRow);

    expect(mockOnRowClick).toHaveBeenCalledWith(mockVariants[0]);
  });

  it('logs TODO when no callback provided', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(
      <VariantsTable 
        variants={mockVariants}
      />
    );

    const firstRow = screen.getByText('Clade.md').closest('[class*="variants-table__row"]');
    fireEvent.click(firstRow);

    expect(consoleSpy).toHaveBeenCalledWith('TODO: Open modal for suggestion:', mockVariants[0]);
    
    consoleSpy.mockRestore();
  });

  it('truncates long summary text', () => {
    const longSummary = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    
    const suggestionWithLongSummary = {
      ...mockVariants[0],
      summary: longSummary
    };

    render(
      <VariantsTable 
        variants={[suggestionWithLongSummary]}
      />
    );

    const summaryElement = screen.getByText((content, element) => {
      return element && content.startsWith('Lorem ipsum') && content.endsWith('...');
    });

    expect(summaryElement).toBeInTheDocument();
    expect(summaryElement.textContent.length).toBeLessThan(longSummary.length);
  });

  it('formats dates correctly', () => {
    render(
      <VariantsTable 
        variants={mockVariants}
      />
    );

    expect(screen.getByText('Aug 7, 2025')).toBeInTheDocument();
    expect(screen.getByText('Aug 13, 2025')).toBeInTheDocument();
  });

  it('handles missing user data gracefully', () => {
    const suggestionWithoutUser = {
      ...mockVariants[0],
      createdBy: null
    };

    render(
      <VariantsTable 
        variants={[suggestionWithoutUser]}
      />
    );

    expect(screen.getByText('Unknown User')).toBeInTheDocument();
  });

  it('applies hover state on mouse enter', () => {
    render(
      <VariantsTable 
        variants={mockVariants}
      />
    );

    const firstRow = screen.getByText('Clade.md').closest('[class*="variants-table__row"]');
    
    fireEvent.mouseEnter(firstRow);
    expect(firstRow).toHaveClass('variants-table__row--hovered');
    
    fireEvent.mouseLeave(firstRow);
    expect(firstRow).not.toHaveClass('variants-table__row--hovered');
  });

  it('renders users with correct names and emails', () => {
    render(
      <VariantsTable 
        variants={mockVariants}
      />
    );

    const userNames = screen.getAllByTestId('user-name');
    expect(userNames[0]).toHaveTextContent('Claude Code');
    expect(userNames[1]).toHaveTextContent('Jack Nichols');

    const userEmails = screen.getAllByTestId('user-email');
    expect(userEmails[0]).toHaveTextContent('agent@agilitee.com');
    expect(userEmails[1]).toHaveTextContent('jack@agilitee.com');
  });


  it('renders action buttons with proper accessibility', () => {
    render(
      <VariantsTable 
        variants={mockVariants}
      />
    );

    const actionButtons = screen.getAllByRole('button');
    expect(actionButtons[0]).toHaveAttribute('aria-label', 'View details for Clade.md');
    expect(actionButtons[1]).toHaveAttribute('aria-label', 'View details for Commands.md');
  });

  it('handles suggestions without IDs', () => {
    const suggestionsWithoutIds = mockVariants.map(({ id, ...rest }) => rest);
    
    render(
      <VariantsTable 
        variants={suggestionsWithoutIds}
      />
    );

    expect(screen.getByText('Clade.md')).toBeInTheDocument();
    expect(screen.getByText('Commands.md')).toBeInTheDocument();
  });

  it('handles missing variant gracefully', () => {
    const suggestionWithoutVariant = {
      ...mockVariants[0],
      variant: null
    };

    render(
      <VariantsTable 
        variants={[suggestionWithoutVariant]}
      />
    );

    expect(screen.getByText('Clade.md')).toBeInTheDocument();
  });

  it('handles missing summary gracefully', () => {
    const suggestionWithoutSummary = {
      ...mockVariants[0],
      summary: null
    };

    render(
      <VariantsTable 
        variants={[suggestionWithoutSummary]}
      />
    );

    expect(screen.getByText('No summary available')).toBeInTheDocument();
  });
});