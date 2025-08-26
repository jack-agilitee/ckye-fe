import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusChip from './StatusChip';

describe('StatusChip', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<StatusChip />);
      
      const chip = screen.getByRole('status');
      expect(chip).toBeInTheDocument();
      expect(chip).toHaveTextContent('Active');
      expect(chip).toHaveAttribute('aria-label', 'Status: Active');
    });

    it('should render with custom text', () => {
      render(<StatusChip text="Custom Status" />);
      
      const chip = screen.getByRole('status');
      expect(chip).toHaveTextContent('Custom Status');
      expect(chip).toHaveAttribute('aria-label', 'Status: Custom Status');
    });

    it('should apply custom className', () => {
      const { container } = render(<StatusChip className="custom-class" />);
      
      const chip = container.querySelector('.custom-class');
      expect(chip).toBeInTheDocument();
    });
  });

  describe('Status States', () => {
    it('should render active status', () => {
      const { container } = render(<StatusChip status="active" text="Active" />);
      
      const chip = container.firstChild;
      expect(chip).toHaveClass('status-chip--active');
      expect(chip).toHaveTextContent('Active');
    });

    it('should render inactive status', () => {
      const { container } = render(<StatusChip status="inactive" text="Inactive" />);
      
      const chip = container.firstChild;
      expect(chip).toHaveClass('status-chip--inactive');
      expect(chip).toHaveTextContent('Inactive');
    });

    it('should render pending status', () => {
      const { container } = render(<StatusChip status="pending" text="Pending" />);
      
      const chip = container.firstChild;
      expect(chip).toHaveClass('status-chip--pending');
      expect(chip).toHaveTextContent('Pending');
    });

    it('should render error status', () => {
      const { container } = render(<StatusChip status="error" text="Error" />);
      
      const chip = container.firstChild;
      expect(chip).toHaveClass('status-chip--error');
      expect(chip).toHaveTextContent('Error');
    });
  });

  describe('Accessibility', () => {
    it('should have role="status"', () => {
      render(<StatusChip />);
      
      const chip = screen.getByRole('status');
      expect(chip).toBeInTheDocument();
    });

    it('should have proper aria-label', () => {
      render(<StatusChip text="Processing" />);
      
      const chip = screen.getByRole('status');
      expect(chip).toHaveAttribute('aria-label', 'Status: Processing');
    });

    it('should update aria-label when text changes', () => {
      const { rerender } = render(<StatusChip text="Loading" />);
      
      let chip = screen.getByRole('status');
      expect(chip).toHaveAttribute('aria-label', 'Status: Loading');
      
      rerender(<StatusChip text="Complete" />);
      chip = screen.getByRole('status');
      expect(chip).toHaveAttribute('aria-label', 'Status: Complete');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty text', () => {
      render(<StatusChip text="" />);
      
      const chip = screen.getByRole('status');
      expect(chip).toBeInTheDocument();
      expect(chip).toHaveAttribute('aria-label', 'Status: ');
    });

    it('should handle long text', () => {
      const longText = 'This is a very long status text that might overflow';
      render(<StatusChip text={longText} />);
      
      const chip = screen.getByRole('status');
      expect(chip).toHaveTextContent(longText);
    });

    it('should handle special characters in text', () => {
      render(<StatusChip text="Status: Active (2023)" />);
      
      const chip = screen.getByRole('status');
      expect(chip).toHaveTextContent('Status: Active (2023)');
    });
  });

  describe('CSS Classes', () => {
    it('should have base status-chip class', () => {
      const { container } = render(<StatusChip />);
      
      const chip = container.firstChild;
      expect(chip).toHaveClass('status-chip');
    });

    it('should combine base class with status modifier', () => {
      const { container } = render(<StatusChip status="pending" />);
      
      const chip = container.firstChild;
      expect(chip).toHaveClass('status-chip');
      expect(chip).toHaveClass('status-chip--pending');
    });

    it('should combine all classes correctly', () => {
      const { container } = render(
        <StatusChip status="active" className="custom-chip" />
      );
      
      const chip = container.firstChild;
      expect(chip).toHaveClass('status-chip');
      expect(chip).toHaveClass('status-chip--active');
      expect(chip).toHaveClass('custom-chip');
    });
  });
});