import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChartSection from './ChartSection';

describe('ChartSection', () => {
  it('renders with default props', () => {
    render(<ChartSection />);
    
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByText(/Variant 3 improved the 1st-try code acceptance rate/)).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<ChartSection title="Custom Results" />);
    
    expect(screen.getByText('Custom Results')).toBeInTheDocument();
  });

  it('renders with custom description', () => {
    const customDescription = 'This is a custom description for the chart section.';
    render(<ChartSection description={customDescription} />);
    
    expect(screen.getByText(customDescription)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ChartSection className="custom-class" />);
    const chartSection = container.firstChild;
    
    expect(chartSection).toHaveClass('custom-class');
  });

  it('renders with all custom props', () => {
    const props = {
      title: 'Test Results',
      description: 'Test description for the component.',
      className: 'test-class'
    };
    
    const { container } = render(<ChartSection {...props} />);
    
    expect(screen.getByText('Test Results')).toBeInTheDocument();
    expect(screen.getByText('Test description for the component.')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('has correct heading level for title', () => {
    render(<ChartSection />);
    const heading = screen.getByRole('heading', { level: 2 });
    
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Results');
  });

  it('renders title as h2 element', () => {
    render(<ChartSection title="Test Title" />);
    const heading = screen.getByRole('heading', { level: 2 });
    
    expect(heading.tagName).toBe('H2');
  });

  it('renders description as paragraph element', () => {
    const { container } = render(<ChartSection />);
    const paragraph = container.querySelector('p');
    
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent(/Variant 3 improved/);
  });

  it('handles empty strings for props', () => {
    render(<ChartSection title="" description="" />);
    
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('');
    
    const paragraph = document.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('');
  });

  it('handles very long content', () => {
    const longTitle = 'A'.repeat(200);
    const longDescription = 'B'.repeat(500);
    
    render(<ChartSection title={longTitle} description={longDescription} />);
    
    expect(screen.getByText(longTitle)).toBeInTheDocument();
    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  it('maintains structure with missing props', () => {
    const { container } = render(<ChartSection />);
    
    const chartSection = container.firstChild;
    const title = chartSection.querySelector('h2');
    const description = chartSection.querySelector('p');
    
    expect(chartSection).toBeInTheDocument();
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('escapes HTML in content', () => {
    const htmlContent = '<script>alert("XSS")</script>';
    render(<ChartSection title={htmlContent} description={htmlContent} />);
    
    // Should render as text, not execute as HTML
    expect(screen.getByText(htmlContent)).toBeInTheDocument();
    expect(document.querySelector('script')).not.toBeInTheDocument();
  });
});