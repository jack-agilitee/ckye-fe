# KpiCard Component

## Overview
The KpiCard component is a molecule-level component that displays key performance indicators (KPIs) in a card format. It shows a title, a chip with summary information, and multiple metrics with their values and labels.

## Figma Reference
- **URL**: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=350-6856&m=dev
- **Node ID**: 350:6856

## Usage

### Basic Usage
```jsx
import KpiCard from '@/components/molecules/KpiCard/KpiCard';

const Dashboard = () => {
  return (
    <KpiCard 
      title="Past 30 Days"
      chipText="66 PRs"
      metrics={[
        { value: 9, label: 'Developers Using Ckye' },
        { value: 102, label: 'Workdays Saved' }
      ]}
    />
  );
};
```

### Custom Time Period
```jsx
<KpiCard 
  title="This Week"
  chipText="12 PRs"
  metrics={[
    { value: 5, label: 'Active Developers' },
    { value: 20, label: 'Hours Saved' }
  ]}
/>
```

### Single Metric
```jsx
<KpiCard 
  title="Today"
  chipText="3 PRs"
  metrics={[
    { value: 15, label: 'Code Reviews Completed' }
  ]}
/>
```

### Multiple Metrics (3+)
```jsx
<KpiCard 
  title="Q4 2024"
  chipText="450 PRs"
  metrics={[
    { value: 25, label: 'Teams' },
    { value: 150, label: 'Developers' },
    { value: 1200, label: 'Days Saved' }
  ]}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | 'Past 30 Days' | The title text displayed in the header |
| `chipText` | string | '66 PRs' | Text displayed in the chip badge |
| `metrics` | array | `[{ value: 9, label: 'Developers Using Ckye' }, { value: 102, label: 'Workdays Saved' }]` | Array of metric objects with value and label |
| `className` | string | '' | Additional CSS class for custom styling |

### Metric Object Structure
```typescript
interface Metric {
  value: number;    // The numeric value to display
  label: string;    // The descriptive label for the metric
}
```

## Styling

The component uses CSS Modules with SCSS and follows the BEM methodology. Key style features:

- **Background**: Dark theme background (`$black-bg-dark`)
- **Typography**: 
  - Title: 20px bold Overpass font
  - Chip: 10px semi-bold Inter font
  - Metric values: 40px bold Overpass font in accent green
  - Metric labels: 12px semi-bold Inter font in secondary color
- **Layout**: Flexbox-based responsive design
- **Divider**: Gradient line separator between header and metrics

### CSS Classes
- `.kpi-card` - Main container
- `.kpi-card__header` - Header section with title and chip
- `.kpi-card__title` - Title text
- `.kpi-card__chip` - Chip container
- `.kpi-card__chip-text` - Chip text
- `.kpi-card__divider` - Gradient divider line
- `.kpi-card__stats` - Metrics container
- `.kpi-card__metric` - Individual metric container
- `.kpi-card__metric-value` - Metric numeric value
- `.kpi-card__metric-label` - Metric description label

## Responsive Behavior

- **Desktop (>480px)**: Metrics displayed horizontally
- **Mobile (≤480px)**: 
  - Metrics stack vertically
  - Metric values reduce to 32px font size
  - Full width metric containers

## Accessibility

- Semantic HTML structure with proper heading hierarchy
- High contrast colors for readability
- Flexible text sizing for zoom support
- No interactive elements (presentational component)

## Testing

The component includes comprehensive tests covering:
- Default rendering
- Custom prop values
- Single and multiple metrics
- Zero and large values
- Component structure validation
- Custom className application

Test coverage: >90%

## Design Decisions

1. **No Chip Component Reuse**: The existing Chip atom includes dismiss functionality not needed for this use case, so a simpler inline chip was implemented
2. **CSS Border**: Used a gradient CSS border instead of an image for the divider for better performance and flexibility
3. **Flexible Metrics**: Supports any number of metrics (1 to n) with automatic layout adjustment
4. **Pure Presentational**: No interactive elements as per design requirements

## Examples in Context

### Dashboard Summary
```jsx
<div className="dashboard-grid">
  <KpiCard 
    title="Past 30 Days"
    chipText="66 PRs"
    metrics={[
      { value: 9, label: 'Developers Using Ckye' },
      { value: 102, label: 'Workdays Saved' }
    ]}
  />
  <KpiCard 
    title="This Quarter"
    chipText="280 PRs"
    metrics={[
      { value: 35, label: 'Active Teams' },
      { value: 450, label: 'Days Saved' }
    ]}
  />
</div>
```

### Developer Stats Page
```jsx
<KpiCard 
  title={selectedDeveloper}
  chipText={`${prCount} PRs`}
  metrics={[
    { value: daysUsingCkye, label: 'Days Using Ckye' },
    { value: workdaysSaved, label: 'Workdays Saved' }
  ]}
/>
```

## Related Components

- **Chip** (atom): Dismissible chip component with close icon
- **DeveloperCard** (molecule): Individual developer statistics card

## Future Enhancements

- Add loading state with skeleton UI
- Support for metric trends (up/down indicators)
- Animated number transitions
- Customizable color themes for metrics
- Support for metric icons
- Tooltip support for additional context