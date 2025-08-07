import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuggestionsTable from './SuggestionsTable';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Avatar component
jest.mock('@/components/atoms/Avatar/Avatar', () => ({
  __esModule: true,
  default: ({ initial, size, className }) => (
    <div data-testid="avatar" className={className}>
      {initial}
    </div>
  ),
}));

describe('SuggestionsTable', () => {
  const mockSuggestions = [
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
      <SuggestionsTable 
        suggestions={mockSuggestions}
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
      <SuggestionsTable 
        suggestions={[]}
        loading={true}
      />
    );

    expect(screen.getByText('Loading suggestions...')).toBeInTheDocument();
  });

  it('displays empty state when no suggestions', () => {
    render(
      <SuggestionsTable 
        suggestions={[]}
        loading={false}
      />
    );

    expect(screen.getByText('No suggestions found')).toBeInTheDocument();
  });

  it('handles row click with callback', () => {
    render(
      <SuggestionsTable 
        suggestions={mockSuggestions}
        onRowClick={mockOnRowClick}
      />
    );

    const firstRow = screen.getByText('Clade.md').closest('[class*="suggestions-table__row"]');
    fireEvent.click(firstRow);

    expect(mockOnRowClick).toHaveBeenCalledWith(mockSuggestions[0]);
  });

  it('logs TODO when no callback provided', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(
      <SuggestionsTable 
        suggestions={mockSuggestions}
      />
    );

    const firstRow = screen.getByText('Clade.md').closest('[class*="suggestions-table__row"]');
    fireEvent.click(firstRow);

    expect(consoleSpy).toHaveBeenCalledWith('TODO: Open modal for suggestion:', mockSuggestions[0]);
    
    consoleSpy.mockRestore();
  });

  it('truncates long summary text', () => {
    const longSummary = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    
    const suggestionWithLongSummary = {
      ...mockSuggestions[0],
      summary: longSummary
    };

    render(
      <SuggestionsTable 
        suggestions={[suggestionWithLongSummary]}
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
      <SuggestionsTable 
        suggestions={mockSuggestions}
      />
    );

    expect(screen.getByText('Aug 7, 2025')).toBeInTheDocument();
    expect(screen.getByText('Aug 13, 2025')).toBeInTheDocument();
  });

  it('handles missing user data gracefully', () => {
    const suggestionWithoutUser = {
      ...mockSuggestions[0],
      createdBy: null
    };

    render(
      <SuggestionsTable 
        suggestions={[suggestionWithoutUser]}
      />
    );

    expect(screen.getByText('Unknown User')).toBeInTheDocument();
  });

  it('applies hover state on mouse enter', () => {
    render(
      <SuggestionsTable 
        suggestions={mockSuggestions}
      />
    );

    const firstRow = screen.getByText('Clade.md').closest('[class*="suggestions-table__row"]');
    
    fireEvent.mouseEnter(firstRow);
    expect(firstRow).toHaveClass('suggestions-table__row--hovered');
    
    fireEvent.mouseLeave(firstRow);
    expect(firstRow).not.toHaveClass('suggestions-table__row--hovered');
  });

  it('renders avatars with correct initials', () => {
    render(
      <SuggestionsTable 
        suggestions={mockSuggestions}
      />
    );

    const avatars = screen.getAllByTestId('avatar');
    expect(avatars[0]).toHaveTextContent('C');
    expect(avatars[1]).toHaveTextContent('J');
  });

  it('renders user emails when available', () => {
    render(
      <SuggestionsTable 
        suggestions={mockSuggestions}
      />
    );

    expect(screen.getByText('agent@agilitee.com')).toBeInTheDocument();
    expect(screen.getByText('jack@agilitee.com')).toBeInTheDocument();
  });

  it('renders action buttons with proper accessibility', () => {
    render(
      <SuggestionsTable 
        suggestions={mockSuggestions}
      />
    );

    const actionButtons = screen.getAllByRole('button');
    expect(actionButtons[0]).toHaveAttribute('aria-label', 'View details for Clade.md');
    expect(actionButtons[1]).toHaveAttribute('aria-label', 'View details for Commands.md');
  });

  it('handles suggestions without IDs', () => {
    const suggestionsWithoutIds = mockSuggestions.map(({ id, ...rest }) => rest);
    
    render(
      <SuggestionsTable 
        suggestions={suggestionsWithoutIds}
      />
    );

    expect(screen.getByText('Clade.md')).toBeInTheDocument();
    expect(screen.getByText('Commands.md')).toBeInTheDocument();
  });

  it('handles missing variant gracefully', () => {
    const suggestionWithoutVariant = {
      ...mockSuggestions[0],
      variant: null
    };

    render(
      <SuggestionsTable 
        suggestions={[suggestionWithoutVariant]}
      />
    );

    expect(screen.getByText('Clade.md')).toBeInTheDocument();
  });

  it('handles missing summary gracefully', () => {
    const suggestionWithoutSummary = {
      ...mockSuggestions[0],
      summary: null
    };

    render(
      <SuggestionsTable 
        suggestions={[suggestionWithoutSummary]}
      />
    );

    expect(screen.getByText('No summary available')).toBeInTheDocument();
  });
});