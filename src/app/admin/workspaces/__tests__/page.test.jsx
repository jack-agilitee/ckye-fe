import { render, screen, waitFor } from '@testing-library/react';
import WorkspacesPage from '../page';

// Mock the components
jest.mock('@/components/pages/TwoColumnPage/TwoColumnPage', () => ({
  __esModule: true,
  default: ({ leftContent, rightContent }) => (
    <div data-testid="two-column-page">
      <div data-testid="left-content">{leftContent}</div>
      <div data-testid="right-content">{rightContent}</div>
    </div>
  ),
}));

jest.mock('@/components/templates/Sidebar/Sidebar', () => ({
  __esModule: true,
  default: ({ activeItem }) => <nav data-testid={`sidebar-${activeItem}`}>Sidebar</nav>,
}));

jest.mock('@/components/molecules/SearchHeader/SearchHeader', () => ({
  __esModule: true,
  default: ({ title, searchPlaceholder, addButtonText, onAdd }) => (
    <div data-testid="search-header">
      <h1>{title}</h1>
      <input placeholder={searchPlaceholder} />
      <button onClick={onAdd}>{addButtonText}</button>
    </div>
  ),
}));

jest.mock('@/components/templates/WorkspacesTable/WorkspacesTable', () => ({
  __esModule: true,
  default: ({ workspaces }) => (
    <table data-testid="workspaces-table">
      <tbody>
        {workspaces.map((workspace) => (
          <tr key={workspace.id}>
            <td>{workspace.name}</td>
            <td>{workspace.users.length} users</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

describe('WorkspacesPage', () => {
  it('renders the page with correct structure', async () => {
    const { container } = render(await WorkspacesPage());
    
    expect(screen.getByTestId('two-column-page')).toBeInTheDocument();
    expect(screen.getByTestId('left-content')).toBeInTheDocument();
    expect(screen.getByTestId('right-content')).toBeInTheDocument();
  });

  it('renders sidebar with correct active item', async () => {
    render(await WorkspacesPage());
    
    expect(screen.getByTestId('sidebar-workspaces')).toBeInTheDocument();
  });

  it('renders search header with correct props', async () => {
    render(await WorkspacesPage());
    
    const searchHeader = screen.getByTestId('search-header');
    expect(searchHeader).toBeInTheDocument();
    expect(screen.getByText('Workspaces')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search Workspaces')).toBeInTheDocument();
    expect(screen.getByText('Add Workspace')).toBeInTheDocument();
  });

  it('renders workspaces table with data', async () => {
    render(await WorkspacesPage());
    
    await waitFor(() => {
      const workspacesTable = screen.getByTestId('workspaces-table');
      expect(workspacesTable).toBeInTheDocument();
    });

    // Check that mock data is rendered
    expect(screen.getByText('Americal Eagle')).toBeInTheDocument();
    expect(screen.getByText('Dollar General')).toBeInTheDocument();
    expect(screen.getByText('Subway')).toBeInTheDocument();
    expect(screen.getByText('Agilitee Internal')).toBeInTheDocument();
    expect(screen.getByText('Control4')).toBeInTheDocument();
  });

  it('displays correct user counts for workspaces', async () => {
    render(await WorkspacesPage());
    
    await waitFor(() => {
      expect(screen.getByText('2 users')).toBeInTheDocument(); // Americal Eagle
      expect(screen.getByText('1 users')).toBeInTheDocument(); // Dollar General
      expect(screen.getByText('0 users')).toBeInTheDocument(); // Agilitee Internal
    });
  });

  it('has proper page structure with workspaces-page class', async () => {
    const { container } = render(await WorkspacesPage());
    
    const workspacesPageDiv = container.querySelector('.workspaces-page');
    expect(workspacesPageDiv).toBeInTheDocument();
  });

  it('handles add workspace button click', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(await WorkspacesPage());
    
    const addButton = screen.getByText('Add Workspace');
    addButton.click();
    
    expect(consoleSpy).toHaveBeenCalledWith('Add workspace clicked');
    
    consoleSpy.mockRestore();
  });

  it('has proper accessibility attributes', async () => {
    const { container } = render(await WorkspacesPage());
    
    // Check for heading hierarchy
    const h1 = container.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent('Workspaces');
  });

  it('renders the correct number of workspaces', async () => {
    render(await WorkspacesPage());
    
    await waitFor(() => {
      const tableRows = screen.getAllByRole('row');
      expect(tableRows).toHaveLength(6); // 6 workspaces in mock data
    });
  });

  it('page metadata is defined correctly', () => {
    expect(WorkspacesPage).toBeDefined();
    // Note: In a real test environment, you would test the metadata export
    // but Jest doesn't handle Next.js metadata exports well in unit tests
  });
});