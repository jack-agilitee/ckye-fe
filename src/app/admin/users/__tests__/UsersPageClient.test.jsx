import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersPageClient from '../UsersPageClient';

// Mock the components
jest.mock('@/components/molecules/SearchHeader/SearchHeader', () => ({
  __esModule: true,
  default: ({ title, searchPlaceholder, buttonText, searchValue, onSearchChange, onButtonClick }) => (
    <div data-testid="search-header">
      <h1>{title}</h1>
      <input
        data-testid="search-input"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={onSearchChange}
      />
      <button data-testid="add-button" onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  ),
}));

jest.mock('@/components/templates/UsersTable/UsersTable', () => ({
  __esModule: true,
  default: ({ users }) => (
    <div data-testid="users-table">
      {users.map((user) => (
        <div key={user.id} data-testid={`user-row-${user.id}`}>
          <span>{user.name}</span>
          <span>{user.email}</span>
        </div>
      ))}
    </div>
  ),
}));

describe('UsersPageClient', () => {
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
      workspaces: ['Americal Eagle', 'Dollar General']
    },
    {
      id: 3,
      name: 'John Elliot',
      email: 'john@agilitee.com',
      userType: 'Member',
      workspaces: ['Americal Eagle']
    }
  ];

  // Mock console.log to avoid test output
  const originalConsoleLog = console.log;
  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it('renders search header and users table', () => {
    render(<UsersPageClient initialUsers={mockUsers} />);

    expect(screen.getByTestId('search-header')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Users')).toBeInTheDocument();
    expect(screen.getByText('Add Users')).toBeInTheDocument();
    expect(screen.getByTestId('users-table')).toBeInTheDocument();
  });

  it('displays all users initially', () => {
    render(<UsersPageClient initialUsers={mockUsers} />);

    expect(screen.getByTestId('user-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('user-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('user-row-3')).toBeInTheDocument();
    expect(screen.getByText('Andrew Vonn')).toBeInTheDocument();
    expect(screen.getByText('Jack Nichols')).toBeInTheDocument();
    expect(screen.getByText('John Elliot')).toBeInTheDocument();
  });

  it('filters users based on search input (name)', async () => {
    const user = userEvent.setup();
    render(<UsersPageClient initialUsers={mockUsers} />);

    const searchInput = screen.getByTestId('search-input');
    
    // Search for "Jack"
    await user.type(searchInput, 'Jack');

    // Should only show Jack Nichols
    expect(screen.getByTestId('user-row-2')).toBeInTheDocument();
    expect(screen.queryByTestId('user-row-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-row-3')).not.toBeInTheDocument();
  });

  it('filters users based on search input (email)', async () => {
    const user = userEvent.setup();
    render(<UsersPageClient initialUsers={mockUsers} />);

    const searchInput = screen.getByTestId('search-input');
    
    // Search for "john@"
    await user.type(searchInput, 'john@');

    // Should only show John Elliot
    expect(screen.getByTestId('user-row-3')).toBeInTheDocument();
    expect(screen.queryByTestId('user-row-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-row-2')).not.toBeInTheDocument();
  });

  it('shows all users when search is cleared', async () => {
    const user = userEvent.setup();
    render(<UsersPageClient initialUsers={mockUsers} />);

    const searchInput = screen.getByTestId('search-input');
    
    // Type and then clear
    await user.type(searchInput, 'Jack');
    await user.clear(searchInput);

    // Should show all users again
    expect(screen.getByTestId('user-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('user-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('user-row-3')).toBeInTheDocument();
  });

  it('handles case-insensitive search', async () => {
    const user = userEvent.setup();
    render(<UsersPageClient initialUsers={mockUsers} />);

    const searchInput = screen.getByTestId('search-input');
    
    // Search for "JACK" in uppercase
    await user.type(searchInput, 'JACK');

    // Should still find Jack Nichols
    expect(screen.getByTestId('user-row-2')).toBeInTheDocument();
    expect(screen.queryByTestId('user-row-1')).not.toBeInTheDocument();
  });

  it('shows no users when search has no matches', async () => {
    const user = userEvent.setup();
    render(<UsersPageClient initialUsers={mockUsers} />);

    const searchInput = screen.getByTestId('search-input');
    
    // Search for something that doesn't exist
    await user.type(searchInput, 'nonexistent');

    // Should show no users
    expect(screen.queryByTestId('user-row-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-row-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-row-3')).not.toBeInTheDocument();
  });

  it('handles add users button click', () => {
    render(<UsersPageClient initialUsers={mockUsers} />);

    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);

    // Should log TODO message
    expect(console.log).toHaveBeenCalledWith('TODO: Open Add User Modal');
  });

  it('handles empty initial users', () => {
    render(<UsersPageClient initialUsers={[]} />);

    expect(screen.getByTestId('users-table')).toBeInTheDocument();
    expect(screen.queryByTestId('user-row-1')).not.toBeInTheDocument();
  });
});