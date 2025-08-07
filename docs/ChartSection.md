# ChartSection Component

## Overview
The ChartSection component displays results and findings in a clean, styled section format. It's designed to present conclusions, data insights, or key findings with a prominent title and descriptive text.

## Figma Reference
- **URL**: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=213-5313&m=dev
- **Node ID**: 213:5313

## Component Location
`src/components/molecules/ChartSection/ChartSection.jsx`

## Usage

### Basic Usage
```jsx
import ChartSection from '@/components/molecules/ChartSection/ChartSection';

function Dashboard() {
  return (
    <ChartSection />
  );
}
```

### Custom Title and Description
```jsx
import ChartSection from '@/components/molecules/ChartSection/ChartSection';

function ResultsPage() {
  return (
    <ChartSection
      title="Performance Analysis"
      description="The latest deployment improved response times by 35% across all endpoints. This improvement has been validated through comprehensive load testing."
    />
  );
}
```

### Multiple Sections
```jsx
import ChartSection from '@/components/molecules/ChartSection/ChartSection';

function AnalyticsPage() {
  return (
    <div className="analytics-container">
      <ChartSection
        title="User Engagement"
        description="Daily active users increased by 45% following the UI redesign. User session duration also improved by an average of 3 minutes."
      />
      
      <ChartSection
        title="Performance Metrics"
        description="API response times decreased by 60ms on average. Database query optimization contributed to a 25% reduction in server load."
      />
      
      <ChartSection
        title="Error Rates"
        description="Application error rates dropped to 0.02% after implementing enhanced error handling and recovery mechanisms."
      />
    </div>
  );
}
```

### With Custom Styling
```jsx
import ChartSection from '@/components/molecules/ChartSection/ChartSection';

function StyledResults() {
  return (
    <ChartSection
      title="Quarterly Results"
      description="Revenue increased by 18% compared to the previous quarter, exceeding projections by 5%."
      className="quarterly-results-section"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | 'Results' | The section heading text |
| `description` | string | 'Variant 3 improved the 1st-try code acceptance rate by 25% compared to Master. Based on the data collected, we can be 95% confident that this improvement is real and not just due to random chance.' | The descriptive text content |
| `className` | string | '' | Additional CSS classes to apply to the section container |

## Features

### Typography
- **Title**: Uses Overpass font family for the heading with bold weight
- **Description**: Uses Inter font family with medium weight for body text
- **Responsive**: Font sizes adjust for mobile devices

### Styling
- Dark background with rounded corners
- Consistent padding and spacing
- Responsive design that adapts to different screen sizes
- Follows the project's design system color variables

### Accessibility
- Semantic HTML structure with proper heading hierarchy (h2)
- Clear text contrast ratios
- Readable font sizes
- Support for screen readers

## Styling

The component uses SCSS modules with BEM methodology:
- `.chart-section` - Main container
- `.chart-section__title` - Title/heading element
- `.chart-section__description` - Description paragraph

### CSS Variables Used
- `$black-bg-light` - Section background color
- `$white-primary` - Text color
- Typography mixins for consistent text styling

## Responsive Design
- Desktop: Full padding and larger typography
- Tablet/Mobile (< 768px): Reduced padding and adjusted font sizes
- Maintains readability across all device sizes

## Testing

The component includes comprehensive tests covering:
- Default prop rendering
- Custom prop handling
- HTML structure validation
- XSS protection
- Edge cases (empty strings, long content)
- Responsive behavior

Run tests with:
```bash
npm run test ChartSection
```

## Best Practices

### Do's
- Use meaningful, concise titles
- Keep descriptions focused and informative
- Apply custom classes for specific styling needs
- Consider the context when setting default values

### Don'ts
- Don't use HTML in the title or description props (it will be escaped)
- Don't rely on this component for complex layouts
- Don't override core styling unless necessary

## Examples by Use Case

### A/B Test Results
```jsx
<ChartSection
  title="A/B Test Conclusion"
  description="Version B outperformed Version A with a 15% higher conversion rate. Statistical significance reached at p < 0.05."
/>
```

### Performance Summary
```jsx
<ChartSection
  title="Performance Impact"
  description="The new caching strategy reduced page load times by 2.3 seconds on average, improving user experience scores by 28%."
/>
```

### Data Analysis
```jsx
<ChartSection
  title="Data Insights"
  description="Customer retention improved by 12% after implementing personalized recommendations. The effect was most pronounced in the 25-34 age demographic."
/>
```

## Future Enhancements
- [ ] Support for rich text formatting in descriptions
- [ ] Optional icon or badge display
- [ ] Animated entrance effects
- [ ] Support for multiple paragraphs
- [ ] Integration with chart/graph components
- [ ] Collapsible/expandable functionality