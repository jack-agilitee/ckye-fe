import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button', 'button--primary');
    
    // Check for default settings icon
    const icon = screen.getByAltText('');
    expect(icon).toHaveAttribute('src', '/settings.svg');
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button', 'button--secondary');
  });

  it('renders with custom icon', () => {
    render(<Button icon="/custom-icon.svg">Custom Icon</Button>);
    
    const icon = screen.getByAltText('');
    expect(icon).toHaveAttribute('src', '/custom-icon.svg');
  });

  it('renders without icon when icon prop is null', () => {
    render(<Button icon={null}>No Icon</Button>);
    
    const icon = screen.queryByRole('img');
    expect(icon).not.toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire click event when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('button--disabled');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with custom className', () => {
    render(<Button className="custom-class">Custom Class</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button', 'button--primary', 'custom-class');
  });

  it('renders with different button types', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    
    rerender(<Button type="reset">Reset</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    
    rerender(<Button>Default</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('passes through additional props', () => {
    render(
      <Button 
        data-testid="custom-button" 
        aria-label="Custom Label"
      >
        Props Test
      </Button>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-testid', 'custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom Label');
  });

  it('renders icon with correct dimensions', () => {
    render(<Button>Icon Test</Button>);
    
    const icon = screen.getByAltText('');
    expect(icon).toHaveAttribute('width', '16');
    expect(icon).toHaveAttribute('height', '16');
  });

  it('has proper keyboard accessibility', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Keyboard Test</Button>);
    
    const button = screen.getByRole('button');
    button.focus();
    
    // Simulate Enter key press
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalled();
  });
});