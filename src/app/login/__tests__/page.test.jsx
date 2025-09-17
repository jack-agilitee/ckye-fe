import { render, screen, fireEvent } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import LoginPage from '../page';

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn()
}));

// Mock Button component
jest.mock('@/components/atoms/Button/Button', () => ({
  __esModule: true,
  default: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login page with correct structure', () => {
    render(<LoginPage />);
    
    // Check main elements
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Log in with your SAML or OIDC provider')).toBeInTheDocument();
    expect(screen.getByText('Single Sign On')).toBeInTheDocument();
  });

  it('renders the Ckye definition section', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Ckye')).toBeInTheDocument();
    expect(screen.getByText('/sky/')).toBeInTheDocument();
    expect(screen.getByText('noun.')).toBeInTheDocument();
    expect(screen.getByText(/A benevolent digital deity/)).toBeInTheDocument();
  });

  it('renders the footer', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Made with ❤️ by Agilitee')).toBeInTheDocument();
  });

  it('calls signIn with azure-ad when button is clicked', () => {
    render(<LoginPage />);
    
    const signInButton = screen.getByRole('button', { name: /Single Sign On/i });
    fireEvent.click(signInButton);
    
    expect(signIn).toHaveBeenCalledWith('azure-ad');
    expect(signIn).toHaveBeenCalledTimes(1);
  });

  it('renders the sign in button', () => {
    render(<LoginPage />);
    
    const button = screen.getByRole('button', { name: /Single Sign On/i });
    expect(button).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<LoginPage />);
    
    // Check for heading hierarchy
    const h1 = container.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent('Welcome Back');
    
    const h2 = container.querySelector('h2');
    expect(h2).toBeInTheDocument();
    expect(h2).toHaveTextContent('Ckye');
    
    // Check button is accessible
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<LoginPage />);
    
    // Check main container has login class
    const loginDiv = container.querySelector('.login');
    expect(loginDiv).toBeInTheDocument();
    
    // Check other key elements have their classes
    expect(container.querySelector('.login__container')).toBeInTheDocument();
    expect(container.querySelector('.login__header')).toBeInTheDocument();
    expect(container.querySelector('.login__button')).toBeInTheDocument();
    expect(container.querySelector('.login__definition')).toBeInTheDocument();
    expect(container.querySelector('.login__footer')).toBeInTheDocument();
  });

  it('does not have any form fields', () => {
    render(<LoginPage />);
    
    // Ensure no input fields exist
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });
});