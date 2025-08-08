# ExperimentsModal Component

## Overview
The `ExperimentsModal` is an organism-level component that displays experiment results comparing two variants (typically Master vs. a test variant). It presents statistical analysis, performance metrics, and visualizations using gauge charts.

## Figma Reference
- **URL**: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=213-4440&m=dev
- **Node ID**: 213:4440

## Component Location
`src/components/organisms/ExperimentsModal/ExperimentsModal.jsx`

## Usage

### Basic Usage
```jsx
import { useState } from 'react';
import ExperimentsModal from '@/components/organisms/ExperimentsModal/ExperimentsModal';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEndExperiment = () => {
    console.log('Ending experiment...');
    // Handle experiment ending logic
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        View Experiment Results
      </button>
      
      <ExperimentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEndExperiment={handleEndExperiment}
      />
    </>
  );
}
```

### With Custom Data
```jsx
<ExperimentsModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onEndExperiment={handleEndExperiment}
  experimentTitle="Custom Experiment v2"
  comparisonText="baseline vs. variant 2"
  resultsData={{
    improvementPercentage: 30,
    confidenceLevel: 99,
    description: 'Variant 2 improved the code acceptance rate by 30% compared to Baseline.'
  }}
  statsData={{
    pValue: '0.00000042',
    masterConfidenceInterval: '40% – 50%',
    variantConfidenceInterval: '65% – 75%'
  }}
  impactDescription="For every 100 code generations, 30 more would be accepted."
  masterData={{
    variantName: 'Baseline',
    createdDate: 'June 1, 2025',
    currentValue: 75,
    totalValue: 150,
    percentage: 50,
    metricLabel: 'Acceptance Rate'
  }}
  variantData={{
    variantName: 'Variant 2',
    createdDate: 'July 15, 2025',
    currentValue: 105,
    totalValue: 150,
    percentage: 70,
    metricLabel: 'Acceptance Rate'
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls the visibility of the modal |
| `onClose` | `function` | - | Callback function called when the modal should close |
| `onEndExperiment` | `function` | - | Callback function called when "End Experiment" button is clicked |
| `experimentTitle` | `string` | `'Clade.md version 3'` | Title of the experiment |
| `comparisonText` | `string` | `'master vs. version 3'` | Text describing what's being compared |
| `resultsData` | `object` | See below | Data for the Results section |
| `statsData` | `object` | See below | Data for the Stats for Nerds section |
| `impactDescription` | `string` | See default | Description of the potential impact |
| `masterData` | `object` | See below | Data for the master/baseline variant card |
| `variantData` | `object` | See below | Data for the test variant card |

### resultsData Object Shape
```javascript
{
  improvementPercentage: 25,      // Percentage improvement
  confidenceLevel: 95,             // Confidence level percentage
  description: 'Full description'  // Complete results description
}
```

### statsData Object Shape
```javascript
{
  pValue: '0.00000083',                        // Statistical p-value
  masterConfidenceInterval: '42.7% – 57.3%',   // CI for master
  variantConfidenceInterval: '68.5% – 81.5%'   // CI for variant
}
```

### masterData/variantData Object Shape
```javascript
{
  variantName: 'Master',              // Name of the variant
  createdDate: 'July 7, 2025',        // Creation date
  currentValue: 89,                   // Current metric value
  totalValue: 178,                    // Total possible value
  percentage: 50,                     // Percentage for gauge (0-100)
  metricLabel: '1st Shot Acceptance Rate' // Label for the metric
}
```

## Features
- **Modal Overlay**: Semi-transparent backdrop with blur effect
- **Click Outside to Close**: Clicking outside the modal content closes it
- **Escape Key Support**: Pressing Escape key closes the modal
- **Scroll Lock**: Prevents body scroll when modal is open
- **Animated Entrance**: Smooth fade-in and slide-up animations
- **Responsive Design**: Adapts to mobile and tablet screens
- **Gauge Visualizations**: Uses VariantCard components for metric display
- **Statistical Sections**: Clear presentation of results, stats, and impact
- **Highlighted Values**: Important percentages and values are color-coded

## Composition
This component uses:
- `VariantCard` component for gauge chart visualizations
- `Image` component from Next.js for the close icon
- CSS Modules with SCSS for styling

## Accessibility
- Close button has proper `aria-label`
- Keyboard navigation support (Escape key)
- Focus management for interactive elements
- Semantic HTML structure with proper headings

## Styling
The component uses CSS Modules with SCSS and follows the BEM methodology:
- Block: `.experiments-modal`
- Elements: `__container`, `__content`, `__header`, `__section`, etc.
- Modifiers: `__stat-value--green` for green colored values

## Testing
Comprehensive test suite covers:
- Rendering with different prop combinations
- Modal open/close behavior
- Click outside and Escape key handling
- Event callback execution
- Body scroll prevention
- Custom data rendering
- Event listener cleanup

## Notes
- The modal prevents body scroll when open
- Clicking the "End Experiment" button triggers both `onEndExperiment` and `onClose` callbacks
- The component gracefully handles missing callbacks
- Gauge animations are handled by the VariantCard component
- All percentage values in descriptions are automatically highlighted in blue