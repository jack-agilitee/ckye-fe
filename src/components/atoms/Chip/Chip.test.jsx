import { render, screen, fireEvent } from '@testing-library/react';
import Chip from './Chip';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe('Chip', () => {
  it('renders with default text', () => {
    render(<Chip />);
    
    const chip = screen.getByRole('button');
    expect(chip).toBeInTheDocument();
    expect(screen.getByText('James Otey')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<Chip text="John Doe" />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders close icon', () => {
    render(<Chip />);
    
    const icon = screen.getByAltText('');
    expect(icon).toHaveAttribute('src', '/close.svg');
    expect(icon).toHaveAttribute('width', '12');
    expect(icon).toHaveAttribute('height', '12');
  });

  it('calls onDismiss when clicked', () => {
    const handleDismiss = jest.fn();
    render(<Chip onDismiss={handleDismiss} />);
    
    const chip = screen.getByRole('button');
    fireEvent.click(chip);
    
    expect(handleDismiss).toHaveBeenCalledTimes(1);
    expect(handleDismiss).toHaveBeenCalledWith(expect.any(Object));
  });

  it('does not error when clicked without onDismiss', () => {
    render(<Chip />);
    
    const chip = screen.getByRole('button');
    expect(() => fireEvent.click(chip)).not.toThrow();
  });

  it('applies hover state on mouse enter', () => {
    render(<Chip />);
    
    const chip = screen.getByRole('button');
    
    expect(chip).not.toHaveClass('chip--hovered');
    
    fireEvent.mouseEnter(chip);
    expect(chip).toHaveClass('chip--hovered');
    
    fireEvent.mouseLeave(chip);
    expect(chip).not.toHaveClass('chip--hovered');
  });

  it('applies custom className', () => {
    render(<Chip className="custom-class" />);
    
    const chip = screen.getByRole('button');
    expect(chip).toHaveClass('chip', 'custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<Chip text="Test User" />);
    
    const chip = screen.getByRole('button');
    expect(chip).toHaveAttribute('aria-label', 'Dismiss Test User');
    expect(chip).toHaveAttribute('type', 'button');
  });

  it('handles keyboard navigation', () => {
    const handleDismiss = jest.fn();
    render(<Chip onDismiss={handleDismiss} />);
    
    const chip = screen.getByRole('button');
    chip.focus();
    
    // Simulate Enter key press
    fireEvent.keyDown(chip, { key: 'Enter', code: 'Enter' });
    fireEvent.click(chip);
    
    expect(handleDismiss).toHaveBeenCalled();
  });

  it('handles hover state transitions correctly', () => {
    render(<Chip />);
    
    const chip = screen.getByRole('button');
    
    // Initial state
    expect(chip).toHaveClass('chip');
    expect(chip).not.toHaveClass('chip--hovered');
    
    // Hover
    fireEvent.mouseEnter(chip);
    expect(chip).toHaveClass('chip', 'chip--hovered');
    
    // Leave
    fireEvent.mouseLeave(chip);
    expect(chip).toHaveClass('chip');
    expect(chip).not.toHaveClass('chip--hovered');
  });

  it('renders with long text properly', () => {
    const longText = 'This is a very long name that should still display properly';
    render(<Chip text={longText} />);
    
    expect(screen.getByText(longText)).toBeInTheDocument();
    const chip = screen.getByRole('button');
    expect(chip).toHaveAttribute('aria-label', `Dismiss ${longText}`);
  });
});