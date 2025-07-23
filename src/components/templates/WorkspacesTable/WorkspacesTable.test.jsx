import { render, screen } from '@testing-library/react';
import WorkspacesTable from './WorkspacesTable';

describe('WorkspacesTable', () => {
  const mockWorkspaces = [
    { id: 1, name: 'Americal Eagle' },
    { id: 2, name: 'Dollar General' },
    { id: 3, name: 'Agilitee' },
    { id: 4, name: 'Control4' },
    { id: 5, name: 'Subway' }
  ];

  it('renders without crashing', () => {
    render(<WorkspacesTable />);
    expect(screen.getByText('Workspaces')).toBeInTheDocument();
  });

  it('renders header correctly', () => {
    render(<WorkspacesTable workspaces={[]} />);
    const header = screen.getByText('Workspaces');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('workspaces-table__header-text');
  });

  it('renders empty state when no workspaces provided', () => {
    const { container } = render(<WorkspacesTable workspaces={[]} />);
    const body = container.querySelector('.workspaces-table__body');
    expect(body).toBeInTheDocument();
    expect(body.children).toHaveLength(0);
  });

  it('renders all workspaces', () => {
    render(<WorkspacesTable workspaces={mockWorkspaces} />);
    
    mockWorkspaces.forEach(workspace => {
      expect(screen.getByText(workspace.name)).toBeInTheDocument();
    });
  });

  it('renders correct number of workspace rows', () => {
    const { container } = render(<WorkspacesTable workspaces={mockWorkspaces} />);
    const rows = container.querySelectorAll('.workspaces-table__row');
    expect(rows).toHaveLength(mockWorkspaces.length);
  });

  it('uses workspace id as key when available', () => {
    const { container } = render(<WorkspacesTable workspaces={mockWorkspaces} />);
    const rows = container.querySelectorAll('.workspaces-table__row');
    expect(rows).toHaveLength(5);
  });

  it('handles workspaces without ids', () => {
    const workspacesWithoutIds = [
      { name: 'Workspace 1' },
      { name: 'Workspace 2' },
      { name: 'Workspace 3' }
    ];
    
    render(<WorkspacesTable workspaces={workspacesWithoutIds} />);
    
    workspacesWithoutIds.forEach(workspace => {
      expect(screen.getByText(workspace.name)).toBeInTheDocument();
    });
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<WorkspacesTable workspaces={mockWorkspaces} />);
    
    expect(container.firstChild).toHaveClass('workspaces-table');
    expect(container.querySelector('.workspaces-table__header')).toBeInTheDocument();
    expect(container.querySelector('.workspaces-table__body')).toBeInTheDocument();
  });

  it('renders ListItem components for each workspace', () => {
    const { container } = render(<WorkspacesTable workspaces={mockWorkspaces} />);
    const listItems = container.querySelectorAll('.list-item');
    expect(listItems).toHaveLength(mockWorkspaces.length);
  });

  it('passes correct props to ListItem components', () => {
    const { container } = render(<WorkspacesTable workspaces={mockWorkspaces} />);
    const firstListItem = container.querySelector('.list-item');
    
    // Check that the text is rendered
    expect(firstListItem).toHaveTextContent(mockWorkspaces[0].name);
    
    // Check that it's not selected (no selected modifier class)
    expect(firstListItem).not.toHaveClass('list-item--selected');
  });
});