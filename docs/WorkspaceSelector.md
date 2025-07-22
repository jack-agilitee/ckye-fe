# WorkspaceSelector Component

A multi-select autocomplete component for selecting workspace members with chip display and keyboard navigation support.

## Figma Reference
- Main Component: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=10-1597&m=dev
- Dropdown Design: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=45-2339&m=dev

## Usage

```jsx
import WorkspaceSelector from '@/components/molecules/WorkspaceSelector/WorkspaceSelector';

const MyComponent = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  const users = [
    { id: '1', name: 'James Otey' },
    { id: '2', name: 'Jack Nichols' },
    { id: '3', name: 'Steve Street' },
    { id: '4', name: 'Sullivan Street' },
    { id: '5', name: 'Dave Fullam' }
  ];

  return (
    <WorkspaceSelector
      label="Workspace"
      placeholder="Select workspace members..."
      options={users}
      value={selectedUsers}
      onChange={setSelectedUsers}
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | 'Workspace' | Label text displayed above the field |
| `placeholder` | string | 'Select workspace members...' | Placeholder text shown when no items selected |
| `options` | array | [] | Array of option objects with `id` and `name` properties |
| `value` | array | [] | Array of selected option objects |
| `onChange` | function | undefined | Callback fired when selection changes |
| `className` | string | '' | Additional CSS class for styling |

## Features

- **Multi-select**: Select multiple workspace members
- **Chip display**: Selected items shown as dismissible chips
- **Autocomplete**: Type to filter available options
- **Keyboard navigation**: Full keyboard support with arrow keys, Enter, and Escape
- **Click outside**: Dropdown closes when clicking outside
- **Accessible**: Proper ARIA attributes for screen readers

## Keyboard Shortcuts

- `↓` Arrow Down: Open dropdown or navigate to next option
- `↑` Arrow Up: Navigate to previous option
- `Enter`: Select focused option or open dropdown
- `Escape`: Close dropdown
- `Backspace`: Remove last chip when input is empty

## Composition

This component uses:
- `Chip` atom component for displaying selected values
- SCSS modules with BEM methodology for styling
- React hooks for state management and effects

## Example with Pre-selected Values

```jsx
const [selectedUsers, setSelectedUsers] = useState([
  { id: '1', name: 'James Otey' },
  { id: '2', name: 'Jack Nichols' }
]);

return (
  <WorkspaceSelector
    options={allUsers}
    value={selectedUsers}
    onChange={setSelectedUsers}
  />
);
```

## Testing

The component includes comprehensive tests covering:
- Rendering and display
- User interactions (click, type, keyboard navigation)
- Selection and removal of items
- Filtering functionality
- Accessibility features

Run tests with:
```bash
npm run test WorkspaceSelector.test.jsx
```