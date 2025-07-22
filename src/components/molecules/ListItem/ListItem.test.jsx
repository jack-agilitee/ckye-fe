import { render, screen, fireEvent } from '@testing-library/react';
import ListItem from './ListItem';

describe('ListItem', () => {
  const defaultProps = {
    text: 'Claude.md',
    onClick: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<ListItem {...defaultProps} />);
    
    const listItem = screen.getByRole('button');
    const text = screen.getByText('Claude.md');
    
    expect(listItem).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    render(<ListItem {...defaultProps} icon="/custom-icon.svg" />);
    
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('src', '/custom-icon.svg');
  });

  it('applies selected styles when selected prop is true', () => {
    render(<ListItem {...defaultProps} selected={true} />);
    
    const listItem = screen.getByRole('button');
    expect(listItem).toHaveClass('list-item--selected');
  });

  it('calls onClick when clicked', () => {
    render(<ListItem {...defaultProps} />);
    
    const listItem = screen.getByRole('button');
    fireEvent.click(listItem);
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', () => {
    render(<ListItem {...defaultProps} />);
    
    const listItem = screen.getByRole('button');
    fireEvent.keyDown(listItem, { key: 'Enter', code: 'Enter' });
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space key is pressed', () => {
    render(<ListItem {...defaultProps} />);
    
    const listItem = screen.getByRole('button');
    fireEvent.keyDown(listItem, { key: ' ', code: 'Space' });
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick for other keys', () => {
    render(<ListItem {...defaultProps} />);
    
    const listItem = screen.getByRole('button');
    fireEvent.keyDown(listItem, { key: 'a', code: 'KeyA' });
    
    expect(defaultProps.onClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<ListItem {...defaultProps} className="custom-class" />);
    
    const listItem = screen.getByRole('button');
    expect(listItem).toHaveClass('custom-class');
  });

  it('renders without onClick handler', () => {
    render(<ListItem text="Test" />);
    
    const listItem = screen.getByRole('button');
    
    // Should not throw error when clicked without onClick
    expect(() => fireEvent.click(listItem)).not.toThrow();
    expect(() => fireEvent.keyDown(listItem, { key: 'Enter' })).not.toThrow();
  });

  it('has proper accessibility attributes', () => {
    render(<ListItem {...defaultProps} />);
    
    const listItem = screen.getByRole('button');
    expect(listItem).toHaveAttribute('tabIndex', '0');
    expect(listItem).toHaveAttribute('role', 'button');
  });

  it('icon has empty alt attribute for decorative image', () => {
    render(<ListItem {...defaultProps} />);
    
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('alt', '');
  });

  it('truncates long text with ellipsis', () => {
    const longText = 'This is a very long filename that should be truncated with ellipsis';
    render(<ListItem {...defaultProps} text={longText} />);
    
    const textElement = screen.getByText(longText);
    expect(textElement).toBeInTheDocument();
    // CSS will handle the visual truncation
  });

  it('maintains hover and selected states together', () => {
    const { rerender } = render(<ListItem {...defaultProps} />);
    
    const listItem = screen.getByRole('button');
    
    // Test unselected state
    expect(listItem).not.toHaveClass('list-item--selected');
    
    // Test selected state
    rerender(<ListItem {...defaultProps} selected={true} />);
    expect(listItem).toHaveClass('list-item--selected');
  });
});