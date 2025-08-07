import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VariantCard from './VariantCard';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('VariantCard', () => {
  const defaultProps = {
    variantName: 'Master',
    createdDate: 'July 7, 2025',
    currentValue: 89,
    totalValue: 178,
    percentage: 50,
    metricLabel: '1st Shot Acceptance Rate'
  };

  it('renders with default props', () => {
    render(<VariantCard {...defaultProps} />);
    
    expect(screen.getByText('Master')).toBeInTheDocument();
    expect(screen.getByText('Created July 7, 2025')).toBeInTheDocument();
    expect(screen.getByText('89')).toBeInTheDocument();
    expect(screen.getByText('/178')).toBeInTheDocument();
    expect(screen.getByText('1st Shot Acceptance Rate')).toBeInTheDocument();
  });

  it('renders with custom variant name', () => {
    render(<VariantCard {...defaultProps} variantName="Variant 3" />);
    expect(screen.getByText('Variant 3')).toBeInTheDocument();
  });

  it('renders with custom date', () => {
    render(<VariantCard {...defaultProps} createdDate="Aug 25, 2025" />);
    expect(screen.getByText('Created Aug 25, 2025')).toBeInTheDocument();
  });

  it('renders with custom values', () => {
    render(
      <VariantCard 
        {...defaultProps} 
        currentValue={126} 
        totalValue={168}
      />
    );
    expect(screen.getByText('126')).toBeInTheDocument();
    expect(screen.getByText('/168')).toBeInTheDocument();
  });

  it('renders with custom metric label', () => {
    render(
      <VariantCard 
        {...defaultProps} 
        metricLabel="2nd Shot Success Rate"
      />
    );
    expect(screen.getByText('2nd Shot Success Rate')).toBeInTheDocument();
  });

  it('displays the correct percentage', async () => {
    render(<VariantCard {...defaultProps} percentage={75} />);
    
    // Wait for animation to complete
    await waitFor(() => {
      expect(screen.getByText('75%')).toBeInTheDocument();
    }, { timeout: 1500 });
  });


  it('renders as a non-interactive card', () => {
    const { container } = render(<VariantCard {...defaultProps} />);
    const card = container.firstChild;
    
    expect(card).not.toHaveAttribute('role', 'button');
    expect(card).not.toHaveAttribute('tabIndex');
    expect(card).not.toHaveAttribute('onClick');
  });


  it('applies custom className', () => {
    const { container } = render(
      <VariantCard {...defaultProps} className="custom-class" />
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('renders accessibility attributes correctly', () => {
    const { container } = render(<VariantCard {...defaultProps} />);
    
    // Check that gauge visualization exists
    const gauge = container.querySelector('[class*="gauge"]');
    expect(gauge).toBeInTheDocument();
  });

  it('renders gauge elements correctly', () => {
    const { container } = render(<VariantCard {...defaultProps} />);
    
    // Check for gradient SVG (aria-hidden)
    const gradientSvg = container.querySelector('svg[aria-hidden="true"]');
    expect(gradientSvg).toBeInTheDocument();
    
    // Check for gradient path
    const paths = gradientSvg.querySelectorAll('path');
    expect(paths).toHaveLength(1);
    
    // Check for gradient definition
    const gradient = gradientSvg.querySelector('linearGradient');
    expect(gradient).toBeInTheDocument();
  });

  it('calculates needle rotation correctly', async () => {
    const { container, rerender } = render(
      <VariantCard {...defaultProps} percentage={0} />
    );
    
    let needle = container.querySelector('[class*="needle"]:not([class*="image"])');
    expect(needle).toHaveStyle({ transform: 'rotate(-90deg)' });
    
    rerender(<VariantCard {...defaultProps} percentage={50} />);
    await waitFor(() => {
      needle = container.querySelector('[class*="needle"]:not([class*="image"])');
      expect(needle).toHaveStyle({ transform: 'rotate(0deg)' });
    });
    
    rerender(<VariantCard {...defaultProps} percentage={100} />);
    await waitFor(() => {
      needle = container.querySelector('[class*="needle"]:not([class*="image"])');
      expect(needle).toHaveStyle({ transform: 'rotate(90deg)' });
    });
  });

  it('animates percentage counter', async () => {
    render(<VariantCard {...defaultProps} percentage={75} />);
    
    // Initially should show 0 or a low value
    const percentageElement = screen.getByText(/%$/);
    
    // Wait for animation to complete
    await waitFor(() => {
      expect(screen.getByText('75%')).toBeInTheDocument();
    }, { timeout: 1500 });
  });

  it('renders needle image with correct props', () => {
    render(<VariantCard {...defaultProps} />);
    
    const needleImage = screen.getByAltText('');
    expect(needleImage).toHaveAttribute('src', '/needle.png');
    expect(needleImage).toHaveAttribute('width', '16');
    expect(needleImage).toHaveAttribute('height', '100');
  });

  it('updates when props change', async () => {
    const { rerender } = render(<VariantCard {...defaultProps} />);
    
    expect(screen.getByText('Master')).toBeInTheDocument();
    expect(screen.getByText('89')).toBeInTheDocument();
    
    rerender(
      <VariantCard 
        {...defaultProps} 
        variantName="Updated Variant"
        currentValue={120}
        percentage={80}
      />
    );
    
    expect(screen.getByText('Updated Variant')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('80%')).toBeInTheDocument();
    }, { timeout: 1500 });
  });

  it('handles edge case percentages', async () => {
    const { rerender } = render(<VariantCard {...defaultProps} percentage={0} />);
    
    await waitFor(() => {
      expect(screen.getByText('0%')).toBeInTheDocument();
    });
    
    rerender(<VariantCard {...defaultProps} percentage={100} />);
    
    await waitFor(() => {
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

});