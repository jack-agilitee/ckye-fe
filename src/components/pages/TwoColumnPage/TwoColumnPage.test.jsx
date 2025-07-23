import { render, screen } from '@testing-library/react';
import TwoColumnPage from './TwoColumnPage';

describe('TwoColumnPage Component', () => {
  it('renders without crashing', () => {
    render(<TwoColumnPage />);
    expect(screen.getByText('Left Navigation')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('displays default placeholder content when no props provided', () => {
    render(<TwoColumnPage />);
    
    // Check left placeholder
    expect(screen.getByText('Left Navigation')).toBeInTheDocument();
    expect(screen.getByText('Add your navigation component here')).toBeInTheDocument();
    
    // Check right placeholder
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Add your main content component here')).toBeInTheDocument();
  });

  it('renders custom left content when provided', () => {
    const CustomLeftContent = () => <div data-testid="custom-left">Custom Navigation</div>;
    
    render(<TwoColumnPage leftContent={<CustomLeftContent />} />);
    
    expect(screen.getByTestId('custom-left')).toBeInTheDocument();
    expect(screen.getByText('Custom Navigation')).toBeInTheDocument();
    expect(screen.queryByText('Left Navigation')).not.toBeInTheDocument();
  });

  it('renders custom right content when provided', () => {
    const CustomRightContent = () => <div data-testid="custom-right">Custom Main Content</div>;
    
    render(<TwoColumnPage rightContent={<CustomRightContent />} />);
    
    expect(screen.getByTestId('custom-right')).toBeInTheDocument();
    expect(screen.getByText('Custom Main Content')).toBeInTheDocument();
    expect(screen.queryByText('Main Content')).not.toBeInTheDocument();
  });

  it('renders both custom contents when provided', () => {
    const CustomLeftContent = () => <div data-testid="custom-left">Custom Nav</div>;
    const CustomRightContent = () => <div data-testid="custom-right">Custom Content</div>;
    
    render(
      <TwoColumnPage 
        leftContent={<CustomLeftContent />} 
        rightContent={<CustomRightContent />} 
      />
    );
    
    expect(screen.getByTestId('custom-left')).toBeInTheDocument();
    expect(screen.getByTestId('custom-right')).toBeInTheDocument();
    expect(screen.queryByText('Left Navigation')).not.toBeInTheDocument();
    expect(screen.queryByText('Main Content')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<TwoColumnPage className="custom-class" />);
    const twoColumnPageElement = container.firstChild;
    
    expect(twoColumnPageElement).toHaveClass('custom-class');
  });

  it('has proper semantic structure for accessibility', () => {
    render(<TwoColumnPage />);
    
    // Check that headings are properly structured
    const leftHeading = screen.getByRole('heading', { name: 'Left Navigation' });
    const rightHeading = screen.getByRole('heading', { name: 'Main Content' });
    
    expect(leftHeading).toBeInTheDocument();
    expect(rightHeading).toBeInTheDocument();
    expect(leftHeading.tagName).toBe('H3');
    expect(rightHeading.tagName).toBe('H3');
  });

  it('supports complex nested components', () => {
    const ComplexLeftContent = () => (
      <div data-testid="complex-left">
        <nav>
          <ul>
            <li><a href="/users">Users</a></li>
            <li><a href="/workspaces">Workspaces</a></li>
          </ul>
        </nav>
      </div>
    );
    
    const ComplexRightContent = () => (
      <div data-testid="complex-right">
        <header>
          <h1>Dashboard</h1>
          <button>Add User</button>
        </header>
        <main>
          <p>Dashboard content goes here</p>
        </main>
      </div>
    );
    
    render(
      <TwoColumnPage 
        leftContent={<ComplexLeftContent />} 
        rightContent={<ComplexRightContent />} 
      />
    );
    
    expect(screen.getByTestId('complex-left')).toBeInTheDocument();
    expect(screen.getByTestId('complex-right')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Add User')).toBeInTheDocument();
  });

  it('maintains layout structure with different content sizes', () => {
    const SmallLeftContent = () => <div data-testid="small-left">Nav</div>;
    const LargeRightContent = () => (
      <div data-testid="large-right">
        {Array.from({ length: 100 }, (_, i) => (
          <p key={i}>This is line {i + 1} of content</p>
        ))}
      </div>
    );
    
    render(
      <TwoColumnPage 
        leftContent={<SmallLeftContent />} 
        rightContent={<LargeRightContent />} 
      />
    );
    
    expect(screen.getByTestId('small-left')).toBeInTheDocument();
    expect(screen.getByTestId('large-right')).toBeInTheDocument();
    expect(screen.getByText('This is line 1 of content')).toBeInTheDocument();
    expect(screen.getByText('This is line 100 of content')).toBeInTheDocument();
  });
});