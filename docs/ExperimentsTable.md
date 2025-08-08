# ExperimentsTable Component

## Overview
The `ExperimentsTable` is a template-level component that displays a table of experiments with their status, creation details, and action buttons. It's designed based on the Figma design and provides interactive functionality for viewing reports.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=210-5014
- Node ID: 210:5014

## Import
```jsx
import ExperimentsTable from '@/components/templates/ExperimentsTable/ExperimentsTable';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `experiments` | `Array` | `[]` | Array of experiment objects to display |
| `onViewReport` | `Function` | `undefined` | Callback function called when View Report button is clicked |
| `loading` | `Boolean` | `false` | Shows loading state when true |

### Experiment Object Structure
```javascript
{
  id: number | string,          // Unique identifier
  name: string,                  // Experiment name (e.g., "Clade.md version 2")
  comparison: string,            // Comparison info (e.g., "master vs. version 2")
  status: string,                // Status: "Active" or "Closed"
  createdDate: string | Date,    // Creation date
  createdBy: {
    name: string,                // Creator's name
    email: string,               // Creator's email
    initial: string              // Initial for avatar
  }
}
```

## Usage Examples

### Basic Usage
```jsx
const experiments = [
  {
    id: 1,
    name: 'Clade.md version 2',
    comparison: 'master vs. version 2',
    status: 'Active',
    createdDate: '2025-08-26',
    createdBy: {
      name: 'Jack Nichols',
      email: 'jack@agilitee.com',
      initial: 'J'
    }
  }
];

<ExperimentsTable experiments={experiments} />
```

### With View Report Handler
```jsx
const handleViewReport = (experiment) => {
  // Navigate to report page or open modal
  console.log('Viewing report for:', experiment.name);
  router.push(`/reports/${experiment.id}`);
};

<ExperimentsTable 
  experiments={experiments}
  onViewReport={handleViewReport}
/>
```

### Loading State
```jsx
<ExperimentsTable 
  experiments={[]}
  loading={true}
/>
```

### Empty State
```jsx
<ExperimentsTable 
  experiments={[]}
  loading={false}
/>
```

## Features

### Interactive Elements
- **View Report Button**: Styled button with icon that triggers the `onViewReport` callback
- **Row Hover**: Visual feedback on row hover
- **Status Indicators**: Color-coded status badges (green for Active, gray for Closed)

### Responsive Layout
- Uses CSS Grid for consistent column alignment
- Responsive to container width
- Text truncation for long content

### Accessibility
- Semantic HTML structure
- ARIA labels for action buttons
- Keyboard navigable
- Focus indicators on interactive elements

### Data Handling
- Gracefully handles missing data
- Automatic date formatting
- Default values for missing fields
- Status normalization (case-insensitive)

## Styling
The component uses SCSS modules with BEM methodology and follows the project's design system:
- Uses global color variables from `_variables.scss`
- Typography mixins from `_mixins.scss`
- Consistent spacing and layout patterns
- Special styling for status badges and action buttons

### Status Styling
- **Active**: Green text with light green background
- **Closed**: Gray text with light gray background

### Action Button
- Blue border and text color (`$code-blue`)
- Hover effect with background color change
- Active state with slight depression effect
- Icon and text combination

## Component Composition
- Uses `User` molecule component for displaying creator information
- Uses Next.js `Image` component for the report icon
- Follows atomic design pattern as a template-level component

## Testing
The component includes comprehensive tests covering:
- Rendering with data
- Loading and empty states
- Click interactions
- Data formatting
- Status styling
- Error handling
- Accessibility features

Test coverage target: >90%

## Dependencies
- React (hooks: useState)
- Next.js Image component
- User component from molecules
- SCSS modules

## Best Practices
1. Always provide meaningful experiment data
2. Implement proper error handling in `onViewReport`
3. Consider pagination for large datasets
4. Provide loading states during data fetching
5. Ensure proper accessibility for all interactive elements
6. Use consistent status values ("Active" or "Closed")

## Related Components
- `UsersTable` - Similar table structure for users
- `SuggestionsTable` - Similar table structure for suggestions
- `WorkspacesTable` - Simpler table structure example
- `User` - Molecule component used for creator display