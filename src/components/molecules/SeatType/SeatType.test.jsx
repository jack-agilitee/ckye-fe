import { render, screen } from '@testing-library/react';
import SeatType, { SEAT_TYPES } from './SeatType';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe('SeatType', () => {
  it('renders member variant by default', () => {
    render(<SeatType />);
    
    const text = screen.getByText('Member');
    expect(text).toBeInTheDocument();
    
    const icon = screen.getByAltText('');
    expect(icon).toHaveAttribute('src', '/eye.svg');
  });

  it('renders member variant explicitly', () => {
    render(<SeatType type={SEAT_TYPES.MEMBER} />);
    
    const text = screen.getByText('Member');
    expect(text).toBeInTheDocument();
    
    const icon = screen.getByAltText('');
    expect(icon).toHaveAttribute('src', '/eye.svg');
  });

  it('renders editor variant', () => {
    render(<SeatType type={SEAT_TYPES.EDITOR} />);
    
    const text = screen.getByText('Editor');
    expect(text).toBeInTheDocument();
    
    const icon = screen.getByAltText('');
    expect(icon).toHaveAttribute('src', '/edit.svg');
  });

  it('renders admin variant', () => {
    render(<SeatType type={SEAT_TYPES.ADMIN} />);
    
    const text = screen.getByText('Admin');
    expect(text).toBeInTheDocument();
    
    const icon = screen.getByAltText('');
    expect(icon).toHaveAttribute('src', '/lightning.svg');
  });

  it('applies custom className', () => {
    const { container } = render(<SeatType className="custom-class" />);
    
    const seatType = container.firstChild;
    expect(seatType).toHaveClass('seat-type', 'custom-class');
  });

  it('renders icon with correct dimensions', () => {
    render(<SeatType />);
    
    const icon = screen.getByAltText('');
    expect(icon).toHaveAttribute('width', '24');
    expect(icon).toHaveAttribute('height', '24');
  });

  it('handles invalid type gracefully', () => {
    render(<SeatType type="invalid-type" />);
    
    // Should default to member
    const text = screen.getByText('Member');
    expect(text).toBeInTheDocument();
    
    const icon = screen.getByAltText('');
    expect(icon).toHaveAttribute('src', '/eye.svg');
  });

  it('renders all variants correctly', () => {
    const variants = [
      { type: SEAT_TYPES.MEMBER, text: 'Member', icon: '/eye.svg' },
      { type: SEAT_TYPES.EDITOR, text: 'Editor', icon: '/edit.svg' },
      { type: SEAT_TYPES.ADMIN, text: 'Admin', icon: '/lightning.svg' }
    ];

    variants.forEach(({ type, text, icon }) => {
      const { unmount } = render(<SeatType type={type} />);
      
      expect(screen.getByText(text)).toBeInTheDocument();
      expect(screen.getByAltText('')).toHaveAttribute('src', icon);
      
      unmount();
    });
  });

  it('maintains consistent structure across variants', () => {
    const { container: container1 } = render(<SeatType type={SEAT_TYPES.MEMBER} />);
    const { container: container2 } = render(<SeatType type={SEAT_TYPES.EDITOR} />);
    const { container: container3 } = render(<SeatType type={SEAT_TYPES.ADMIN} />);
    
    // All should have the same basic structure
    [container1, container2, container3].forEach(container => {
      const seatType = container.firstChild;
      expect(seatType).toHaveClass('seat-type');
      
      const avatar = seatType.firstChild;
      expect(avatar).toHaveClass('seat-type__avatar');
      
      const text = seatType.lastChild;
      expect(text).toHaveClass('seat-type__text');
    });
  });

  it('exports SEAT_TYPES enum correctly', () => {
    expect(SEAT_TYPES).toEqual({
      MEMBER: 'member',
      EDITOR: 'editor',
      ADMIN: 'admin'
    });
  });
});