import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useParams } from 'next/navigation';
import DashboardPage from '../page';
import { getPages, addPage } from '@/lib/api/pages';

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

jest.mock('@/lib/api/pages', () => ({
  getPages: jest.fn(),
  addPage: jest.fn(),
}));

jest.mock('@/components/pages/TwoColumnPage/TwoColumnPage', () => ({
  __esModule: true,
  default: ({ leftContent, rightContent }) => (
    <div data-testid="two-column-page">
      <div data-testid="left-content">{leftContent}</div>
      <div data-testid="right-content">{rightContent}</div>
    </div>
  ),
}));

jest.mock('@/components/templates/Sidebar/Sidebar', () => ({
  __esModule: true,
  default: ({ 
    contextItems, 
    selectedItemId, 
    accountName, 
    accountInitial,
    onContextItemClick,
    onAddNewClick 
  }) => (
    <div data-testid="sidebar">
      <div data-testid="account-name">{accountName}</div>
      <div data-testid="account-initial">{accountInitial}</div>
      {contextItems.map((item) => (
        <button
          key={item.id}
          data-testid={`context-item-${item.id}`}
          className={selectedItemId === item.id ? 'selected' : ''}
          onClick={() => onContextItemClick(item)}
        >
          {item.name}
        </button>
      ))}
      <button data-testid="add-new-button" onClick={onAddNewClick}>
        Add New
      </button>
    </div>
  ),
}));

jest.mock('@/components/organisms/MarkdownEditor/MarkdownEditor', () => ({
  __esModule: true,
  default: ({ placeholder }) => (
    <div data-testid="markdown-editor">
      <p>{placeholder}</p>
    </div>
  ),
}));

describe('DashboardPage', () => {
  const mockPages = [
    { id: '1', name: 'Claude.md', content: '# Claude', company: 'AEO' },
    { id: '2', name: 'Commands.md', content: '# Commands', company: 'AEO' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ companyName: 'AEO' });
    getPages.mockResolvedValue({ data: mockPages });
  });

  it('renders the page with TwoColumnPage layout', async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('two-column-page')).toBeInTheDocument();
    });
  });

  it('fetches pages on mount', async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(getPages).toHaveBeenCalledWith('AEO');
    });
  });

  it('displays company name in sidebar', async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('account-name')).toHaveTextContent('AEO');
      expect(screen.getByTestId('account-initial')).toHaveTextContent('A');
    });
  });

  it('displays fetched pages in sidebar', async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('context-item-1')).toHaveTextContent('Claude.md');
      expect(screen.getByTestId('context-item-2')).toHaveTextContent('Commands.md');
    });
  });

  it('auto-selects first page', async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      const firstItem = screen.getByTestId('context-item-1');
      expect(firstItem).toHaveClass('selected');
    });
  });

  it('handles page selection', async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      const secondItem = screen.getByTestId('context-item-2');
      fireEvent.click(secondItem);
    });

    // Check if selection changed
    await waitFor(() => {
      const secondItem = screen.getByTestId('context-item-2');
      expect(secondItem).toHaveClass('selected');
    });
  });

  it('handles adding new page', async () => {
    const newPage = { id: '3', name: 'NewPage.md', content: '# NewPage', company: 'AEO' };
    addPage.mockResolvedValue(newPage);
    getPages.mockResolvedValueOnce({ data: mockPages })
           .mockResolvedValueOnce({ data: [...mockPages, newPage] });
    
    // Mock prompt
    global.prompt = jest.fn().mockReturnValue('NewPage');
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      const addButton = screen.getByTestId('add-new-button');
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(addPage).toHaveBeenCalledWith({
        name: 'NewPage.md',
        company: 'AEO',
        content: '# NewPage\n\nStart writing your content here...'
      });
      expect(getPages).toHaveBeenCalledTimes(2);
    });
  });

  it('handles add page cancellation', async () => {
    global.prompt = jest.fn().mockReturnValue(null);
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      const addButton = screen.getByTestId('add-new-button');
      fireEvent.click(addButton);
    });

    expect(addPage).not.toHaveBeenCalled();
  });

  it('displays loading state', () => {
    getPages.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<DashboardPage />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error state', async () => {
    getPages.mockRejectedValue(new Error('Failed to fetch'));
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
    });
  });

  it('handles add page error', async () => {
    addPage.mockRejectedValue(new Error('Failed to create'));
    global.prompt = jest.fn().mockReturnValue('NewPage');
    global.alert = jest.fn();
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      const addButton = screen.getByTestId('add-new-button');
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Failed to create page: Failed to create');
    });
  });

  it('renders markdown editor with correct placeholder', async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
      expect(screen.getByText('Select a page from the sidebar to start editing...')).toBeInTheDocument();
    });
  });

  it('handles empty pages list', async () => {
    getPages.mockResolvedValue({ data: [] });
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.queryByTestId('context-item-1')).not.toBeInTheDocument();
    });
  });
});