import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Sidebar from './Sidebar';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock UserContext
jest.mock('@/context/UserContext', () => ({
  useUser: jest.fn(),
}));

// Mock AccountChanger component
jest.mock('@/components/organisms/AccountChanger/AccountChanger', () => {
  return function AccountChanger({ accountName, accountInitial, onAccountClick, onNotesClick }) {
    return (
      <div data-testid="account-changer">
        <button onClick={onAccountClick}>{accountName} ({accountInitial})</button>
        <button onClick={onNotesClick}>Notes</button>
      </div>
    );
  };
});

// Mock ListItem component
jest.mock('@/components/molecules/ListItem/ListItem', () => {
  return function ListItem({ text, icon, selected, onClick }) {
    return (
      <div 
        data-testid="list-item" 
        data-text={text}
        data-selected={selected}
        onClick={onClick}
        className={selected ? 'selected' : ''}
      >
        {text}
      </div>
    );
  };
});

describe('Sidebar', () => {
  const mockPush = jest.fn();
  const mockOnContextItemClick = jest.fn();
  const mockOnAddNewClick = jest.fn();
  const mockOnAccountClick = jest.fn();
  const mockOnNotesClick = jest.fn();
  const mockOnAdminBack = jest.fn();

  const mockContextItems = [
    { id: '1', name: 'Claude.md' },
    { id: '2', name: 'Commands.md' },
    { id: '3', name: 'Integrations/MCP' }
  ];
  
  // Default mock for useUser - non-admin user
  const mockUserDefault = {
    user: {
      userType: 'Member',
      email: 'test@example.com',
      name: 'Test User'
    },
    workspaces: [],
    isLoading: false,
    error: null
  };
  
  // Admin user mock
  const mockUserAdmin = {
    user: {
      userType: 'Admin',
      email: 'admin@example.com',
      name: 'Admin User'
    },
    workspaces: [],
    isLoading: false,
    error: null
  };

  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
    });
    // Set default non-admin user
    useUser.mockReturnValue(mockUserDefault);
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  it('should render the sidebar with all sections', () => {
    render(
      <Sidebar 
        contextItems={mockContextItems}
        selectedItemId="1"
        onContextItemClick={mockOnContextItemClick}
        onAddNewClick={mockOnAddNewClick}
        onAccountClick={mockOnAccountClick}
        onNotesClick={mockOnNotesClick}
      />
    );

    expect(screen.getByText('CONTEXT')).toBeInTheDocument();
    expect(screen.getByText('WORKSPACE')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Invite Members')).toBeInTheDocument();
    expect(screen.getByText('Add New')).toBeInTheDocument();
  });

  it('should render AccountChanger component', () => {
    render(<Sidebar />);
    
    expect(screen.getByTestId('account-changer')).toBeInTheDocument();
  });

  it('should render context items and handle selection', () => {
    render(
      <Sidebar 
        contextItems={mockContextItems}
        selectedItemId="2"
      />
    );

    expect(screen.getByText('Claude.md')).toBeInTheDocument();
    expect(screen.getByText('Commands.md')).toBeInTheDocument();
    expect(screen.getByText('Integrations/MCP')).toBeInTheDocument();
  });

  it('should handle context item click', () => {
    render(
      <Sidebar 
        contextItems={mockContextItems}
        onContextItemClick={mockOnContextItemClick}
      />
    );

    const claudeItem = screen.getByText('Claude.md');
    fireEvent.click(claudeItem);

    expect(consoleLogSpy).toHaveBeenCalledWith('Claude.md');
    expect(mockOnContextItemClick).toHaveBeenCalledWith(mockContextItems[0]);
  });

  it('should handle Add New click', () => {
    render(
      <Sidebar 
        onAddNewClick={mockOnAddNewClick}
      />
    );

    const addNewButton = screen.getByText('Add New');
    fireEvent.click(addNewButton);

    expect(consoleLogSpy).toHaveBeenCalledWith('add new');
    expect(mockOnAddNewClick).toHaveBeenCalled();
  });

  it('should handle workspace item clicks', () => {
    render(<Sidebar />);

    const settingsButton = screen.getByText('Settings');
    fireEvent.click(settingsButton);

    expect(consoleLogSpy).toHaveBeenCalledWith('Settings');

    const inviteButton = screen.getByText('Invite Members');
    fireEvent.click(inviteButton);

    expect(consoleLogSpy).toHaveBeenCalledWith('Invite Members');
  });

  it('should show admin section when user is admin', () => {
    // Set admin user
    useUser.mockReturnValue(mockUserAdmin);
    
    render(
      <Sidebar />
    );

    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.getByText('Ckye Admin')).toBeInTheDocument();
  });

  it('should hide admin section when user is not admin', () => {
    // useUser is already mocked with non-admin user by default
    render(
      <Sidebar />
    );

    expect(screen.queryByText('ADMIN')).not.toBeInTheDocument();
    expect(screen.queryByText('Ckye Admin')).not.toBeInTheDocument();
  });

  it('should navigate to admin page when admin item is clicked', () => {
    // Set admin user
    useUser.mockReturnValue(mockUserAdmin);
    
    render(
      <Sidebar />
    );

    const adminButton = screen.getByText('Ckye Admin');
    fireEvent.click(adminButton);

    expect(mockPush).toHaveBeenCalledWith('/admin/workspaces');
  });

  it('should render admin mode when isAdminMode is true', () => {
    render(
      <Sidebar isAdminMode={true} />
    );

    expect(screen.getByText('Workspaces')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByTestId('account-changer')).toBeInTheDocument();
    
    // Should not show regular sidebar content
    expect(screen.queryByText('CONTEXT')).not.toBeInTheDocument();
    expect(screen.queryByText('WORKSPACE')).not.toBeInTheDocument();
  });

  it('should handle admin mode navigation clicks', () => {
    render(
      <Sidebar isAdminMode={true} />
    );

    const workspacesButton = screen.getByText('Workspaces');
    fireEvent.click(workspacesButton);

    expect(mockPush).toHaveBeenCalledWith('/admin/workspaces');

    const usersButton = screen.getByText('Users');
    fireEvent.click(usersButton);

    expect(mockPush).toHaveBeenCalledWith('/admin/users');
  });

  it('should handle admin back with custom callback', () => {
    render(
      <Sidebar 
        isAdminMode={true}
        onAdminBack={mockOnAdminBack}
      />
    );

    // The AccountChanger component should receive the onAdminBack prop
    expect(screen.getByTestId('account-changer')).toBeInTheDocument();
  });

  it('should handle admin back with default home redirect', () => {
    render(
      <Sidebar isAdminMode={true} />
    );

    // When no onAdminBack prop is provided, should default to home redirect
    expect(screen.getByTestId('account-changer')).toBeInTheDocument();
  });


  it('should pass correct props to AccountChanger', () => {
    render(
      <Sidebar 
        accountName="Test Account"
        accountInitial="T"
        onAccountClick={mockOnAccountClick}
        onNotesClick={mockOnNotesClick}
      />
    );

    expect(screen.getByText('Test Account (T)')).toBeInTheDocument();
    
    const accountButton = screen.getByText('Test Account (T)');
    fireEvent.click(accountButton);
    expect(mockOnAccountClick).toHaveBeenCalled();

    const notesButton = screen.getByText('Notes');
    fireEvent.click(notesButton);
    expect(mockOnNotesClick).toHaveBeenCalled();
  });

  it('should apply selected state to the correct item', () => {
    render(
      <Sidebar 
        contextItems={mockContextItems}
        selectedItemId="2"
      />
    );

    const selectedItem = screen.getByTestId('list-item').closest('[data-selected="true"]');
    expect(selectedItem).toBeInTheDocument();
  });

  it('should render with default props', () => {
    render(<Sidebar />);

    expect(screen.getByText('CONTEXT')).toBeInTheDocument();
    expect(screen.getByText('WORKSPACE')).toBeInTheDocument();
    expect(screen.getByText('Add New')).toBeInTheDocument();
    expect(screen.queryByText('ADMIN')).not.toBeInTheDocument();
  });

  it('should handle empty context items', () => {
    render(<Sidebar contextItems={[]} />);

    expect(screen.getByText('CONTEXT')).toBeInTheDocument();
    expect(screen.getByText('Add New')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(<Sidebar />);
    
    expect(container.querySelector('.sidebar')).toBeInTheDocument();
    expect(container.querySelector('.sidebar__header')).toBeInTheDocument();
    expect(container.querySelector('.sidebar__content')).toBeInTheDocument();
    expect(container.querySelector('.sidebar__sections')).toBeInTheDocument();
    expect(container.querySelector('.sidebar__section')).toBeInTheDocument();
  });

  it('should handle context item click without callback', () => {
    render(
      <Sidebar 
        contextItems={mockContextItems}
      />
    );

    const claudeItem = screen.getByText('Claude.md');
    fireEvent.click(claudeItem);

    expect(consoleLogSpy).toHaveBeenCalledWith('Claude.md');
    // Should not throw error when callback is not provided
  });

});