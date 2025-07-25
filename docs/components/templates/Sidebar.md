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
- **Admin Section**: Conditional section that appears automatically for admin users (determined by UserContext)
- **Admin Mode**: Complete alternative layout for admin interface with Workspaces and Users navigation
- **Navigation**: Routing to admin workspace page and console logging for interactions
- **Selection State**: Visual feedback for selected context items
- **Responsive Design**: Adapts to mobile screens
- **User Context Integration**: Automatically determines admin status from UserContext

## Usage

```jsx
import Sidebar from '@/components/templates/Sidebar/Sidebar';

const MyApp = () => {
  const [selectedItem, setSelectedItem] = useState('1');
  // Admin status is now automatically determined from UserContext

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


  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        contextItems={contextItems}
        selectedItemId={selectedItem}
        accountName="AEO"
        accountInitial="A"
        onContextItemClick={handleContextItemClick}
        onAddNewClick={handleAddNewClick}
        onAccountClick={() => console.log('Account clicked')}
        onNotesClick={() => console.log('Notes clicked')}
      />
      <main style={{ flex: 1 }}>
        {/* Main content area */}
      </main>
    </div>
  );
};

// Admin Mode Example
const AdminApp = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        isAdminMode={true}
      />
      <main style={{ flex: 1 }}>
        {/* Admin content area */}
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
| isAdminMode | boolean | No | false | Whether to render the admin mode layout with Workspaces/Users navigation |
| accountName | string | No | 'AEO' | Account name displayed in header |
| accountInitial | string | No | 'A' | Account initial displayed in avatar |
| onContextItemClick | function | No | - | Callback when a context item is clicked |
| onAddNewClick | function | No | - | Callback when "Add New" is clicked |
| onAccountClick | function | No | - | Callback when account changer is clicked |
| onNotesClick | function | No | - | Callback when notes button is clicked |
| onAdminBack | function | No | - | Callback when admin back button is clicked (defaults to home redirect) |

**Note**: The admin section visibility is now determined automatically based on the user's `userType` from UserContext. When `userType === 'Admin'`, the admin section will be shown.

## Context Item Object Structure

```javascript
{
  id: string,    // Unique identifier for the item
  name: string   // Display name of the item
}
```

## Component Behavior

### Regular Mode (default)

#### Context Section
- **Dynamic Items**: Rendered from `contextItems` prop
- **Selection State**: Item matching `selectedItemId` gets highlighted background
- **Click Handling**: Logs item name to console and calls `onContextItemClick`
- **Add New**: Always present, logs "add new" and calls `onAddNewClick`

#### Workspace Section
- **Static Items**: Settings and Invite Members are always present
- **Click Handling**: Logs item name to console with TODO comments for future navigation
- **Icons**: Uses `/settings.svg` and `/invite.svg` from public directory

#### Admin Section
- **Conditional Rendering**: Only appears when the user's `userType` in UserContext is 'Admin'
- **Navigation**: Clicking "Ckye Admin" navigates to `/admin/workspace`
- **Console Logging**: Logs "Ckye Admin" when clicked
- **Automatic Detection**: No need to pass isAdmin prop - component reads from UserContext

#### Account Header
- **Integration**: Uses existing AccountChanger component
- **Admin State**: Automatically determined from UserContext
- **Props Passthrough**: Passes account-related props to AccountChanger

### Admin Mode (`isAdminMode={true}`)

#### Admin Header
- **AccountChanger Integration**: Uses existing AccountChanger component with `isAdmin={true}`
- **Admin Variant**: AccountChanger automatically renders admin header with back button and "Ckye Admin" title
- **Props Passthrough**: Passes account-related props to AccountChanger

#### Navigation Items
- **Workspaces**: Navigates to `/admin/workspace`
- **Users**: Navigates to `/admin/users`
- **Icons**: Uses `/workspace.svg` and `/users.svg` from public directory

#### Layout Differences
- **No Context Section**: Context items are not shown in admin mode
- **No Workspace Section**: Regular workspace items are not shown
- **AccountChanger in Admin Mode**: Shows admin variant of AccountChanger
- **Simplified Layout**: Only shows admin navigation items

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

### Regular Mode
- `/document.svg` - For context items
- `/plus.svg` - For "Add New" button
- `/settings.svg` - For Settings item
- `/invite.svg` - For Invite Members item
- `/person.svg` - For Admin item

### Admin Mode
- `/workspace.svg` - For Workspaces navigation
- `/users.svg` - For Users navigation

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
- @/context/UserContext (for automatic admin detection)
- SCSS modules with global variables and mixins