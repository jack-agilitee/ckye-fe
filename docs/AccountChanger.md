# AccountChanger Component

## Overview
The AccountChanger component is an organism-level component that displays the current account information with an avatar and provides quick actions for account switching and creating notes.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=5-115&m=dev
- Node ID: 5:115

## Usage

```jsx
import AccountChanger from '@/components/organisms/AccountChanger/AccountChanger';

// Basic usage
<AccountChanger />

// With custom props
<AccountChanger 
  accountName="MyCompany" 
  accountInitial="M"
  onAccountClick={() => console.log('Account clicked')}
  onNotesClick={() => console.log('Notes clicked')}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `accountName` | string | 'Agilitee' | The name of the current account |
| `accountInitial` | string | 'A' | The initial letter to display in the avatar |
| `onAccountClick` | function | undefined | Callback function when account dropdown is clicked |
| `onNotesClick` | function | undefined | Callback function when notes button is clicked |

## Features

### Interactive Elements
1. **Account Dropdown Button**: Clicking on the account section (avatar + name + chevron) triggers a console log and calls the `onAccountClick` callback if provided. This is intended to open a modal in the future.
2. **Notes Button**: Clicking the notes icon triggers a console log and calls the `onNotesClick` callback if provided. This is intended to create a new document in the future.

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
// In a layout or header component
import AccountChanger from '@/components/organisms/AccountChanger/AccountChanger';

const Header = () => {
  const handleAccountSwitch = () => {
    // TODO: Open account switcher modal
    console.log('Opening account switcher...');
  };

  const handleCreateNote = () => {
    // TODO: Navigate to new note creation
    console.log('Creating new note...');
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
          onAccountClick={handleAccountSwitch}
          onNotesClick={handleCreateNote}
        />
      </div>
    </header>
  );
};
```