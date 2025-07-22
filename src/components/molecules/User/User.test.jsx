import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import User from './User';

describe('User Component', () => {
  const defaultProps = {
    name: 'Andrew Venn',
    email: 'andrew@agilitee.com'
  };

  it('renders without crashing', () => {
    render(<User {...defaultProps} />);
    expect(screen.getByText('Andrew Venn')).toBeInTheDocument();
  });

  it('displays user name correctly', () => {
    render(<User {...defaultProps} />);
    expect(screen.getByText('Andrew Venn')).toBeInTheDocument();
  });

  it('displays user email correctly', () => {
    render(<User {...defaultProps} />);
    expect(screen.getByText('andrew@agilitee.com')).toBeInTheDocument();
  });

  it('generates initial from name when initial prop not provided', () => {
    render(<User {...defaultProps} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('uses provided initial when initial prop is given', () => {
    render(<User {...defaultProps} initial="V" />);
    expect(screen.getByText('V')).toBeInTheDocument();
  });

  it('displays empty initial when no name or initial provided', () => {
    render(<User name="" email="test@example.com" />);
    const avatar = screen.getByText('test@example.com').parentElement.previousSibling;
    expect(avatar.textContent).toBe('');
  });

  it('handles long names with text overflow', () => {
    const longName = 'Very Long Name That Should Be Truncated With Ellipsis';
    render(<User name={longName} email="test@example.com" />);
    expect(screen.getByText(longName)).toBeInTheDocument();
  });

  it('handles long emails with text overflow', () => {
    const longEmail = 'verylongemailaddress@exampledomain.com';
    render(<User name="Test User" email={longEmail} />);
    expect(screen.getByText(longEmail)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<User {...defaultProps} className="custom-class" />);
    const userElement = container.firstChild;
    expect(userElement).toHaveClass('custom-class');
  });

  it('renders with default empty values when no props provided', () => {
    render(<User />);
    const { container } = render(<User />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('capitalizes the initial letter', () => {
    render(<User name="john doe" email="john@example.com" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('has correct structure with avatar and info sections', () => {
    const { container } = render(<User {...defaultProps} />);
    const userElement = container.firstChild;
    
    // Check main container
    expect(userElement).toHaveClass('user');
    
    // Check avatar section exists
    const avatar = userElement.querySelector('.user__avatar');
    expect(avatar).toBeInTheDocument();
    
    // Check info section exists
    const info = userElement.querySelector('.user__info');
    expect(info).toBeInTheDocument();
  });

  it('renders all required elements in correct order', () => {
    const { container } = render(<User {...defaultProps} />);
    const userElement = container.firstChild;
    
    // Avatar should come before info
    const children = Array.from(userElement.children);
    expect(children[0]).toHaveClass('user__avatar');
    expect(children[1]).toHaveClass('user__info');
  });

  it('uses correct CSS modules classes', () => {
    const { container } = render(<User {...defaultProps} />);
    const userElement = container.firstChild;
    
    expect(userElement.querySelector('.user__avatar')).toBeInTheDocument();
    expect(userElement.querySelector('.user__avatar-initial')).toBeInTheDocument();
    expect(userElement.querySelector('.user__info')).toBeInTheDocument();
    expect(userElement.querySelector('.user__name')).toBeInTheDocument();
    expect(userElement.querySelector('.user__email')).toBeInTheDocument();
  });
});