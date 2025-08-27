import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SSOConfigCard from './SSOConfigCard';

// Mock the WorkspaceSSOIndicatorRow component
jest.mock('@/components/molecules/WorkspaceSSOIndicatorRow/WorkspaceSSOIndicatorRow', () => {
  return function MockWorkspaceSSOIndicatorRow(props) {
    return (
      <div data-testid="workspace-sso-row">
        <div>{props.companyName}</div>
        <div>{props.ssoProvider}</div>
        <div>{props.statusText}</div>
        <button onClick={props.onDisconnect}>Disconnect SSO</button>
        <a href={props.dashboardUrl}>WorkOS Dashboard</a>
      </div>
    );
  };
});

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage(props) {
    return <img {...props} />;
  };
});

describe('SSOConfigCard', () => {
  const defaultProps = {
    companyName: 'American Eagle',
    title: 'SSO Configuration',
    description: 'Control who can access your Ckye workspace',
    onEnableSSO: jest.fn(),
    onDisconnect: jest.fn(),
    dashboardUrl: 'https://dashboard.workos.com'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Empty State', () => {
    it('should render empty state by default', () => {
      render(<SSOConfigCard {...defaultProps} />);
      
      expect(screen.getByText('Enable Single Sign-On for This Workspace')).toBeInTheDocument();
      expect(screen.getByText(/Connect via SAML or OIDC/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Enable SSO for American Eagle/i })).toBeInTheDocument();
    });

    it('should render with custom company name in button', () => {
      render(<SSOConfigCard {...defaultProps} companyName="Test Corp" />);
      
      expect(screen.getByRole('button', { name: /Enable SSO for Test Corp/i })).toBeInTheDocument();
    });

    it('should display lock icon in empty state', () => {
      render(<SSOConfigCard {...defaultProps} />);
      
      const icon = screen.getByAltText('');
      expect(icon).toHaveAttribute('src', '/lock.svg');
      expect(icon).toHaveAttribute('width', '40');
      expect(icon).toHaveAttribute('height', '40');
    });

    it('should call onEnableSSO when enable button is clicked', () => {
      const onEnableSSO = jest.fn();
      render(<SSOConfigCard {...defaultProps} onEnableSSO={onEnableSSO} />);
      
      const button = screen.getByRole('button', { name: /Enable SSO for American Eagle/i });
      fireEvent.click(button);
      
      expect(onEnableSSO).toHaveBeenCalledTimes(1);
    });

    it('should not error when onEnableSSO is not provided', () => {
      render(<SSOConfigCard {...defaultProps} onEnableSSO={undefined} />);
      
      const button = screen.getByRole('button', { name: /Enable SSO/i });
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('should render custom title and description', () => {
      render(
        <SSOConfigCard 
          {...defaultProps} 
          title="Custom Title"
          description="Custom description text"
        />
      );
      
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom description text')).toBeInTheDocument();
    });
  });

  describe('Connected State', () => {
    const connectedProps = {
      ...defaultProps,
      state: 'connected',
      ssoProvider: 'Microsoft Entra ID',
      ssoType: 'SAML',
      domains: ['@acmecorp.com', '@acme-contractors.com'],
      ssoStatus: 'active',
      ssoStatusText: 'Active',
      avatarInitial: 'A',
      connectionId: 'con_01HQNFK5BN5TQHXP3S1P9HFMZG',
      createdDate: '8/26/2025',
      loginUrl: 'ckye.ai/login/acme-corp?sso'
    };

    it('should render connected state with WorkspaceSSOIndicatorRow', () => {
      render(<SSOConfigCard {...connectedProps} />);
      
      expect(screen.getByTestId('workspace-sso-row')).toBeInTheDocument();
      expect(screen.getByText('American Eagle')).toBeInTheDocument();
      expect(screen.getByText('Microsoft Entra ID')).toBeInTheDocument();
    });

    it('should display connection metadata', () => {
      render(<SSOConfigCard {...connectedProps} />);
      
      expect(screen.getByText('Connection ID:')).toBeInTheDocument();
      expect(screen.getByText('con_01HQNFK5BN5TQHXP3S1P9HFMZG')).toBeInTheDocument();
      expect(screen.getByText('Created:')).toBeInTheDocument();
      expect(screen.getByText('8/26/2025')).toBeInTheDocument();
      expect(screen.getByText('Login URL:')).toBeInTheDocument();
      expect(screen.getByText('ckye.ai/login/acme-corp?sso')).toBeInTheDocument();
    });

    it('should pass correct props to WorkspaceSSOIndicatorRow', () => {
      render(<SSOConfigCard {...connectedProps} />);
      
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Disconnect SSO/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /WorkOS Dashboard/i })).toHaveAttribute('href', 'https://dashboard.workos.com');
    });

    it('should handle disconnect callback', () => {
      const onDisconnect = jest.fn();
      render(<SSOConfigCard {...connectedProps} onDisconnect={onDisconnect} />);
      
      const disconnectButton = screen.getByRole('button', { name: /Disconnect SSO/i });
      fireEvent.click(disconnectButton);
      
      expect(onDisconnect).toHaveBeenCalledTimes(1);
    });

    it('should not show enable button in connected state', () => {
      render(<SSOConfigCard {...connectedProps} />);
      
      expect(screen.queryByText('Enable Single Sign-On for This Workspace')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Enable SSO/i })).not.toBeInTheDocument();
    });

    it('should render with custom metadata values', () => {
      render(
        <SSOConfigCard 
          {...connectedProps}
          connectionId="custom_connection_123"
          createdDate="1/1/2024"
          loginUrl="custom.domain.com/sso"
        />
      );
      
      expect(screen.getByText('custom_connection_123')).toBeInTheDocument();
      expect(screen.getByText('1/1/2024')).toBeInTheDocument();
      expect(screen.getByText('custom.domain.com/sso')).toBeInTheDocument();
    });
  });

  describe('Common Props', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <SSOConfigCard {...defaultProps} className="custom-class" />
      );
      
      const element = container.firstChild;
      expect(element).toHaveClass('custom-class');
    });

    it('should render header in both states', () => {
      const { rerender } = render(<SSOConfigCard {...defaultProps} state="empty" />);
      
      expect(screen.getByText('SSO Configuration')).toBeInTheDocument();
      expect(screen.getByText('Control who can access your Ckye workspace')).toBeInTheDocument();
      
      rerender(<SSOConfigCard {...defaultProps} state="connected" />);
      
      expect(screen.getByText('SSO Configuration')).toBeInTheDocument();
      expect(screen.getByText('Control who can access your Ckye workspace')).toBeInTheDocument();
    });
  });

  describe('State Transitions', () => {
    it('should transition from empty to connected state', () => {
      const { rerender } = render(<SSOConfigCard {...defaultProps} state="empty" />);
      
      expect(screen.getByText('Enable Single Sign-On for This Workspace')).toBeInTheDocument();
      expect(screen.queryByTestId('workspace-sso-row')).not.toBeInTheDocument();
      
      rerender(<SSOConfigCard {...defaultProps} state="connected" />);
      
      expect(screen.queryByText('Enable Single Sign-On for This Workspace')).not.toBeInTheDocument();
      expect(screen.getByTestId('workspace-sso-row')).toBeInTheDocument();
    });

    it('should transition from connected to empty state', () => {
      const { rerender } = render(<SSOConfigCard {...defaultProps} state="connected" />);
      
      expect(screen.getByTestId('workspace-sso-row')).toBeInTheDocument();
      expect(screen.queryByText('Enable Single Sign-On for This Workspace')).not.toBeInTheDocument();
      
      rerender(<SSOConfigCard {...defaultProps} state="empty" />);
      
      expect(screen.queryByTestId('workspace-sso-row')).not.toBeInTheDocument();
      expect(screen.getByText('Enable Single Sign-On for This Workspace')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels for interactive elements', () => {
      render(<SSOConfigCard {...defaultProps} state="empty" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Enable SSO for American Eagle');
    });

    it('should use semantic HTML elements', () => {
      render(<SSOConfigCard {...defaultProps} />);
      
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('SSO Configuration');
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Enable Single Sign-On for This Workspace');
    });

    it('should have proper button type', () => {
      render(<SSOConfigCard {...defaultProps} state="empty" />);
      
      const button = screen.getByRole('button', { name: /Enable SSO/i });
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined state as empty', () => {
      render(<SSOConfigCard {...defaultProps} state={undefined} />);
      
      expect(screen.getByText('Enable Single Sign-On for This Workspace')).toBeInTheDocument();
    });

    it('should handle invalid state as empty', () => {
      render(<SSOConfigCard {...defaultProps} state="invalid" />);
      
      expect(screen.getByText('Enable Single Sign-On for This Workspace')).toBeInTheDocument();
    });

    it('should handle long company names', () => {
      const longName = 'Very Long Company Name That Might Overflow The Container';
      render(<SSOConfigCard {...defaultProps} companyName={longName} />);
      
      expect(screen.getByRole('button', { name: new RegExp(longName, 'i') })).toBeInTheDocument();
    });

    it('should handle long metadata values', () => {
      const longConnectionId = 'con_' + 'x'.repeat(100);
      render(
        <SSOConfigCard 
          {...defaultProps} 
          state="connected"
          connectionId={longConnectionId}
        />
      );
      
      expect(screen.getByText(longConnectionId)).toBeInTheDocument();
    });
  });
});