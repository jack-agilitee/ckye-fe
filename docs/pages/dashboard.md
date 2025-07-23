# Dashboard Page

## Overview
The Dashboard page provides a two-column layout with a sidebar for navigation and a markdown editor for content management. It supports dynamic routing based on company name and integrates with the pages API for content persistence.

## Route Information
- **Path**: `/dashboard/[companyName]`
- **File Location**: `src/app/dashboard/[companyName]/page.jsx`
- **Access Level**: Private (requires authentication)

## Components Used
- **Page Template**: TwoColumnPage
- **Sidebar Component**: Sidebar (existing template component in non-admin mode)
- **Content Components**: 
  - MarkdownEditor (placeholder component in organisms)

## Data Requirements
### API Integration
- **Component**: Sidebar
- **Endpoints**: 
  - `GET /api/pages?company={companyName}` - Fetch pages for company
  - `POST /api/pages` - Create new page
- **Props Filled**: contextItems (array of pages)
- **API Client Functions**: 
  - `getPages(companyName)` in `lib/api/pages.js`
  - `addPage(pageData)` in `lib/api/pages.js`

### Response Format
```json
{
  "data": [
    {
      "id": "1",
      "name": "Claude.md",
      "content": "# Claude.md content...",
      "company": "AEO",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 2,
    "company": "AEO"
  }
}
```

### Error Handling
- Loading states displayed during fetch with centered loading message
- Error messages shown on failure with error details
- Alert shown for add page failures
- Retry functionality through page refresh

## Props Documentation

### DashboardPage
No props - uses dynamic route parameter `companyName`

### Sidebar Props
| Prop | Type | Description | Default |
|------|------|-------------|---------|
| contextItems | array | List of pages from API | [] |
| selectedItemId | string | ID of selected page | null |
| isAdmin | boolean | Admin status | false |
| isAdminMode | boolean | Admin mode status | false |
| accountName | string | Company name from route | - |
| accountInitial | string | First letter of company | - |
| onContextItemClick | function | Page selection handler | - |
| onAddNewClick | function | Add page handler | - |
| onAccountClick | function | Account click handler | - |
| onNotesClick | function | Notes click handler | - |

### MarkdownEditor Props
| Prop | Type | Description | Default |
|------|------|-------------|---------|
| content | string | Markdown content | '' |
| placeholder | string | Placeholder text | 'Start typing...' |
| readOnly | boolean | Read-only mode | false |

## Usage Examples
### Direct Navigation
```jsx
// Navigate to AEO company dashboard
<Link href="/dashboard/AEO">Go to Dashboard</Link>

// Navigate to different company
<Link href="/dashboard/CompanyName">Company Dashboard</Link>
```

### Programmatic Navigation
```jsx
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push('/dashboard/AEO');
```

## Testing
- Test file: `src/app/dashboard/[companyName]/__tests__/page.test.jsx`
- Coverage requirements: >90%
- Key test scenarios:
  - Page rendering with TwoColumnPage layout
  - API data fetching on mount
  - Page selection functionality
  - Add new page functionality
  - Error handling for API failures
  - Loading states
  - Empty data states

## SEO Considerations
- **Title**: Dynamic based on company name
- **Description**: Company-specific dashboard
- **Keywords**: dashboard, markdown, pages, {companyName}
- **Open Graph**: Company-specific tags

## Accessibility
- ARIA labels for interactive elements
- Keyboard navigation support for sidebar
- Screen reader friendly component structure
- Proper heading hierarchy
- Color contrast compliant with WCAG standards

## Performance
- Client-side rendering for real-time updates
- API calls optimized with loading states
- Component lazy loading potential for editor
- Efficient re-renders with React hooks

## Future Enhancements
1. **Markdown Editor Implementation**:
   - Replace placeholder with full editor
   - Live preview functionality
   - Syntax highlighting
   - Toolbar for formatting

2. **Auto-save Functionality**:
   - Periodic saves while editing
   - Conflict resolution
   - Version history

3. **Enhanced Navigation**:
   - Folder structure support
   - Search functionality
   - Recent pages section

4. **Collaboration Features**:
   - Real-time collaboration
   - User presence indicators
   - Comments and annotations

## API Endpoints Created
### GET /api/pages
- Query params: `company` (required)
- Returns: Array of pages for the company
- Status codes: 200 (success), 400 (missing company), 500 (server error)

### POST /api/pages
- Body: `{ name, company, content }`
- Returns: Created page object
- Status codes: 201 (created), 400 (validation error), 500 (server error)

### GET /api/pages/[id]
- Returns: Single page object
- Status codes: 200 (success), 404 (not found), 500 (server error)

### PUT /api/pages/[id]
- Body: Page update data
- Returns: Updated page object
- Status codes: 200 (success), 404 (not found), 500 (server error)

### DELETE /api/pages/[id]
- Returns: Success message
- Status codes: 200 (success), 404 (not found), 500 (server error)