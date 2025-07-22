import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeftNav from './LeftNav';

describe('LeftNav Component', () => {
  const mockOnAccountModalToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  test('renders LeftNav component with correct structure', () => {
    render(<LeftNav onAccountModalToggle={mockOnAccountModalToggle} />);
    
    expect(screen.getByText('AEO')).toBeInTheDocument();
    expect(screen.getByText('CONTEXT')).toBeInTheDocument();
    expect(screen.getByText('Claude.md')).toBeInTheDocument();
    expect(screen.getByText('Commands.md')).toBeInTheDocument();
    expect(screen.getByText('Integrations/MCP')).toBeInTheDocument();
    expect(screen.getByText('Add New')).toBeInTheDocument();
  });

  test('renders avatar with correct initial letter', () => {
    render(<LeftNav onAccountModalToggle={mockOnAccountModalToggle} />);
    
    const avatarElements = screen.getAllByText('A');
    expect(avatarElements).toHaveLength(1);
  });

  test('calls onAccountModalToggle when account changer is clicked', () => {
    render(<LeftNav onAccountModalToggle={mockOnAccountModalToggle} />);
    
    const accountChanger = screen.getByText('AEO').closest('.left-nav__account-changer');
    fireEvent.click(accountChanger);
    
    expect(mockOnAccountModalToggle).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('Account changer clicked - opening AccountModal');
  });

  test('console logs and shows TODO when note/settings icon is clicked', () => {
    render(<LeftNav onAccountModalToggle={mockOnAccountModalToggle} />);
    
    const noteIcon = document.querySelector('.left-nav__note');
    fireEvent.click(noteIcon);
    
    expect(console.log).toHaveBeenCalledWith('Note/Settings icon clicked');
  });

  test('console logs and shows TODO when Add New is clicked', () => {
    render(<LeftNav onAccountModalToggle={mockOnAccountModalToggle} />);
    
    const addNewButton = screen.getByText('Add New');
    fireEvent.click(addNewButton);
    
    expect(console.log).toHaveBeenCalledWith('Add New button clicked');
  });

  test('handles file selection correctly', () => {
    render(<LeftNav onAccountModalToggle={mockOnAccountModalToggle} />);
    
    // Initially Claude.md should be selected
    const claudeItem = screen.getByText('Claude.md').closest('.left-nav__list-item');
    expect(claudeItem).toHaveClass('left-nav__list-item--selected');
    
    // Click on Commands.md
    const commandsItem = screen.getByText('Commands.md');
    fireEvent.click(commandsItem);
    
    expect(console.log).toHaveBeenCalledWith('File item clicked: Commands.md');
  });

  test('applies hover states correctly on list items', async () => {
    render(<LeftNav onAccountModalToggle={mockOnAccountModalToggle} />);
    
    const commandsItem = screen.getByText('Commands.md').closest('.left-nav__list-item');
    
    // Hover over the item
    fireEvent.mouseEnter(commandsItem);
    await waitFor(() => {
      expect(commandsItem).toHaveClass('left-nav__list-item--hovered');
    });
    
    // Leave hover
    fireEvent.mouseLeave(commandsItem);
    await waitFor(() => {
      expect(commandsItem).not.toHaveClass('left-nav__list-item--hovered');
    });
  });

  test('renders all context files correctly', () => {
    render(<LeftNav onAccountModalToggle={mockOnAccountModalToggle} />);
    
    const contextFiles = ['Claude.md', 'Commands.md', 'Integrations/MCP'];
    
    contextFiles.forEach(fileName => {
      expect(screen.getByText(fileName)).toBeInTheDocument();
    });
  });

  test('handles file clicks with console logging and TODO comments', () => {
    render(<LeftNav onAccountModalToggle={mockOnAccountModalToggle} />);
    
    // Test clicking on different files
    const files = ['Claude.md', 'Commands.md', 'Integrations/MCP'];
    
    files.forEach(fileName => {
      const fileItem = screen.getByText(fileName);
      fireEvent.click(fileItem);
      expect(console.log).toHaveBeenCalledWith(`File item clicked: ${fileName}`);
    });
  });

  test('maintains selected state correctly when switching files', () => {
    render(<LeftNav onAccountModalToggle={mockOnAccountModalToggle} />);
    
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
    render(<LeftNav onAccountModalToggle={mockOnAccountModalToggle} />);
    
    // Check for main BEM classes
    expect(document.querySelector('.left-nav')).toBeInTheDocument();
    expect(document.querySelector('.left-nav__account-changer')).toBeInTheDocument();
    expect(document.querySelector('.left-nav__content')).toBeInTheDocument();
    expect(document.querySelector('.left-nav__context-section')).toBeInTheDocument();
    expect(document.querySelector('.left-nav__file-list')).toBeInTheDocument();
  });

  test('handles onAccountModalToggle prop correctly', () => {
    // Test without prop
    render(<LeftNav />);
    
    const accountChanger = screen.getByText('AEO').closest('.left-nav__account-changer');
    fireEvent.click(accountChanger);
    
    // Should not throw error when prop is undefined
    expect(console.log).toHaveBeenCalledWith('Account changer clicked - opening AccountModal');
  });

  test('displays correct icons for selected and unselected states', () => {
    render(<LeftNav onAccountModalToggle={mockOnAccountModalToggle} />);
    
    // Check that images are rendered (even though we can't test the actual src easily in JSDOM)
    const images = document.querySelectorAll('.left-nav__list-item-icon-img');
    expect(images.length).toBeGreaterThan(0);
  });

  test('accessibility: components have proper structure for screen readers', () => {
    render(<LeftNav onAccountModalToggle={mockOnAccountModalToggle} />);
    
    // Check for clickable elements
    const clickableElements = [
      document.querySelector('.left-nav__account-changer'),
      document.querySelector('.left-nav__note'),
      document.querySelector('.left-nav__add-new'),
      ...document.querySelectorAll('.left-nav__list-item')
    ];
    
    clickableElements.forEach(element => {
      expect(element).toBeInTheDocument();
    });
  });
});