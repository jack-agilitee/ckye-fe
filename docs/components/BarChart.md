# BarChart Component

## Overview
The BarChart component is a template-level data visualization component that displays bar charts with customizable data, labels, and styling. It's designed to show trends and comparisons over time or categories.

## Figma Reference
- **URL**: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=350-6367&m=dev
- **Node ID**: 350:6367

## Usage

### Basic Usage
```jsx
import BarChart from '@/components/templates/BarChart/BarChart';

const DashboardPage = () => {
  return (
    <BarChart />
  );
};
```

### With Custom Data
```jsx
import BarChart from '@/components/templates/BarChart/BarChart';

const AnalyticsPage = () => {
  const data = [
    { date: '1/1', value: 45 },
    { date: '1/2', value: 52 },
    { date: '1/3', value: 48 },
    { date: '1/4', value: 70 },
    { date: '1/5', value: 65 }
  ];

  return (
    <BarChart 
      title="Daily Active Users"
      dateRange="Jan 1 - Jan 5, 2024"
      data={data}
      maxValue={100}
      yAxisLabel="Users"
      xAxisLabel="Date"
      barColor="#4CAF50"
    />
  );
};
```

### Quarterly Report Example
```jsx
<BarChart 
  title="Quarterly Revenue"
  dateRange="2024 Fiscal Year"
  data={[
    { date: 'Q1', value: 850000 },
    { date: 'Q2', value: 920000 },
    { date: 'Q3', value: 1100000 },
    { date: 'Q4', value: 1250000 }
  ]}
  maxValue={1500000}
  yAxisLabel="Revenue ($)"
  xAxisLabel="Quarter"
  barColor="#2196F3"
/>
```

### Development Hours Saved (Default)
```jsx
<BarChart 
  title="Development Hours Saved"
  dateRange="Past 30 Days: Sep 15 — Aug 12, 2025"
  barColor="#8ED09C"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | 'Development Hours Saved' | The chart title displayed at the top |
| `dateRange` | string | 'Past 30 Days: Sep 15 — Aug 12, 2025' | Date range or period description |
| `data` | array | Sample data | Array of objects with `date` and `value` properties |
| `maxValue` | number | 150 | Maximum value for Y-axis scaling |
| `yAxisLabel` | string | 'Hours' | Label for the Y-axis |
| `xAxisLabel` | string | 'Date' | Label for the X-axis |
| `barColor` | string | '#8ED09C' | Color of the bars (hex color) |
| `className` | string | '' | Additional CSS class for custom styling |

### Data Object Structure
```typescript
interface ChartData {
  date: string;   // X-axis label (e.g., "1/15", "Q1", "Jan")
  value: number;  // Y-axis value (bar height)
}
```

## Styling

The component uses CSS Modules with SCSS and follows the BEM methodology. Key style features:

- **Background**: Dark theme background (`$black-bg-dark`)
- **Typography**: 
  - Title: 18px semi-bold Inter font
  - Date range: 12px medium Inter font
  - Axis labels: 12px semi-bold Inter font
  - Y-axis values: 8px semi-bold Inter font
  - X-axis dates: 12px SF Mono font (rotated 30°)
- **Layout**: Flexbox-based responsive design
- **Grid**: Dotted horizontal grid lines for reference
- **Bars**: Customizable color with rounded top corners

### CSS Classes
- `.bar-chart` - Main container
- `.bar-chart__header` - Header section with title and date range
- `.bar-chart__title` - Chart title
- `.bar-chart__date-range` - Date range text
- `.bar-chart__body` - Main chart area
- `.bar-chart__y-axis` - Y-axis container
- `.bar-chart__grid-line` - Horizontal grid lines
- `.bar-chart__y-value` - Y-axis value labels
- `.bar-chart__y-label` - Y-axis label (rotated)
- `.bar-chart__bars` - Bars container
- `.bar-chart__bar` - Individual bar
- `.bar-chart__x-label` - X-axis date labels (rotated)
- `.bar-chart__x-axis-label` - X-axis label

## Responsive Behavior

- **Desktop (>768px)**: Full layout with all labels visible
- **Tablet (≤768px)**: 
  - Reduced padding and minimum height
  - Smaller bar widths
  - X-axis labels rotated to 45°
- **Mobile (≤480px)**: 
  - Every other X-axis label hidden to prevent overlap
  - Further reduced bar widths

## Accessibility

- Each bar has `role="img"` for screen readers
- `aria-label` on bars provides full context (e.g., "1/15: 75 Hours")
- Semantic HTML structure with proper heading hierarchy
- High contrast colors for readability
- Keyboard accessible (bars are not interactive by default)

## Testing

The component includes comprehensive tests covering:
- Default and custom prop rendering
- Data visualization accuracy
- Bar height calculations
- Axis label rendering
- Grid line generation
- Accessibility attributes
- Responsive behavior
- Edge cases (empty data, large datasets)

Test coverage: >90%

## Design Decisions

1. **Template Level**: Placed in templates folder as it's a complete, self-contained chart component
2. **CSS Grid Lines**: Used CSS gradients instead of SVG images for better performance and flexibility
3. **Rotated Labels**: X-axis labels rotate 30° to prevent overlap with many data points
4. **Default Data**: Includes sample data to show a functional chart even without props
5. **Flexible Scaling**: Automatic Y-axis scaling based on maxValue prop

## Examples in Context

### Analytics Dashboard
```jsx
<div className="dashboard-grid">
  <BarChart 
    title="Weekly Active Users"
    dateRange="Last 7 Days"
    data={weeklyData}
    yAxisLabel="Users"
    barColor="#4CAF50"
  />
  <BarChart 
    title="API Calls"
    dateRange="Last 7 Days"
    data={apiData}
    yAxisLabel="Calls (thousands)"
    barColor="#FF9800"
  />
</div>
```

### Performance Metrics Page
```jsx
<BarChart 
  title="Page Load Times"
  dateRange="Past 24 Hours"
  data={performanceData}
  maxValue={5000}
  yAxisLabel="Time (ms)"
  xAxisLabel="Hour"
  barColor="#E91E63"
/>
```

## Related Components

- **ChartSection** (molecule): Wrapper component for charts with description
- **KpiCard** (molecule): Displays key performance indicators
- **DeveloperCard** (molecule): Shows individual developer statistics

## Future Enhancements

- Add hover tooltips showing exact values
- Support for multiple data series (grouped bars)
- Animated bar transitions on data change
- Click handlers for drill-down functionality
- Export chart as image/PDF
- Support for negative values
- Stacked bar chart variant
- Horizontal bar chart option
- Real-time data updates
- Color gradients for bars based on value ranges