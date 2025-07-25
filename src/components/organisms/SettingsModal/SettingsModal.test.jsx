import { render, screen, fireEvent } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import SettingsModal from './SettingsModal';
import { useUser } from '@/context/UserContext';

// Mock the dependencies
jest.mock('next-auth/react');
jest.mock('next/navigation');
jest.mock('@/context/UserContext');

const mockWorkspaces = [
  { id: '1', name: 'AEO', shortName: 'aeo', userCount: 3 },
  { id: '2', name: 'Dollar General', shortName: 'dg', userCount: 5 },
  { id: '3', name: 'Agilitee', shortName: 'agilitee', userCount: 10 }
];

describe('SettingsModal', () => {
  const mockOnDismiss = jest.fn();
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    
    // Setup default mocks
    useSession.mockReturnValue({ data: { user: { email: 'test@example.com' } } });
    useRouter.mockReturnValue({ push: mockPush });
    usePathname.mockReturnValue('/dashboard/aeo');
    useUser.mockReturnValue({ workspaces: mockWorkspaces });
  });

  it('renders with workspace from context', () => {
    render(<SettingsModal onDismiss={mockOnDismiss} />);
    expect(screen.getByText('AEO')).toBeInTheDocument();
    expect(screen.getByText('3 Members')).toBeInTheDocument();
  });

  it('renders with empty workspaces', () => {
    useUser.mockReturnValue({ workspaces: [] });
    render(<SettingsModal onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('0 Members')).toBeInTheDocument();
  });

  it('renders all workspace items from context', () => {
    render(<SettingsModal onDismiss={mockOnDismiss} />);
    
    expect(screen.getByText('AEO')).toBeInTheDocument();
    expect(screen.getByText('Dollar General')).toBeInTheDocument();
    expect(screen.getByText('Agilitee')).toBeInTheDocument();
  });

  it('handles settings button click', () => {
    render(<SettingsModal onDismiss={mockOnDismiss} />);
    
    const settingsButton = screen.getByText('Settings');
    fireEvent.click(settingsButton);
    
    expect(console.log).toHaveBeenCalledWith('settings');
  });

  it('handles invite members button click', () => {
    render(<SettingsModal onDismiss={mockOnDismiss} />);
    
    const inviteButton = screen.getByText('Invite Members');
    fireEvent.click(inviteButton);
    
    expect(console.log).toHaveBeenCalledWith('invite members');
  });

  it('handles workspace selection and navigation', async () => {
    render(<SettingsModal onDismiss={mockOnDismiss} />);
    
    const dollarGeneralWorkspace = screen.getByText('Dollar General');
    fireEvent.click(dollarGeneralWorkspace);
    
    // Should trigger navigation after state update
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mockPush).toHaveBeenCalledWith('/dashboard/dg');
    expect(mockOnDismiss).toHaveBeenCalled();
  });

  it('shows checkmark for current workspace based on pathname', () => {
    usePathname.mockReturnValue('/dashboard/dg');
    render(<SettingsModal onDismiss={mockOnDismiss} />);
    
    // Should show checkmark for Dollar General since pathname is /dashboard/dg
    const checkmarks = screen.getAllByAltText('');
    expect(checkmarks.length).toBeGreaterThan(0);
  });

  it('handles logout button click', () => {
    const mockSignOut = jest.fn();
    jest.mock('next-auth/react', () => ({
      ...jest.requireActual('next-auth/react'),
      signOut: mockSignOut
    }));
    
    render(<SettingsModal onDismiss={mockOnDismiss} />);
    
    const logoutButton = screen.getByText('Log Out');
    fireEvent.click(logoutButton);
    
    // Should call signOut from next-auth
  });

  it('calls onDismiss when clicking outside', () => {
    const { container } = render(
      <div>
        <div data-testid="outside">Outside</div>
        <SettingsModal onDismiss={mockOnDismiss} />
      </div>
    );
    
    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);
    
    expect(mockOnDismiss).toHaveBeenCalled();
  });

  it('calls onDismiss when pressing Escape', () => {
    render(<SettingsModal onDismiss={mockOnDismiss} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnDismiss).toHaveBeenCalled();
  });

  it('does not call onDismiss when clicking inside modal', () => {
    render(<SettingsModal onDismiss={mockOnDismiss} />);
    
    const modal = screen.getByText('Settings').closest('.settings-modal');
    fireEvent.mouseDown(modal);
    
    expect(mockOnDismiss).not.toHaveBeenCalled();
  });

  it('handles missing onDismiss gracefully', () => {
    render(<SettingsModal />);
    
    // Should not throw error
    fireEvent.keyDown(document, { key: 'Escape' });
  });
});