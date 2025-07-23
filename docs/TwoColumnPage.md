# TwoColumnPage Component

A responsive two-column layout component for authenticated pages, designed for admin dashboards and similar interfaces.

## Figma Reference
- **URL**: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=7-722&m=dev
- **Node ID**: 7:722

## Overview

The TwoColumnPage component provides a consistent layout structure with:
- **Left Section**: Fixed-width sidebar for navigation (200px desktop, full-width mobile)
- **Right Section**: Flexible main content area
- **Responsive Design**: Mobile-first approach with breakpoints
- **Placeholder Content**: Default content when no components are provided

## Usage

### Basic Usage
```jsx
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';

const MyPage = () => {
  return (
    <TwoColumnPage 
      leftContent={<Navigation />}
      rightContent={<MainContent />}
    />
  );
};
```

### With Placeholder Content
```jsx
// Shows default placeholder content for both sections
<TwoColumnPage />
```

### Custom Styling
```jsx
<TwoColumnPage 
  className="custom-page-styles"
  leftContent={<SideNav />}
  rightContent={<Dashboard />}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `leftContent` | `ReactNode` | `undefined` | Content for the left sidebar section |
| `rightContent` | `ReactNode` | `undefined` | Content for the main content area |
| `className` | `string` | `''` | Additional CSS class names |

## Layout Specifications

### Desktop (≥769px)
- Left section: Fixed 200px width (240px on ≥1200px screens)
- Right section: Flexible width (remaining space)
- Layout: Horizontal side-by-side

### Mobile (≤768px)
- Left section: Full width, stacked below main content
- Right section: Full width, stacked above navigation
- Layout: Vertical stacking (content first, then navigation)

## Styling

The component uses CSS Modules with BEM methodology:

```scss
.two-column-page {
  &__left { /* Left sidebar styles */ }
  &__right { /* Right content area styles */ }
  &__placeholder { /* Placeholder content styles */ }
}
```

### Color Scheme
- Background: `$background-dark` (#202020)
- Sidebar: `$black-bg-dark` (#252525)
- Border: `$border-color` (rgba($white-primary, 0.1))
- Text: `$text-primary` and `$text-secondary`

## Examples

### Admin Dashboard
```jsx
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import AdminNav from '@/components/organisms/AdminNav/AdminNav';
import UsersList from '@/components/organisms/UsersList/UsersList';

const AdminDashboard = () => {
  return (
    <TwoColumnPage 
      leftContent={<AdminNav />}
      rightContent={<UsersList />}
    />
  );
};
```

### Settings Page
```jsx
import TwoColumnPage from '@/components/pages/TwoColumnPage/TwoColumnPage';
import SettingsNav from '@/components/molecules/SettingsNav/SettingsNav';
import AccountSettings from '@/components/organisms/AccountSettings/AccountSettings';

const SettingsPage = () => {
  return (
    <TwoColumnPage 
      leftContent={<SettingsNav />}
      rightContent={<AccountSettings />}
    />
  );
};
```

### Complex Nested Content
```jsx
const ComplexPage = () => {
  const leftContent = (
    <div>
      <h2>Navigation</h2>
      <nav>
        <ul>
          <li><Link href="/users">Users</Link></li>
          <li><Link href="/workspaces">Workspaces</Link></li>
          <li><Link href="/settings">Settings</Link></li>
        </ul>
      </nav>
    </div>
  );

  const rightContent = (
    <div>
      <header>
        <h1>Dashboard</h1>
        <button>Add User</button>
      </header>
      <main>
        <UserTable users={users} />
        <Pagination />
      </main>
    </div>
  );

  return (
    <TwoColumnPage 
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
};
```

## Accessibility

- Uses semantic HTML structure
- Proper heading hierarchy (h3 for placeholder titles)
- Keyboard navigation friendly
- Screen reader compatible
- Maintains focus management

## Testing

The component includes comprehensive tests covering:
- ✅ Basic rendering
- ✅ Placeholder content display
- ✅ Custom content rendering
- ✅ CSS class application
- ✅ Accessibility structure
- ✅ Complex nested components
- ✅ Responsive behavior
- ✅ Content size variations

Run tests with:
```bash
npm run test -- TwoColumnPage.test.jsx
```

## Development Notes

### File Structure
```
src/components/pages/TwoColumnPage/
├── TwoColumnPage.jsx           # Main component
├── TwoColumnPage.module.scss   # Styles with BEM
├── TwoColumnPage.test.jsx      # Test suite
└── README.md                  # This documentation
```

### Design Decisions
1. **Mobile-first**: Content appears before navigation on mobile
2. **Fixed sidebar**: Consistent navigation width on desktop
3. **Flexible content**: Main area adapts to available space
4. **Placeholder system**: Helpful development experience
5. **BEM naming**: Consistent CSS architecture

### Performance Considerations
- Minimal CSS footprint using CSS Modules
- No unnecessary re-renders (pure functional component)
- Efficient responsive breakpoints
- Optimized for different content sizes

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- CSS Grid and Flexbox support required