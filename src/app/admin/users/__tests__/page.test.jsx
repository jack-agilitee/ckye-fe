import { render, screen, waitFor } from '@testing-library/react';
import UsersPage from '../page';
import { getUsers } from '@/lib/api/users';

// Mock the API module
jest.mock('@/lib/api/users');

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

jest.mock('../UsersPageClient', () => ({
  __esModule: true,
  default: ({ initialUsers }) => (
    <div data-testid="users-page-client">
      <div data-testid="users-count">{initialUsers.length} users</div>
      {initialUsers.map((user) => (
        <div key={user.id} data-testid={`user-${user.id}`}>
          {user.name}
        </div>
      ))}
    </div>
  ),
}));

describe('UsersPage', () => {
  const mockUsers = [
    { 
      id: 1, 
      name: 'Andrew Vonn', 
      email: 'andrew@agilitee.com',
      userType: 'Member',
      workspaces: ['Americal Eagle']
    },
    { 
      id: 2, 
      name: 'Jack Nichols', 
      email: 'jack@agilitee.com',
      userType: 'Admin',
      workspaces: ['Americal Eagle', 'Dollar General', 'Agilitee']
    },
  ];

  beforeEach(() => {
    getUsers.mockResolvedValue({ 
      data: mockUsers,
      meta: {
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page with correct structure', async () => {
    const { container } = render(await UsersPage());
    
    expect(screen.getByTestId('two-column-page')).toBeInTheDocument();
    expect(screen.getByTestId('left-content')).toBeInTheDocument();
    expect(screen.getByTestId('right-content')).toBeInTheDocument();
  });

  it('renders sidebar in admin mode', async () => {
    render(await UsersPage());
    
    expect(screen.getByTestId('sidebar-admin')).toBeInTheDocument();
  });

  it('fetches and displays user data', async () => {
    render(await UsersPage());
    
    await waitFor(() => {
      expect(getUsers).toHaveBeenCalledTimes(1);
    });

    const usersClient = screen.getByTestId('users-page-client');
    expect(usersClient).toBeInTheDocument();
    expect(screen.getByTestId('users-count')).toHaveTextContent('2 users');
    expect(screen.getByText('Andrew Vonn')).toBeInTheDocument();
    expect(screen.getByText('Jack Nichols')).toBeInTheDocument();
  });

  it('handles empty user data', async () => {
    getUsers.mockResolvedValue({ 
      data: [],
      meta: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      }
    });
    
    render(await UsersPage());
    
    const usersClient = screen.getByTestId('users-page-client');
    expect(usersClient).toBeInTheDocument();
    expect(screen.getByTestId('users-count')).toHaveTextContent('0 users');
  });

  it('handles API errors gracefully', async () => {
    getUsers.mockRejectedValue(new Error('Failed to fetch users'));
    
    await expect(UsersPage()).rejects.toThrow('Failed to fetch users');
  });

  it('has proper metadata', async () => {
    const { metadata } = await import('../page');
    
    expect(metadata).toEqual({
      title: 'Users | Ckye Admin',
      description: 'Manage system users and workspace assignments',
    });
  });
});