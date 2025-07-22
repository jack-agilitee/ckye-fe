# LeftNav Component

## Overview

The `LeftNav` component is a navigation sidebar for the Cyke Web App that displays the user's account information, context files, and provides interactive functionality for file management.

## Figma Reference

- **Design URL**: [https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=7-180&m=dev](https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=7-180&m=dev)
- **Node ID**: `7:180`

## Component Structure

The LeftNav component consists of:

1. **Account Changer**: Displays user avatar and name with dropdown functionality
2. **Note/Settings Icon**: Quick access to settings (currently console logs + TODO)
3. **Context Section**: Lists available markdown files with selection states
4. **Add New Button**: Allows adding new files (currently console logs + TODO)

## Props

This component does not accept any props. It manages the AccountModal state internally.

## Usage Examples

### Basic Usage

```jsx
import LeftNav from './components/LeftNav/LeftNav';

function App() {
  return (
    <div className="app">
      <LeftNav />
    </div>
  );
}
```

### Complete Layout Example

```jsx
import LeftNav from './components/LeftNav/LeftNav';

function Layout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <LeftNav />
      </aside>
      <main className="main-content">
        {/* Your main content here */}
      </main>
    </div>
  );
}
```

## Interactive Elements

### Account Changer
- **Trigger**: Click on the AEO section
- **Action**: Opens the AccountModal internally
- **Console Log**: "Account changer clicked - opening AccountModal"

### Note/Settings Icon
- **Trigger**: Click on the note icon
- **Action**: Console logs message with TODO comment
- **Console Log**: "Note/Settings icon clicked"
- **TODO**: Create functionality to create a new MD file when clicked

### File List Items
- **Trigger**: Click on any file item (Claude.md, Commands.md, Integrations/MCP)
- **Action**: Updates selection state and console logs
- **Console Log**: "File item clicked: [fileName]"
- **TODO**: Should open that MD file
- **States**: 
  - Selected: `left-nav__list-item--selected`
  - Hovered: `left-nav__list-item--hovered`

### Add New Button
- **Trigger**: Click on "+ Add New"
- **Action**: Console logs message with TODO comment
- **Console Log**: "Add New button clicked"
- **TODO**: Create functionality to create a new MD file when clicked

## Styling

The component uses BEM methodology with CSS modules:

### Main Classes
- `.left-nav` - Main container
- `.left-nav__account-changer` - Account section
- `.left-nav__content` - Main content area
- `.left-nav__context-section` - Context files section
- `.left-nav__file-list` - File list container

### State Classes
- `.left-nav__list-item--selected` - Selected file item
- `.left-nav__list-item--hovered` - Hovered file item

### Color Variables Used
- Background: `#202020`
- Avatar Background: `#353535`
- Primary Text: `#d5d5d5`
- Secondary Text: `#9b9b9b`
- Selected Background: `#353535`

## Accessibility

- All interactive elements are keyboard accessible
- Proper hover states for better user feedback
- Semantic HTML structure
- Console logging for debugging interactions

## File Structure

```
src/app/components/LeftNav/
├── LeftNav.jsx          # Main component with export
├── LeftNav.module.css   # BEM styles
└── LeftNav.test.jsx     # Test suite
```

## Testing

Comprehensive test suite covers:
- Component rendering
- Interactive functionality
- State management
- Hover effects
- Console logging
- BEM class structure
- Accessibility features

Run tests with:
```bash
npm test LeftNav.test.jsx
```

## Future Enhancements

### Planned TODOs
1. **File Opening**: Implement actual file opening functionality for list items
2. **File Creation**: Add modal/flow for creating new markdown files
3. **Settings Integration**: Connect note icon to actual settings functionality
4. **Drag & Drop**: Add file reordering capabilities
5. **Context Menu**: Right-click options for file management

### Integration Points
- Includes `AccountModal` component internally for account switching
- Self-contained navigation solution
- Designed to integrate with file management system
- Ready for backend API integration for file operations

## Performance Considerations

- Uses CSS modules for style encapsulation
- Minimal re-renders with proper state management
- Hover states handled with local component state
- Images loaded from localhost server (development)

## Browser Support

- Modern browsers with ES6+ support
- Requires React 18+ with hooks support
- Next.js App Router compatible