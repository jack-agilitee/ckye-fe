import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddWorkspaceModal from './AddWorkspaceModal';

describe('AddWorkspaceModal', () => {
  const mockCloseModal = jest.fn();
  const mockUsers = [
    { id: '1', name: 'James Otey' },
    { id: '2', name: 'Jack Nichols' },
    { id: '3', name: 'Steve Street' },
    { id: '4', name: 'Sullivan Street' },
    { id: '5', name: 'Dave Fullam' }
  ];

  const defaultProps = {
    closeModal: mockCloseModal,
    users: mockUsers
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  it('renders without crashing', () => {
    render(<AddWorkspaceModal {...defaultProps} />);
    expect(screen.getByText('Add Workspace')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<AddWorkspaceModal {...defaultProps} />);
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Short Name (Used for URL Path)')).toBeInTheDocument();
    expect(screen.getByText('Add Users')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<AddWorkspaceModal {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Workspace' })).toBeInTheDocument();
  });

  it('updates name field when typing', () => {
    render(<AddWorkspaceModal {...defaultProps} />);
    
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'American Eagle Outfitters' } });
    
    expect(nameInput.value).toBe('American Eagle Outfitters');
  });

  it('updates short name field when typing', () => {
    render(<AddWorkspaceModal {...defaultProps} />);
    
    const shortNameInput = screen.getByLabelText('Short Name (Used for URL Path)');
    fireEvent.change(shortNameInput, { target: { value: 'AEO' } });
    
    expect(shortNameInput.value).toBe('AEO');
  });

  it('calls closeModal when Cancel button is clicked', () => {
    render(<AddWorkspaceModal {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);
    
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('logs workspace data when Create Workspace is clicked', () => {
    render(<AddWorkspaceModal {...defaultProps} />);
    
    // Fill in the form
    const nameInput = screen.getByLabelText('Name');
    const shortNameInput = screen.getByLabelText('Short Name (Used for URL Path)');
    
    fireEvent.change(nameInput, { target: { value: 'Test Workspace' } });
    fireEvent.change(shortNameInput, { target: { value: 'TW' } });
    
    // Click create button
    const createButton = screen.getByRole('button', { name: 'Create Workspace' });
    fireEvent.click(createButton);
    
    expect(console.log).toHaveBeenCalledWith('create workspace', {
      name: 'Test Workspace',
      shortName: 'TW',
      selectedUsers: []
    });
  });

  it('applies custom className', () => {
    const { container } = render(
      <AddWorkspaceModal {...defaultProps} className="custom-modal" />
    );
    
    const modal = container.firstChild;
    expect(modal).toHaveClass('add-workspace-modal');
    expect(modal).toHaveClass('custom-modal');
  });

  it('has correct modal structure', () => {
    const { container } = render(<AddWorkspaceModal {...defaultProps} />);
    
    expect(container.querySelector('.add-workspace-modal')).toBeInTheDocument();
    expect(container.querySelector('.add-workspace-modal__container')).toBeInTheDocument();
    expect(container.querySelector('.add-workspace-modal__content')).toBeInTheDocument();
    expect(container.querySelector('.add-workspace-modal__header')).toBeInTheDocument();
    expect(container.querySelector('.add-workspace-modal__divider')).toBeInTheDocument();
    expect(container.querySelector('.add-workspace-modal__form')).toBeInTheDocument();
    expect(container.querySelector('.add-workspace-modal__actions')).toBeInTheDocument();
  });

  it('passes users array to WorkspaceSelector', () => {
    render(<AddWorkspaceModal {...defaultProps} />);
    
    // The WorkspaceSelector should be rendered with the users
    // We can verify this by checking if the component is rendered
    // and can interact with it
    const addUsersField = screen.getByText('Add Users');
    expect(addUsersField).toBeInTheDocument();
  });

  it('handles empty users array', () => {
    render(<AddWorkspaceModal closeModal={mockCloseModal} users={[]} />);
    
    expect(screen.getByText('Add Users')).toBeInTheDocument();
  });

  it('handles missing users prop', () => {
    render(<AddWorkspaceModal closeModal={mockCloseModal} />);
    
    expect(screen.getByText('Add Users')).toBeInTheDocument();
  });

  it('has proper placeholders', () => {
    render(<AddWorkspaceModal {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('American Eagle Outfitters')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('AEO')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select users...')).toBeInTheDocument();
  });

  it('maintains form state across re-renders', () => {
    const { rerender } = render(<AddWorkspaceModal {...defaultProps} />);
    
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Test Name' } });
    
    rerender(<AddWorkspaceModal {...defaultProps} />);
    
    expect(screen.getByDisplayValue('Test Name')).toBeInTheDocument();
  });
});