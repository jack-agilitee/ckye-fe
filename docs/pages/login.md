# Login Page

## Overview
The login page provides a simple, centered interface for users to authenticate using NextAuth with Microsoft Azure AD. The page follows the Figma design with a clean, minimalist approach.

## Route Information
- **Path**: `/login`
- **File Location**: `src/app/login/page.jsx`
- **Access Level**: Public (unauthenticated users)

## Components Used
- No custom components - simple standalone page
- Uses NextAuth's `signIn` function for authentication
- Next.js Image component for icon rendering

## Data Requirements
### API Integration
- No direct API calls
- Uses NextAuth's built-in authentication flow
- Redirects to Microsoft Azure AD for authentication

### Authentication Flow
1. User clicks "Single Sign On" button
2. `signIn('azure-ad')` is called
3. User is redirected to Microsoft login
4. After successful authentication, user is redirected back to the application

## Design Implementation
The page implements the Figma design (node-id: 115-2814) with the following elements:
- Welcome message
- Single Sign On button
- Ckye brand definition
- Footer attribution

### Color Scheme
- Background: `$background-dark` (#252525)
- Primary text: `$white-primary` (#D5D5D5)
- Secondary text: `$white-secondary` (#9B9B9B)
- Button/Link: `$code-blue` (#74A0C8)

### Typography
- Title: 32px Overpass Bold
- Subtitle: 14px Inter Semi-Bold
- Definition: 40px/20px Overpass Bold, 18px EB Garamond
- Button: 14px Inter Semi-Bold

## Usage Examples
### Basic Usage
The page is automatically rendered when users navigate to `/login`:
```
// Automatic routing - no import needed
// Users are redirected here when not authenticated
```

### Programmatic Navigation
```jsx
import { useRouter } from 'next/navigation';

function Component() {
  const router = useRouter();
  
  const redirectToLogin = () => {
    router.push('/login');
  };
}
```

## Testing
- Test file: `src/app/login/__tests__/page.test.jsx`
- Coverage requirements: >90%
- Key test scenarios:
  - Page rendering with all elements
  - Sign in button click triggers `signIn('azure-ad')`
  - Proper text content displayed
  - Accessibility compliance
  - No form fields present (as per design)

## SEO Considerations
- **Title**: Set by global layout
- **Description**: Set by global layout
- **Robots**: Should allow indexing for brand visibility

## Accessibility
- Semantic HTML structure with proper headings (h1, h2)
- Button has clear click target
- Icon has empty alt text (decorative)
- Color contrast meets WCAG standards
- Keyboard navigable (single button focus)

## Performance
- Minimal dependencies (NextAuth only)
- No heavy components or libraries
- Fast initial load time
- Single SVG icon asset

## Security Considerations
- No sensitive data stored on the page
- Authentication handled by NextAuth
- Redirects to secure Microsoft OAuth flow
- No custom authentication logic

## Mobile Responsiveness
- Responsive design with media query at 480px
- Content reflows for small screens
- Definition section becomes static on mobile
- Maintains readability on all screen sizes

## Future Enhancements
- Add loading state during authentication
- Add error handling for failed authentication
- Consider adding "Remember me" functionality
- Add support for other authentication providers if needed