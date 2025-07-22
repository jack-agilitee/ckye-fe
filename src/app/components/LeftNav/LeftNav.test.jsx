import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeftNav from './LeftNav';

describe('LeftNav Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  test('renders LeftNav component with correct structure', () => {
    render(<LeftNav />);
    
    expect(screen.getByText('AEO')).toBeInTheDocument();
    expect(screen.getByText('CONTEXT')).toBeInTheDocument();
    expect(screen.getByText('Claude.md')).toBeInTheDocument();
    expect(screen.getByText('Commands.md')).toBeInTheDocument();
    expect(screen.getByText('Integrations/MCP')).toBeInTheDocument();
    expect(screen.getByText('Add New')).toBeInTheDocument();
  });

  test('renders avatar with correct initial letter', () => {
    render(<LeftNav />);
    
    const avatarElements = screen.getAllByText('A');
    expect(avatarElements).toHaveLength(1);
  });

  test('opens AccountModal when account changer is clicked', () => {
    render(<LeftNav />);
    
    // Initially modal should not be visible
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    
    const accountChanger = screen.getByText('AEO').closest('.left-nav__account-changer');
    fireEvent.click(accountChanger);
    
    // Now modal should be visible
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Invite Members')).toBeInTheDocument();
    expect(console.log).toHaveBeenCalledWith('Account changer clicked - opening AccountModal');
  });

  test('console logs and shows TODO when note/settings icon is clicked', () => {
    render(<LeftNav />);
    
    const noteIcon = document.querySelector('.left-nav__note');
    fireEvent.click(noteIcon);
    
    expect(console.log).toHaveBeenCalledWith('Note/Settings icon clicked');
  });

  test('console logs and shows TODO when Add New is clicked', () => {
    render(<LeftNav />);
    
    const addNewButton = screen.getByText('Add New');
    fireEvent.click(addNewButton);
    
    expect(console.log).toHaveBeenCalledWith('Add New button clicked');
  });

  test('handles file selection correctly', () => {
    render(<LeftNav />);
    
    // Initially Claude.md should be selected
    const claudeItem = screen.getByText('Claude.md').closest('.left-nav__list-item');
    expect(claudeItem).toHaveClass('left-nav__list-item--selected');
    
    // Click on Commands.md
    const commandsItem = screen.getByText('Commands.md');
    fireEvent.click(commandsItem);
    
    expect(console.log).toHaveBeenCalledWith('File item clicked: Commands.md');
  });

  test('supports keyboard navigation on list items', async () => {
    render(<LeftNav />);
    
    const commandsItem = screen.getByText('Commands.md').closest('.left-nav__list-item');
    
    // Focus the item
    commandsItem.focus();
    expect(commandsItem).toHaveFocus();
    
    // Press Enter to activate
    fireEvent.keyDown(commandsItem, { key: 'Enter' });
    expect(console.log).toHaveBeenCalledWith('File item clicked: Commands.md');
    
    // Press Space to activate
    fireEvent.keyDown(commandsItem, { key: ' ' });
    expect(console.log).toHaveBeenCalledWith('File item clicked: Commands.md');
  });

  test('renders all context files correctly', () => {
    render(<LeftNav />);
    
    const contextFiles = ['Claude.md', 'Commands.md', 'Integrations/MCP'];
    
    contextFiles.forEach(fileName => {
      expect(screen.getByText(fileName)).toBeInTheDocument();
    });
  });

  test('handles file clicks with console logging and TODO comments', () => {
    render(<LeftNav />);
    
    // Test clicking on different files
    const files = ['Claude.md', 'Commands.md', 'Integrations/MCP'];
    
    files.forEach(fileName => {
      const fileItem = screen.getByText(fileName);
      fireEvent.click(fileItem);
      expect(console.log).toHaveBeenCalledWith(`File item clicked: ${fileName}`);
    });
  });

  test('maintains selected state correctly when switching files', () => {
    render(<LeftNav />);
    
    // Initially Claude.md is selected
    let claudeItem = screen.getByText('Claude.md').closest('.left-nav__list-item');
    expect(claudeItem).toHaveClass('left-nav__list-item--selected');
    
    // Click Commands.md
    const commandsItem = screen.getByText('Commands.md');
    fireEvent.click(commandsItem);
    
    // Re-query elements as they may have been re-rendered
    claudeItem = screen.getByText('Claude.md').closest('.left-nav__list-item');
    const commandsItemContainer = screen.getByText('Commands.md').closest('.left-nav__list-item');
    
    expect(claudeItem).not.toHaveClass('left-nav__list-item--selected');
    expect(commandsItemContainer).toHaveClass('left-nav__list-item--selected');
  });

  test('renders with correct BEM class structure', () => {
    render(<LeftNav />);
    
    // Check for main BEM classes
    expect(document.querySelector('.left-nav')).toBeInTheDocument();
    expect(document.querySelector('.left-nav__account-changer')).toBeInTheDocument();
    expect(document.querySelector('.left-nav__content')).toBeInTheDocument();
    expect(document.querySelector('.left-nav__context-section')).toBeInTheDocument();
    expect(document.querySelector('.left-nav__file-list')).toBeInTheDocument();
  });

  test('closes AccountModal when clicking outside', () => {
    render(<LeftNav />);
    
    // Open modal first
    const accountChanger = screen.getByText('AEO').closest('.left-nav__account-changer');
    fireEvent.click(accountChanger);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    
    // Click outside to close (click overlay)
    const overlay = document.querySelector('.account-modal__overlay');
    fireEvent.click(overlay);
    
    // Modal should be closed
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  test('displays correct icons for selected and unselected states', () => {
    render(<LeftNav />);
    
    // Check that images are rendered (even though we can't test the actual src easily in JSDOM)
    const images = document.querySelectorAll('.left-nav__list-item-icon-img');
    expect(images.length).toBeGreaterThan(0);
  });

  test('accessibility: components have proper keyboard navigation', () => {
    render(<LeftNav />);
    
    // Check for keyboard accessible elements with proper attributes
    const keyboardElements = [
      document.querySelector('.left-nav__account-changer'),
      document.querySelector('.left-nav__note'),
      document.querySelector('.left-nav__add-new'),
      ...document.querySelectorAll('.left-nav__list-item')
    ];
    
    keyboardElements.forEach(element => {
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('tabIndex', '0');
      expect(element).toHaveAttribute('role', 'button');
    });
  });

  test('keyboard navigation works for all interactive elements', () => {
    render(<LeftNav />);
    
    // Test account changer keyboard activation
    const accountChanger = document.querySelector('.left-nav__account-changer');
    fireEvent.keyDown(accountChanger, { key: 'Enter' });
    expect(console.log).toHaveBeenCalledWith('Account changer clicked - opening AccountModal');
    expect(screen.getByText('Settings')).toBeInTheDocument(); // Modal should open
    
    // Test note icon keyboard activation
    const noteIcon = document.querySelector('.left-nav__note');
    fireEvent.keyDown(noteIcon, { key: ' ' });
    expect(console.log).toHaveBeenCalledWith('Note/Settings icon clicked');
    
    // Test add new button keyboard activation
    const addNewButton = document.querySelector('.left-nav__add-new');
    fireEvent.keyDown(addNewButton, { key: 'Enter' });
    expect(console.log).toHaveBeenCalledWith('Add New button clicked');
  });
});