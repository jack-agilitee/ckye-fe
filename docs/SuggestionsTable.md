# SuggestionsTable Component

## Overview
The `SuggestionsTable` is a template-level component that displays a table of suggestions with file information, creation details, and summaries. It's designed based on the Figma design and provides interactive row functionality.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=210-3933
- Node ID: 210:3933

## Import
```jsx
import SuggestionsTable from '@/components/templates/SuggestionsTable/SuggestionsTable';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `suggestions` | `Array` | `[]` | Array of suggestion objects to display |
| `onRowClick` | `Function` | `undefined` | Callback function called when a row is clicked |
| `loading` | `Boolean` | `false` | Shows loading state when true |

### Suggestion Object Structure
```javascript
{
  id: number | string,          // Unique identifier
  fileName: string,              // Name of the file
  variant: string,               // Variant information
  createdDate: string | Date,    // Creation date
  createdBy: {
    name: string,                // Creator's name
    email: string,               // Creator's email
    initial: string              // Initial for avatar
  },
  summary: string                // Suggestion summary text
}
```

## Usage Examples

### Basic Usage
```jsx
const suggestions = [
  {
    id: 1,
    fileName: 'Clade.md',
    variant: 'Variant 2',
    createdDate: '2025-08-07',
    createdBy: {
      name: 'Claude Code',
      email: 'agent@agilitee.com',
      initial: 'C'
    },
    summary: 'Updated examples to use React function components with hooks'
  }
];

<SuggestionsTable suggestions={suggestions} />
```

### With Click Handler
```jsx
const handleRowClick = (suggestion) => {
  // Open modal or navigate to detail page
  openSuggestionModal(suggestion);
};

<SuggestionsTable 
  suggestions={suggestions}
  onRowClick={handleRowClick}
/>
```

### Loading State
```jsx
<SuggestionsTable 
  suggestions={[]}
  loading={true}
/>
```

### Empty State
```jsx
<SuggestionsTable 
  suggestions={[]}
  loading={false}
/>
```

## Features

### Interactive Rows
- Rows are clickable and trigger the `onRowClick` callback
- Hover state provides visual feedback
- Chevron icon indicates clickable action

### Responsive Layout
- Uses CSS Grid for consistent column alignment
- Text truncation for long content
- Responsive to container width

### Accessibility
- Semantic HTML structure
- ARIA labels for action buttons
- Keyboard navigable
- Focus indicators

### Data Handling
- Gracefully handles missing data
- Automatic date formatting
- Text truncation for long summaries
- Default values for missing fields

## Styling
The component uses SCSS modules with BEM methodology and follows the project's design system:
- Uses global color variables from `_variables.scss`
- Typography mixins from `_mixins.scss`
- Consistent spacing and layout patterns

## TODO
- Implement modal for row click action when `onRowClick` is not provided
- The component includes a TODO comment to implement the modal functionality

## Testing
The component includes comprehensive tests covering:
- Rendering with data
- Loading and empty states
- Click interactions
- Data formatting
- Error handling
- Accessibility features

Test coverage target: >90%

## Dependencies
- React (hooks: useState)
- Next.js Image component
- Avatar component from atoms
- SCSS modules

## Best Practices
1. Always provide meaningful data for better UX
2. Implement proper error handling in `onRowClick`
3. Consider pagination for large datasets
4. Provide loading states during data fetching
5. Ensure proper accessibility for all interactive elements