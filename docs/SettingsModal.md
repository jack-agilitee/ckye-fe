# SettingsModal Component

## Overview
The `SettingsModal` is an organism-level component that provides workspace selection, user account management, and quick access to settings and member invitation features.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=7-669&m=dev
- Node ID: 7:669

## Usage

```jsx
import SettingsModal from '@/components/organisms/SettingsModal/SettingsModal';

const workspaces = [
  { id: '1', name: 'AEO', memberCount: 3 },
  { id: '2', name: 'Dollar General', memberCount: 5 },
  { id: '3', name: 'Agilitee', memberCount: 10 }
];

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <SettingsModal
          workspaces={workspaces}
          currentWorkspaceId="1"
          userEmail="james@agilitee.com"
          onDismiss={() => setShowModal(false)}
        />
      )}
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| workspaces | Array | `[]` | Array of workspace objects with `id`, `name`, and `memberCount` properties |
| currentWorkspaceId | String | `null` | ID of the currently selected workspace |
| userEmail | String | `''` | Email address of the current user |
| onDismiss | Function | - | Callback function called when modal should be dismissed |

## Workspace Object Structure

```javascript
{
  id: string,          // Unique identifier for the workspace
  name: string,        // Display name of the workspace
  memberCount: number  // Number of members in the workspace
}
```

## Features

### Interactive Elements
1. **Settings Button** - Logs "settings" to console (TODO: Navigate to settings page)
2. **Invite Members Button** - Logs "invite members" to console (TODO: Navigate to invite members page)
3. **Workspace Selection** - Click to select a different workspace (TODO: Navigate to workspace page)
4. **Log Out Button** - Logs "log out" to console (TODO: Hook up logout API)

### Dismissal Behavior
- Click outside the modal to dismiss
- Press ESC key to dismiss
- Both actions trigger the `onDismiss` callback

### Visual Feedback
- Selected workspace shows a checkmark icon
- Hover states on all interactive elements
- Selected workspace has highlighted background

## Accessibility
- Keyboard navigation support
- ESC key to close modal
- Focus management for modal interaction
- Semantic HTML structure

## Styling
- Uses SCSS modules with BEM methodology
- Follows the project's design system colors and typography
- Responsive design considerations
- Dark theme optimized

## Dependencies
- User component (molecule) - for workspace header display
- Avatar component (atom) - for workspace list items
- Button component (atom) - for action buttons
- Next.js Image component for icons

## Testing
Comprehensive test coverage includes:
- Rendering with various prop combinations
- User interaction handling
- Workspace selection state management
- Modal dismissal behavior
- Console logging for TODO items

## Future Enhancements
- Implement actual navigation for settings and invite members
- Connect logout functionality to authentication API
- Add workspace switching functionality
- Add loading states for async operations
- Add animation transitions for modal appearance/dismissal