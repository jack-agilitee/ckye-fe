# Users Admin Page

## Overview
The Users Admin page provides comprehensive user management functionality for system administrators. It displays a list of all users, their roles, and workspace assignments, with the ability to search, filter, and add new users.

## Route Information
- **Path**: `/admin/users`
- **File Location**: `src/app/admin/users/page.jsx`
- **Access Level**: Admin only

## Components Used
- **Page Template**: TwoColumnPage
- **Sidebar Component**: Sidebar (in admin mode)
- **Content Components**: 
  - SearchHeader - Provides search functionality and add user button
  - UsersTable - Displays user list in tabular format

## Data Requirements
### API Integration
- **Component**: UsersTable
- **Endpoint**: `/api/users`
- **Method**: GET
- **Props Filled**: users array
- **API Client Function**: `getUsers` in `lib/api/users.js`

### Response Format
```json
{
  "data": [
    {
      "id": 1,
      "name": "Andrew Vonn",
      "email": "andrew@agilitee.com",
      "userType": "Member",
      "workspaces": ["Americal Eagle"],
      "avatar": "A"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 11,
    "totalPages": 1
  }
}
```

### Error Handling
- Server-side errors will prevent page rendering
- Client-side search filters users locally without API calls
- Empty results show empty table (no error state)

## Props Documentation
### SearchHeader Props
| Prop | Type | Description | Default |
|------|------|-------------|---------|
| title | string | Page title | 'Users' |
| searchPlaceholder | string | Search input placeholder | 'Search Users' |
| buttonText | string | Add button text | 'Add Users' |
| searchValue | string | Current search value | '' |
| onSearchChange | function | Search input change handler | - |
| onButtonClick | function | Add button click handler | - |

### UsersTable Props
| Prop | Type | Description | Default |
|------|------|-------------|---------|
| users | array | Array of user objects | [] |

### User Object Structure
| Field | Type | Description |
|-------|------|-------------|
| id | number | Unique user identifier |
| name | string | User's full name |
| email | string | User's email address |
| userType | string | 'Member' or 'Admin' |
| workspaces | array | Array of workspace names |
| avatar | string | Single character for avatar |

## Usage Examples
### Direct Access
```
Navigate to: /admin/users
```

### Programmatic Navigation
```jsx
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/admin/users');
```

## Features
1. **User List Display**
   - Shows all users with name, email, type, and workspaces
   - Avatar displays user's initial
   - Clean table layout matching Figma design

2. **Search Functionality**
   - Real-time client-side filtering
   - Case-insensitive search
   - Searches both name and email fields

3. **Add Users** (TODO)
   - Button prepared for modal integration
   - Will allow adding new users with workspace assignment

## Testing
- Test files: 
  - `src/app/admin/users/__tests__/page.test.jsx` - Server component tests
  - `src/app/admin/users/__tests__/UsersPageClient.test.jsx` - Client component tests
- Coverage requirements: >90%
- Key test scenarios:
  - Page rendering with data
  - Empty data handling
  - Search functionality
  - Case-insensitive search
  - Button interactions
  - API error handling

## SEO Considerations
- **Title**: "Users | Ckye Admin"
- **Description**: "Manage system users and workspace assignments"
- Admin-only page, not indexed by search engines

## Accessibility
- Semantic HTML structure
- Proper heading hierarchy (h1 for page title)
- Table structure for user data
- Interactive elements are keyboard accessible
- Search input has proper placeholder text

## Performance
- Server-side rendering for initial load
- Optimized with React Server Components
- Client-side search prevents unnecessary API calls
- Minimal JavaScript bundle for interactivity

## Future Enhancements
1. **Add User Modal**
   - Form for creating new users
   - Workspace selection dropdown
   - Role assignment

2. **User Actions**
   - Edit user details
   - Delete users
   - Manage user permissions

3. **Advanced Filtering**
   - Filter by user type
   - Filter by workspace
   - Sort by columns

4. **Pagination**
   - Handle large user lists
   - Server-side pagination support

## Development Notes
- Uses mock data from API route
- Ready for backend integration
- Follows atomic design principles
- SCSS modules with BEM methodology
- Fully typed with proper error handling