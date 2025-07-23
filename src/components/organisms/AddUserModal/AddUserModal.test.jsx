import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddUserModal from './AddUserModal';

// Mock the atomic components
jest.mock('@/components/atoms/TextField/TextField', () => {
  return function TextField({ label, value, onChange, placeholder }) {
    return (
      <div>
        <label>{label}</label>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          data-testid={`textfield-${label.toLowerCase()}`}
        />
      </div>
    );
  };
});

jest.mock('@/components/atoms/Dropdown/Dropdown', () => {
  return function Dropdown({ label, value, onChange, options, placeholder }) {
    return (
      <div>
        <label>{label}</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-testid="dropdown-workspace"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

jest.mock('@/components/atoms/Button/Button', () => {
  return function Button({ children, onClick, variant, className }) {
    return (
      <button onClick={onClick} className={className} data-variant={variant}>
        {children}
      </button>
    );
  };
});

describe('AddUserModal', () => {
  const mockCloseModal = jest.fn();
  const mockWorkspaces = [
    { id: '1', name: 'Workspace 1' },
    { id: '2', name: 'Workspace 2' },
    { id: '3', name: 'Workspace 3' }
  ];

  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  it('should render the modal with all form fields', () => {
    render(<AddUserModal closeModal={mockCloseModal} workspaces={mockWorkspaces} />);
    
    expect(screen.getByText('Add User')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Invite Members')).toBeInTheDocument();
  });

  it('should call closeModal when Cancel button is clicked', () => {
    render(<AddUserModal closeModal={mockCloseModal} workspaces={mockWorkspaces} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('should update name state when name field changes', () => {
    render(<AddUserModal closeModal={mockCloseModal} workspaces={mockWorkspaces} />);
    
    const nameInput = screen.getByTestId('textfield-name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(nameInput.value).toBe('John Doe');
  });

  it('should update email state when email field changes', () => {
    render(<AddUserModal closeModal={mockCloseModal} workspaces={mockWorkspaces} />);
    
    const emailInput = screen.getByTestId('textfield-email');
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    
    expect(emailInput.value).toBe('john@example.com');
  });

  it('should update workspace state when dropdown selection changes', () => {
    render(<AddUserModal closeModal={mockCloseModal} workspaces={mockWorkspaces} />);
    
    const workspaceDropdown = screen.getByTestId('dropdown-workspace');
    fireEvent.change(workspaceDropdown, { target: { value: '2' } });
    
    expect(workspaceDropdown.value).toBe('2');
  });

  it('should log form data when Invite Members is clicked', () => {
    render(<AddUserModal closeModal={mockCloseModal} workspaces={mockWorkspaces} />);
    
    // Fill in the form
    const nameInput = screen.getByTestId('textfield-name');
    const emailInput = screen.getByTestId('textfield-email');
    const workspaceDropdown = screen.getByTestId('dropdown-workspace');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(workspaceDropdown, { target: { value: '2' } });
    
    // Click Invite Members
    const inviteButton = screen.getByText('Invite Members');
    fireEvent.click(inviteButton);
    
    expect(consoleLogSpy).toHaveBeenCalledWith('calling create user');
    expect(consoleLogSpy).toHaveBeenCalledWith('Name:', 'John Doe');
    expect(consoleLogSpy).toHaveBeenCalledWith('Email:', 'john@example.com');
    expect(consoleLogSpy).toHaveBeenCalledWith('Selected Workspace:', '2');
  });

  it('should render with empty workspaces array', () => {
    render(<AddUserModal closeModal={mockCloseModal} workspaces={[]} />);
    
    const workspaceDropdown = screen.getByTestId('dropdown-workspace');
    expect(workspaceDropdown.children.length).toBe(1); // Only placeholder option
  });

  it('should render without workspaces prop', () => {
    render(<AddUserModal closeModal={mockCloseModal} />);
    
    expect(screen.getByText('Add User')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(<AddUserModal closeModal={mockCloseModal} workspaces={mockWorkspaces} />);
    
    expect(container.querySelector('.add-user-modal')).toBeInTheDocument();
    expect(container.querySelector('.add-user-modal__container')).toBeInTheDocument();
    expect(container.querySelector('.add-user-modal__content')).toBeInTheDocument();
    expect(container.querySelector('.add-user-modal__header')).toBeInTheDocument();
    expect(container.querySelector('.add-user-modal__title')).toBeInTheDocument();
    expect(container.querySelector('.add-user-modal__divider')).toBeInTheDocument();
    expect(container.querySelector('.add-user-modal__form')).toBeInTheDocument();
    expect(container.querySelector('.add-user-modal__actions')).toBeInTheDocument();
  });

  it('should handle workspaces without id property', () => {
    const workspacesWithoutId = [
      { name: 'Workspace A' },
      { name: 'Workspace B' }
    ];
    
    render(<AddUserModal closeModal={mockCloseModal} workspaces={workspacesWithoutId} />);
    
    const workspaceDropdown = screen.getByTestId('dropdown-workspace');
    expect(workspaceDropdown.children.length).toBe(3); // Placeholder + 2 options
    expect(screen.getByText('Workspace A')).toBeInTheDocument();
    expect(screen.getByText('Workspace B')).toBeInTheDocument();
  });

  it('should not close modal when Invite Members is clicked', () => {
    render(<AddUserModal closeModal={mockCloseModal} workspaces={mockWorkspaces} />);
    
    const inviteButton = screen.getByText('Invite Members');
    fireEvent.click(inviteButton);
    
    expect(mockCloseModal).not.toHaveBeenCalled();
  });
});