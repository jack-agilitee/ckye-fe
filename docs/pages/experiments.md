# Experiments Page

## Overview
The Experiments page displays a table of experiments for a specific company/workspace. It provides functionality to search, view, and manage different experiments for documents (like Claude.md and Commands.md) that have been created through the system. Users can view experiment reports through a modal interface.

## Route Information
- **Path**: `/experiments/[company]`
- **File Location**: `src/app/experiments/[company]/page.jsx`
- **Access Level**: Private (requires authentication)
- **Dynamic Route**: Yes - company parameter is required

## Components Used
- **Page Template**: TwoColumnPage
- **Sidebar Component**: Sidebar (templates)
- **Content Components**: 
  - SearchHeader (molecules)
  - ExperimentsTable (templates)
  - ExperimentsModal (organisms)

## Data Requirements
### Current Implementation
- Data is currently hardcoded in the page component
- Mock experiments include:
  - Claude.md experiments (versions 2-5)
  - Commands.md experiment (version 2)
  - Each experiment has: experimentName, version, status, createdDate, createdBy

### Future API Integration
When API is implemented, the page should:
- **Endpoint**: `/api/experiments/[company]`
- **Method**: GET
- **Response Format**:
```json
{
  "data": [
    {
      "id": "string",
      "experimentName": "string",
      "version": "string",
      "status": "Active" | "Closed",
      "createdDate": "string",
      "createdBy": {
        "initial": "string",
        "name": "string",
        "email": "string"
      }
    }
  ],
  "total": "number"
}
```

## Props Documentation
### ExperimentsPage
| Prop | Type | Description | Default |
|------|------|-------------|---------|
| params | object | Next.js route params containing company | Required |
| params.company | string | Company/workspace identifier | Required |

### Component Integration
The page integrates the following components with these props:

**Sidebar:**
- accountName: Company name from route params
- selectedItemId: "experiments" (hardcoded)
- onContextItemClick: Handler for context menu items

**SearchHeader:**
- title: "Experiments"
- searchPlaceholder: "Search Experiments by Name"
- searchValue: Controlled search input value
- onSearchChange: Updates search filter
- buttonText: "New Experiment"
- onButtonClick: Handler for creating new experiments

**ExperimentsTable:**
- experiments: Filtered array of experiment objects
- company: Company identifier
- onRowClick: Opens ExperimentsModal with selected experiment

**ExperimentsModal:**
- isOpen: Boolean to control modal visibility
- onClose: Handler to close modal
- experimentName: Name of the selected experiment
- version: Version comparison string

## Features
- **Search Functionality**: Real-time filtering of experiments by name, version, or status
- **Sidebar Navigation**: Context items and workspace navigation
- **Responsive Table**: Displays experiment information in organized columns
- **Modal Integration**: Click on experiment rows to view detailed reports
- **Status Indicators**: Visual distinction between Active and Closed experiments

## Usage Examples
### Direct Navigation
```jsx
// Navigate to experiments page for a specific company
router.push('/experiments/agilitee');
```

### From Sidebar
The Sidebar component can navigate to the experiments page:
```jsx
<ListItem
  text="Experiments"
  icon="/experiments.svg"
  selected={pathname?.includes('/experiments')}
  onClick={() => router.push(`/experiments/${accountName.toLowerCase()}`)}
/>
```

## Testing
- Test file: `src/app/experiments/[company]/__tests__/page.test.jsx`
- Coverage requirements: >90%
- Key test scenarios:
  - Page rendering with correct structure
  - Search functionality (filtering by name, version, status)
  - Modal open/close functionality
  - Component integration
  - Dynamic routing with company parameter
  - Accessibility compliance

## SEO Considerations
- **Title**: Dynamic based on company - "Experiments - [Company] | Ckye"
- **Description**: "View and manage experiments for [Company]"
- **Keywords**: experiments, A/B testing, versions, comparison
- **Indexing**: No-index (private page)

## Accessibility
- ARIA labels for interactive elements
- Keyboard navigation supported
- Screen reader friendly table structure
- Color contrast compliant (WCAG AA)
- Focus indicators on interactive elements
- Modal focus management

## Performance
- Client-side rendering for interactivity
- Search debouncing to reduce re-renders
- Optimized table rendering
- Lazy loading modal component
- Minimal bundle size impact

## Styling
- Uses SCSS modules with BEM methodology
- Responsive design with grid layout
- Dark theme following design system
- Typography using global mixins
- Consistent with application design patterns

## Future Enhancements
1. **API Integration**: Connect to backend for real experiment data
2. **Create Experiment**: Implement new experiment creation flow
3. **Export Reports**: Download experiment reports in various formats
4. **Bulk Actions**: Select multiple experiments for operations
5. **Advanced Filters**: Filter by date range, status, user
6. **Real-time Updates**: WebSocket integration for live status updates
7. **Pagination**: For large experiment lists
8. **Analytics Integration**: Detailed metrics and charts in modal

## Figma Reference
Design specification available at:
https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=210-5008

## Notes
- The page uses the TwoColumnPage template for consistent layout
- Similar structure to the variants page for consistency
- Search is case-insensitive and searches across name, version, and status
- The "New Experiment" button currently logs to console - needs implementation
- ExperimentsModal opens when clicking on table rows to view detailed reports
- Status can be "Active" or "Closed" to indicate experiment state