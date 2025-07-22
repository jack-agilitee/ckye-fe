import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkspaceSelector from './WorkspaceSelector';

const mockOptions = [
  { id: '1', name: 'James Otey' },
  { id: '2', name: 'Jack Nichols' },
  { id: '3', name: 'Steve Street' },
  { id: '4', name: 'Sullivan Street' },
  { id: '5', name: 'Dave Fullam' },
  { id: '6', name: 'Phil Stephenson' },
  { id: '7', name: 'Sam Street' },
  { id: '8', name: 'Andrew Venn' }
];

describe('WorkspaceSelector', () => {
  const defaultProps = {
    label: 'Workspace',
    options: mockOptions,
    value: [],
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with label', () => {
    render(<WorkspaceSelector {...defaultProps} />);
    expect(screen.getByText('Workspace')).toBeInTheDocument();
  });

  it('displays placeholder when no value selected', () => {
    render(<WorkspaceSelector {...defaultProps} placeholder="Select users..." />);
    expect(screen.getByPlaceholderText('Select users...')).toBeInTheDocument();
  });

  it('displays selected values as chips', () => {
    const value = [
      { id: '1', name: 'James Otey' },
      { id: '2', name: 'Jack Nichols' }
    ];
    render(<WorkspaceSelector {...defaultProps} value={value} />);
    
    expect(screen.getByText('James Otey')).toBeInTheDocument();
    expect(screen.getByText('Jack Nichols')).toBeInTheDocument();
  });

  it('opens dropdown when field is clicked', async () => {
    render(<WorkspaceSelector {...defaultProps} />);
    
    const field = screen.getByRole('combobox');
    fireEvent.click(field);
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  it('filters options based on input', async () => {
    render(<WorkspaceSelector {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.click(input);
    
    await userEvent.type(input, 'steve');
    
    await waitFor(() => {
      expect(screen.getByText('Steve Street')).toBeInTheDocument();
      expect(screen.queryByText('James Otey')).not.toBeInTheDocument();
    });
  });

  it('excludes already selected options from dropdown', async () => {
    const value = [{ id: '1', name: 'James Otey' }];
    render(<WorkspaceSelector {...defaultProps} value={value} />);
    
    const field = screen.getByRole('combobox');
    fireEvent.click(field);
    
    await waitFor(() => {
      expect(screen.queryByRole('option', { name: /James Otey/ })).not.toBeInTheDocument();
      expect(screen.getByRole('option', { name: /Jack Nichols/ })).toBeInTheDocument();
    });
  });

  it('calls onChange when option is selected', async () => {
    const onChange = jest.fn();
    render(<WorkspaceSelector {...defaultProps} onChange={onChange} />);
    
    const field = screen.getByRole('combobox');
    fireEvent.click(field);
    
    const option = await screen.findByText('James Otey');
    fireEvent.click(option);
    
    expect(onChange).toHaveBeenCalledWith([
      { id: '1', name: 'James Otey' }
    ]);
  });

  it('calls onChange when chip is dismissed', () => {
    const onChange = jest.fn();
    const value = [
      { id: '1', name: 'James Otey' },
      { id: '2', name: 'Jack Nichols' }
    ];
    render(<WorkspaceSelector {...defaultProps} value={value} onChange={onChange} />);
    
    const dismissButtons = screen.getAllByRole('button', { name: /Dismiss/ });
    fireEvent.click(dismissButtons[0]);
    
    expect(onChange).toHaveBeenCalledWith([
      { id: '2', name: 'Jack Nichols' }
    ]);
  });

  it('handles keyboard navigation', async () => {
    render(<WorkspaceSelector {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.click(input);
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    
    // Navigate down
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const firstOption = screen.getByText('James Otey').parentElement;
    expect(firstOption).toHaveClass('workspace-selector__option--focused');
    
    // Navigate down again
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const secondOption = screen.getByText('Jack Nichols').parentElement;
    expect(secondOption).toHaveClass('workspace-selector__option--focused');
    
    // Navigate up
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(firstOption).toHaveClass('workspace-selector__option--focused');
  });

  it('selects option with Enter key', async () => {
    const onChange = jest.fn();
    render(<WorkspaceSelector {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.click(input);
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    
    // Navigate to first option
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    
    // Select with Enter
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(onChange).toHaveBeenCalledWith([
      { id: '1', name: 'James Otey' }
    ]);
  });

  it('closes dropdown with Escape key', async () => {
    render(<WorkspaceSelector {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.click(input);
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    
    fireEvent.keyDown(input, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('removes last chip with Backspace when input is empty', () => {
    const onChange = jest.fn();
    const value = [
      { id: '1', name: 'James Otey' },
      { id: '2', name: 'Jack Nichols' }
    ];
    render(<WorkspaceSelector {...defaultProps} value={value} onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Backspace' });
    
    expect(onChange).toHaveBeenCalledWith([
      { id: '1', name: 'James Otey' }
    ]);
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <WorkspaceSelector {...defaultProps} />
        <button>Outside</button>
      </div>
    );
    
    const field = screen.getByRole('combobox');
    fireEvent.click(field);
    
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
    
    const outsideButton = screen.getByText('Outside');
    fireEvent.mouseDown(outsideButton);
    
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    const { container } = render(<WorkspaceSelector {...defaultProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles empty options array', () => {
    render(<WorkspaceSelector {...defaultProps} options={[]} />);
    
    const field = screen.getByRole('combobox');
    fireEvent.click(field);
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('maintains focus on input after selection', async () => {
    const onChange = jest.fn();
    render(<WorkspaceSelector {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.click(input);
    
    const option = await screen.findByText('James Otey');
    fireEvent.click(option);
    
    expect(input).toHaveFocus();
  });
});