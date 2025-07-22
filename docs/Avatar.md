# Avatar Component

## Overview
The `Avatar` is an atom-level component that displays a user's initial in a styled container. It's a reusable component used throughout the application for representing users or workspaces.

## Usage

```jsx
import Avatar from '@/components/atoms/Avatar/Avatar';

// Basic usage
<Avatar initial="J" />

// With size variant
<Avatar initial="A" size="large" />

// With color variant
<Avatar initial="M" variant="primary" />

// With custom className
<Avatar initial="S" className="custom-avatar" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initial | String | `'A'` | The letter(s) to display in the avatar |
| size | String | `'medium'` | Size variant: `'small'`, `'medium'`, or `'large'` |
| variant | String | `'default'` | Color variant: `'default'`, `'primary'`, or `'selected'` |
| className | String | `''` | Additional CSS classes to apply |

## Size Variants

- **small**: 24x24px with 14px font
- **medium**: 40x40px with 20px font (default)
- **large**: 56x56px with 28px font

## Color Variants

- **default**: Uses `$black-light` background
- **primary**: Uses `$primary-color` background
- **selected**: Uses `$primary-color` background (for active states)

## Styling
- Uses SCSS modules with BEM methodology
- Rounded corners (4px border-radius)
- Bold font weight for initials
- Centered content with flexbox
- Non-selectable text for better UX

## Examples

```jsx
// User avatar in a list
<div className="user-item">
  <Avatar initial={user.name.charAt(0)} size="small" />
  <span>{user.name}</span>
</div>

// Workspace avatar with selection state
<Avatar 
  initial={workspace.name.charAt(0)} 
  variant={isSelected ? 'selected' : 'default'}
/>

// Large avatar for profile pages
<Avatar 
  initial={user.firstName.charAt(0) + user.lastName.charAt(0)} 
  size="large"
/>
```

## Accessibility
- Uses semantic HTML
- High contrast colors for readability
- Supports custom className for additional styling needs

## Testing
Full test coverage includes:
- Rendering with all prop combinations
- Size variant classes
- Color variant classes
- Custom className application
- Default prop values