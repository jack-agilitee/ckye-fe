import { render, screen, fireEvent } from '@testing-library/react';
import SearchHeader from './SearchHeader';

describe('SearchHeader', () => {
  const defaultProps = {
    title: 'Users',
    searchPlaceholder: 'Search Users',
    buttonText: 'Add Users'
  };

  it('renders without crashing', () => {
    render(<SearchHeader />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<SearchHeader title="Products" />);
    expect(screen.getByText('Products')).toBeInTheDocument();
  });

  it('renders search bar with correct placeholder', () => {
    render(<SearchHeader searchPlaceholder="Find items..." />);
    expect(screen.getByPlaceholderText('Find items...')).toBeInTheDocument();
  });

  it('renders button with custom text', () => {
    render(<SearchHeader buttonText="Create New" />);
    expect(screen.getByText('Create New')).toBeInTheDocument();
  });

  it('calls onSearch when search is triggered', () => {
    const mockOnSearch = jest.fn();
    render(<SearchHeader onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText('Search Users');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  it('calls onButtonClick when button is clicked', () => {
    const mockOnButtonClick = jest.fn();
    render(<SearchHeader onButtonClick={mockOnButtonClick} />);
    
    const button = screen.getByText('Add Users');
    fireEvent.click(button);
    
    expect(mockOnButtonClick).toHaveBeenCalledTimes(1);
  });

  it('handles controlled search input', () => {
    const mockOnSearchChange = jest.fn();
    render(
      <SearchHeader 
        searchValue="initial value"
        onSearchChange={mockOnSearchChange}
      />
    );
    
    const searchInput = screen.getByDisplayValue('initial value');
    fireEvent.change(searchInput, { target: { value: 'new value' } });
    
    expect(mockOnSearchChange).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(<SearchHeader className="custom-class" />);
    const searchHeader = container.firstChild;
    
    expect(searchHeader).toHaveClass('search-header');
    expect(searchHeader).toHaveClass('custom-class');
  });

  it('renders all subcomponents correctly', () => {
    render(<SearchHeader {...defaultProps} />);
    
    // Check title
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Users');
    
    // Check search bar
    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Users')).toBeInTheDocument();
    
    // Check button
    const button = screen.getByRole('button', { name: /add users/i });
    expect(button).toBeInTheDocument();
  });

  it('maintains proper layout structure', () => {
    const { container } = render(<SearchHeader {...defaultProps} />);
    
    const searchHeader = container.querySelector('.search-header');
    const title = container.querySelector('.search-header__title');
    const controls = container.querySelector('.search-header__controls');
    const search = container.querySelector('.search-header__search');
    const button = container.querySelector('.search-header__button');
    
    expect(searchHeader).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(controls).toBeInTheDocument();
    expect(search).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('button includes the people-add icon', () => {
    render(<SearchHeader />);
    
    // The Button component renders an Image with the icon
    const button = screen.getByRole('button', { name: /add users/i });
    expect(button).toBeInTheDocument();
    
    // Check that button has an image (icon)
    const icon = button.querySelector('img');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src');
  });
});