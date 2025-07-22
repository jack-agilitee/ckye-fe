import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('renders with default props', () => {
    render(<Avatar />);
    const avatar = screen.getByText('A');
    expect(avatar).toBeInTheDocument();
  });

  it('renders with custom initial', () => {
    render(<Avatar initial="J" />);
    const avatar = screen.getByText('J');
    expect(avatar).toBeInTheDocument();
  });

  it('applies small size class', () => {
    const { container } = render(<Avatar size="small" />);
    const avatar = container.firstChild;
    expect(avatar).toHaveClass('avatar--small');
  });

  it('applies medium size class', () => {
    const { container } = render(<Avatar size="medium" />);
    const avatar = container.firstChild;
    expect(avatar).toHaveClass('avatar--medium');
  });

  it('applies large size class', () => {
    const { container } = render(<Avatar size="large" />);
    const avatar = container.firstChild;
    expect(avatar).toHaveClass('avatar--large');
  });

  it('applies variant class', () => {
    const { container } = render(<Avatar variant="primary" />);
    const avatar = container.firstChild;
    expect(avatar).toHaveClass('avatar--primary');
  });

  it('applies custom className', () => {
    const { container } = render(<Avatar className="custom-class" />);
    const avatar = container.firstChild;
    expect(avatar).toHaveClass('custom-class');
  });

  it('combines all classes correctly', () => {
    const { container } = render(
      <Avatar 
        initial="X" 
        size="large" 
        variant="selected" 
        className="custom"
      />
    );
    const avatar = container.firstChild;
    expect(avatar).toHaveClass('avatar');
    expect(avatar).toHaveClass('avatar--large');
    expect(avatar).toHaveClass('avatar--selected');
    expect(avatar).toHaveClass('custom');
  });
});