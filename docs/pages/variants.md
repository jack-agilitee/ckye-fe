# Variants Page

## Overview
The Variants page displays a table of suggested document variants for a specific company/workspace. It provides functionality to search, view, and manage different versions of documents (like Claude.md and Commands.md) that have been created through the system.

## Route Information
- **Path**: `/variants/[company]`
- **File Location**: `src/app/variants/[company]/page.jsx`
- **Access Level**: Private (requires authentication)
- **Dynamic Route**: Yes - company parameter is required

## Components Used
- **Page Template**: TwoColumnPage
- **Sidebar Component**: Sidebar (templates)
- **Content Components**: 
  - SearchHeader (molecules)
  - VariantsTable (templates)

## Data Requirements
### Current Implementation
- Data is currently hardcoded in the page component
- Mock variants include:
  - Claude.md variants (2-5)
  - Commands.md variant 2
  - Each variant has: name, variantLabel, createdDate, createdBy (user info), and summary

### Future API Integration
When API is implemented, the page should:
- **Endpoint**: `/api/variants/[company]`
- **Method**: GET
- **Response Format**:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "variantLabel": "string", 
      "createdDate": "string",
      "createdBy": {
        "initial": "string",
        "name": "string",
        "email": "string"
      },
      "summary": "string"
    }
  ],
  "total": "number"
}
```

## Props Documentation
### VariantsPage
| Prop | Type | Description | Default |
|------|------|-------------|---------|
| params | object | Next.js route params containing company | Required |
| params.company | string | Company/workspace identifier | Required |

### VariantsTable Component
| Prop | Type | Description | Default |
|------|------|-------------|---------|
| variants | array | Array of variant objects | [] |
| company | string | Company identifier | '' |

## Features
- **Search Functionality**: Real-time filtering of variants by name, label, or summary
- **Sidebar Navigation**: Context items and workspace navigation
- **Responsive Table**: Displays variant information in organized columns
- **Row Interactions**: Clickable rows for future detail view/edit functionality

## Usage Examples
### Direct Navigation
```jsx
// Navigate to variants page for a specific company
router.push('/variants/agilitee');
```

### From Sidebar
The Sidebar component automatically navigates to the variants page when "Suggested Variants" is clicked:
```jsx
<ListItem
  text="Suggested Variants"
  icon="/sparkle.svg"
  selected={pathname?.includes('/variants')}
  onClick={() => router.push(`/variants/${accountName.toLowerCase()}`)}
/>
```

## Testing
- Test file: `src/app/variants/[company]/__tests__/page.test.jsx`
- Coverage requirements: >90%
- Key test scenarios:
  - Page rendering with correct structure
  - Search functionality (filtering)
  - Component integration
  - Dynamic routing with company parameter
  - Accessibility compliance

## SEO Considerations
- **Title**: Dynamic based on company - "Variants - [Company] | Ckye"
- **Description**: "View and manage document variants for [Company]"
- **Keywords**: variants, documents, versions, suggestions
- **Indexing**: No-index (private page)

## Accessibility
- ARIA labels for interactive elements
- Keyboard navigation supported
- Screen reader friendly table structure
- Color contrast compliant (WCAG AA)
- Focus indicators on interactive elements

## Performance
- Client-side rendering for interactivity
- Search debouncing to reduce re-renders
- Optimized table rendering
- Lazy loading for future API integration

## Styling
- Uses SCSS modules with BEM methodology
- Responsive design with grid layout
- Dark theme following design system
- Typography using global mixins

## Future Enhancements
1. **API Integration**: Connect to backend for real variant data
2. **Add Variant Modal**: Implement creation of new variants
3. **Variant Details**: Click-through to view/edit full variant content
4. **Bulk Actions**: Select multiple variants for operations
5. **Export Functionality**: Download variants in various formats
6. **Version Comparison**: Side-by-side variant comparison view
7. **Pagination**: For large variant lists
8. **Advanced Filters**: Filter by date, user, etc.

## Figma Reference
Design specification available at:
https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=210-3927

## Notes
- The page uses the TwoColumnPage template for consistent layout
- Sidebar context items are currently hardcoded but should be fetched from API
- Search is case-insensitive and searches across name, label, and summary
- The "Add Variant" button currently logs to console - needs modal implementation