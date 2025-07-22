# User Component

## Overview
The User component is a molecule-level component that displays user information in a compact list item format. It shows a user's avatar with their initial, name, and email address.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=19-2216&m=dev
- Node ID: 19:2216

## Usage

```jsx
import User from '@/components/molecules/User/User';

// Basic usage
<User 
  name="Andrew Venn" 
  email="andrew@agilitee.com" 
/>

// With custom initial
<User 
  name="Andrew Venn" 
  email="andrew@agilitee.com" 
  initial="V"
/>

// With custom className
<User 
  name="John Doe" 
  email="john@example.com" 
  className="custom-user-style"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | '' | The user's full name |
| email | string | '' | The user's email address |
| initial | string | '' | Custom initial to display in avatar. If not provided, uses first letter of name |
| className | string | '' | Additional CSS class names to apply to the component |

## Features

- **Automatic Initial Generation**: If no initial is provided, the component automatically uses the first letter of the user's name
- **Responsive Text**: Long names and emails are truncated with ellipsis to maintain layout
- **BEM Methodology**: Uses CSS Modules with BEM naming convention for styling
- **Accessible**: Semantic HTML structure for screen readers

## Styling

The component uses SCSS modules with the following BEM structure:
- `.user` - Main container
- `.user__avatar` - Avatar container
- `.user__avatar-initial` - Initial text within avatar
- `.user__info` - Information container
- `.user__name` - User name text
- `.user__email` - User email text

## Design Tokens

The component uses the following design tokens from the Figma design:
- Avatar background: `#353535` (Black/Light)
- Initial color: `#D5D5D5` (White/Primary)
- Name color: `#D5D5D5` (White/Primary)
- Email color: `#9B9B9B` (White/Secondary)
- Avatar size: 40x40px
- Border radius: 8px

## Examples

### Basic User
```jsx
<User 
  name="Andrew Venn" 
  email="andrew@agilitee.com" 
/>
```

### User with Custom Initial
```jsx
<User 
  name="Andrew Venn" 
  email="andrew@agilitee.com" 
  initial="AV"
/>
```

### User List
```jsx
const users = [
  { id: 1, name: "Andrew Venn", email: "andrew@agilitee.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" }
];

<div className="user-list">
  {users.map(user => (
    <User 
      key={user.id}
      name={user.name} 
      email={user.email} 
    />
  ))}
</div>
```

## Testing

The component includes comprehensive test coverage including:
- Rendering with various prop combinations
- Initial generation logic
- Text overflow handling
- CSS module class application
- Component structure validation

Run tests with:
```bash
npm run test User.test.jsx
```

## Accessibility

- Uses semantic HTML structure
- Text contrast ratios meet WCAG AA standards
- Supports keyboard navigation when used within interactive containers

## Related Components

This component can be used with:
- `UsersTable` (organism) - For displaying lists of users
- `UserDetails` (organism) - For showing detailed user information
- `Avatar` (atom) - If a standalone avatar component is needed