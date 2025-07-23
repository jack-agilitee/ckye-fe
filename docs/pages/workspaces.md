# Workspaces Page

## Overview
The Workspaces page provides administrators with a comprehensive view of all workspaces in the Ckye platform. It allows for searching, viewing, and managing workspaces and their associated users.

## Route Information
- **Path**: `/admin/workspaces`
- **File Location**: `src/app/admin/workspaces/page.jsx` (Client Component)
- **Layout Location**: `src/app/admin/workspaces/layout.jsx` (Metadata)
- **Access Level**: Admin only

## Components Used
- **Page Template**: TwoColumnPage
- **Sidebar Component**: Sidebar (with "workspaces" as active item)
- **Content Components**: 
  - SearchHeader - Provides search functionality and add workspace button
  - WorkspacesTable - Displays list of workspaces with user information

## Data Requirements
### Client-Side Data Fetching
- **Function**: `getWorkspacesData()`
- **Type**: Client-side async function (called in useEffect)
- **Current Status**: Mock data (to be replaced with actual API call)
- **Loading State**: Displays "Loading workspaces..." while fetching
- **Response Format**:
```json
[
  {
    "id": "string",
    "name": "string",
    "users": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "avatar": "string | null"
      }
    ]
  }
]
```

### Future API Integration
When the API is implemented, replace the mock `getWorkspacesData()` function with:
```javascript
import { getWorkspaces } from '@/lib/api/workspaces';

async function getWorkspacesData() {
  return await getWorkspaces();
}
```

## Props Documentation
The page component itself doesn't accept props, but passes the following to child components:

### TwoColumnPage Props
| Prop | Type | Description |
|------|------|-------------|
| leftContent | ReactNode | Sidebar component |
| rightContent | ReactNode | Main content area with SearchHeader and WorkspacesTable |

### Sidebar Props
| Prop | Type | Description |
|------|------|-------------|
| activeItem | string | Current active navigation item ("workspaces") |

### SearchHeader Props
| Prop | Type | Description |
|------|------|-------------|
| title | string | Page title ("Workspaces") |
| searchPlaceholder | string | Placeholder text for search input |
| addButtonText | string | Text for add button ("Add Workspace") |
| onAdd | function | Callback for add button click |

### WorkspacesTable Props
| Prop | Type | Description |
|------|------|-------------|
| workspaces | Array | Array of workspace objects with user data |

## Usage Examples
### Basic Usage
The page is automatically rendered by Next.js router when navigating to `/admin/workspaces`.

### With Custom Layout
To add a custom layout for admin pages:
```jsx
// In src/app/admin/layout.jsx
export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
```

## Testing
- **Test file**: `src/app/admin/workspaces/__tests__/page.test.jsx`
- **Coverage requirements**: >90%
- **Key test scenarios**:
  - Page structure rendering
  - Sidebar active state
  - Search header functionality
  - Workspaces table data display
  - User count accuracy
  - Add workspace button interaction
  - Accessibility compliance

## SEO Considerations
- **Title**: "Workspaces | Ckye Admin"
- **Description**: "Manage workspaces and users in the Ckye platform"
- **Access**: Admin-only route (should be protected by authentication)

## Accessibility
- Semantic HTML structure with proper heading hierarchy
- ARIA labels on interactive elements
- Keyboard navigation support through component structure
- Screen reader friendly table implementation

## Performance
- Server-side rendering for initial page load
- Static metadata generation
- Future considerations:
  - Implement pagination for large workspace lists
  - Add search debouncing for better performance
  - Consider virtualization for very long lists

## Design Reference
- **Figma Design**: [Node ID 8-1465](https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=8-1465&m=dev)
- Follows the design system with dark theme
- Responsive layout with two-column structure

## Future Enhancements
1. **API Integration**: Replace mock data with actual API calls
2. **Real-time Updates**: Add WebSocket support for live workspace updates
3. **Filtering**: Add advanced filtering options (by user count, creation date, etc.)
4. **Bulk Actions**: Support for selecting and managing multiple workspaces
5. **Export Functionality**: Add ability to export workspace data
6. **User Management**: Direct user management from workspace view