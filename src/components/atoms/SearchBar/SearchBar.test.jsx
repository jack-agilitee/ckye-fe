import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    placeholder: 'Search Users',
    onSearch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search Users');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar {...defaultProps} placeholder="Search Products" />);
    
    const input = screen.getByPlaceholderText('Search Products');
    expect(input).toBeInTheDocument();
  });

  it('handles value and onChange props', () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <SearchBar 
        {...defaultProps} 
        value="test" 
        onChange={handleChange} 
      />
    );
    
    const input = screen.getByPlaceholderText('Search Users');
    expect(input).toHaveValue('test');

    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch when Enter key is pressed', () => {
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search Users');
    fireEvent.change(input, { target: { value: 'search term' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(defaultProps.onSearch).toHaveBeenCalledWith('search term');
  });

  it('does not call onSearch for other keys', () => {
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search Users');
    fireEvent.change(input, { target: { value: 'search term' } });
    fireEvent.keyDown(input, { key: 'Tab' });
    
    expect(defaultProps.onSearch).not.toHaveBeenCalled();
  });

  it('applies focus styles when focused', async () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchBar = screen.getByRole('search');
    const input = screen.getByPlaceholderText('Search Users');
    
    expect(searchBar).not.toHaveClass('search-bar--focused');
    
    fireEvent.focus(input);
    await waitFor(() => {
      expect(searchBar.className).toMatch(/search-bar--focused/);
    });
    
    fireEvent.blur(input);
    await waitFor(() => {
      expect(searchBar.className).not.toMatch(/search-bar--focused/);
    });
  });

  it('focuses input when container is clicked', () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchBar = screen.getByRole('search');
    const input = screen.getByPlaceholderText('Search Users');
    
    fireEvent.click(searchBar);
    expect(document.activeElement).toBe(input);
  });

  it('renders with custom className', () => {
    render(<SearchBar {...defaultProps} className="custom-class" />);
    
    const searchBar = screen.getByRole('search');
    expect(searchBar).toHaveClass('custom-class');
  });

  it('respects disabled prop', () => {
    render(<SearchBar {...defaultProps} disabled={true} />);
    
    const input = screen.getByPlaceholderText('Search Users');
    expect(input).toBeDisabled();
  });

  it('uses custom aria-label', () => {
    render(<SearchBar {...defaultProps} ariaLabel="Search products" />);
    
    const input = screen.getByLabelText('Search products');
    expect(input).toBeInTheDocument();
  });

  it('renders with id and name attributes', () => {
    render(
      <SearchBar 
        {...defaultProps} 
        id="search-input" 
        name="search" 
      />
    );
    
    const input = screen.getByPlaceholderText('Search Users');
    expect(input).toHaveAttribute('id', 'search-input');
    expect(input).toHaveAttribute('name', 'search');
  });

  it('renders search icon', () => {
    render(<SearchBar {...defaultProps} />);
    
    const svg = screen.getByRole('search').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('handles undefined onSearch gracefully', () => {
    render(<SearchBar placeholder="Search Users" />);
    
    const input = screen.getByPlaceholderText('Search Users');
    
    // Should not throw error
    expect(() => {
      fireEvent.keyDown(input, { key: 'Enter' });
    }).not.toThrow();
  });

  it('handles undefined onChange gracefully', () => {
    render(<SearchBar {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Search Users');
    
    // Should not throw error
    expect(() => {
      fireEvent.change(input, { target: { value: 'test' } });
    }).not.toThrow();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);
    
    await user.tab();
    const input = screen.getByPlaceholderText('Search Users');
    expect(document.activeElement).toBe(input);
  });
});