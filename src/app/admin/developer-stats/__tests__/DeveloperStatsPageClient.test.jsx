import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeveloperStatsPageClient from '../DeveloperStatsPageClient';
import { getDeveloperStatsByWorkspace } from '@/lib/api/developer-statistics';

// Mock the API module
jest.mock('@/lib/api/developer-statistics');

describe('DeveloperStatsPageClient', () => {
  const mockWorkspaces = [
    { id: 'ws-1', name: 'American Eagle' },
    { id: 'ws-2', name: 'Dollar General' },
    { id: 'ws-3', name: 'Agilitee' },
  ];

  const mockStats = [
    {
      id: 1,
      user: 'jack.nichols',
      prNumber: 123,
      mergedDate: '2024-03-15T10:30:00Z',
      estimatedTime: 8,
    },
    {
      id: 2,
      user: 'andrew.vonn',
      prNumber: 124,
      mergedDate: '2024-03-16T14:45:00Z',
      estimatedTime: 12,
    },
    {
      id: 3,
      user: 'john.doe',
      prNumber: 125,
      mergedDate: '2024-03-17T09:15:00Z',
      estimatedTime: 6,
    },
  ];

  beforeEach(() => {
    getDeveloperStatsByWorkspace.mockResolvedValue({
      data: mockStats,
      meta: {
        page: 1,
        totalPages: 2,
        total: 15,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders page title and dropdown', () => {
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    expect(screen.getByText('Developer Statistics')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Workspace:')).toBeInTheDocument();
    expect(screen.getByText('Choose a workspace...')).toBeInTheDocument();
  });

  it('displays all workspace options in dropdown', () => {
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    const select = screen.getByLabelText('Select Workspace:');
    
    mockWorkspaces.forEach((workspace) => {
      expect(select).toHaveTextContent(workspace.name);
    });
  });

  it('shows no content when no workspace is selected', () => {
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    expect(screen.queryByText('Loading statistics...')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('fetches and displays statistics when workspace is selected', async () => {
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    const select = screen.getByLabelText('Select Workspace:');
    fireEvent.change(select, { target: { value: 'ws-1' } });
    
    await waitFor(() => {
      expect(getDeveloperStatsByWorkspace).toHaveBeenCalledWith('ws-1', {
        page: 1,
        limit: 10,
        sortBy: 'mergedDate',
        sortOrder: 'desc',
      });
    });
    
    // Check table headers
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('PR Number')).toBeInTheDocument();
    expect(screen.getByText('Merged Date')).toBeInTheDocument();
    expect(screen.getByText('Estimated Time')).toBeInTheDocument();
    
    // Check data rows
    expect(screen.getByText('jack.nichols')).toBeInTheDocument();
    expect(screen.getByText('#123')).toBeInTheDocument();
    expect(screen.getByText('8h')).toBeInTheDocument();
  });

  it('handles sorting when column headers are clicked', async () => {
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    const select = screen.getByLabelText('Select Workspace:');
    fireEvent.change(select, { target: { value: 'ws-1' } });
    
    await waitFor(() => {
      expect(getDeveloperStatsByWorkspace).toHaveBeenCalled();
    });
    
    // Click on Developer column to sort
    const developerHeader = screen.getByText('Developer').closest('th');
    fireEvent.click(developerHeader);
    
    await waitFor(() => {
      expect(getDeveloperStatsByWorkspace).toHaveBeenCalledWith('ws-1', {
        page: 1,
        limit: 10,
        sortBy: 'user',
        sortOrder: 'asc',
      });
    });
  });

  it('displays loading state while fetching data', async () => {
    getDeveloperStatsByWorkspace.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    const select = screen.getByLabelText('Select Workspace:');
    fireEvent.change(select, { target: { value: 'ws-1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Loading statistics...')).toBeInTheDocument();
    });
  });

  it('displays error message when API call fails', async () => {
    getDeveloperStatsByWorkspace.mockRejectedValue(new Error('API Error'));
    
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    const select = screen.getByLabelText('Select Workspace:');
    fireEvent.change(select, { target: { value: 'ws-1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load developer statistics')).toBeInTheDocument();
    });
  });

  it('displays empty state when no statistics found', async () => {
    getDeveloperStatsByWorkspace.mockResolvedValue({
      data: [],
      meta: { page: 1, totalPages: 0, total: 0 },
    });
    
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    const select = screen.getByLabelText('Select Workspace:');
    fireEvent.change(select, { target: { value: 'ws-1' } });
    
    await waitFor(() => {
      expect(screen.getByText('No developer statistics found for this workspace.')).toBeInTheDocument();
    });
  });

  it('handles pagination correctly', async () => {
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    const select = screen.getByLabelText('Select Workspace:');
    fireEvent.change(select, { target: { value: 'ws-1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });
    
    // Click Next button
    const nextButton = screen.getByText('Next');
    expect(nextButton).not.toBeDisabled();
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(getDeveloperStatsByWorkspace).toHaveBeenCalledWith('ws-1', {
        page: 2,
        limit: 10,
        sortBy: 'mergedDate',
        sortOrder: 'desc',
      });
    });
  });

  it('disables Previous button on first page', async () => {
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    const select = screen.getByLabelText('Select Workspace:');
    fireEvent.change(select, { target: { value: 'ws-1' } });
    
    await waitFor(() => {
      const prevButton = screen.getByText('Previous');
      expect(prevButton).toBeDisabled();
    });
  });

  it('disables Next button on last page', async () => {
    getDeveloperStatsByWorkspace.mockResolvedValue({
      data: mockStats,
      meta: { page: 1, totalPages: 1, total: 3 },
    });
    
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    const select = screen.getByLabelText('Select Workspace:');
    fireEvent.change(select, { target: { value: 'ws-1' } });
    
    await waitFor(() => {
      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
    });
  });

  it('formats dates correctly', async () => {
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    const select = screen.getByLabelText('Select Workspace:');
    fireEvent.change(select, { target: { value: 'ws-1' } });
    
    await waitFor(() => {
      // Check if dates are formatted correctly
      expect(screen.getByText('Mar 15, 2024')).toBeInTheDocument();
      expect(screen.getByText('Mar 16, 2024')).toBeInTheDocument();
      expect(screen.getByText('Mar 17, 2024')).toBeInTheDocument();
    });
  });

  it('handles null/undefined values gracefully', async () => {
    getDeveloperStatsByWorkspace.mockResolvedValue({
      data: [
        {
          id: 1,
          user: 'test.user',
          prNumber: 100,
          mergedDate: null,
          estimatedTime: null,
        },
      ],
      meta: { page: 1, totalPages: 1, total: 1 },
    });
    
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    const select = screen.getByLabelText('Select Workspace:');
    fireEvent.change(select, { target: { value: 'ws-1' } });
    
    await waitFor(() => {
      expect(screen.getByText('test.user')).toBeInTheDocument();
      expect(screen.getByText('#100')).toBeInTheDocument();
      // Should display '-' for null values
      expect(screen.getAllByText('-')).toHaveLength(2);
    });
  });

  it('resets to page 1 when changing workspace', async () => {
    render(<DeveloperStatsPageClient workspaces={mockWorkspaces} />);
    
    const select = screen.getByLabelText('Select Workspace:');
    
    // Select first workspace
    fireEvent.change(select, { target: { value: 'ws-1' } });
    
    await waitFor(() => {
      expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    });
    
    // Go to page 2
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
      expect(getDeveloperStatsByWorkspace).toHaveBeenCalledWith('ws-1', 
        expect.objectContaining({ page: 2 })
      );
    });
    
    // Change workspace
    fireEvent.change(select, { target: { value: 'ws-2' } });
    
    await waitFor(() => {
      expect(getDeveloperStatsByWorkspace).toHaveBeenCalledWith('ws-2', 
        expect.objectContaining({ page: 1 }) // Should reset to page 1
      );
    });
  });
});