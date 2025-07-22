# Chip Component

## Overview
The Chip component is an atom-level component that displays a dismissible chip/tag with hover states. It's commonly used to show selected items, filters, or tags that users can remove.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=45-2458&m=dev
- Node ID: 45:2458

## Usage

```jsx
import Chip from '@/components/atoms/Chip/Chip';

// Basic usage
<Chip text="James Otey" onDismiss={(e) => console.log('Dismissed')} />

// Multiple chips
const [chips, setChips] = useState(['James Otey', 'John Doe', 'Jane Smith']);

{chips.map((name, index) => (
  <Chip 
    key={name}
    text={name}
    onDismiss={() => {
      setChips(chips.filter((_, i) => i !== index));
    }}
  />
))}

// Custom styling
<Chip 
  text="Custom Chip" 
  className="my-custom-chip"
  onDismiss={handleDismiss}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | 'James Otey' | The text content displayed in the chip |
| `onDismiss` | function | - | Callback function called when the chip is clicked |
| `className` | string | '' | Additional CSS classes to apply |

## Features

### States
- **Default**: Normal state with `$white-secondary` text on `$black-light` background
- **Hover**: Background changes to `$black-light-hover`, text becomes `$white-primary`
- **Focus**: Visible focus outline for keyboard navigation
- **Active**: Slight scale transform for tactile feedback

### Accessibility
- Fully keyboard accessible
- Proper button semantics
- Descriptive aria-label for screen readers
- Focus indicators for keyboard navigation

### Interaction
- Entire chip is clickable
- Hover state provides visual feedback
- Smooth transitions between states
- Dismiss icon included

## Component Structure
```
Chip/
├── Chip.jsx         # Main component
├── Chip.module.scss # Styles with BEM
└── Chip.test.jsx    # Comprehensive tests
```

## Styling
The component uses SCSS modules with BEM methodology:
- Block: `.chip`
- Elements: `.chip__text`, `.chip__icon`
- Modifiers: `.chip--hovered`

## Testing
The component includes comprehensive tests covering:
- Rendering with default and custom text
- Click event handling
- Hover state management
- Accessibility attributes
- Keyboard navigation
- Custom className support

To run tests:
```bash
npm run test Chip
```

## Examples

### Filter Chips
```jsx
const FilterChips = () => {
  const [filters, setFilters] = useState(['Active', 'Pending', 'Completed']);
  
  return (
    <div className="filter-container">
      {filters.map(filter => (
        <Chip
          key={filter}
          text={filter}
          onDismiss={() => {
            setFilters(filters.filter(f => f !== filter));
          }}
        />
      ))}
    </div>
  );
};
```

### User Tags
```jsx
const UserTags = ({ users, onRemoveUser }) => {
  return (
    <div className="user-tags">
      {users.map(user => (
        <Chip
          key={user.id}
          text={user.name}
          onDismiss={() => onRemoveUser(user.id)}
        />
      ))}
    </div>
  );
};
```

### Selected Items
```jsx
const SelectedItems = ({ items, onDeselect }) => {
  return (
    <div className="selected-items">
      <h3>Selected:</h3>
      {items.map(item => (
        <Chip
          key={item}
          text={item}
          onDismiss={() => onDeselect(item)}
          className="selected-chip"
        />
      ))}
    </div>
  );
};
```

## Design Decisions
- Uses button element for proper semantics and accessibility
- Icon uses Next.js Image component for optimization
- Hover state matches Figma design specifications
- Smooth transitions enhance user experience
- Flexible text prop allows for dynamic content