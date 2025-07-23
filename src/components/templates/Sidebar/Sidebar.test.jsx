import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
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

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function Image({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('Sidebar', () => {
  const mockPush = jest.fn();
  const mockOnContextItemClick = jest.fn();
  const mockOnAddNewClick = jest.fn();
  const mockOnWorkspaceItemClick = jest.fn();
  const mockOnAccountClick = jest.fn();
  const mockOnNotesClick = jest.fn();

  const mockContextItems = [
    { id: '1', name: 'Claude.md' },
    { id: '2', name: 'Commands.md' },
    { id: '3', name: 'Integrations/MCP' }
  ];

  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
    });
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
        onWorkspaceItemClick={mockOnWorkspaceItemClick}
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
    render(
      <Sidebar 
        onWorkspaceItemClick={mockOnWorkspaceItemClick}
      />
    );

    const settingsButton = screen.getByText('Settings');
    fireEvent.click(settingsButton);

    expect(consoleLogSpy).toHaveBeenCalledWith('Settings');
    expect(mockOnWorkspaceItemClick).toHaveBeenCalledWith('Settings');

    const inviteButton = screen.getByText('Invite Members');
    fireEvent.click(inviteButton);

    expect(consoleLogSpy).toHaveBeenCalledWith('Invite Members');
    expect(mockOnWorkspaceItemClick).toHaveBeenCalledWith('Invite Members');
  });

  it('should show admin section when isAdmin is true', () => {
    render(
      <Sidebar isAdmin={true} />
    );

    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(screen.getByText('Ckye Admin')).toBeInTheDocument();
  });

  it('should hide admin section when isAdmin is false', () => {
    render(
      <Sidebar isAdmin={false} />
    );

    expect(screen.queryByText('ADMIN')).not.toBeInTheDocument();
    expect(screen.queryByText('Ckye Admin')).not.toBeInTheDocument();
  });

  it('should navigate to admin page when admin item is clicked', () => {
    render(
      <Sidebar isAdmin={true} />
    );

    const adminButton = screen.getByText('Ckye Admin');
    fireEvent.click(adminButton);

    expect(consoleLogSpy).toHaveBeenCalledWith('Ckye Admin');
    expect(mockPush).toHaveBeenCalledWith('/admin/workspace');
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

  it('should apply selected class to the correct item', () => {
    const { container } = render(
      <Sidebar 
        contextItems={mockContextItems}
        selectedItemId="2"
      />
    );

    const selectedItems = container.querySelectorAll('.sidebar__listItem--selected');
    expect(selectedItems).toHaveLength(1);
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

  it('should handle workspace item click without callback', () => {
    render(<Sidebar />);

    const settingsButton = screen.getByText('Settings');
    fireEvent.click(settingsButton);

    expect(consoleLogSpy).toHaveBeenCalledWith('Settings');
    // Should not throw error when callback is not provided
  });
});