# WorkspacesTable

A template component that displays a list of workspaces in a clean, non-interactive table format.

## Usage

```jsx
import WorkspacesTable from '@/components/templates/WorkspacesTable/WorkspacesTable';

const workspaces = [
  { id: 1, name: 'Americal Eagle' },
  { id: 2, name: 'Dollar General' },
  { id: 3, name: 'Agilitee' },
  { id: 4, name: 'Control4' },
  { id: 5, name: 'Subway' }
];

<WorkspacesTable workspaces={workspaces} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| workspaces | Array | [] | Array of workspace objects containing name and optional id |

## Workspace Object Structure

Each workspace object should have the following properties:

- `name` (string, required): The name of the workspace
- `id` (string/number, optional): Unique identifier for the workspace

## Features

- Clean, minimal design with dark background
- Non-interactive list items (no hover states or click handlers)
- Automatic text truncation for long workspace names
- Responsive layout that maintains proper spacing

## Styling

The component uses SCSS modules with BEM methodology. Key classes:

- `.workspaces-table` - Main container
- `.workspaces-table__header` - Header section with label
- `.workspaces-table__body` - Container for workspace rows
- `.workspaces-table__row` - Individual workspace row
- `.workspaces-table__item` - Wrapper for ListItem component

## Dependencies

- Uses the `ListItem` molecule component for displaying individual workspaces
- Requires global SCSS variables and mixins from the project styles

## Example

```jsx
const MyPage = () => {
  const workspaceData = [
    { id: 'ws-001', name: 'Americal Eagle' },
    { id: 'ws-002', name: 'Dollar General' },
    { id: 'ws-003', name: 'Agilitee' },
    { id: 'ws-004', name: 'Control4' },
    { id: 'ws-005', name: 'Subway' },
    { id: 'ws-006', name: 'Long Branch Mall' },
    { id: 'ws-007', name: 'Target' },
    { id: 'ws-008', name: 'Walmart' }
  ];

  return (
    <div className="page-container">
      <WorkspacesTable workspaces={workspaceData} />
    </div>
  );
};
```

## Notes

- This is a template-level component designed for full-page layouts
- The component is non-interactive by design (no click handlers or selection states)
- Long workspace names are automatically truncated with ellipsis
- The document icon is displayed for all workspace items