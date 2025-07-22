import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsersTable from './UsersTable';
import { SEAT_TYPES } from '../../molecules/SeatType/SeatType';

// Mock the molecule components
jest.mock('../../molecules/User/User', () => {
  return function MockUser({ name, email, className }) {
    return (
      <div className={className} data-testid="user-component">
        <span>{name}</span>
        <span>{email}</span>
      </div>
    );
  };
});

jest.mock('../../molecules/SeatType/SeatType', () => {
  return {
    __esModule: true,
    default: function MockSeatType({ type, className }) {
      return (
        <div className={className} data-testid="seat-type-component">
          {type}
        </div>
      );
    },
    SEAT_TYPES: {
      MEMBER: 'member',
      EDITOR: 'editor',
      ADMIN: 'admin'
    }
  };
});

describe('UsersTable', () => {
  const mockUsers = [
    {
      name: 'Andrew Venn',
      email: 'andrew@agilitee.com',
      userType: SEAT_TYPES.MEMBER,
      workspaces: ['Americal Eagle']
    },
    {
      name: 'Jack Nichols',
      email: 'jack@agilitee.com',
      userType: SEAT_TYPES.ADMIN,
      workspaces: ['Americal Eagle', 'Dollar General', 'Agilitee']
    },
    {
      name: 'Eli Eijadi',
      email: 'eli@agilitee.com',
      userType: SEAT_TYPES.MEMBER,
      workspaces: ['Americal Eagle', 'Agilitee']
    }
  ];

  it('renders without crashing', () => {
    render(<UsersTable users={[]} />);
  });

  it('renders table headers correctly', () => {
    render(<UsersTable users={[]} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('User Type')).toBeInTheDocument();
    expect(screen.getByText('Workspaces')).toBeInTheDocument();
  });

  it('renders empty table when no users provided', () => {
    const { container } = render(<UsersTable users={[]} />);
    const rows = container.querySelectorAll('.users-table__row');
    expect(rows).toHaveLength(0);
  });

  it('renders users correctly', () => {
    render(<UsersTable users={mockUsers} />);
    
    // Check if all users are rendered
    const userComponents = screen.getAllByTestId('user-component');
    expect(userComponents).toHaveLength(3);
    
    // Check if user data is passed correctly
    expect(screen.getByText('Andrew Venn')).toBeInTheDocument();
    expect(screen.getByText('andrew@agilitee.com')).toBeInTheDocument();
    
    // Check if seat types are rendered
    const seatTypeComponents = screen.getAllByTestId('seat-type-component');
    expect(seatTypeComponents).toHaveLength(3);
    expect(screen.getByText(SEAT_TYPES.MEMBER)).toBeInTheDocument();
    expect(screen.getByText(SEAT_TYPES.ADMIN)).toBeInTheDocument();
  });

  it('displays workspaces correctly', () => {
    render(<UsersTable users={mockUsers} />);
    
    // Single workspace
    expect(screen.getByText('Americal Eagle')).toBeInTheDocument();
    
    // Multiple workspaces
    expect(screen.getByText('Americal Eagle, Dollar General, Agilitee')).toBeInTheDocument();
    
    // Two workspaces
    expect(screen.getByText('Americal Eagle, Agilitee')).toBeInTheDocument();
  });

  it('truncates long workspace lists', () => {
    const userWithManyWorkspaces = {
      name: 'Test User',
      email: 'test@example.com',
      userType: SEAT_TYPES.MEMBER,
      workspaces: [
        'Workspace One',
        'Workspace Two',
        'Workspace Three',
        'Workspace Four',
        'Workspace Five',
        'Workspace Six'
      ]
    };
    
    render(<UsersTable users={[userWithManyWorkspaces]} />);
    
    // Check that the text is truncated
    const workspaceText = screen.getByText(/Workspace One.*\.\.\./);
    expect(workspaceText).toBeInTheDocument();
    expect(workspaceText.textContent).toHaveLength(50); // 47 chars + '...'
  });

  it('handles users with no workspaces', () => {
    const userWithNoWorkspaces = {
      name: 'No Workspace User',
      email: 'no-workspace@example.com',
      userType: SEAT_TYPES.MEMBER,
      workspaces: []
    };
    
    const { container } = render(<UsersTable users={[userWithNoWorkspaces]} />);
    
    // Find the workspaces column in the rendered row
    const workspaceColumns = container.querySelectorAll('.users-table__workspaces');
    expect(workspaceColumns[0].textContent).toBe('');
  });

  it('handles users with null/undefined workspaces', () => {
    const userWithNullWorkspaces = {
      name: 'Null Workspace User',
      email: 'null-workspace@example.com',
      userType: SEAT_TYPES.MEMBER,
      workspaces: null
    };
    
    const { container } = render(<UsersTable users={[userWithNullWorkspaces]} />);
    
    // Find the workspaces column in the rendered row
    const workspaceColumns = container.querySelectorAll('.users-table__workspaces');
    expect(workspaceColumns[0].textContent).toBe('');
  });

  it('renders with default empty array when users prop not provided', () => {
    const { container } = render(<UsersTable />);
    
    // Should render headers but no rows
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('User Type')).toBeInTheDocument();
    expect(screen.getByText('Workspaces')).toBeInTheDocument();
    
    const rows = container.querySelectorAll('.users-table__row');
    expect(rows).toHaveLength(0);
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<UsersTable users={mockUsers} />);
    
    // Check main container
    expect(container.querySelector('.users-table')).toBeInTheDocument();
    
    // Check header
    expect(container.querySelector('.users-table__header')).toBeInTheDocument();
    
    // Check body
    expect(container.querySelector('.users-table__body')).toBeInTheDocument();
    
    // Check rows
    const rows = container.querySelectorAll('.users-table__row');
    expect(rows).toHaveLength(3);
    
    // Check columns
    const firstRow = rows[0];
    const columns = firstRow.querySelectorAll('.users-table__column');
    expect(columns).toHaveLength(3);
  });
});