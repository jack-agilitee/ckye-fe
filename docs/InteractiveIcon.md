# InteractiveIcon Component

## Overview
The InteractiveIcon component is an interactive button that displays a three-dot menu icon with hover state functionality. It's designed as an atomic component that can be used throughout the application for action menus, settings, and more options functionality.

## Figma Reference
- **URL**: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=187-3223&m=dev
- **Node ID**: 187-3223

## Usage

### Basic Usage
```jsx
import InteractiveIcon from '@/components/atoms/InteractiveIcon/InteractiveIcon';

function MyComponent() {
  const handleClick = () => {
    console.log('Icon clicked');
  };

  return (
    <InteractiveIcon onClick={handleClick} />
  );
}
```

### With Custom Aria Label
```jsx
<InteractiveIcon 
  onClick={handleClick}
  ariaLabel="Open settings menu"
/>
```

### Different Sizes
```jsx
// Small size (12x12px icon)
<InteractiveIcon size="small" onClick={handleClick} />

// Medium size (16x16px icon) - default
<InteractiveIcon size="medium" onClick={handleClick} />

// Large size (20x20px icon)
<InteractiveIcon size="large" onClick={handleClick} />
```

### Disabled State
```jsx
<InteractiveIcon 
  onClick={handleClick}
  disabled
/>
```

### With Custom Class
```jsx
<InteractiveIcon 
  onClick={handleClick}
  className="my-custom-class"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onClick` | `function` | - | Click handler function |
| `ariaLabel` | `string` | `'More options'` | Accessibility label for screen readers |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size variant of the icon |
| `disabled` | `boolean` | `false` | Disables the button when true |
| `className` | `string` | `''` | Additional CSS classes to apply |

## States

### Default State
The icon appears with a transparent background and gray icon color (#9B9B9B).

### Hover State
On hover, the background changes to a dark gray (#474747) and the icon color changes to white.

### Focus State
When focused (keyboard navigation), a primary color outline appears around the button for accessibility.

### Active State
When clicked, the icon scales down slightly (95%) to provide tactile feedback.

### Disabled State
When disabled, the icon appears at 50% opacity and the cursor changes to 'not-allowed'.

## Accessibility

- Fully keyboard accessible with Tab navigation
- Includes proper ARIA labels for screen readers
- Focus visible states for keyboard navigation
- Respects user's reduced motion preferences
- Semantic button element with type="button" to prevent form submission

## Testing

The component includes comprehensive tests covering:
- Rendering with different props
- Click event handling
- Hover state management
- Disabled state behavior
- Size variants
- Custom className application
- Accessibility attributes

Run tests with:
```bash
npm test InteractiveIcon.test.jsx
```

## Design Tokens

The component uses the following design tokens from the global variables:
- `$white-secondary`: #9B9B9B (default icon color)
- `$black-hover-light`: #474747 (hover background)
- `$primary-color`: For focus outline

## Icon Asset

The component uses the `/dots.svg` icon file from the public directory. Ensure this file exists in your project at `/public/dots.svg`.

## Examples in Context

### In a Table Row
```jsx
<tr>
  <td>User Name</td>
  <td>user@example.com</td>
  <td>
    <InteractiveIcon 
      onClick={() => openUserMenu(userId)}
      ariaLabel="User actions"
    />
  </td>
</tr>
```

### In a Card Header
```jsx
<div className="card-header">
  <h3>Card Title</h3>
  <InteractiveIcon 
    onClick={handleCardOptions}
    ariaLabel="Card options"
  />
</div>
```

### With Dropdown Menu (common use case)
```jsx
function MenuExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="menu-container">
      <InteractiveIcon 
        onClick={() => setIsOpen(!isOpen)}
        ariaLabel="Open menu"
      />
      {isOpen && (
        <DropdownMenu>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
          <MenuItem>Share</MenuItem>
        </DropdownMenu>
      )}
    </div>
  );
}
```

## Browser Support

The component is compatible with all modern browsers and includes appropriate fallbacks for older browsers.