import { render, screen } from '@testing-library/react';
import BarChart from './BarChart';

// Mock Recharts components
jest.mock('recharts', () => ({
  BarChart: ({ children, ...props }) => <div data-testid="recharts-bar-chart" {...props}>{children}</div>,
  Bar: ({ children, ...props }) => <div data-testid="recharts-bar" {...props}>{children}</div>,
  XAxis: (props) => <div data-testid="recharts-xaxis" {...props} />,
  YAxis: (props) => <div data-testid="recharts-yaxis" {...props} />,
  CartesianGrid: (props) => <div data-testid="recharts-grid" {...props} />,
  Tooltip: (props) => <div data-testid="recharts-tooltip" {...props} />,
  ResponsiveContainer: ({ children }) => <div data-testid="recharts-container">{children}</div>,
  Cell: (props) => <div data-testid="recharts-cell" {...props} />
}));

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
    
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('renders Recharts components', () => {
    render(<BarChart {...defaultProps} />);
    
    expect(screen.getByTestId('recharts-container')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-bar')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-xaxis')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-yaxis')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-grid')).toBeInTheDocument();
    expect(screen.getByTestId('recharts-tooltip')).toBeInTheDocument();
  });

  it('passes correct data to Recharts', () => {
    const { container } = render(<BarChart {...defaultProps} />);
    
    const barChart = screen.getByTestId('recharts-bar-chart');
    expect(barChart).toHaveAttribute('data');
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
    expect(screen.getByTestId('recharts-bar-chart')).toBeInTheDocument();
  });

  it('handles large datasets', () => {
    const largeData = Array.from({ length: 30 }, (_, i) => ({
      date: i % 3 === 0 ? `Day ${i + 1}` : '',
      value: Math.random() * 100
    }));
    
    render(<BarChart {...defaultProps} data={largeData} />);
    
    expect(screen.getByTestId('recharts-bar-chart')).toBeInTheDocument();
  });

  it('renders correct number of Cell components for custom colors', () => {
    render(<BarChart {...defaultProps} />);
    
    const cells = screen.getAllByTestId('recharts-cell');
    expect(cells).toHaveLength(3); // Should match data length
  });

  it('passes barColor prop correctly', () => {
    render(<BarChart {...defaultProps} barColor="#FF0000" />);
    
    const cells = screen.getAllByTestId('recharts-cell');
    cells.forEach(cell => {
      expect(cell).toHaveAttribute('fill', '#FF0000');
    });
  });

  it('renders with custom maxValue', () => {
    render(<BarChart {...defaultProps} maxValue={200} />);
    
    const yAxis = screen.getByTestId('recharts-yaxis');
    expect(yAxis).toHaveAttribute('domain');
  });

  it('renders with different data values', () => {
    const customData = [
      { date: 'Q1', value: 25 },
      { date: 'Q2', value: 50 },
      { date: 'Q3', value: 75 },
      { date: 'Q4', value: 100 }
    ];
    
    render(<BarChart {...defaultProps} data={customData} />);
    
    const cells = screen.getAllByTestId('recharts-cell');
    expect(cells).toHaveLength(4);
  });

  it('has proper chart structure', () => {
    const { container } = render(<BarChart {...defaultProps} />);
    
    // Check for header section
    const header = container.querySelector('[class*="bar-chart__header"]');
    expect(header).toBeInTheDocument();
    
    // Check for body section
    const body = container.querySelector('[class*="bar-chart__body"]');
    expect(body).toBeInTheDocument();
    
    // Check for x-axis label
    const xLabel = container.querySelector('[class*="bar-chart__x-label"]');
    expect(xLabel).toBeInTheDocument();
  });

  it('renders with spaced labels in data', () => {
    const spacedData = [
      { date: 'Mon', value: 45 },
      { date: '', value: 48 },
      { date: 'Wed', value: 52 },
      { date: '', value: 55 },
      { date: 'Fri', value: 65 }
    ];
    
    render(<BarChart {...defaultProps} data={spacedData} />);
    
    const cells = screen.getAllByTestId('recharts-cell');
    expect(cells).toHaveLength(5);
  });
});