# AddWorkspaceModal

A modal component for creating new workspaces with user selection functionality.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=51-2495&m=dev
- Node ID: 51:2495

## Usage

```jsx
import AddWorkspaceModal from '@/components/organisms/AddWorkspaceModal/AddWorkspaceModal';

const MyPage = () => {
  const [showModal, setShowModal] = useState(false);
  
  const users = [
    { id: '1', name: 'James Otey' },
    { id: '2', name: 'Jack Nichols' },
    { id: '3', name: 'Steve Street' },
    { id: '4', name: 'Sullivan Street' },
    { id: '5', name: 'Dave Fullam' }
  ];

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Add Workspace</button>
      
      {showModal && (
        <AddWorkspaceModal 
          closeModal={handleCloseModal}
          users={users}
        />
      )}
    </>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| closeModal | function | - | Callback function called when Cancel button is clicked or modal should close |
| users | array | [] | Array of user objects for the WorkspaceSelector |
| className | string | '' | Additional CSS classes |

## User Object Structure

Each user object in the users array should have:
- `id` (string): Unique identifier
- `name` (string): Display name of the user

## Features

- **Form Fields**: Name and Short Name text inputs for workspace details
- **User Selection**: Multi-select user field using WorkspaceSelector component
- **State Management**: Controlled form inputs with React state
- **Modal Overlay**: Fixed position overlay with semi-transparent background
- **Responsive Design**: Adapts to smaller screens
- **Accessibility**: Proper labels and ARIA attributes

## Component Composition

This organism is composed of:
- **TextField** (atom): For Name and Short Name inputs
- **WorkspaceSelector** (molecule): For multi-user selection
- **Button** (atom): For Cancel and Create Workspace actions

## Behavior

- **Cancel Button**: Calls the `closeModal` prop function
- **Create Workspace Button**: Logs workspace data to console and shows TODO for API integration
- **Form State**: Maintains local state for all form fields
- **User Selection**: Uses WorkspaceSelector's built-in chip functionality

## Example with State Management

```jsx
const WorkspaceManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  
  const allUsers = [
    { id: '1', name: 'James Otey' },
    { id: '2', name: 'Jack Nichols' },
    { id: '3', name: 'Steve Street' }
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <Button onClick={handleOpenModal}>
        Add New Workspace
      </Button>

      {isModalOpen && (
        <AddWorkspaceModal 
          closeModal={handleCloseModal}
          users={allUsers}
        />
      )}

      <div>
        {workspaces.map(workspace => (
          <div key={workspace.id}>{workspace.name}</div>
        ))}
      </div>
    </div>
  );
};
```

## Styling

The component uses SCSS modules with BEM methodology. Key classes:

- `.add-workspace-modal` - Main modal container with overlay
- `.add-workspace-modal__container` - Scrollable content wrapper
- `.add-workspace-modal__content` - Modal content box
- `.add-workspace-modal__header` - Header section
- `.add-workspace-modal__title` - Modal title
- `.add-workspace-modal__divider` - Horizontal separator
- `.add-workspace-modal__form` - Form fields container
- `.add-workspace-modal__actions` - Button container

## TODO

- Hook up API call for workspace creation in `handleCreateWorkspace`
- Add form validation (required fields, short name format)
- Add loading state during API call
- Add error handling for API failures
- Consider adding close on escape key
- Consider adding close on background click

## Accessibility

- All form fields have proper labels
- Modal has appropriate z-index for stacking
- Buttons are keyboard accessible
- Form inputs support standard keyboard navigation

## Testing

The component includes comprehensive tests covering:
- Rendering with required props
- Form field interactions
- Button click handlers
- State management
- Prop validation
- Custom className application