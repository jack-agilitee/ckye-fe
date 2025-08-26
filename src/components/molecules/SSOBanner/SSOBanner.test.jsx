import { render, screen } from '@testing-library/react';
import SSOBanner from './SSOBanner';

describe('SSOBanner', () => {
  describe('Default Props', () => {
    it('renders with default props', () => {
      render(<SSOBanner />);
      
      expect(screen.getByText('Before you Begin')).toBeInTheDocument();
      expect(screen.getByText(/You'll need to have already created/)).toBeInTheDocument();
      expect(screen.getByText('go to WorkOS Dashboard.')).toBeInTheDocument();
    });

    it('renders default link with correct attributes', () => {
      render(<SSOBanner />);
      
      const link = screen.getByText('go to WorkOS Dashboard.');
      expect(link).toHaveAttribute('href', 'https://dashboard.workos.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Custom Props', () => {
    it('renders with custom title', () => {
      render(<SSOBanner title="Custom Title" />);
      
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders with custom description', () => {
      render(<SSOBanner description="Custom description text " />);
      
      expect(screen.getByText(/Custom description text/)).toBeInTheDocument();
    });

    it('renders with custom link text', () => {
      render(<SSOBanner linkText="Click here" />);
      
      expect(screen.getByText('Click here')).toBeInTheDocument();
    });

    it('renders with custom link URL', () => {
      render(<SSOBanner linkUrl="https://example.com" />);
      
      const link = screen.getByText('go to WorkOS Dashboard.');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('renders internal link when linkTarget is not _blank', () => {
      render(<SSOBanner linkTarget="_self" linkUrl="/dashboard" />);
      
      const link = screen.getByText('go to WorkOS Dashboard.');
      expect(link).toHaveAttribute('href', '/dashboard');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
    });
  });

  describe('CSS Classes', () => {
    it('applies custom className', () => {
      const { container } = render(<SSOBanner className="custom-class" />);
      
      const banner = container.firstChild;
      expect(banner).toHaveClass('custom-class');
    });

    it('has correct BEM classes', () => {
      const { container } = render(<SSOBanner />);
      
      const banner = container.firstChild;
      expect(banner).toHaveClass('sso-banner');
      expect(screen.getByRole('heading')).toHaveClass('sso-banner__title');
      expect(screen.getByText(/You'll need to have already created/).parentElement).toHaveClass('sso-banner__description');
      expect(screen.getByRole('link')).toHaveClass('sso-banner__link');
    });
  });

  describe('Accessibility', () => {
    it('renders title as h3 heading', () => {
      render(<SSOBanner />);
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Before you Begin');
    });

    it('external link has security attributes', () => {
      render(<SSOBanner />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('link is keyboard accessible', () => {
      render(<SSOBanner />);
      
      const link = screen.getByRole('link');
      expect(link).toBeVisible();
      expect(link.tagName.toLowerCase()).toBe('a');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string props', () => {
      render(
        <SSOBanner 
          title=""
          description=""
          linkText=""
          linkUrl=""
        />
      );
      
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('');
    });

    it('handles very long text content', () => {
      const longTitle = 'A'.repeat(100);
      const longDescription = 'B'.repeat(500);
      
      render(
        <SSOBanner 
          title={longTitle}
          description={longDescription}
        />
      );
      
      expect(screen.getByText(longTitle)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(longDescription.substring(0, 50)))).toBeInTheDocument();
    });
  });
});