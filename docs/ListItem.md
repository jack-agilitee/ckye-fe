# ListItem Component

## Overview
The ListItem component is a clickable list item with icon and text, designed based on the Figma design. It supports hover and selected states, and is fully accessible with keyboard navigation.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=5-185&m=dev
- Node ID: 5:185

## Usage

### Basic Usage
```jsx
import ListItem from '@/components/molecules/ListItem/ListItem';

function FileList() {
  const handleItemClick = (filename) => {
    console.log('Clicked:', filename);
  };

  return (
    <div>
      <ListItem 
        text="Claude.md"
        onClick={() => handleItemClick('Claude.md')}
      />
    </div>
  );
}
```

### With Custom Icon
```jsx
<ListItem 
  text="Settings"
  icon="/settings.svg"
  onClick={handleClick}
/>
```

### Selected State
```jsx
<ListItem 
  text="Selected File.js"
  selected={true}
  onClick={handleClick}
/>
```

### File Browser Example
```jsx
function FileBrowser() {
  const [selectedFile, setSelectedFile] = useState(null);
  
  const files = [
    { name: 'README.md', icon: '/document.svg' },
    { name: 'package.json', icon: '/document.svg' },
    { name: 'src', icon: '/folder.svg' }
  ];

  return (
    <div>
      {files.map((file) => (
        <ListItem
          key={file.name}
          text={file.name}
          icon={file.icon}
          selected={selectedFile === file.name}
          onClick={() => setSelectedFile(file.name)}
        />
      ))}
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | *required* | The text content to display |
| `icon` | `string` | `'/document.svg'` | Path to the icon image |
| `selected` | `boolean` | `false` | Whether the item is in selected state |
| `onClick` | `function` | `undefined` | Callback function when item is clicked |
| `className` | `string` | `''` | Additional CSS classes to apply |

## Styling

The component uses CSS Modules with SCSS and follows the BEM naming convention. The following color scheme is applied based on the Figma design:

- **Default text**: #9B9B9B (White/Secondary)
- **Selected text**: #D5D5D5 (White/Primary)  
- **Default background**: transparent
- **Hover background**: #383838 (Black/Light Hover)
- **Selected background**: #353535 (Black/Light)

## Accessibility

- Keyboard navigable with Tab key
- Activatable with Enter or Space keys
- Proper focus indicators
- Role="button" for screen readers
- Decorative icons have empty alt attributes

## Testing

The component includes comprehensive tests covering:
- Rendering with various props
- Click interactions
- Keyboard interactions (Enter/Space)
- Selected state styling
- Custom className application
- Accessibility attributes
- Icon rendering
- Error handling for missing onClick

Run tests with:
```bash
npm run test -- ListItem.test.jsx
```

## Design Decisions

1. **Icon as prop**: The icon is configurable via prop to support different file types and icons
2. **CSS pseudo-selectors**: Hover states are handled purely with CSS for better performance
3. **Keyboard support**: Full keyboard navigation support for accessibility
4. **Client component**: Marked as 'use client' due to interactive onClick handler
5. **Next.js Image**: Uses Next.js Image component for optimized icon loading