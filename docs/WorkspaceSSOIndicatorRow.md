# WorkspaceSSOIndicatorRow Component

## Overview
The WorkspaceSSOIndicatorRow component displays SSO (Single Sign-On) configuration information for a workspace, including the company name, SSO provider details, status, and action buttons for disconnecting SSO or accessing the WorkOS dashboard.

## Figma Reference
- **URL**: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=567-11894&m=dev
- **Node ID**: 567:11894

## Component Location
`src/components/molecules/WorkspaceSSOIndicatorRow/WorkspaceSSOIndicatorRow.jsx`

## Usage

### Basic Usage
```jsx
import WorkspaceSSOIndicatorRow from '@/components/molecules/WorkspaceSSOIndicatorRow/WorkspaceSSOIndicatorRow';

function SSOManagementPage() {
  const handleDisconnect = () => {
    console.log('Disconnecting SSO...');
    // Add your disconnect logic here
  };

  return (
    <WorkspaceSSOIndicatorRow
      companyName="Acme Corp"
      avatarInitial="A"
      ssoProvider="Microsoft Entra ID"
      ssoType="SAML"
      domains={['@acmecorp.com', '@acme-contractors.com']}
      status="active"
      statusText="Active"
      onDisconnect={handleDisconnect}
      dashboardUrl="https://dashboard.workos.com/organizations/org_123"
    />
  );
}
```

### With Different Status States
```jsx
// Active state
<WorkspaceSSOIndicatorRow
  companyName="Active Company"
  status="active"
  statusText="Active"
  // ... other props
/>

// Inactive state
<WorkspaceSSOIndicatorRow
  companyName="Inactive Company"
  status="inactive"
  statusText="Inactive"
  // ... other props
/>

// Pending state
<WorkspaceSSOIndicatorRow
  companyName="Pending Company"
  status="pending"
  statusText="Pending Setup"
  // ... other props
/>

// Error state
<WorkspaceSSOIndicatorRow
  companyName="Error Company"
  status="error"
  statusText="Configuration Error"
  // ... other props
/>
```

### In a List Context
```jsx
function SSOWorkspacesList({ workspaces }) {
  return (
    <div className="workspaces-list">
      {workspaces.map(workspace => (
        <WorkspaceSSOIndicatorRow
          key={workspace.id}
          companyName={workspace.companyName}
          avatarInitial={workspace.companyName[0]}
          ssoProvider={workspace.ssoProvider}
          ssoType={workspace.ssoType}
          domains={workspace.domains}
          status={workspace.status}
          statusText={workspace.statusText}
          onDisconnect={() => handleDisconnect(workspace.id)}
          dashboardUrl={workspace.dashboardUrl}
        />
      ))}
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `companyName` | string | `'Acme Corp'` | The name of the company/workspace |
| `avatarInitial` | string | `'A'` | The initial(s) to display in the avatar |
| `ssoProvider` | string | `'Microsoft Entra ID'` | The SSO provider name (e.g., Microsoft Entra ID, Okta, Auth0) |
| `ssoType` | string | `'SAML'` | The SSO protocol type (e.g., SAML, OIDC) |
| `domains` | string[] | `['@acmecorp.com', '@acme-contractors.com']` | Array of email domains configured for SSO |
| `status` | string | `'active'` | Status of the SSO configuration. Options: 'active', 'inactive', 'pending', 'error' |
| `statusText` | string | `'Active'` | Text to display in the status chip |
| `onDisconnect` | function | undefined | Callback function when disconnect button is clicked |
| `dashboardUrl` | string | `'#'` | URL to the WorkOS dashboard for this workspace |
| `className` | string | `''` | Additional CSS class names to apply to the component |

## Component Composition
This molecule component composes the following atomic components:
- **Avatar**: Displays the company initial(s)
- **StatusChip**: Shows the current SSO status

## Features
- **Responsive Design**: Adapts layout for mobile screens (stacks vertically on screens < 768px)
- **Accessibility**: Full ARIA labels and keyboard navigation support
- **Status Indicators**: Visual status chips with color coding for different states
- **Action Buttons**: Disconnect SSO and open WorkOS dashboard functionalities

## Styling
The component uses CSS Modules with SCSS for styling. Key style features:
- BEM methodology for class naming
- Responsive breakpoints for mobile adaptation
- Hover and focus states for interactive elements
- Color-coded status chips:
  - Active: Green (#8ed09c on #4e6557 background)
  - Inactive: Gray (#9b9b9b)
  - Pending: Orange (#f5a623)
  - Error: Red (#eb5757)

## Testing
The component includes comprehensive test coverage (>90%) for:
- Rendering with various prop combinations
- Status state variations
- User interactions (disconnect callback, dashboard link)
- Accessibility features
- Edge cases and prop validation

Run tests with:
```bash
npm run test WorkspaceSSOIndicatorRow
```

## Accessibility
- Proper heading hierarchy (h3 for company name)
- ARIA labels for all interactive elements
- Role="status" for status indicator
- Keyboard navigation support
- Focus indicators for interactive elements

## Dependencies
This component depends on:
- React (hooks)
- Next.js (for optimizations)
- Avatar component (atomic)
- StatusChip component (atomic)

## Notes
- The dashboard link opens in a new tab with security attributes (noopener noreferrer)
- The disconnect button requires a callback function to handle the disconnection logic
- Domains are displayed as a comma-separated list
- The component is fully controlled - all state management should be handled by the parent component