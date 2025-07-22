# SeatType Component

## Overview
The SeatType component is a molecule-level component that displays different user seat types (Member, Editor, Admin) with corresponding icons and colors. It's used to visually represent user permissions or roles in the system.

## Figma Reference
- URL: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=8-1409&m=dev
- Node ID: 8:1409

## Usage

```jsx
import SeatType, { SEAT_TYPES } from '@/components/molecules/SeatType/SeatType';

// Default (Member)
<SeatType />

// Member variant
<SeatType type={SEAT_TYPES.MEMBER} />

// Editor variant
<SeatType type={SEAT_TYPES.EDITOR} />

// Admin variant
<SeatType type={SEAT_TYPES.ADMIN} />

// With custom className
<SeatType type={SEAT_TYPES.ADMIN} className="my-custom-class" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `SEAT_TYPES` enum | `SEAT_TYPES.MEMBER` | The seat type variant to display |
| `className` | string | '' | Additional CSS classes to apply |

## Enum Values

```jsx
SEAT_TYPES = {
  MEMBER: 'member',
  EDITOR: 'editor',
  ADMIN: 'admin'
}
```

## Features

### Variants
- **Member**: Gray background with eye icon
- **Editor**: Green background with edit/pencil icon
- **Admin**: Red background with lightning bolt icon

### Visual Design
- Fixed width text area (186px) for consistent alignment
- 40x40px avatar container with rounded corners
- Icon size: 24x24px
- Uses design system colors and typography

### Non-interactive
- Display-only component with no hover or click interactions
- Used for showing user roles/permissions visually

## Component Structure
```
SeatType/
├── SeatType.jsx         # Main component with enum
├── SeatType.module.scss # Styles with BEM
└── SeatType.test.jsx    # Comprehensive tests
```

## Styling
The component uses SCSS modules with BEM methodology:
- Block: `.seat-type`
- Elements: `.seat-type__avatar`, `.seat-type__icon`, `.seat-type__text`
- Modifiers: `.seat-type__avatar--member`, `.seat-type__avatar--editor`, `.seat-type__avatar--admin`

## Testing
The component includes comprehensive tests covering:
- All three variants render correctly
- Default behavior (Member variant)
- Icon rendering for each variant
- Custom className support
- Invalid type handling (defaults to Member)
- Enum export validation

To run tests:
```bash
npm run test SeatType
```

## Examples

### User List with Roles
```jsx
const UserList = ({ users }) => {
  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-item">
          <User name={user.name} email={user.email} />
          <SeatType type={user.seatType} />
        </div>
      ))}
    </div>
  );
};
```

### Permission Display
```jsx
const PermissionCard = ({ permission }) => {
  const seatType = permission.canEdit 
    ? (permission.isAdmin ? SEAT_TYPES.ADMIN : SEAT_TYPES.EDITOR)
    : SEAT_TYPES.MEMBER;
    
  return (
    <div className="permission-card">
      <h3>{permission.resourceName}</h3>
      <SeatType type={seatType} />
    </div>
  );
};
```

### Team Members Section
```jsx
const TeamMembers = ({ members }) => {
  const groupedMembers = {
    admins: members.filter(m => m.type === SEAT_TYPES.ADMIN),
    editors: members.filter(m => m.type === SEAT_TYPES.EDITOR),
    viewers: members.filter(m => m.type === SEAT_TYPES.MEMBER)
  };
  
  return (
    <div>
      <section>
        <h2>Administrators</h2>
        {groupedMembers.admins.map(admin => (
          <div key={admin.id}>
            <span>{admin.name}</span>
            <SeatType type={SEAT_TYPES.ADMIN} />
          </div>
        ))}
      </section>
      {/* Similar sections for editors and viewers */}
    </div>
  );
};
```

## Design Decisions
- Uses enum pattern for type safety and maintainability
- Non-interactive to match Figma design specifications
- Fixed text width ensures consistent layout in lists
- Color-coded avatars provide quick visual identification
- Semantic HTML structure for accessibility