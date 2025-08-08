import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import VariantsPage from '../page';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock components
jest.mock('@/components/pages/TwoColumnPage/TwoColumnPage', () => ({
  __esModule: true,
  default: ({ leftContent, rightContent, className }) => (
    <div data-testid="two-column-page" className={className}>
      <div data-testid="left-content">{leftContent}</div>
      <div data-testid="right-content">{rightContent}</div>
    </div>
  ),
}));

jest.mock('@/components/templates/Sidebar/Sidebar', () => ({
  __esModule: true,
  default: ({ accountName, selectedItemId, onContextItemClick }) => (
    <div data-testid="sidebar">
      <span data-testid="account-name">{accountName}</span>
      <span data-testid="selected-item">{selectedItemId}</span>
      <button onClick={() => onContextItemClick({ id: 'test' })}>Click Context Item</button>
    </div>
  ),
}));

jest.mock('@/components/molecules/SearchHeader/SearchHeader', () => ({
  __esModule: true,
  default: ({ title, searchPlaceholder, onSearch, searchValue, onSearchChange, buttonText, onButtonClick }) => (
    <div data-testid="search-header">
      <h1>{title}</h1>
      <input 
        data-testid="search-input"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={onSearchChange}
      />
      <button data-testid="add-button" onClick={onButtonClick}>{buttonText}</button>
    </div>
  ),
}));

jest.mock('@/components/templates/VariantsTable/VariantsTable', () => ({
  __esModule: true,
  default: ({ variants, company }) => (
    <div data-testid="variants-table">
      <span data-testid="company">{company}</span>
      <div data-testid="variants-count">{variants.length} variants</div>
      {variants.map((variant) => (
        <div key={variant.id} data-testid={`variant-${variant.id}`}>
          <span>{variant.name}</span>
          <span>{variant.summary}</span>
        </div>
      ))}
    </div>
  ),
}));

jest.mock('@/context/UserContext', () => ({
  useUser: () => ({
    user: { userType: 'Member' }
  })
}));

describe('VariantsPage', () => {
  const mockPush = jest.fn();
  const mockParams = { company: 'testcompany' };

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    usePathname.mockReturnValue('/variants/testcompany');
    jest.clearAllMocks();
  });

  it('renders the page with correct structure', () => {
    render(<VariantsPage params={mockParams} />);
    
    expect(screen.getByTestId('two-column-page')).toBeInTheDocument();
    expect(screen.getByTestId('left-content')).toBeInTheDocument();
    expect(screen.getByTestId('right-content')).toBeInTheDocument();
  });

  it('renders the sidebar with correct company name', () => {
    render(<VariantsPage params={mockParams} />);
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('account-name')).toHaveTextContent('testcompany');
  });

  it('renders the search header with correct props', () => {
    render(<VariantsPage params={mockParams} />);
    
    expect(screen.getByTestId('search-header')).toBeInTheDocument();
    expect(screen.getByText('Suggested Document Variants')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Suggestions by Name')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toHaveTextContent('Add Variant');
  });

  it('renders the variants table with mock data', () => {
    render(<VariantsPage params={mockParams} />);
    
    expect(screen.getByTestId('variants-table')).toBeInTheDocument();
    expect(screen.getByTestId('company')).toHaveTextContent('testcompany');
    expect(screen.getByTestId('variants-count')).toHaveTextContent('5 variants');
  });

  it('filters variants when searching', () => {
    render(<VariantsPage params={mockParams} />);
    
    const searchInput = screen.getByTestId('search-input');
    
    // Initially shows all 5 variants
    expect(screen.getByTestId('variants-count')).toHaveTextContent('5 variants');
    
    // Search for "Commands"
    fireEvent.change(searchInput, { target: { value: 'Commands' } });
    
    // Should show only 1 variant
    expect(screen.getByTestId('variants-count')).toHaveTextContent('1 variants');
  });

  it('filters by variant summary', () => {
    render(<VariantsPage params={mockParams} />);
    
    const searchInput = screen.getByTestId('search-input');
    
    // Search for "React function"
    fireEvent.change(searchInput, { target: { value: 'React function' } });
    
    // Should show only variants with matching summary
    expect(screen.getByTestId('variants-count')).toHaveTextContent('1 variants');
  });

  it('handles add variant button click', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<VariantsPage params={mockParams} />);
    
    const addButton = screen.getByTestId('add-button');
    fireEvent.click(addButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Add Variant clicked');
    consoleSpy.mockRestore();
  });

  it('handles context item click', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<VariantsPage params={mockParams} />);
    
    const contextButton = screen.getByText('Click Context Item');
    fireEvent.click(contextButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Context item clicked:', { id: 'test' });
    consoleSpy.mockRestore();
  });

  it('shows all variants when search is cleared', () => {
    render(<VariantsPage params={mockParams} />);
    
    const searchInput = screen.getByTestId('search-input');
    
    // Search for something
    fireEvent.change(searchInput, { target: { value: 'Commands' } });
    expect(screen.getByTestId('variants-count')).toHaveTextContent('1 variants');
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByTestId('variants-count')).toHaveTextContent('5 variants');
  });

  it('uses default company name when not provided', () => {
    render(<VariantsPage params={{}} />);
    
    expect(screen.getByTestId('account-name')).toHaveTextContent('Agilitee');
  });

  it('renders correct variant data', () => {
    render(<VariantsPage params={mockParams} />);
    
    // Check that Claude.md variants are rendered
    expect(screen.getByTestId('variant-1')).toBeInTheDocument();
    expect(screen.getByTestId('variant-2')).toBeInTheDocument();
    expect(screen.getByTestId('variant-3')).toBeInTheDocument();
    expect(screen.getByTestId('variant-4')).toBeInTheDocument();
    expect(screen.getByTestId('variant-5')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<VariantsPage params={mockParams} />);
    
    // Check for heading
    const heading = screen.getByText('Suggested Document Variants');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
    
    // Check for search input
    const searchInput = screen.getByPlaceholderText('Search Suggestions by Name');
    expect(searchInput).toBeInTheDocument();
    
    // Check for buttons
    const addButton = screen.getByTestId('add-button');
    expect(addButton).toBeInTheDocument();
  });
});