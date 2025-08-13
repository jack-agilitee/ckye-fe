import { render, screen } from '@testing-library/react';
import BarChart from './BarChart';

describe('BarChart', () => {
  const defaultProps = {
    title: 'Test Chart',
    dateRange: 'Jan 1 - Jan 31, 2024',
    data: [
      { date: '1/1', value: 50 },
      { date: '1/15', value: 75 },
      { date: '1/31', value: 100 }
    ],
    maxValue: 100,
    yAxisLabel: 'Value',
    xAxisLabel: 'Date'
  };

  it('renders with default props', () => {
    render(<BarChart />);
    
    expect(screen.getByText('Development Hours Saved')).toBeInTheDocument();
    expect(screen.getByText(/Past 30 Days/)).toBeInTheDocument();
  });

  it('renders with custom title and date range', () => {
    render(<BarChart {...defaultProps} />);
    
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    expect(screen.getByText('Jan 1 - Jan 31, 2024')).toBeInTheDocument();
  });

  it('renders axis labels correctly', () => {
    render(<BarChart {...defaultProps} />);
    
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('renders correct number of bars', () => {
    const { container } = render(<BarChart {...defaultProps} />);
    
    const bars = container.querySelectorAll('[class*="bar-chart__bar"]');
    expect(bars).toHaveLength(3);
  });

  it('renders y-axis values correctly', () => {
    render(<BarChart {...defaultProps} />);
    
    // Should render 6 y-axis values from maxValue down to 0
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders x-axis date labels', () => {
    render(<BarChart {...defaultProps} />);
    
    expect(screen.getByText('1/1')).toBeInTheDocument();
    expect(screen.getByText('1/15')).toBeInTheDocument();
    expect(screen.getByText('1/31')).toBeInTheDocument();
  });

  it('applies custom bar color', () => {
    const { container } = render(
      <BarChart {...defaultProps} barColor="#FF0000" />
    );
    
    const bars = container.querySelectorAll('[class*="bar-chart__bar"]');
    expect(bars[0]).toHaveStyle({ backgroundColor: '#FF0000' });
  });

  it('calculates bar heights correctly', () => {
    const { container } = render(<BarChart {...defaultProps} />);
    
    const bars = container.querySelectorAll('[class*="bar-chart__bar"]');
    // First bar: 50/100 = 50%
    expect(bars[0]).toHaveStyle({ height: '50%' });
    // Second bar: 75/100 = 75%
    expect(bars[1]).toHaveStyle({ height: '75%' });
    // Third bar: 100/100 = 100%
    expect(bars[2]).toHaveStyle({ height: '100%' });
  });

  it('applies custom className', () => {
    const { container } = render(
      <BarChart {...defaultProps} className="custom-chart" />
    );
    
    const chart = container.firstChild;
    expect(chart).toHaveClass('custom-chart');
  });

  it('renders with empty data array', () => {
    render(<BarChart {...defaultProps} data={[]} />);
    
    // Should render with default sample data
    expect(screen.getByText('Test Chart')).toBeInTheDocument();
    const { container } = render(<BarChart {...defaultProps} data={[]} />);
    const bars = container.querySelectorAll('[class*="bar-chart__bar"]');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('handles large datasets', () => {
    const largeData = Array.from({ length: 30 }, (_, i) => ({
      date: `Day ${i + 1}`,
      value: Math.random() * 100
    }));
    
    const { container } = render(
      <BarChart {...defaultProps} data={largeData} />
    );
    
    const bars = container.querySelectorAll('[class*="bar-chart__bar"]');
    expect(bars).toHaveLength(30);
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<BarChart {...defaultProps} />);
    
    const bars = container.querySelectorAll('[role="img"]');
    expect(bars).toHaveLength(3);
    
    // Check aria-labels
    expect(bars[0]).toHaveAttribute('aria-label', '1/1: 50 Value');
    expect(bars[1]).toHaveAttribute('aria-label', '1/15: 75 Value');
    expect(bars[2]).toHaveAttribute('aria-label', '1/31: 100 Value');
  });

  it('renders grid lines', () => {
    const { container } = render(<BarChart {...defaultProps} />);
    
    const gridLines = container.querySelectorAll('[class*="bar-chart__grid-line"]');
    expect(gridLines).toHaveLength(6); // One for each y-axis value
  });

  it('handles custom maxValue', () => {
    render(<BarChart {...defaultProps} maxValue={200} />);
    
    // Should render y-axis values based on new maxValue
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('160')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('renders with different data values', () => {
    const customData = [
      { date: 'Q1', value: 25 },
      { date: 'Q2', value: 50 },
      { date: 'Q3', value: 75 },
      { date: 'Q4', value: 100 }
    ];
    
    const { container } = render(
      <BarChart {...defaultProps} data={customData} />
    );
    
    const bars = container.querySelectorAll('[class*="bar-chart__bar"]');
    expect(bars).toHaveLength(4);
    
    // Check date labels
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.getByText('Q3')).toBeInTheDocument();
    expect(screen.getByText('Q4')).toBeInTheDocument();
  });
});