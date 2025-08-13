# Developer Statistics Page

## Overview
The Developer Statistics page is an admin-only feature that provides insights into developer contributions across different workspaces. It displays pull request metrics including PR numbers, merge dates, and estimated time spent.

## Location
- **URL**: `/admin/developer-stats`
- **Access**: Admin users only
- **Navigation**: Admin → Developer Statistics in the sidebar

## Features

### Workspace Selection
- Dropdown selector to choose a specific workspace
- Statistics are filtered by the selected workspace
- Workspace list is fetched from the API on page load

### Statistics Table
Displays the following information for each PR:
- **Developer**: GitHub username who created the PR
- **PR Number**: The pull request number
- **Merged Date**: When the PR was merged (formatted as MMM DD, YYYY)
- **Estimated Time**: Hours spent on the PR (displayed as "Xh")

### Sorting
- Click on any column header to sort by that field
- Toggle between ascending and descending order
- Default sort: Merged Date (descending)
- Visual indicators show current sort column and direction

### Pagination
- 10 items per page
- Previous/Next navigation buttons
- Page indicator shows current page and total pages
- Pagination resets when changing workspace or sort order

## Component Structure

### Page Component (`page.jsx`)
- Server component that fetches workspaces
- Uses `TwoColumnPage` layout
- Passes workspace data to client component

### Client Component (`DeveloperStatsPageClient.jsx`)
- Handles user interactions
- Manages state for:
  - Selected workspace
  - Statistics data
  - Sorting configuration
  - Pagination
  - Loading and error states

### Styling (`DeveloperStatsPageClient.module.scss`)
- Uses SCSS modules with BEM methodology
- Imports shared variables and mixins
- Responsive design for mobile devices
- Hover states for interactive elements

## API Integration

### Endpoints Used
1. `GET /api/workspaces` - Fetch available workspaces
2. `GET /api/developer-statistics` - Fetch statistics for selected workspace

### API Functions
- `getWorkspaces()` - Retrieves all workspaces
- `getDeveloperStatsByWorkspace()` - Fetches filtered statistics with pagination and sorting

### Query Parameters
- `workspaceId`: Filter by workspace
- `page`: Current page number
- `limit`: Items per page (default: 10)
- `sortBy`: Field to sort by
- `sortOrder`: 'asc' or 'desc'

## State Management

### Local State
- `selectedWorkspace`: Currently selected workspace ID
- `stats`: Array of developer statistics
- `loading`: Loading state for API calls
- `error`: Error message if API call fails
- `sortConfig`: Current sort field and direction
- `currentPage`: Current page number
- `totalPages`: Total number of pages

### Effects
- Fetches statistics when workspace selection changes
- Re-fetches when sort configuration changes
- Re-fetches when page changes

## Error Handling

### Loading States
- Shows "Loading statistics..." while fetching data
- Prevents user interaction during loading

### Error States
- Displays error message if API call fails
- Shows user-friendly error text
- Logs detailed error to console for debugging

### Empty States
- Shows message when no statistics found for workspace
- Handles null/undefined values gracefully (displays "-")

## Responsive Design

### Mobile Optimizations
- Controls stack vertically on small screens
- Dropdown expands to full width
- Table becomes horizontally scrollable
- Pagination buttons wrap if needed
- Reduced padding for better space usage

## Testing

### Unit Tests
Test files located in `__tests__/` directory:
- `page.test.jsx` - Tests for page component
- `DeveloperStatsPageClient.test.jsx` - Tests for client component

### Test Coverage
- Component rendering
- API integration
- User interactions (dropdown, sorting, pagination)
- Error handling
- Loading states
- Empty states
- Date formatting
- Responsive behavior

## Future Enhancements

### Potential Features
- Export statistics to CSV/Excel
- Date range filtering
- Developer filtering
- Summary statistics (totals, averages)
- Charts and visualizations
- Comparison between workspaces
- Time tracking integration
- Performance metrics

### Performance Optimizations
- Implement data caching
- Add virtual scrolling for large datasets
- Optimize API calls with debouncing
- Implement server-side sorting/filtering

## Related Components

### Dependencies
- `TwoColumnPage` - Layout component
- `Sidebar` - Navigation component with admin mode
- API client functions in `lib/api/`

### Similar Pages
- `/admin/users` - User management page
- `/admin/workspaces` - Workspace management page

## Maintenance Notes

### Adding New Columns
1. Update API to include new field
2. Add column header in table
3. Add sorting logic for new field
4. Update formatting function if needed
5. Add test coverage

### Updating Styles
1. Follow BEM methodology
2. Use existing variables from `_variables.scss`
3. Use mixins from `_mixins.scss`
4. Test responsive behavior

### Debugging
- Check browser console for API errors
- Verify workspace ID is being passed correctly
- Check network tab for API response format
- Ensure authentication cookies are present