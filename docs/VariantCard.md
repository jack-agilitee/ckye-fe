# VariantCard Component

## Overview
The VariantCard component displays variant performance metrics with an animated gauge visualization. It's designed to show key performance indicators in a visually appealing card format with a speedometer-style gauge.

## Figma Reference
- **URL**: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=213-5348&m=dev
- **Node ID**: 213:5348

## Component Location
`src/components/organisms/VariantCard/VariantCard.jsx`

## Usage

### Basic Usage
```jsx
import VariantCard from '@/components/organisms/VariantCard/VariantCard';

function Dashboard() {
  return (
    <VariantCard
      variantName="Master"
      createdDate="July 7, 2025"
      currentValue={89}
      totalValue={178}
      percentage={50}
      metricLabel="1st Shot Acceptance Rate"
    />
  );
}
```

### Interactive Card
```jsx
import VariantCard from '@/components/organisms/VariantCard/VariantCard';

function VariantsList() {
  const handleVariantClick = (variantName) => {
    console.log(`Variant ${variantName} clicked`);
    // Navigate to variant details or show modal
  };

  return (
    <VariantCard
      variantName="Variant 3"
      createdDate="Aug 25, 2025"
      currentValue={126}
      totalValue={168}
      percentage={75}
      metricLabel="1st Shot Acceptance Rate"
      onClick={() => handleVariantClick('Variant 3')}
    />
  );
}
```

### Multiple Cards Grid
```jsx
import VariantCard from '@/components/organisms/VariantCard/VariantCard';

function VariantsGrid() {
  const variants = [
    {
      name: 'Master',
      date: 'July 7, 2025',
      current: 89,
      total: 178,
      percentage: 50
    },
    {
      name: 'Variant 3',
      date: 'Aug 25, 2025',
      current: 126,
      total: 168,
      percentage: 75
    }
  ];

  return (
    <div className="variants-grid">
      {variants.map((variant) => (
        <VariantCard
          key={variant.name}
          variantName={variant.name}
          createdDate={variant.date}
          currentValue={variant.current}
          totalValue={variant.total}
          percentage={variant.percentage}
          metricLabel="1st Shot Acceptance Rate"
        />
      ))}
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variantName` | string | 'Master' | The name of the variant |
| `createdDate` | string | 'July 7, 2025' | The creation date of the variant |
| `currentValue` | number | 89 | The current metric value |
| `totalValue` | number | 178 | The total/maximum metric value |
| `percentage` | number | 50 | The percentage to display on the gauge (0-100) |
| `metricLabel` | string | '1st Shot Acceptance Rate' | The label describing the metric |
| `onClick` | function | undefined | Optional click handler for making the card interactive |
| `className` | string | '' | Additional CSS classes to apply to the card |

## Features

### Animated Gauge
- The gauge needle animates from 0 to the target percentage on mount
- Smooth cubic-bezier easing for natural motion
- Percentage counter animates simultaneously with the needle

### Interactive States
- When `onClick` prop is provided, the card becomes clickable
- Hover effect with elevation and shadow
- Keyboard accessible (Enter and Space keys trigger click)
- Focus outline for accessibility

### Responsive Design
- Adapts to container width
- Mobile-optimized layout for screens under 480px
- Maintains aspect ratio of gauge visualization

### Accessibility
- Semantic HTML structure
- ARIA labels for gauge visualization
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

## Styling

The component uses SCSS modules with BEM methodology:
- `.variant-card` - Main container
- `.variant-card__header` - Header section with name and date
- `.variant-card__stats` - Statistics section
- `.variant-card__gauge` - Gauge visualization container
- `.variant-card__needle` - Animated needle element
- `.variant-card__percentage` - Percentage display

### CSS Variables Used
- `$black-bg-light` - Card background
- `$white-primary` - Primary text color
- `$white-secondary` - Secondary text color
- `$code-blue` - Accent color for values and progress
- `$black-light-hover` - Hover state background

## Animation Details

### Needle Animation
- Duration: 1 second
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Rotation range: -90° to 90° (maps to 0-100%)

### Percentage Counter
- Duration: 1 second
- Steps: 30 frames
- Synchronized with needle movement

## Dependencies
- React (hooks: useState, useEffect, useRef)
- Next.js Image component for needle image
- SCSS Modules for styling

## Image Assets
- **Needle Image**: `/public/needle.png` - The gauge needle graphic

## Testing

The component includes comprehensive tests covering:
- Rendering with different props
- Click and keyboard interactions
- Animation behavior
- Accessibility attributes
- Responsive behavior
- Edge cases (0% and 100% values)

Run tests with:
```bash
npm run test VariantCard
```

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 not supported due to CSS Grid and SVG requirements

## Performance Considerations
- Uses React.memo internally for optimization
- Needle image loaded with priority flag
- CSS transforms for smooth animations
- Minimal re-renders through proper state management

## Future Enhancements
- [ ] Add color themes for different metric ranges (green/yellow/red)
- [ ] Support for multiple metrics in one card
- [ ] Export gauge as image functionality
- [ ] Configurable animation duration
- [ ] Support for reverse gauge (100 to 0)