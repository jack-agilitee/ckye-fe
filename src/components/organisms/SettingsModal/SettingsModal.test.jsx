import { render, screen, fireEvent } from '@testing-library/react';
import SettingsModal from './SettingsModal';

const mockWorkspaces = [
  { id: '1', name: 'AEO', memberCount: 3 },
  { id: '2', name: 'Dollar General', memberCount: 5 },
  { id: '3', name: 'Agilitee', memberCount: 10 }
];

describe('SettingsModal', () => {
  const mockOnDismiss = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  it('renders with default props', () => {
    render(<SettingsModal onDismiss={mockOnDismiss} />);
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('0 Members')).toBeInTheDocument();
  });

  it('renders with workspaces', () => {
    render(
      <SettingsModal 
        workspaces={mockWorkspaces}
        currentWorkspaceId="1"
        onDismiss={mockOnDismiss}
      />
    );
    
    expect(screen.getByText('AEO')).toBeInTheDocument();
    expect(screen.getByText('3 Members')).toBeInTheDocument();
    // Email is now fetched from session, not passed as prop
  });

  it('renders all workspace items', () => {
    render(
      <SettingsModal 
        workspaces={mockWorkspaces}
        currentWorkspaceId="1"
        onDismiss={mockOnDismiss}
      />
    );
    
    expect(screen.getByText('Dollar General')).toBeInTheDocument();
    expect(screen.getByText('Agilitee')).toBeInTheDocument();
  });

  it('handles settings button click', () => {
    render(
      <SettingsModal 
        workspaces={mockWorkspaces}
        onDismiss={mockOnDismiss}
      />
    );
    
    const settingsButton = screen.getByText('Settings');
    fireEvent.click(settingsButton);
    
    expect(console.log).toHaveBeenCalledWith('settings');
  });

  it('handles invite members button click', () => {
    render(
      <SettingsModal 
        workspaces={mockWorkspaces}
        onDismiss={mockOnDismiss}
      />
    );
    
    const inviteButton = screen.getByText('Invite Members');
    fireEvent.click(inviteButton);
    
    expect(console.log).toHaveBeenCalledWith('invite members');
  });

  it('handles workspace selection', () => {
    render(
      <SettingsModal 
        workspaces={mockWorkspaces}
        currentWorkspaceId="1"
        onDismiss={mockOnDismiss}
      />
    );
    
    const dollarGeneralWorkspace = screen.getByText('Dollar General');
    fireEvent.click(dollarGeneralWorkspace);
    
    expect(console.log).toHaveBeenCalledWith('workspace selected:', mockWorkspaces[1]);
  });

  it('shows checkmark for selected workspace', () => {
    const { rerender } = render(
      <SettingsModal 
        workspaces={mockWorkspaces}
        currentWorkspaceId="1"
        onDismiss={mockOnDismiss}
      />
    );
    
    // Check initial state
    const checkmarks = screen.getAllByAltText('');
    expect(checkmarks.length).toBeGreaterThan(0);
    
    // Click on different workspace
    const dollarGeneralWorkspace = screen.getByText('Dollar General');
    fireEvent.click(dollarGeneralWorkspace);
    
    // Should update selected state
    rerender(
      <SettingsModal 
        workspaces={mockWorkspaces}
        currentWorkspaceId="2"
        onDismiss={mockOnDismiss}
      />
    );
  });

  it('handles logout button click', () => {
    render(
      <SettingsModal 
        workspaces={mockWorkspaces}
        onDismiss={mockOnDismiss}
      />
    );
    
    const logoutButton = screen.getByText('Log Out');
    fireEvent.click(logoutButton);
    
    expect(console.log).toHaveBeenCalledWith('log out');
  });

  it('calls onDismiss when clicking outside', () => {
    const { container } = render(
      <div>
        <div data-testid="outside">Outside</div>
        <SettingsModal 
          workspaces={mockWorkspaces}
          onDismiss={mockOnDismiss}
        />
      </div>
    );
    
    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);
    
    expect(mockOnDismiss).toHaveBeenCalled();
  });

  it('calls onDismiss when pressing Escape', () => {
    render(
      <SettingsModal 
        workspaces={mockWorkspaces}
        onDismiss={mockOnDismiss}
      />
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnDismiss).toHaveBeenCalled();
  });

  it('does not call onDismiss when clicking inside modal', () => {
    render(
      <SettingsModal 
        workspaces={mockWorkspaces}
        onDismiss={mockOnDismiss}
      />
    );
    
    const modal = screen.getByText('Settings').closest('.settings-modal');
    fireEvent.mouseDown(modal);
    
    expect(mockOnDismiss).not.toHaveBeenCalled();
  });

  it('handles missing onDismiss gracefully', () => {
    render(
      <SettingsModal 
        workspaces={mockWorkspaces}
      />
    );
    
    // Should not throw error
    fireEvent.keyDown(document, { key: 'Escape' });
  });
});