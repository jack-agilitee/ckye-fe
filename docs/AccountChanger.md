# AccountChanger Component

## Overview
The AccountChanger component is an organism-level component that displays the current account information with an avatar and provides quick actions for account switching and creating notes. It supports two variants: a default account view and an admin view.

## Figma Reference
- Default variant URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=5-115&m=dev
- Admin variant URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=7-941&m=dev
- Node IDs: 5:115 (default), 7:941 (admin)

## Usage

```jsx
import AccountChanger from '@/components/organisms/AccountChanger/AccountChanger';

// Basic usage - Default variant
<AccountChanger />

// With custom props
<AccountChanger 
  accountName="MyCompany" 
  accountInitial="M"
  onAccountClick={() => console.log('Account clicked')}
  onNotesClick={() => console.log('Notes clicked')}
/>

// Admin variant
<AccountChanger 
  isAdmin={true}
  onAdminBack={() => console.log('Exiting admin mode')}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accountName` | string | 'Agilitee' | The name of the current account (default variant only) |
| `accountInitial` | string | 'A' | The initial letter to display in the avatar (default variant only) |
| `onAccountClick` | function | undefined | Callback function when account dropdown is clicked (default variant only) |
| `onNotesClick` | function | undefined | Callback function when notes button is clicked (default variant only) |
| `isAdmin` | boolean | false | When true, renders the admin variant |
| `onAdminBack` | function | undefined | Callback function when admin back button is clicked (admin variant only) |

## Features

### Interactive Elements

#### Default Variant
1. **Account Dropdown Button**: Clicking on the account section (avatar + name + chevron) triggers a console log and calls the `onAccountClick` callback if provided. This is intended to open a modal in the future.
2. **Notes Button**: Clicking the notes icon triggers a console log and calls the `onNotesClick` callback if provided. This is intended to create a new document in the future.

#### Admin Variant
1. **Back Button**: Clicking the chevron-left icon triggers a console log and calls the `onAdminBack` callback if provided. This is intended to exit admin mode and revert to the default account view.

### Accessibility
- Proper ARIA labels for both buttons
- Keyboard navigation support with visible focus indicators
- Semantic button elements for interactive areas

### Styling
- Uses SCSS modules with BEM methodology
- Responsive design with hover states
- Smooth transitions for interactive feedback
- Focus indicators for keyboard navigation

## Component Structure
```
AccountChanger/
├── AccountChanger.jsx       # Main component
├── AccountChanger.module.scss   # Styles with BEM
└── AccountChanger.test.jsx  # Comprehensive tests
```

## Testing
The component includes comprehensive tests covering:
- Rendering with default and custom props
- Click event handling for both interactive elements
- Console log verification
- Accessibility attributes
- Icon rendering
- Admin variant rendering and interactions
- Switching between variants

To run tests:
```bash
npm run test AccountChanger
```

## Future Enhancements
- [ ] Implement account dropdown modal when chevron is clicked
- [ ] Implement create new document functionality when notes button is clicked
- [ ] Add animation for dropdown chevron rotation
- [ ] Support for account status indicators
- [ ] Account switching animation

## Example with Context
```jsx
// In a layout or header component with variant switching
import { useState } from 'react';
import AccountChanger from '@/components/organisms/AccountChanger/AccountChanger';

const Header = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleAccountSwitch = () => {
    // For demo: switch to admin mode
    // In real app: open account switcher modal
    console.log('Opening account switcher...');
    setIsAdminMode(true);
  };

  const handleCreateNote = () => {
    // TODO: Navigate to new note creation
    console.log('Creating new note...');
  };

  const handleAdminBack = () => {
    // Exit admin mode
    console.log('Exiting admin mode...');
    setIsAdminMode(false);
  };

  return (
    <header className="app-header">
      <div className="app-header__left">
        {/* Other header content */}
      </div>
      <div className="app-header__right">
        <AccountChanger
          accountName="Agilitee"
          accountInitial="A"
          isAdmin={isAdminMode}
          onAccountClick={handleAccountSwitch}
          onNotesClick={handleCreateNote}
          onAdminBack={handleAdminBack}
        />
      </div>
    </header>
  );
};
```