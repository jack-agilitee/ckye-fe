# Button Component

## Overview
The Button component is an atom-level component that provides a reusable button with icon support and multiple variants. It's designed based on the Figma design system with primary and secondary styling options.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=7-637&m=dev
- Node ID: 7:637

## Usage

```jsx
import Button from '@/components/atoms/Button/Button';

// Basic usage with default settings icon
<Button onClick={() => console.log('clicked')}>
  Settings
</Button>

// Secondary variant
<Button variant="secondary" onClick={handleClick}>
  Secondary Action
</Button>

// Custom icon
<Button icon="/custom-icon.svg" onClick={handleClick}>
  Custom Action
</Button>

// No icon
<Button icon={null} onClick={handleClick}>
  Text Only
</Button>

// Disabled state
<Button disabled onClick={handleClick}>
  Disabled Button
</Button>

// Submit button
<Button type="submit" onClick={handleSubmit}>
  Submit Form
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | node | - | The content of the button (usually text) |
| `variant` | 'primary' \| 'secondary' | 'primary' | Visual variant of the button (affects border color) |
| `icon` | string \| null | '/settings.svg' | Path to icon image, or null to hide icon |
| `onClick` | function | - | Click event handler |
| `disabled` | boolean | false | Whether the button is disabled |
| `type` | 'button' \| 'submit' \| 'reset' | 'button' | HTML button type attribute |
| `className` | string | '' | Additional CSS classes |
| `...props` | object | - | Any additional props are passed to the button element |

## Features

### Variants
- **Primary**: Default variant with `$black-light` border color
- **Secondary**: Alternative variant with `$primary-color` border color

### States
- **Default**: Normal interactive state
- **Hover**: Slight opacity change and border color adjustment
- **Focus**: Visible focus outline for keyboard navigation
- **Active**: Scale transform for tactile feedback
- **Disabled**: Reduced opacity and disabled cursor

### Accessibility
- Proper button semantics with native HTML button element
- Keyboard navigation support (Enter/Space activation)
- Focus indicators for keyboard users
- Disabled state properly communicated
- Icon images use empty alt text as they are decorative

### Icon Support
- Accepts any icon path via the `icon` prop
- Defaults to settings icon (`/settings.svg`)
- Can be hidden by passing `icon={null}`
- Icons are rendered at 16x16px using Next.js Image component

## Component Structure
```
Button/
├── Button.jsx         # Main component
├── Button.module.scss # Styles with BEM
└── Button.test.jsx    # Comprehensive tests
```

## Styling
The component uses SCSS modules with BEM methodology:
- Block: `.button`
- Elements: `.button__icon`, `.button__text`
- Modifiers: `.button--primary`, `.button--secondary`, `.button--disabled`

## Testing
The component includes comprehensive tests covering:
- Rendering with different variants
- Icon rendering and customization
- Click event handling
- Disabled state behavior
- Keyboard accessibility
- Props passing
- Custom className support

To run tests:
```bash
npm run test Button
```

## Examples

### Form Submit Button
```jsx
<form onSubmit={handleSubmit}>
  <Button type="submit" icon="/check.svg">
    Save Changes
  </Button>
</form>
```

### Action Buttons Group
```jsx
<div className="button-group">
  <Button onClick={handleEdit} icon="/edit.svg">
    Edit
  </Button>
  <Button 
    variant="secondary" 
    onClick={handleDelete} 
    icon="/trash.svg"
  >
    Delete
  </Button>
</div>
```

### Loading State (custom implementation)
```jsx
<Button 
  disabled={isLoading}
  onClick={handleAction}
  icon={isLoading ? "/spinner.svg" : "/save.svg"}
>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

## Design Decisions
- Uses transparent background to match Figma design
- Border-based styling for visual distinction
- Icon placement on the left for consistency
- Flexible icon system allows any SVG/image
- Supports all native button attributes via prop spreading