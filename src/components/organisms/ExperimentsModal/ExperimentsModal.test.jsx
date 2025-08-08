import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExperimentsModal from './ExperimentsModal';

// Mock the VariantCard component
jest.mock('@/components/organisms/VariantCard/VariantCard', () => {
  return function MockVariantCard(props) {
    return (
      <div data-testid="variant-card">
        <span>{props.variantName}</span>
        <span>{props.percentage}%</span>
      </div>
    );
  };
});

// Mock the ChartSection component
jest.mock('@/components/molecules/ChartSection/ChartSection', () => {
  return function MockChartSection(props) {
    return (
      <div className={props.className}>
        <h2>{props.title}</h2>
        {props.children || <p>{props.description}</p>}
      </div>
    );
  };
});

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('ExperimentsModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onEndExperiment: jest.fn(),
    experimentTitle: 'Clade.md version 3',
    comparisonText: 'master vs. version 3',
    resultsData: {
      improvementPercentage: 25,
      confidenceLevel: 95,
      description: 'Variant 3 improved the 1st-try code acceptance rate by 25% compared to Master. Based on the data collected, we can be 95% confident that this improvement is real and not just due to random chance.'
    },
    statsData: {
      pValue: '0.00000083',
      masterConfidenceInterval: '42.7% – 57.3%',
      variantConfidenceInterval: '68.5% – 81.5%'
    },
    impactDescription: 'For every 100 code generations, approximately 25 more would be accepted on the first try by developers.',
    masterData: {
      variantName: 'Master',
      createdDate: 'July 7, 2025',
      currentValue: 89,
      totalValue: 178,
      percentage: 50,
      metricLabel: '1st Shot Acceptance Rate'
    },
    variantData: {
      variantName: 'Variant 3',
      createdDate: 'Aug 25, 2025',
      currentValue: 126,
      totalValue: 168,
      percentage: 75,
      metricLabel: '1st Shot Acceptance Rate'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Reset body overflow
    document.body.style.overflow = 'unset';
  });

  it('should not render when isOpen is false', () => {
    render(<ExperimentsModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Clade.md version 3')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<ExperimentsModal {...defaultProps} />);
    expect(screen.getByText('Clade.md version 3')).toBeInTheDocument();
    expect(screen.getByText('master vs. version 3')).toBeInTheDocument();
  });

  it('should display all section titles', () => {
    render(<ExperimentsModal {...defaultProps} />);
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByText('Stats for Nerds')).toBeInTheDocument();
    expect(screen.getByText('Potential Impact')).toBeInTheDocument();
  });

  it('should display results data with highlighted percentages', () => {
    render(<ExperimentsModal {...defaultProps} />);
    const description = screen.getByText(/Variant 3 improved the 1st-try code acceptance rate/);
    expect(description).toBeInTheDocument();
    // Check for highlighted percentages
    const highlights = description.querySelectorAll('span');
    expect(highlights.length).toBeGreaterThan(0);
  });

  it('should display stats data', () => {
    render(<ExperimentsModal {...defaultProps} />);
    expect(screen.getByText(/0.00000083/)).toBeInTheDocument();
    expect(screen.getByText(/42.7% – 57.3%/)).toBeInTheDocument();
    expect(screen.getByText(/68.5% – 81.5%/)).toBeInTheDocument();
  });

  it('should display impact description', () => {
    render(<ExperimentsModal {...defaultProps} />);
    expect(screen.getByText(defaultProps.impactDescription)).toBeInTheDocument();
  });

  it('should render two variant cards', () => {
    render(<ExperimentsModal {...defaultProps} />);
    const variantCards = screen.getAllByTestId('variant-card');
    expect(variantCards).toHaveLength(2);
    expect(screen.getByText('Master')).toBeInTheDocument();
    expect(screen.getByText('Variant 3')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<ExperimentsModal {...defaultProps} />);
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onEndExperiment and onClose when End Experiment button is clicked', () => {
    render(<ExperimentsModal {...defaultProps} />);
    const endButton = screen.getByText('End Experiment');
    fireEvent.click(endButton);
    expect(defaultProps.onEndExperiment).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should close modal when clicking outside', () => {
    const { container } = render(<ExperimentsModal {...defaultProps} />);
    const modalOverlay = container.firstChild;
    fireEvent.mouseDown(modalOverlay);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should not close modal when clicking inside', () => {
    render(<ExperimentsModal {...defaultProps} />);
    const modalContent = screen.getByText('Clade.md version 3').closest('[class*="content"]');
    fireEvent.mouseDown(modalContent);
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('should close modal when Escape key is pressed', () => {
    render(<ExperimentsModal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should prevent body scroll when modal is open', () => {
    render(<ExperimentsModal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body scroll when modal is closed', () => {
    const { rerender } = render(<ExperimentsModal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<ExperimentsModal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('should handle missing callbacks gracefully', () => {
    const propsWithoutCallbacks = {
      ...defaultProps,
      onClose: undefined,
      onEndExperiment: undefined
    };
    
    render(<ExperimentsModal {...propsWithoutCallbacks} />);
    const closeButton = screen.getByLabelText('Close modal');
    const endButton = screen.getByText('End Experiment');
    
    // Should not throw errors
    expect(() => fireEvent.click(closeButton)).not.toThrow();
    expect(() => fireEvent.click(endButton)).not.toThrow();
  });

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = render(<ExperimentsModal {...defaultProps} />);
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('should render with custom data props', () => {
    const customProps = {
      ...defaultProps,
      experimentTitle: 'Custom Experiment',
      comparisonText: 'baseline vs. variant',
      impactDescription: 'Custom impact description',
      masterData: {
        ...defaultProps.masterData,
        variantName: 'Baseline',
        percentage: 60
      },
      variantData: {
        ...defaultProps.variantData,
        variantName: 'Variant A',
        percentage: 85
      }
    };

    render(<ExperimentsModal {...customProps} />);
    
    expect(screen.getByText('Custom Experiment')).toBeInTheDocument();
    expect(screen.getByText('baseline vs. variant')).toBeInTheDocument();
    expect(screen.getByText('Custom impact description')).toBeInTheDocument();
    expect(screen.getByText('Baseline')).toBeInTheDocument();
    expect(screen.getByText('Variant A')).toBeInTheDocument();
  });
});