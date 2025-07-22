import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dropdown from './Dropdown';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Dropdown Component', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Dropdown options={mockOptions} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<Dropdown label="Select Option" options={mockOptions} />);
      const label = screen.getByText('Select Option');
      expect(label).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Dropdown placeholder="Choose an option" options={mockOptions} />);
      const placeholder = screen.getByText('Choose an option');
      expect(placeholder).toBeInTheDocument();
    });

    it('renders with default placeholder when none provided', () => {
      render(<Dropdown options={mockOptions} />);
      const placeholder = screen.getByText('Select an option');
      expect(placeholder).toBeInTheDocument();
    });

    it('renders required asterisk when required', () => {
      render(<Dropdown label="Required Field" required options={mockOptions} />);
      const asterisk = screen.getByText('*');
      expect(asterisk).toBeInTheDocument();
    });

    it('renders error message when error and errorMessage provided', () => {
      render(
        <Dropdown 
          error 
          errorMessage="Please select an option" 
          options={mockOptions} 
        />
      );
      const errorMsg = screen.getByText('Please select an option');
      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveAttribute('role', 'alert');
    });

    it('displays selected option label', () => {
      render(
        <Dropdown 
          value="option2" 
          options={mockOptions} 
        />
      );
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('renders chevron icon', () => {
      render(<Dropdown options={mockOptions} />);
      const icon = screen.getByAltText('');
      expect(icon).toHaveAttribute('src', '/chevron-down.svg');
    });
  });

  describe('Props and Attributes', () => {
    it('applies custom className', () => {
      render(<Dropdown className="custom-dropdown" options={mockOptions} />);
      const container = screen.getByRole('button').closest('.dropdown');
      expect(container).toHaveClass('custom-dropdown');
    });

    it('applies custom dropdownClassName', () => {
      render(<Dropdown dropdownClassName="custom-field" options={mockOptions} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-field');
    });

    it('applies custom labelClassName', () => {
      render(
        <Dropdown 
          label="Test" 
          labelClassName="custom-label" 
          options={mockOptions} 
        />
      );
      const label = screen.getByText('Test');
      expect(label).toHaveClass('custom-label');
    });

    it('sets disabled state', () => {
      render(<Dropdown disabled options={mockOptions} />);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('sets aria-invalid when error', () => {
      render(<Dropdown error options={mockOptions} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-describedby when error with message', () => {
      render(
        <Dropdown 
          id="test-dropdown" 
          error 
          errorMessage="Error message" 
          options={mockOptions} 
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'test-dropdown-error');
    });

    it('generates unique id when not provided', () => {
      render(<Dropdown label="Test" options={mockOptions} />);
      const button = screen.getByRole('button');
      const label = screen.getByText('Test');
      const buttonId = button.getAttribute('id');
      expect(buttonId).toMatch(/^dropdown-/);
      expect(label).toHaveAttribute('for', buttonId);
    });

    it('uses provided id', () => {
      render(
        <Dropdown 
          id="custom-id" 
          label="Test" 
          options={mockOptions} 
        />
      );
      const button = screen.getByRole('button');
      const label = screen.getByText('Test');
      expect(button).toHaveAttribute('id', 'custom-id');
      expect(label).toHaveAttribute('for', 'custom-id');
    });

    it('passes through additional props', () => {
      render(
        <Dropdown 
          data-testid="custom-test" 
          options={mockOptions} 
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-testid', 'custom-test');
    });
  });

  describe('Dropdown Behavior', () => {
    it('opens dropdown when clicked', () => {
      render(<Dropdown options={mockOptions} />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes dropdown when clicked again', () => {
      render(<Dropdown options={mockOptions} />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      
      fireEvent.click(button);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not open when disabled', () => {
      render(<Dropdown disabled options={mockOptions} />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', async () => {
      render(
        <div>
          <Dropdown options={mockOptions} />
          <button>Outside button</button>
        </div>
      );
      
      const dropdownButton = screen.getByRole('button', { name: 'Dropdown' });
      fireEvent.click(dropdownButton);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      
      const outsideButton = screen.getByText('Outside button');
      fireEvent.mouseDown(outsideButton);
      
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });

    it('displays all options when opened', () => {
      render(<Dropdown options={mockOptions} />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('highlights selected option', () => {
      render(<Dropdown value="option2" options={mockOptions} />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      const selectedOption = screen.getByRole('option', { name: 'Option 2' });
      expect(selectedOption).toHaveClass('dropdown__option--selected');
      expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Option Selection', () => {
    it('selects option when clicked', () => {
      const handleChange = jest.fn();
      render(
        <Dropdown 
          onChange={handleChange} 
          options={mockOptions} 
        />
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const option = screen.getByText('Option 2');
      fireEvent.click(option);
      
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'option2'
          })
        })
      );
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(button).toHaveTextContent('Option 2');
    });

    it('updates display value when option selected', () => {
      render(<Dropdown options={mockOptions} />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveTextContent('Select an option');
      
      fireEvent.click(button);
      fireEvent.click(screen.getByText('Option 3'));
      
      expect(button).toHaveTextContent('Option 3');
    });

    it('includes name in onChange event', () => {
      const handleChange = jest.fn();
      render(
        <Dropdown 
          name="testDropdown"
          onChange={handleChange} 
          options={mockOptions} 
        />
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(screen.getByText('Option 1'));
      
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            name: 'testDropdown',
            value: 'option1'
          })
        })
      );
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens dropdown with Enter key', () => {
      render(<Dropdown options={mockOptions} />);
      const button = screen.getByRole('button');
      
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('opens dropdown with Space key', () => {
      render(<Dropdown options={mockOptions} />);
      const button = screen.getByRole('button');
      
      button.focus();
      fireEvent.keyDown(button, { key: ' ' });
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes dropdown with Escape key', () => {
      render(<Dropdown options={mockOptions} />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      
      fireEvent.keyDown(button, { key: 'Escape' });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('opens dropdown with ArrowDown key', () => {
      render(<Dropdown options={mockOptions} />);
      const button = screen.getByRole('button');
      
      button.focus();
      fireEvent.keyDown(button, { key: 'ArrowDown' });
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes dropdown with ArrowUp key when open', () => {
      render(<Dropdown options={mockOptions} />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      fireEvent.keyDown(button, { key: 'ArrowUp' });
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('selects option with Enter key on option', () => {
      const handleChange = jest.fn();
      render(
        <Dropdown 
          onChange={handleChange} 
          options={mockOptions} 
        />
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const option = screen.getByText('Option 2');
      fireEvent.keyDown(option, { key: 'Enter' });
      
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'option2'
          })
        })
      );
    });

    it('selects option with Space key on option', () => {
      const handleChange = jest.fn();
      render(
        <Dropdown 
          onChange={handleChange} 
          options={mockOptions} 
        />
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      const option = screen.getByText('Option 3');
      fireEvent.keyDown(option, { key: ' ' });
      
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'option3'
          })
        })
      );
    });
  });

  describe('Controlled Component', () => {
    it('displays value from props', () => {
      render(
        <Dropdown 
          value="option3" 
          onChange={() => {}} 
          options={mockOptions} 
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Option 3');
    });

    it('calls onChange when value changes', () => {
      const handleChange = jest.fn();
      const { rerender } = render(
        <Dropdown 
          value="option1" 
          onChange={handleChange} 
          options={mockOptions} 
        />
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(screen.getByText('Option 2'));
      
      expect(handleChange).toHaveBeenCalled();
      
      // Simulate parent component updating the value
      rerender(
        <Dropdown 
          value="option2" 
          onChange={handleChange} 
          options={mockOptions} 
        />
      );
      
      expect(button).toHaveTextContent('Option 2');
    });
  });

  describe('Uncontrolled Component', () => {
    it('works as uncontrolled component', () => {
      render(<Dropdown options={mockOptions} />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveTextContent('Select an option');
      
      fireEvent.click(button);
      fireEvent.click(screen.getByText('Option 1'));
      
      expect(button).toHaveTextContent('Option 1');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to button element', () => {
      const ref = { current: null };
      render(<Dropdown ref={ref} options={mockOptions} />);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current.tagName).toBe('BUTTON');
    });
  });

  describe('Error States', () => {
    it('applies error styling when error prop is true', () => {
      render(<Dropdown error options={mockOptions} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('dropdown__field--error');
    });

    it('shows error message with proper association', () => {
      render(
        <Dropdown 
          name="testDropdown" 
          error 
          errorMessage="Please select a valid option" 
          options={mockOptions} 
        />
      );
      
      const button = screen.getByRole('button');
      const errorMsg = screen.getByText('Please select a valid option');
      const errorId = errorMsg.getAttribute('id');
      
      expect(button).toHaveAttribute('aria-invalid', 'true');
      expect(button).toHaveAttribute('aria-describedby', errorId);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Dropdown label="Select Option" options={mockOptions} />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-haspopup', 'listbox');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-label', 'Select Option');
    });

    it('updates aria-expanded when opened', () => {
      render(<Dropdown options={mockOptions} />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('associates label with dropdown button', () => {
      render(<Dropdown label="Country" options={mockOptions} />);
      const button = screen.getByLabelText('Country');
      expect(button).toBeInTheDocument();
    });

    it('options have proper role and aria-selected', () => {
      render(<Dropdown value="option2" options={mockOptions} />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      
      expect(options[0]).toHaveAttribute('aria-selected', 'false');
      expect(options[1]).toHaveAttribute('aria-selected', 'true');
      expect(options[2]).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      render(<Dropdown options={[]} />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      
      const listbox = screen.getByRole('listbox');
      expect(listbox).toBeEmptyDOMElement();
    });

    it('handles options without matching value', () => {
      render(
        <Dropdown 
          value="nonexistent" 
          options={mockOptions} 
          placeholder="Select something"
        />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Select something');
    });
  });
});