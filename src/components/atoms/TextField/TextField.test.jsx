import { render, screen, fireEvent } from '@testing-library/react';
import TextField from './TextField';

describe('TextField Component', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<TextField />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders with label', () => {
      render(<TextField label="Name" />);
      const label = screen.getByText('Name');
      expect(label).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<TextField placeholder="Enter your name" />);
      const input = screen.getByPlaceholderText('Enter your name');
      expect(input).toBeInTheDocument();
    });

    it('renders with default placeholder when none provided', () => {
      render(<TextField />);
      const input = screen.getByPlaceholderText('Label');
      expect(input).toBeInTheDocument();
    });

    it('renders required asterisk when required', () => {
      render(<TextField label="Email" required />);
      const asterisk = screen.getByText('*');
      expect(asterisk).toBeInTheDocument();
    });

    it('renders error message when error and errorMessage provided', () => {
      render(<TextField error errorMessage="This field is required" />);
      const errorMsg = screen.getByText('This field is required');
      expect(errorMsg).toBeInTheDocument();
      expect(errorMsg).toHaveAttribute('role', 'alert');
    });

    it('does not render error message when only error is true', () => {
      render(<TextField error />);
      const errorMsg = screen.queryByRole('alert');
      expect(errorMsg).not.toBeInTheDocument();
    });
  });

  describe('Props and Attributes', () => {
    it('applies custom className', () => {
      render(<TextField className="custom-field" />);
      const container = screen.getByRole('textbox').closest('div');
      expect(container).toHaveClass('custom-field');
    });

    it('applies custom inputClassName', () => {
      render(<TextField inputClassName="custom-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('custom-input');
    });

    it('applies custom labelClassName', () => {
      render(<TextField label="Test" labelClassName="custom-label" />);
      const label = screen.getByText('Test');
      expect(label).toHaveClass('custom-label');
    });

    it('sets input type', () => {
      render(<TextField type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('sets disabled state', () => {
      render(<TextField disabled />);
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    it('sets required attribute', () => {
      render(<TextField required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('sets aria-invalid when error', () => {
      render(<TextField error />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-describedby when error with message', () => {
      render(<TextField id="test-input" error errorMessage="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
    });

    it('generates unique id when not provided', () => {
      render(<TextField label="Test" />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Test');
      const inputId = input.getAttribute('id');
      expect(inputId).toMatch(/^textfield-/);
      expect(label).toHaveAttribute('for', inputId);
    });

    it('uses provided id', () => {
      render(<TextField id="custom-id" label="Test" />);
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Test');
      expect(input).toHaveAttribute('id', 'custom-id');
      expect(label).toHaveAttribute('for', 'custom-id');
    });

    it('passes through additional props', () => {
      render(<TextField data-testid="custom-test" maxLength={50} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('data-testid', 'custom-test');
      expect(input).toHaveAttribute('maxLength', '50');
    });
  });

  describe('Controlled Component', () => {
    it('accepts and displays value', () => {
      render(<TextField value="Test value" onChange={() => {}} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Test value');
    });

    it('calls onChange handler', () => {
      const handleChange = jest.fn();
      render(<TextField onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'New value' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: 'New value'
          })
        })
      );
    });

    it('calls onBlur handler', () => {
      const handleBlur = jest.fn();
      render(<TextField onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');
      
      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('calls onFocus handler', () => {
      const handleFocus = jest.fn();
      render(<TextField onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');
      
      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });
  });

  describe('Uncontrolled Component', () => {
    it('works as uncontrolled component', () => {
      render(<TextField />);
      const input = screen.getByRole('textbox');
      
      fireEvent.change(input, { target: { value: 'Typed value' } });
      expect(input).toHaveValue('Typed value');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to input element', () => {
      const ref = { current: null };
      render(<TextField ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current.tagName).toBe('INPUT');
    });
  });

  describe('Error States', () => {
    it('applies error styling when error prop is true', () => {
      render(<TextField error />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('text-field__input--error');
    });

    it('shows error message with proper association', () => {
      render(
        <TextField 
          name="email" 
          error 
          errorMessage="Invalid email address" 
        />
      );
      
      const input = screen.getByRole('textbox');
      const errorMsg = screen.getByText('Invalid email address');
      const errorId = errorMsg.getAttribute('id');
      
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', errorId);
    });
  });

  describe('Accessibility', () => {
    it('associates label with input', () => {
      render(<TextField label="Username" name="username" />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });

    it('handles label with required indicator', () => {
      render(<TextField label="Email" required />);
      const input = screen.getByLabelText(/Email/);
      expect(input).toBeRequired();
    });

    it('maintains focus on disabled state', () => {
      const { rerender } = render(<TextField />);
      const input = screen.getByRole('textbox');
      
      input.focus();
      expect(document.activeElement).toBe(input);
      
      rerender(<TextField disabled />);
      expect(input).toBeDisabled();
    });
  });
});