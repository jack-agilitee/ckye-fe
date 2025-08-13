import { render, screen } from '@testing-library/react';
import KpiCard from './KpiCard';

describe('KpiCard', () => {
  const defaultProps = {
    title: 'Past 30 Days',
    chipText: '66 PRs',
    metrics: [
      { value: 9, label: 'Developers Using Ckye' },
      { value: 102, label: 'Workdays Saved' }
    ]
  };

  it('renders with default props', () => {
    render(<KpiCard {...defaultProps} />);
    
    expect(screen.getByText('Past 30 Days')).toBeInTheDocument();
    expect(screen.getByText('66 PRs')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('Developers Using Ckye')).toBeInTheDocument();
    expect(screen.getByText('102')).toBeInTheDocument();
    expect(screen.getByText('Workdays Saved')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<KpiCard {...defaultProps} title="Last Week" />);
    
    expect(screen.getByText('Last Week')).toBeInTheDocument();
  });

  it('renders with custom chip text', () => {
    render(<KpiCard {...defaultProps} chipText="120 PRs" />);
    
    expect(screen.getByText('120 PRs')).toBeInTheDocument();
  });

  it('renders with different metrics', () => {
    const customMetrics = [
      { value: 15, label: 'Active Users' },
      { value: 250, label: 'Hours Saved' }
    ];
    
    render(<KpiCard {...defaultProps} metrics={customMetrics} />);
    
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText('Hours Saved')).toBeInTheDocument();
  });

  it('renders with single metric', () => {
    const singleMetric = [
      { value: 42, label: 'Total Contributions' }
    ];
    
    render(<KpiCard {...defaultProps} metrics={singleMetric} />);
    
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Total Contributions')).toBeInTheDocument();
  });

  it('renders with multiple metrics', () => {
    const multipleMetrics = [
      { value: 5, label: 'Teams' },
      { value: 20, label: 'Projects' },
      { value: 150, label: 'Commits' }
    ];
    
    render(<KpiCard {...defaultProps} metrics={multipleMetrics} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Commits')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <KpiCard {...defaultProps} className="custom-class" />
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('renders with zero values', () => {
    const zeroMetrics = [
      { value: 0, label: 'Pending Tasks' },
      { value: 0, label: 'Errors' }
    ];
    
    render(<KpiCard {...defaultProps} metrics={zeroMetrics} />);
    
    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(2);
    expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
    expect(screen.getByText('Errors')).toBeInTheDocument();
  });

  it('renders with large values', () => {
    const largeMetrics = [
      { value: 999999, label: 'Total Lines' },
      { value: 1234567, label: 'Operations' }
    ];
    
    render(<KpiCard {...defaultProps} metrics={largeMetrics} />);
    
    expect(screen.getByText('999999')).toBeInTheDocument();
    expect(screen.getByText('Total Lines')).toBeInTheDocument();
    expect(screen.getByText('1234567')).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
  });

  it('has proper component structure', () => {
    const { container } = render(<KpiCard {...defaultProps} />);
    
    // Check for header section
    const header = container.querySelector('[class*="kpi-card__header"]');
    expect(header).toBeInTheDocument();
    
    // Check for divider
    const divider = container.querySelector('[class*="kpi-card__divider"]');
    expect(divider).toBeInTheDocument();
    
    // Check for stats section
    const stats = container.querySelector('[class*="kpi-card__stats"]');
    expect(stats).toBeInTheDocument();
    
    // Check for metrics
    const metrics = container.querySelectorAll('[class*="kpi-card__metric"]');
    expect(metrics).toHaveLength(2);
  });
});