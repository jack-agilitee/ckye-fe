# AddUserModal Component

## Overview
The AddUserModal component is a modal dialog for adding new users to the system. It provides a form interface with fields for name, email, and workspace selection, following the Figma design specifications.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=9-1000&m=dev
- Node ID: 9:1000

## Features
- Form with three input fields: Name, Email, and Workspace selection
- State management for all form inputs
- Integration with existing atomic components (TextField, Dropdown, Button)
- Modal overlay with centered content
- Responsive design for mobile devices
- Console logging of form data (placeholder for API integration)

## Usage

```jsx
import AddUserModal from '@/components/organisms/AddUserModal/AddUserModal';

const MyComponent = () => {
  const [showModal, setShowModal] = useState(false);
  
  const workspaces = [
    { id: '1', name: 'Development Team' },
    { id: '2', name: 'Design Team' },
    { id: '3', name: 'Marketing Team' }
  ];

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>Add User</button>
      
      {showModal && (
        <AddUserModal 
          closeModal={handleCloseModal}
          workspaces={workspaces}
        />
      )}
    </>
  );
};
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| closeModal | function | Yes | - | Callback function to close the modal |
| workspaces | array | No | [] | Array of workspace objects with `id` and `name` properties |

## Workspace Object Structure

```javascript
{
  id: string,    // Unique identifier for the workspace (optional, falls back to name)
  name: string   // Display name of the workspace
}
```

## Component Behavior

1. **Name Input**: Captures user's name in component state
2. **Email Input**: Captures user's email in component state
3. **Workspace Dropdown**: Displays available workspaces and captures selection
4. **Cancel Button**: Calls the `closeModal` prop function
5. **Invite Members Button**: Logs form data to console and includes TODO for API integration

## State Management

The component manages three pieces of state:
- `name`: String value for the user's name
- `email`: String value for the user's email
- `selectedWorkspace`: String value for the selected workspace ID

## Styling

The component uses SCSS modules with BEM methodology:
- `.add-user-modal`: Main wrapper with overlay
- `.add-user-modal__container`: Content container with max-width
- `.add-user-modal__content`: Modal content with background and border
- `.add-user-modal__header`: Header section
- `.add-user-modal__title`: Modal title with heading-2 mixin
- `.add-user-modal__divider`: Horizontal line separator
- `.add-user-modal__form`: Form container with field spacing
- `.add-user-modal__field`: Individual field wrapper
- `.add-user-modal__actions`: Button container
- `.add-user-modal__button`: Button styling overrides

## Accessibility

- Modal overlay prevents interaction with background content
- Form fields use proper label associations through atomic components
- Keyboard navigation supported through native form elements
- Focus management handled by browser defaults

## Testing

The component includes comprehensive tests covering:
- Rendering of all form elements
- State updates for each input field
- Button click handlers
- Console logging behavior
- Edge cases (empty workspaces, missing props)
- CSS class application

## Future Enhancements

- [ ] Implement actual API call for user creation
- [ ] Add form validation (email format, required fields)
- [ ] Add loading state during API call
- [ ] Add success/error message display
- [ ] Implement keyboard shortcut (ESC) to close modal
- [ ] Add click-outside-to-close functionality
- [ ] Add animation for modal appearance/disappearance

## Dependencies

- React (hooks: useState)
- @/components/atoms/TextField/TextField
- @/components/atoms/Dropdown/Dropdown
- @/components/atoms/Button/Button
- SCSS modules with global variables and mixins