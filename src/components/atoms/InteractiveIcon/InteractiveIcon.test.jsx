import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InteractiveIcon from './InteractiveIcon';

describe('InteractiveIcon', () => {
  it('renders the interactive icon button', () => {
    render(<InteractiveIcon />);
    const button = screen.getByRole('button', { name: /more options/i });
    expect(button).toBeInTheDocument();
  });

  it('renders with custom aria label', () => {
    render(<InteractiveIcon ariaLabel="Menu options" />);
    const button = screen.getByRole('button', { name: /menu options/i });
    expect(button).toBeInTheDocument();
  });

  it('applies the correct size class', () => {
    const { rerender } = render(<InteractiveIcon size="small" />);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('interactive-icon--small');

    rerender(<InteractiveIcon size="medium" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('interactive-icon--medium');

    rerender(<InteractiveIcon size="large" />);
    button = screen.getByRole('button');
    expect(button).toHaveClass('interactive-icon--large');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<InteractiveIcon onClick={handleClick} />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger click when disabled', () => {
    const handleClick = jest.fn();
    render(<InteractiveIcon onClick={handleClick} disabled />);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies disabled class when disabled', () => {
    render(<InteractiveIcon disabled />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('interactive-icon--disabled');
  });

  it('applies hover class on mouse enter', () => {
    render(<InteractiveIcon />);
    const button = screen.getByRole('button');
    
    fireEvent.mouseEnter(button);
    expect(button).toHaveClass('interactive-icon--hover');
    
    fireEvent.mouseLeave(button);
    expect(button).not.toHaveClass('interactive-icon--hover');
  });

  it('applies custom className', () => {
    render(<InteractiveIcon className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('renders the icon image with correct src', () => {
    render(<InteractiveIcon />);
    const image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('src', '/dots.svg');
  });

  it('renders icon with correct size based on size prop', () => {
    const { rerender } = render(<InteractiveIcon size="small" />);
    let image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('width', '12');
    expect(image).toHaveAttribute('height', '12');

    rerender(<InteractiveIcon size="medium" />);
    image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('width', '16');
    expect(image).toHaveAttribute('height', '16');

    rerender(<InteractiveIcon size="large" />);
    image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('width', '20');
    expect(image).toHaveAttribute('height', '20');
  });

  it('prevents default button behavior', () => {
    render(<InteractiveIcon />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('maintains hover state correctly', () => {
    render(<InteractiveIcon />);
    const button = screen.getByRole('button');
    
    // Initial state - no hover
    expect(button).not.toHaveClass('interactive-icon--hover');
    
    // Mouse enter - should have hover class
    fireEvent.mouseEnter(button);
    expect(button).toHaveClass('interactive-icon--hover');
    
    // Mouse leave - should remove hover class
    fireEvent.mouseLeave(button);
    expect(button).not.toHaveClass('interactive-icon--hover');
  });

  it('passes event object to onClick handler', () => {
    const handleClick = jest.fn();
    render(<InteractiveIcon onClick={handleClick} />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({
      type: 'click'
    }));
  });
});