# AccountModal Component

## Overview

The `AccountModal` component is a modal dialog for the Cyke Web App that allows users to manage their workspace settings, switch between accounts, and access account-related functionality.

## Figma Reference

- **Design URL**: [https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=7-670&m=dev](https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=7-670&m=dev)
- **Node ID**: `7:670`

## Component Structure

The AccountModal component consists of:

1. **Workspace Header**: Shows current workspace info (AEO, 3 Members)
2. **Action Buttons**: Settings and Invite Members CTAs
3. **Account Switcher**: List of available accounts with selection state
4. **Logout Option**: Log out functionality

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls modal visibility |
| `onClose` | `function` | `undefined` | Callback function when modal should close |

## Usage Examples

### Basic Usage

```jsx
import { useState } from 'react';
import AccountModal from './components/AccountModal/AccountModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Open Account Modal
      </button>
      <AccountModal 
        isOpen={isModalOpen} 
        onClose={handleClose} 
      />
    </div>
  );
}
```

### With LeftNav Integration

```jsx
'use client';

import { useState } from 'react';
import LeftNav from './components/LeftNav/LeftNav';
import AccountModal from './components/AccountModal/AccountModal';

function Layout() {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const handleToggleModal = () => {
    setIsAccountModalOpen(!isAccountModalOpen);
  };

  const handleCloseModal = () => {
    setIsAccountModalOpen(false);
  };

  return (
    <div className="app-layout">
      <LeftNav onAccountModalToggle={handleToggleModal} />
      <AccountModal 
        isOpen={isAccountModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}
```

## Interactive Elements

### Settings Button
- **Trigger**: Click on "Settings" button
- **Action**: Console logs message with TODO comment
- **Console Log**: "Settings button clicked"
- **TODO**: Navigate to settings page or open settings modal

### Invite Members Button
- **Trigger**: Click on "Invite Members" button
- **Action**: Console logs message with TODO comment
- **Console Log**: "Invite Members button clicked"
- **TODO**: Open invite members modal or flow

### Account Selection
- **Trigger**: Click on any account in the list
- **Action**: Updates selected account state and console logs
- **Console Log**: "Account selected: [accountName]"
- **TODO**: Switch to selected account
- **Visual Feedback**: Checkmark appears next to selected account

### Log Out
- **Trigger**: Click on "Log Out" option
- **Action**: Console logs message with TODO comment
- **Console Log**: "Log Out clicked"
- **TODO**: Implement logout functionality

### Modal Closing
- **Trigger**: Click outside modal (on overlay)
- **Action**: Calls `onClose` prop to close modal
- **Note**: Clicking inside modal content does not close modal

## Account Management

### Default Accounts
The modal displays three accounts:
1. **AEO** (selected by default)
2. **Dollar General**
3. **Agilitee**

### Account State
- Only one account can be selected at a time
- Selected account shows checkmark icon
- State managed internally with `useState`

## Styling

The component uses BEM methodology with CSS modules:

### Main Classes
- `.account-modal__overlay` - Full-screen overlay
- `.account-modal` - Modal container
- `.account-modal__content` - Modal content wrapper
- `.account-modal__workspace` - Workspace header section
- `.account-modal__ctas` - Action buttons section
- `.account-modal__accounts-section` - Account switcher section

### State Classes
- `.account-modal__checkmark--visible` - Shows checkmark for selected account

### Color Variables Used
- Modal Background: `#252525`
- Border: `#353535`
- Avatar Background: `#353535`
- Primary Text: `#d5d5d5`
- Secondary Text: `#9b9b9b`
- CTA Border/Text: `#74a0c8`
- Overlay: `rgba(0, 0, 0, 0.5)`

## Modal Behavior

### Opening
- Modal appears centered on screen
- Overlay prevents interaction with background
- No animation (can be added in future)

### Closing
- Click overlay to close
- ESC key support can be added
- Clicking modal content does not close

### Focus Management
- Modal should trap focus (can be enhanced)
- First focusable element should receive focus

## Accessibility

- Modal overlay prevents background interaction
- Proper semantic HTML structure
- Keyboard navigation support ready
- Screen reader friendly text content
- High contrast colors for visibility

## File Structure

```
src/app/components/AccountModal/
├── AccountModal.jsx          # Main component with export
├── AccountModal.module.css   # BEM styles
└── AccountModal.test.jsx     # Test suite
```

## Testing

Comprehensive test suite covers:
- Modal visibility states
- Interactive functionality
- Account selection
- State management
- Overlay click behavior
- Console logging
- BEM class structure
- Accessibility features

Run tests with:
```bash
npm test AccountModal.test.jsx
```

## Future Enhancements

### Planned TODOs
1. **Settings Integration**: Connect to actual settings page/modal
2. **Invite Flow**: Implement member invitation functionality
3. **Account Switching**: Backend integration for account switching
4. **Logout**: Implement proper authentication logout
5. **Animation**: Add smooth open/close animations

### Advanced Features
- **Keyboard Navigation**: Full keyboard support with focus trapping
- **ESC Key Closing**: Close modal on ESC press
- **Click Outside Enhancement**: Better outside click detection
- **Loading States**: Show loading during account operations
- **Error Handling**: Display errors for failed operations

### Integration Points
- Authentication system integration
- User management API endpoints
- Settings page/modal integration
- Team management functionality

## Performance Considerations

- Conditional rendering prevents unnecessary DOM nodes
- CSS modules for style encapsulation
- Minimal re-renders with proper state management
- Images loaded from localhost server (development)

## Browser Support

- Modern browsers with ES6+ support
- Requires React 18+ with hooks support
- Next.js App Router compatible
- CSS Grid and Flexbox support required

## Security Considerations

- No sensitive data stored in component state
- Console logging safe for development
- Ready for secure authentication integration
- Proper data sanitization points identified