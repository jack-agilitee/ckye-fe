import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SSOConnectionModal from './SSOConnectionModal';

describe('SSOConnectionModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConnect = jest.fn();
  
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConnect: mockOnConnect,
    emailDomainOptions: [
      { id: '1', name: '@company.com' },
      { id: '2', name: '@example.org' },
      { id: '3', name: '@test.io' }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <SSOConnectionModal {...defaultProps} isOpen={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content when open', () => {
    render(<SSOConnectionModal {...defaultProps} />);
    
    expect(screen.getByText('Connect WorkOS Organization')).toBeInTheDocument();
    expect(screen.getByText('Link an existing WorkOS organization to this Workspace')).toBeInTheDocument();
    expect(screen.getByText('Before you Begin')).toBeInTheDocument();
  });

  it('displays all form fields', () => {
    render(<SSOConnectionModal {...defaultProps} />);
    
    expect(screen.getByLabelText('Organization ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Custom Slug (Optional)')).toBeInTheDocument();
    expect(screen.getByText('Allowed email domains')).toBeInTheDocument();
  });

  it('displays setup checklist', () => {
    render(<SSOConnectionModal {...defaultProps} />);
    
    expect(screen.getByText('Setup Checklist')).toBeInTheDocument();
    expect(screen.getByText('Created organization in WorkOS Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Configured SSO connection (Microsoft, Google, Okta, etc.)')).toBeInTheDocument();
    expect(screen.getByText('Tested authentication in WorkOS')).toBeInTheDocument();
    expect(screen.getByText('Ready to connect to Ckye')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<SSOConnectionModal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside modal', async () => {
    const { container } = render(<SSOConnectionModal {...defaultProps} />);
    
    const overlay = container.querySelector('.sso-connection-modal__overlay').parentElement;
    fireEvent.mouseDown(overlay);
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call onClose when clicking inside modal', () => {
    render(<SSOConnectionModal {...defaultProps} />);
    
    const modalContent = screen.getByRole('dialog');
    fireEvent.mouseDown(modalContent);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('updates organization ID input', () => {
    render(<SSOConnectionModal {...defaultProps} />);
    
    const orgIdInput = screen.getByLabelText('Organization ID');
    fireEvent.change(orgIdInput, { target: { value: 'org_test123' } });
    
    expect(orgIdInput.value).toBe('org_test123');
  });

  it('updates custom slug input', () => {
    render(<SSOConnectionModal {...defaultProps} />);
    
    const slugInput = screen.getByLabelText('Custom Slug (Optional)');
    fireEvent.change(slugInput, { target: { value: 'test-company' } });
    
    expect(slugInput.value).toBe('test-company');
  });

  it('disables connect button when organization ID is empty', () => {
    render(<SSOConnectionModal {...defaultProps} />);
    
    const connectButton = screen.getByText('Connect Workspace');
    expect(connectButton).toBeDisabled();
  });

  it('enables connect button when organization ID is provided', () => {
    render(<SSOConnectionModal {...defaultProps} />);
    
    const orgIdInput = screen.getByLabelText('Organization ID');
    fireEvent.change(orgIdInput, { target: { value: 'org_test123' } });
    
    const connectButton = screen.getByText('Connect Workspace');
    expect(connectButton).not.toBeDisabled();
  });

  it('calls onConnect with form data when connect button is clicked', () => {
    render(<SSOConnectionModal {...defaultProps} />);
    
    const orgIdInput = screen.getByLabelText('Organization ID');
    const slugInput = screen.getByLabelText('Custom Slug (Optional)');
    
    fireEvent.change(orgIdInput, { target: { value: 'org_test123' } });
    fireEvent.change(slugInput, { target: { value: 'test-company' } });
    
    const connectButton = screen.getByText('Connect Workspace');
    fireEvent.click(connectButton);
    
    expect(mockOnConnect).toHaveBeenCalledWith({
      organizationId: 'org_test123',
      customSlug: 'test-company',
      emailDomains: []
    });
  });

  it('renders custom dashboard link', () => {
    const customLink = 'https://custom.workos.com';
    render(
      <SSOConnectionModal 
        {...defaultProps} 
        dashboardLink={customLink}
      />
    );
    
    const link = screen.getByText('WorkOS Dashboard');
    expect(link).toHaveAttribute('href', customLink);
  });

  it('applies custom className', () => {
    const { container } = render(
      <SSOConnectionModal 
        {...defaultProps} 
        className="custom-class"
      />
    );
    
    const modal = container.firstChild;
    expect(modal).toHaveClass('custom-class');
  });

  it('displays helper text for form fields', () => {
    render(<SSOConnectionModal {...defaultProps} />);
    
    expect(screen.getByText('Find this in WorkOS Dashboard → Organizations → Your Organization')).toBeInTheDocument();
    expect(screen.getByText('For branded login URLs like ckye.ai/login/acme-corp')).toBeInTheDocument();
    expect(screen.getByText('Only users with these email domains can be invited')).toBeInTheDocument();
  });
});