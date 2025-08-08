import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateExperimentModal from './CreateExperimentModal';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock atomic components
jest.mock('@/components/atoms/TextField/TextField', () => ({
  __esModule: true,
  default: ({ label, placeholder, value, onChange, className }) => (
    <div data-testid="textfield" className={className}>
      <label>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        data-testid={`textfield-${label}`}
      />
    </div>
  ),
}));

jest.mock('@/components/atoms/Dropdown/Dropdown', () => ({
  __esModule: true,
  default: ({ label, value, onChange, options, placeholder, className }) => (
    <div data-testid="dropdown" className={className}>
      <label>{label}</label>
      <select
        value={value}
        onChange={onChange}
        data-testid={`dropdown-${label}`}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

jest.mock('@/components/atoms/Button/Button', () => ({
  __esModule: true,
  default: ({ children, onClick, variant, className }) => (
    <button
      onClick={onClick}
      className={className}
      data-testid={`button-${variant}`}
    >
      {children}
    </button>
  ),
}));

describe('CreateExperimentModal', () => {
  const mockOnClose = jest.fn();
  const mockOnCreate = jest.fn();
  
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onCreate: mockOnCreate,
    masterFiles: [
      { value: 'claude', label: 'Claude.md' },
      { value: 'commands', label: 'Commands.md' },
      { value: 'readme', label: 'README.md' }
    ],
    variants: [
      { value: 'v1', label: 'Variant 1' },
      { value: 'v2', label: 'Variant 2' },
      { value: 'v3', label: 'Variant 3' }
    ]
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnCreate.mockClear();
    document.body.style.overflow = '';
  });

  it('renders modal when isOpen is true', () => {
    render(<CreateExperimentModal {...defaultProps} />);
    
    expect(screen.getByText('New Experiment')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Master File')).toBeInTheDocument();
    expect(screen.getByText('Variant to Test')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create Experiment')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(<CreateExperimentModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('New Experiment')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<CreateExperimentModal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<CreateExperimentModal {...defaultProps} />);
    
    const cancelButton = screen.getByTestId('button-secondary');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<CreateExperimentModal {...defaultProps} />);
    
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal content is clicked', () => {
    render(<CreateExperimentModal {...defaultProps} />);
    
    const title = screen.getByText('New Experiment');
    fireEvent.click(title);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('handles form input changes', () => {
    render(<CreateExperimentModal {...defaultProps} />);
    
    const nameInput = screen.getByTestId('textfield-Name');
    const masterFileSelect = screen.getByTestId('dropdown-Master File');
    const variantSelect = screen.getByTestId('dropdown-Variant to Test');
    
    fireEvent.change(nameInput, { target: { value: 'Test Experiment' } });
    fireEvent.change(masterFileSelect, { target: { value: 'commands' } });
    fireEvent.change(variantSelect, { target: { value: 'v2' } });
    
    expect(nameInput.value).toBe('Test Experiment');
    expect(masterFileSelect.value).toBe('commands');
    expect(variantSelect.value).toBe('v2');
  });

  it('calls onCreate with form data when Create Experiment is clicked', () => {
    render(<CreateExperimentModal {...defaultProps} />);
    
    const nameInput = screen.getByTestId('textfield-Name');
    const masterFileSelect = screen.getByTestId('dropdown-Master File');
    const variantSelect = screen.getByTestId('dropdown-Variant to Test');
    
    fireEvent.change(nameInput, { target: { value: 'Test Experiment' } });
    fireEvent.change(masterFileSelect, { target: { value: 'commands' } });
    fireEvent.change(variantSelect, { target: { value: 'v2' } });
    
    const createButton = screen.getByTestId('button-primary');
    fireEvent.click(createButton);
    
    expect(mockOnCreate).toHaveBeenCalledWith({
      name: 'Test Experiment',
      masterFile: 'commands',
      variant: 'v2'
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('resets form when modal reopens', () => {
    const { rerender } = render(<CreateExperimentModal {...defaultProps} />);
    
    const nameInput = screen.getByTestId('textfield-Name');
    fireEvent.change(nameInput, { target: { value: 'Test Experiment' } });
    
    rerender(<CreateExperimentModal {...defaultProps} isOpen={false} />);
    rerender(<CreateExperimentModal {...defaultProps} isOpen={true} />);
    
    const resetInput = screen.getByTestId('textfield-Name');
    expect(resetInput.value).toBe('');
  });

  it('closes modal on Escape key press', () => {
    render(<CreateExperimentModal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('sets body overflow to hidden when open', () => {
    render(<CreateExperimentModal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body overflow when closed', () => {
    const { rerender } = render(<CreateExperimentModal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<CreateExperimentModal {...defaultProps} isOpen={false} />);
    
    expect(document.body.style.overflow).toBe('');
  });

  it('applies custom className', () => {
    render(<CreateExperimentModal {...defaultProps} className="custom-modal" />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveClass('custom-modal');
  });

  it('sets default values for dropdowns from first options', () => {
    render(<CreateExperimentModal {...defaultProps} />);
    
    const masterFileSelect = screen.getByTestId('dropdown-Master File');
    const variantSelect = screen.getByTestId('dropdown-Variant to Test');
    
    expect(masterFileSelect.value).toBe('claude');
    expect(variantSelect.value).toBe('v1');
  });

  it('handles empty options arrays', () => {
    render(
      <CreateExperimentModal
        {...defaultProps}
        masterFiles={[]}
        variants={[]}
      />
    );
    
    const masterFileSelect = screen.getByTestId('dropdown-Master File');
    const variantSelect = screen.getByTestId('dropdown-Variant to Test');
    
    expect(masterFileSelect.value).toBe('');
    expect(variantSelect.value).toBe('');
  });

  it('still closes modal when onCreate is not provided', () => {
    render(
      <CreateExperimentModal
        isOpen={true}
        onClose={mockOnClose}
        masterFiles={defaultProps.masterFiles}
        variants={defaultProps.variants}
      />
    );
    
    const createButton = screen.getByTestId('button-primary');
    fireEvent.click(createButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('has proper ARIA attributes', () => {
    render(<CreateExperimentModal {...defaultProps} />);
    
    const modal = screen.getByRole('dialog');
    expect(modal).toHaveAttribute('aria-modal', 'true');
    expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
    
    const title = screen.getByText('New Experiment');
    expect(title).toHaveAttribute('id', 'modal-title');
  });
});