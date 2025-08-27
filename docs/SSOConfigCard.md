# SSOConfigCard Component

## Overview
The SSOConfigCard component displays SSO (Single Sign-On) configuration for a workspace with two state variants: empty state (SSO not configured) and connected state (SSO active). It composes the WorkspaceSSOIndicatorRow molecule component for the connected state display.

## Figma Reference
- **URL**: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=567-11755&m=dev
- **Node ID**: 567:11755

## Component Location
`src/components/organisms/SSOConfigCard/SSOConfigCard.jsx`

## Usage

### Basic Usage - Empty State
```jsx
import SSOConfigCard from '@/components/organisms/SSOConfigCard/SSOConfigCard';

function SSOSettings() {
  const handleEnableSSO = () => {
    console.log('Enabling SSO...');
    // Trigger SSO configuration flow
  };

  return (
    <SSOConfigCard
      state="empty"
      companyName="Acme Corp"
      onEnableSSO={handleEnableSSO}
    />
  );
}
```

### Connected State
```jsx
import SSOConfigCard from '@/components/organisms/SSOConfigCard/SSOConfigCard';

function SSOSettings() {
  const handleDisconnect = () => {
    console.log('Disconnecting SSO...');
    // Handle SSO disconnection
  };

  return (
    <SSOConfigCard
      state="connected"
      companyName="Acme Corp"
      avatarInitial="A"
      ssoProvider="Microsoft Entra ID"
      ssoType="SAML"
      domains={['@acmecorp.com', '@acme-contractors.com']}
      ssoStatus="active"
      ssoStatusText="Active"
      onDisconnect={handleDisconnect}
      dashboardUrl="https://dashboard.workos.com/org/acme"
      connectionId="con_01HQNFK5BN5TQHXP3S1P9HFMZG"
      createdDate="8/26/2025"
      loginUrl="ckye.ai/login/acme-corp?sso"
    />
  );
}
```

### State Management Example
```jsx
function SSOConfigurationPage() {
  const [ssoState, setSSOState] = useState('empty');
  const [ssoConfig, setSSOConfig] = useState(null);

  const handleEnableSSO = async () => {
    try {
      const config = await enableSSO(); // Your API call
      setSSOConfig(config);
      setSSOState('connected');
    } catch (error) {
      console.error('Failed to enable SSO:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectSSO(); // Your API call
      setSSOConfig(null);
      setSSOState('empty');
    } catch (error) {
      console.error('Failed to disconnect SSO:', error);
    }
  };

  return (
    <SSOConfigCard
      state={ssoState}
      companyName="Acme Corp"
      onEnableSSO={handleEnableSSO}
      onDisconnect={handleDisconnect}
      {...(ssoConfig || {})}
    />
  );
}
```

## Props

### Common Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | string | `'empty'` | Component state. Options: 'empty', 'connected' |
| `companyName` | string | `'American Eagle'` | The name of the company/workspace |
| `title` | string | `'SSO Configuration'` | Card title |
| `description` | string | `'Control who can access your Ckye workspace'` | Card description |
| `className` | string | `''` | Additional CSS class names |

### Empty State Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onEnableSSO` | function | undefined | Callback function when "Enable SSO" button is clicked |

### Connected State Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onDisconnect` | function | undefined | Callback function when disconnect button is clicked |
| `dashboardUrl` | string | `'#'` | URL to the WorkOS dashboard |
| `ssoProvider` | string | `'Microsoft Entra ID'` | SSO provider name |
| `ssoType` | string | `'SAML'` | SSO protocol type (SAML, OIDC) |
| `domains` | string[] | `['@acmecorp.com', '@acme-contractors.com']` | Email domains configured for SSO |
| `ssoStatus` | string | `'active'` | SSO status for the chip |
| `ssoStatusText` | string | `'Active'` | Text to display in status chip |
| `avatarInitial` | string | `'A'` | Initial(s) for the avatar |
| `connectionId` | string | `'con_01HQNFK5BN5TQHXP3S1P9HFMZG'` | SSO connection identifier |
| `createdDate` | string | `'8/26/2025'` | Date when SSO was configured |
| `loginUrl` | string | `'ckye.ai/login/acme-corp?sso'` | SSO login URL |

## Component Composition
This organism component composes:
- **WorkspaceSSOIndicatorRow** (molecule): Displays SSO configuration with action buttons in connected state
- **Next.js Image**: For the lock icon in empty state
- Native HTML elements for metadata display

## State Variants

### Empty State
- Displays a lock icon
- Shows instructional text about enabling SSO
- Provides "Enable SSO for [Company]" button
- Centered layout for empty state content

### Connected State
- Shows WorkspaceSSOIndicatorRow with company details
- Displays SSO connection metadata (ID, creation date, login URL)
- Provides disconnect and dashboard access buttons
- Full-width layout for connected content

## Features
- **Two distinct visual states**: Empty and connected
- **Component composition**: Reuses existing WorkspaceSSOIndicatorRow molecule
- **Responsive design**: Adapts layout for mobile screens
- **Accessibility**: Full ARIA labels and semantic HTML
- **Action callbacks**: Configurable enable and disconnect handlers

## Styling
The component uses CSS Modules with SCSS for styling:
- BEM methodology for class naming
- Responsive breakpoints for mobile adaptation
- Consistent spacing and typography
- Border and background styling matching design system
- Lock icon with CSS filter for proper coloring

## Testing
The component includes comprehensive test coverage (>90%) for:
- Both state variants (empty and connected)
- User interactions (enable SSO, disconnect)
- Props validation
- State transitions
- Accessibility features
- Edge cases

Run tests with:
```bash
npm run test SSOConfigCard
```

## Accessibility
- Semantic HTML structure (h2, h3 headings)
- ARIA labels for interactive elements
- Proper button types
- Keyboard navigation support
- Focus indicators for interactive elements

## Dependencies
This component depends on:
- React (hooks)
- Next.js (Image component)
- WorkspaceSSOIndicatorRow component (molecule)

## Notes
- The component is controlled - state management should be handled by parent
- Lock icon path: `/public/lock.svg`
- Empty state shows enable button with dynamic company name
- Connected state delegates SSO row display to WorkspaceSSOIndicatorRow
- Metadata in connected state shows connection details
- Both states share the same header (title and description)