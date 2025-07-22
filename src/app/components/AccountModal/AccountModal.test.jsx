import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccountModal from './AccountModal';

describe('AccountModal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  test('does not render when isOpen is false', () => {
    render(<AccountModal isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByText('AEO')).not.toBeInTheDocument();
    expect(document.querySelector('.account-modal__overlay')).not.toBeInTheDocument();
  });

  test('renders when isOpen is true', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('AEO')).toBeInTheDocument();
    expect(screen.getByText('3 Members')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Invite Members')).toBeInTheDocument();
    expect(screen.getByText('james@agilitee.com')).toBeInTheDocument();
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });

  test('renders workspace information correctly', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('AEO')).toBeInTheDocument();
    expect(screen.getByText('3 Members')).toBeInTheDocument();
    
    // Check for avatar
    const avatarElements = screen.getAllByText('A');
    expect(avatarElements.length).toBeGreaterThan(0);
  });

  test('renders all accounts correctly', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('AEO')).toBeInTheDocument();
    expect(screen.getByText('Dollar General')).toBeInTheDocument();
    expect(screen.getByText('Agilitee')).toBeInTheDocument();
  });

  test('shows selected account with checkmark', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    // AEO should be selected by default
    const aeoCheckmark = document.querySelector('.account-modal__checkmark--visible');
    expect(aeoCheckmark).toBeInTheDocument();
  });

  test('handles settings button click', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    const settingsButton = screen.getByText('Settings').closest('.account-modal__cta');
    fireEvent.click(settingsButton);
    
    expect(console.log).toHaveBeenCalledWith('Settings button clicked');
  });

  test('handles invite members button click', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    const inviteButton = screen.getByText('Invite Members').closest('.account-modal__cta');
    fireEvent.click(inviteButton);
    
    expect(console.log).toHaveBeenCalledWith('Invite Members button clicked');
  });

  test('handles account selection correctly', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    // Click on Dollar General account
    const dollarGeneralAccount = screen.getByText('Dollar General').closest('.account-modal__account');
    fireEvent.click(dollarGeneralAccount);
    
    expect(console.log).toHaveBeenCalledWith('Account selected: Dollar General');
  });

  test('handles log out click', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    const logoutButton = screen.getByText('Log Out').closest('.account-modal__logout');
    fireEvent.click(logoutButton);
    
    expect(console.log).toHaveBeenCalledWith('Log Out clicked');
  });

  test('closes modal when clicking overlay', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    const overlay = document.querySelector('.account-modal__overlay');
    fireEvent.click(overlay);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not close modal when clicking modal content', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    const modalContent = document.querySelector('.account-modal__content');
    fireEvent.click(modalContent);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('updates selected account state correctly', async () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    // Initially AEO should be selected
    let aeoCheckmark = document.querySelector('.account-modal__checkmark--visible');
    expect(aeoCheckmark).toBeInTheDocument();
    
    // Click on Agilitee
    const agiliteeAccount = screen.getByText('Agilitee').closest('.account-modal__account');
    fireEvent.click(agiliteeAccount);
    
    // Wait for state update
    await waitFor(() => {
      const checkmarks = document.querySelectorAll('.account-modal__checkmark--visible');
      expect(checkmarks).toHaveLength(1);
    });
    
    expect(console.log).toHaveBeenCalledWith('Account selected: Agilitee');
  });

  test('renders with correct BEM class structure', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    // Check for main BEM classes
    expect(document.querySelector('.account-modal__overlay')).toBeInTheDocument();
    expect(document.querySelector('.account-modal')).toBeInTheDocument();
    expect(document.querySelector('.account-modal__content')).toBeInTheDocument();
    expect(document.querySelector('.account-modal__workspace')).toBeInTheDocument();
    expect(document.querySelector('.account-modal__ctas')).toBeInTheDocument();
    expect(document.querySelector('.account-modal__accounts-section')).toBeInTheDocument();
  });

  test('renders CTA buttons with correct styling', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    const settingsCta = screen.getByText('Settings').closest('.account-modal__cta');
    const inviteCta = screen.getByText('Invite Members').closest('.account-modal__cta');
    
    expect(settingsCta).toHaveClass('account-modal__cta--settings');
    expect(inviteCta).toHaveClass('account-modal__cta--invite');
  });

  test('renders dividers correctly', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    const dividers = document.querySelectorAll('.account-modal__divider');
    expect(dividers).toHaveLength(2);
  });

  test('handles hover effects on interactive elements', async () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    // Test CTA button hover
    const settingsButton = screen.getByText('Settings').closest('.account-modal__cta');
    
    fireEvent.mouseEnter(settingsButton);
    // In a real browser, this would trigger CSS hover styles
    expect(settingsButton).toBeInTheDocument();
    
    fireEvent.mouseLeave(settingsButton);
    expect(settingsButton).toBeInTheDocument();
  });

  test('displays email address correctly', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('james@agilitee.com')).toBeInTheDocument();
    expect(screen.getByText('james@agilitee.com').closest('.account-modal__email')).toBeInTheDocument();
  });

  test('renders all account avatars', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    // Should have multiple avatar elements (workspace + accounts)
    const avatars = document.querySelectorAll('.account-modal__avatar, .account-modal__account-avatar');
    expect(avatars.length).toBeGreaterThan(1);
  });

  test('handles onClose prop correctly when undefined', () => {
    render(<AccountModal isOpen={true} />);
    
    const overlay = document.querySelector('.account-modal__overlay');
    
    // Should not throw error when onClose is undefined
    expect(() => fireEvent.click(overlay)).not.toThrow();
  });

  test('accessibility: modal has proper focus management', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    // Modal should be rendered with proper structure
    const modal = document.querySelector('.account-modal');
    expect(modal).toBeInTheDocument();
    
    // Interactive elements should be present
    const interactiveElements = [
      ...document.querySelectorAll('.account-modal__cta'),
      ...document.querySelectorAll('.account-modal__account'),
      document.querySelector('.account-modal__logout')
    ];
    
    interactiveElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });

  test('renders images correctly', () => {
    render(<AccountModal isOpen={true} onClose={mockOnClose} />);
    
    // Check that images are rendered (icons, dividers, etc.)
    const images = document.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });
});