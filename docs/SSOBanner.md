# SSOBanner Component

## Overview
The SSOBanner component is a configurable information banner designed to display SSO setup instructions or other important messages with an optional link.

## Figma Reference
- **URL**: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=567-11941
- **Node ID**: 567:11941

## Location
`src/components/molecules/SSOBanner/SSOBanner.jsx`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | `'Before you Begin'` | The banner title/heading |
| `description` | string | `"You'll need to have already created..."` | The main description text |
| `linkText` | string | `'go to WorkOS Dashboard.'` | The clickable link text |
| `linkUrl` | string | `'https://dashboard.workos.com'` | The URL the link points to |
| `linkTarget` | string | `'_blank'` | Link target attribute (`'_blank'` for new tab, `'_self'` for same window) |
| `className` | string | `''` | Additional CSS classes to apply to the banner |

## Usage Examples

### Default Usage
```jsx
import SSOBanner from '@/components/molecules/SSOBanner/SSOBanner';

function MyComponent() {
  return (
    <SSOBanner />
  );
}
```

### Custom Content
```jsx
import SSOBanner from '@/components/molecules/SSOBanner/SSOBanner';

function MyComponent() {
  return (
    <SSOBanner
      title="Getting Started"
      description="Please complete the following setup before continuing: "
      linkText="View Setup Guide"
      linkUrl="https://docs.example.com/setup"
      linkTarget="_blank"
    />
  );
}
```

### Internal Navigation
```jsx
import SSOBanner from '@/components/molecules/SSOBanner/SSOBanner';

function MyComponent() {
  return (
    <SSOBanner
      title="Account Required"
      description="You need to create an account to continue. "
      linkText="Sign up now"
      linkUrl="/signup"
      linkTarget="_self"
    />
  );
}
```

### With Custom Styling
```jsx
import SSOBanner from '@/components/molecules/SSOBanner/SSOBanner';

function MyComponent() {
  return (
    <SSOBanner
      title="Important Notice"
      description="Please review our terms before proceeding. "
      linkText="Read Terms"
      linkUrl="/terms"
      linkTarget="_self"
      className="my-custom-banner"
    />
  );
}
```

## Styling

The component uses CSS Modules with SCSS and follows BEM methodology:

- `.sso-banner` - Main container with dark background
- `.sso-banner__title` - Title/heading styling
- `.sso-banner__description` - Description text styling
- `.sso-banner__link` - Link styling with hover and focus states

### Design Tokens Used
- Background: `#262B35` (Dark blue-gray)
- Title: `$text-primary` (#D5D5D5)
- Description: `$text-secondary` (#9B9B9B)
- Link: `#5193CF` (Blue)

## Accessibility

- Title is rendered as an `h3` heading for proper document structure
- External links include `rel="noopener noreferrer"` for security
- Links have visible focus states for keyboard navigation
- Proper color contrast ratios maintained

## Testing

The component includes comprehensive tests covering:
- Default and custom prop rendering
- Link behavior (external vs internal)
- CSS class application
- Accessibility features
- Edge cases (empty strings, long content)

Run tests with:
```bash
npm test SSOBanner.test.jsx
```

## Notes

- The component automatically determines whether to use Next.js `Link` component (for internal navigation) or standard `<a>` tag (for external links) based on the `linkTarget` prop
- External links automatically get security attributes (`rel="noopener noreferrer"`)
- The component is fully responsive and adapts to its container width