# SearchBar Component

## Overview
The SearchBar component is an atomic-level search input field based on the Figma design. It provides a clean, accessible search interface with focus states and keyboard support.

## Figma Reference
- **URL**: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=8-1039&m=dev
- **Node ID**: 8:1039

## Usage

### Basic Usage
```jsx
import SearchBar from '@/components/atoms/SearchBar/SearchBar';

function MyComponent() {
  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
    // Perform search logic
  };

  return (
    <SearchBar 
      placeholder="Search Users" 
      onSearch={handleSearch} 
    />
  );
}
```

### Controlled Component
```jsx
import { useState } from 'react';
import SearchBar from '@/components/atoms/SearchBar/SearchBar';

function ControlledSearch() {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value) => {
    console.log('Search submitted:', value);
    // Perform search
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    // Optional: Perform real-time search
  };

  return (
    <SearchBar 
      value={searchValue}
      onChange={handleChange}
      onSearch={handleSearch}
      placeholder="Search products..." 
    />
  );
}
```

### With Custom Styling
```jsx
<SearchBar 
  className="my-custom-search"
  placeholder="Search..."
  onSearch={handleSearch}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `'Search Users'` | Placeholder text for the input field |
| `onSearch` | `function` | `undefined` | Callback function called when Enter key is pressed. Receives the current input value |
| `value` | `string` | `undefined` | Controlled value for the input |
| `onChange` | `function` | `undefined` | Change handler for controlled input |
| `className` | `string` | `''` | Additional CSS classes to apply to the container |
| `id` | `string` | `undefined` | HTML id attribute for the input |
| `name` | `string` | `undefined` | HTML name attribute for the input |
| `ariaLabel` | `string` | `'Search'` | Accessibility label for the input |
| `disabled` | `boolean` | `false` | Whether the input is disabled |

## Features

### Accessibility
- Full keyboard navigation support
- ARIA labels and roles
- Focus management
- High contrast mode support
- Reduced motion support

### Styling
- BEM methodology with SCSS modules
- Focus and hover states
- Smooth transitions
- Responsive design
- Customizable through className prop

### Behavior
- Click anywhere on the search bar to focus the input
- Press Enter to trigger search callback
- Visual feedback for focus state
- Disabled state support

## Testing
The component includes comprehensive tests covering:
- Rendering with different props
- User interactions (typing, Enter key, focus/blur)
- Accessibility features
- Edge cases (undefined callbacks)
- Keyboard navigation

Run tests with:
```bash
npm run test SearchBar.test.jsx
```

## Design Tokens
The component uses the following design tokens from the Figma design:
- Border color: `#353535`
- Text/placeholder color: `#9B9B9B`
- Focus border color: `#666666`
- Text color (active): `#FFFFFF`

## Example Integration

### In a Users List Page
```jsx
'use client';

import { useState } from 'react';
import SearchBar from '@/components/atoms/SearchBar/SearchBar';
import UsersList from '@/components/organisms/UsersList/UsersList';

export default function UsersPage() {
  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleSearch = (searchTerm) => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="users-page">
      <div className="users-page__header">
        <h1>Users</h1>
        <SearchBar 
          placeholder="Search users by name or email..."
          onSearch={handleSearch}
        />
      </div>
      <UsersList users={filteredUsers} />
    </div>
  );
}
```

## Notes
- The component is marked as a Client Component (`'use client'`) due to its interactive nature
- The search icon is loaded from `/public/search__icon.svg` using Next.js Image component
- The component follows the project's functional component patterns with React hooks
- No index.js file is used - import the component directly from SearchBar.jsx