# Sidebar Template Component

## Overview
The Sidebar template component provides a complete left navigation layout for the application. It includes an account changer header, dynamic context items, static workspace items, and a conditional admin section, following the Figma design specifications.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=5-230&m=dev
- Node ID: 5:230

## Features
- **Account Header**: Integrates with existing AccountChanger organism component
- **Context Section**: Dynamic list of document/file items with selection state
- **Workspace Section**: Static items (Settings, Invite Members) with console logging
- **Admin Section**: Conditional section that appears only for admin users
- **Navigation**: Routing to admin workspace page and console logging for interactions
- **Selection State**: Visual feedback for selected context items
- **Responsive Design**: Adapts to mobile screens

## Usage

```jsx
import Sidebar from '@/components/templates/Sidebar/Sidebar';

const MyApp = () => {
  const [selectedItem, setSelectedItem] = useState('1');
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const contextItems = [
    { id: '1', name: 'Claude.md' },
    { id: '2', name: 'Commands.md' },
    { id: '3', name: 'Integrations/MCP' }
  ];

  const handleContextItemClick = (item) => {
    setSelectedItem(item.id);
    // TODO: Navigate to document or update main content
  };

  const handleAddNewClick = () => {
    // TODO: Show modal or navigate to create new document
  };

  const handleWorkspaceItemClick = (itemName) => {
    // TODO: Navigate to settings or invite members page
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        contextItems={contextItems}
        selectedItemId={selectedItem}
        isAdmin={isUserAdmin}
        accountName="AEO"
        accountInitial="A"
        onContextItemClick={handleContextItemClick}
        onAddNewClick={handleAddNewClick}
        onWorkspaceItemClick={handleWorkspaceItemClick}
        onAccountClick={() => console.log('Account clicked')}
        onNotesClick={() => console.log('Notes clicked')}
      />
      <main style={{ flex: 1 }}>
        {/* Main content area */}
      </main>
    </div>
  );
};
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| contextItems | array | No | [] | Array of context item objects with `id` and `name` properties |
| selectedItemId | string | No | null | ID of the currently selected context item |
| isAdmin | boolean | No | false | Whether to show the admin section |
| accountName | string | No | 'AEO' | Account name displayed in header |
| accountInitial | string | No | 'A' | Account initial displayed in avatar |
| onContextItemClick | function | No | - | Callback when a context item is clicked |
| onAddNewClick | function | No | - | Callback when "Add New" is clicked |
| onWorkspaceItemClick | function | No | - | Callback when workspace items are clicked |
| onAccountClick | function | No | - | Callback when account changer is clicked |
| onNotesClick | function | No | - | Callback when notes button is clicked |

## Context Item Object Structure

```javascript
{
  id: string,    // Unique identifier for the item
  name: string   // Display name of the item
}
```

## Component Behavior

### Context Section
- **Dynamic Items**: Rendered from `contextItems` prop
- **Selection State**: Item matching `selectedItemId` gets highlighted background
- **Click Handling**: Logs item name to console and calls `onContextItemClick`
- **Add New**: Always present, logs "add new" and calls `onAddNewClick`

### Workspace Section
- **Static Items**: Settings and Invite Members are always present
- **Click Handling**: Logs item name to console and calls `onWorkspaceItemClick`
- **Icons**: Uses `/settings.svg` and `/invite.svg` from public directory

### Admin Section
- **Conditional Rendering**: Only appears when `isAdmin` is true
- **Navigation**: Clicking "Ckye Admin" navigates to `/admin/workspace`
- **Console Logging**: Logs "Ckye Admin" when clicked

### Account Header
- **Integration**: Uses existing AccountChanger component
- **Non-Admin Mode**: Always renders in default (non-admin) variant
- **Props Passthrough**: Passes account-related props to AccountChanger

## Styling

The component uses SCSS modules with BEM methodology:
- `.sidebar`: Main container with fixed width and full height
- `.sidebar__header`: Account changer section with padding
- `.sidebar__content`: Scrollable content area with sections
- `.sidebar__section`: Individual section containers
- `.sidebar__sectionTitle`: Uppercase section headers
- `.sidebar__listItem`: Clickable list items with hover effects
- `.sidebar__listItem--selected`: Selected state styling
- `.sidebar__adminSection`: Admin section positioned at bottom

## Icons Used

The component uses the following icons from the public directory:
- `/document.svg` - For context items
- `/plus.svg` - For "Add New" button
- `/settings.svg` - For Settings item
- `/invite.svg` - For Invite Members item
- `/person.svg` - For Admin item

## Accessibility

- **Semantic HTML**: Uses appropriate button elements for interactive items
- **ARIA Labels**: Screen reader friendly button descriptions
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Focus Management**: Visible focus indicators for keyboard users
- **Contrast**: Text colors meet WCAG guidelines

## Responsive Design

- **Desktop**: Fixed 220px width with full height
- **Mobile**: Adapts to full width with auto height
- **Scrolling**: Vertical scroll when content exceeds container height

## Testing

The component includes comprehensive tests covering:
- Rendering of all sections and items
- Context item selection and click handling
- Workspace item interactions
- Admin section conditional rendering
- Navigation to admin workspace
- AccountChanger integration
- Props validation and default values
- CSS class application
- Accessibility features

## Future Enhancements

- [ ] Implement actual routing for context items
- [ ] Add drag-and-drop reordering for context items
- [ ] Implement collapsible sections
- [ ] Add keyboard shortcuts for navigation
- [ ] Implement search/filter functionality
- [ ] Add breadcrumb navigation
- [ ] Support for nested folder structures
- [ ] Add tooltips for truncated item names

## Dependencies

- React (hooks: useRouter from Next.js)
- Next.js (Image component, useRouter)
- @/components/organisms/AccountChanger/AccountChanger
- SCSS modules with global variables and mixins