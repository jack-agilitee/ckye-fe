import { render, screen, waitFor } from '@testing-library/react';
import DeveloperStatsPage from '../page';
import { getWorkspaces } from '@/lib/api/workspaces';
import { cookies } from 'next/headers';

// Mock the API module
jest.mock('@/lib/api/workspaces');

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock the components
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
  default: ({ isAdminMode }) => (
    <nav data-testid={`sidebar-${isAdminMode ? 'admin' : 'regular'}`}>
      Sidebar
    </nav>
  ),
}));

jest.mock('../DeveloperStatsPageClient', () => ({
  __esModule: true,
  default: ({ workspaces }) => (
    <div data-testid="developer-stats-page-client">
      <div data-testid="workspaces-count">{workspaces.length} workspaces</div>
      {workspaces.map((workspace) => (
        <div key={workspace.id} data-testid={`workspace-${workspace.id}`}>
          {workspace.name}
        </div>
      ))}
    </div>
  ),
}));

describe('DeveloperStatsPage', () => {
  const mockWorkspaces = [
    { 
      id: 'ws-1', 
      name: 'American Eagle',
      createdAt: '2024-01-01T00:00:00Z'
    },
    { 
      id: 'ws-2', 
      name: 'Dollar General',
      createdAt: '2024-01-02T00:00:00Z'
    },
    { 
      id: 'ws-3', 
      name: 'Agilitee',
      createdAt: '2024-01-03T00:00:00Z'
    },
  ];

  beforeEach(() => {
    const mockCookieStore = {
      toString: jest.fn().mockReturnValue('mock-cookie-value'),
    };
    cookies.mockReturnValue(mockCookieStore);
    
    getWorkspaces.mockResolvedValue({ 
      data: mockWorkspaces,
      meta: {
        page: 1,
        limit: 20,
        total: 3,
        totalPages: 1
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page with correct structure', async () => {
    const { container } = render(await DeveloperStatsPage());
    
    expect(screen.getByTestId('two-column-page')).toBeInTheDocument();
    expect(screen.getByTestId('left-content')).toBeInTheDocument();
    expect(screen.getByTestId('right-content')).toBeInTheDocument();
  });

  it('renders sidebar in admin mode', async () => {
    render(await DeveloperStatsPage());
    
    expect(screen.getByTestId('sidebar-admin')).toBeInTheDocument();
  });

  it('fetches and displays workspace data', async () => {
    render(await DeveloperStatsPage());
    
    await waitFor(() => {
      expect(getWorkspaces).toHaveBeenCalledTimes(1);
      expect(getWorkspaces).toHaveBeenCalledWith('mock-cookie-value');
    });

    const statsClient = screen.getByTestId('developer-stats-page-client');
    expect(statsClient).toBeInTheDocument();
    expect(screen.getByTestId('workspaces-count')).toHaveTextContent('3 workspaces');
    expect(screen.getByText('American Eagle')).toBeInTheDocument();
    expect(screen.getByText('Dollar General')).toBeInTheDocument();
    expect(screen.getByText('Agilitee')).toBeInTheDocument();
  });

  it('handles empty workspace data', async () => {
    getWorkspaces.mockResolvedValue({ 
      data: [],
      meta: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      }
    });
    
    render(await DeveloperStatsPage());
    
    const statsClient = screen.getByTestId('developer-stats-page-client');
    expect(statsClient).toBeInTheDocument();
    expect(screen.getByTestId('workspaces-count')).toHaveTextContent('0 workspaces');
  });

  it('handles API errors gracefully', async () => {
    getWorkspaces.mockRejectedValue(new Error('Failed to fetch workspaces'));
    
    await expect(DeveloperStatsPage()).rejects.toThrow('Failed to fetch workspaces');
  });

  it('has proper metadata', async () => {
    const { metadata } = await import('../page');
    
    expect(metadata).toEqual({
      title: 'Developer Statistics | Ckye Admin',
      description: 'View developer statistics and PR metrics by workspace',
    });
  });
});