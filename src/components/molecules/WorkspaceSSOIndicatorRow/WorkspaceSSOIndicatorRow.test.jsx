import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkspaceSSOIndicatorRow from './WorkspaceSSOIndicatorRow';

describe('WorkspaceSSOIndicatorRow', () => {
  const defaultProps = {
    companyName: 'Acme Corp',
    avatarInitial: 'A',
    ssoProvider: 'Microsoft Entra ID',
    ssoType: 'SAML',
    domains: ['@acmecorp.com', '@acme-contractors.com'],
    status: 'active',
    statusText: 'Active',
    onDisconnect: jest.fn(),
    dashboardUrl: 'https://dashboard.workos.com/test'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with all default props', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} />);
      
      expect(screen.getByText('Acme Corp')).toBeInTheDocument();
      expect(screen.getByText('Microsoft Entra ID • SAML • @acmecorp.com, @acme-contractors.com')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Disconnect SSO')).toBeInTheDocument();
      expect(screen.getByText('WorkOS Dashboard')).toBeInTheDocument();
    });

    it('should render with minimal props', () => {
      render(<WorkspaceSSOIndicatorRow />);
      
      expect(screen.getByText('Acme Corp')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should display multiple domains correctly', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} />);
      
      expect(screen.getByText(/.*@acmecorp.com.*@acme-contractors.com.*/)).toBeInTheDocument();
    });

    it('should display single domain correctly', () => {
      const props = {
        ...defaultProps,
        domains: ['@single-domain.com']
      };
      render(<WorkspaceSSOIndicatorRow {...props} />);
      
      expect(screen.getByText(/.*@single-domain.com.*/)).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <WorkspaceSSOIndicatorRow {...defaultProps} className="custom-class" />
      );
      
      const element = container.firstChild;
      expect(element).toHaveClass('custom-class');
    });
  });

  describe('Status States', () => {
    it('should render active status', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} status="active" statusText="Active" />);
      
      const statusElement = screen.getByText('Active');
      expect(statusElement).toBeInTheDocument();
      expect(statusElement.parentElement).toHaveAttribute('role', 'status');
    });

    it('should render inactive status', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} status="inactive" statusText="Inactive" />);
      
      const statusElement = screen.getByText('Inactive');
      expect(statusElement).toBeInTheDocument();
    });

    it('should render pending status', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} status="pending" statusText="Pending" />);
      
      const statusElement = screen.getByText('Pending');
      expect(statusElement).toBeInTheDocument();
    });

    it('should render error status', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} status="error" statusText="Error" />);
      
      const statusElement = screen.getByText('Error');
      expect(statusElement).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onDisconnect when disconnect button is clicked', () => {
      const onDisconnect = jest.fn();
      render(<WorkspaceSSOIndicatorRow {...defaultProps} onDisconnect={onDisconnect} />);
      
      const disconnectButton = screen.getByRole('button', { name: /Disconnect SSO for Acme Corp/i });
      fireEvent.click(disconnectButton);
      
      expect(onDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should not error when onDisconnect is not provided', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} onDisconnect={undefined} />);
      
      const disconnectButton = screen.getByRole('button', { name: /Disconnect SSO/i });
      expect(() => fireEvent.click(disconnectButton)).not.toThrow();
    });

    it('should render dashboard link with correct href', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} />);
      
      const dashboardLink = screen.getByRole('link', { name: /WorkOS Dashboard for Acme Corp/i });
      expect(dashboardLink).toHaveAttribute('href', 'https://dashboard.workos.com/test');
      expect(dashboardLink).toHaveAttribute('target', '_blank');
      expect(dashboardLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should prevent default when dashboard URL is not provided', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} dashboardUrl="#" />);
      
      const dashboardLink = screen.getByRole('link', { name: /WorkOS Dashboard/i });
      const event = { preventDefault: jest.fn() };
      
      fireEvent.click(dashboardLink, event);
      expect(dashboardLink).toHaveAttribute('href', '#');
    });

    it('should handle empty dashboard URL', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} dashboardUrl="" />);
      
      const dashboardLink = screen.getByRole('link', { name: /WorkOS Dashboard/i });
      expect(dashboardLink).toHaveAttribute('href', '');
    });
  });

  describe('Avatar', () => {
    it('should render avatar with correct initial', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} avatarInitial="T" />);
      
      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('should render avatar with company name first letter when initial not provided', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} avatarInitial="AC" />);
      
      expect(screen.getByText('AC')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels for buttons', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} />);
      
      expect(screen.getByLabelText('Disconnect SSO for Acme Corp')).toBeInTheDocument();
      expect(screen.getByLabelText('Open WorkOS Dashboard for Acme Corp')).toBeInTheDocument();
    });

    it('should have proper aria label for status', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} />);
      
      const statusElement = screen.getByRole('status');
      expect(statusElement).toHaveAttribute('aria-label', 'Status: Active');
    });

    it('should render company name as heading', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Acme Corp');
    });

    it('should have proper keyboard navigation support', () => {
      render(<WorkspaceSSOIndicatorRow {...defaultProps} />);
      
      const disconnectButton = screen.getByRole('button', { name: /Disconnect SSO/i });
      const dashboardLink = screen.getByRole('link', { name: /WorkOS Dashboard/i });
      
      expect(disconnectButton).toHaveProperty('type', 'button');
      expect(dashboardLink).toHaveProperty('href');
    });
  });

  describe('Props Validation', () => {
    it('should handle empty domains array', () => {
      const props = {
        ...defaultProps,
        domains: []
      };
      render(<WorkspaceSSOIndicatorRow {...props} />);
      
      expect(screen.getByText(/Microsoft Entra ID • SAML •\s*$/)).toBeInTheDocument();
    });

    it('should handle very long company names', () => {
      const props = {
        ...defaultProps,
        companyName: 'Very Long Company Name That Might Overflow The Container'
      };
      render(<WorkspaceSSOIndicatorRow {...props} />);
      
      expect(screen.getByText('Very Long Company Name That Might Overflow The Container')).toBeInTheDocument();
    });

    it('should handle special characters in domains', () => {
      const props = {
        ...defaultProps,
        domains: ['@test-company.co.uk', '@test_company.org']
      };
      render(<WorkspaceSSOIndicatorRow {...props} />);
      
      expect(screen.getByText(/.*@test-company.co.uk.*@test_company.org.*/)).toBeInTheDocument();
    });
  });
});