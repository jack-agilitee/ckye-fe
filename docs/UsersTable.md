# UsersTable Component

## Overview
The UsersTable component displays a table of users with their information including name, email, user type, and workspaces. It's designed as a template that composes existing User and SeatType molecules.

## Figma Reference
- **URL**: https://www.figma.com/design/1wJBV3eb9vlRvuxQICmBwY/Cyke-Web-App?node-id=19-2213
- **Node ID**: 19:2213

## Usage

```jsx
import UsersTable from '@/components/templates/UsersTable/UsersTable';
import { SEAT_TYPES } from '@/components/molecules/SeatType/SeatType';

const users = [
  {
    name: 'Andrew Venn',
    email: 'andrew@agilitee.com',
    userType: SEAT_TYPES.MEMBER,
    workspaces: ['Americal Eagle']
  },
  {
    name: 'Jack Nichols', 
    email: 'jack@agilitee.com',
    userType: SEAT_TYPES.ADMIN,
    workspaces: ['Americal Eagle', 'Dollar General', 'Agilitee']
  }
];

<UsersTable users={users} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| users | Array | [] | Array of user objects to display |

### User Object Structure

Each user object should have the following properties:

| Property | Type | Description |
|----------|------|-------------|
| name | string | User's full name |
| email | string | User's email address |
| userType | string | One of: SEAT_TYPES.MEMBER, SEAT_TYPES.EDITOR, SEAT_TYPES.ADMIN |
| workspaces | Array<string> | List of workspace names the user belongs to |

## Features

- **Responsive Layout**: Three-column layout with proper spacing
- **Component Composition**: Uses existing User and SeatType molecules
- **Workspace Truncation**: Long workspace lists are truncated with CSS ellipsis
- **Clean Design**: Follows the design system with proper colors and typography
- **No Interactions**: Static display table without click handlers or hover states

## Styling

The component uses SCSS modules with BEM methodology:

- `.users-table` - Main container
- `.users-table__header` - Table header row
- `.users-table__body` - Table body container
- `.users-table__row` - Individual user row
- `.users-table__column` - Column container
- `.users-table__workspaces` - Workspace text styling

## Example with Multiple Users

```jsx
const exampleUsers = [
  {
    name: 'Andrew Venn',
    email: 'andrew@agilitee.com',
    userType: SEAT_TYPES.MEMBER,
    workspaces: ['Americal Eagle']
  },
  {
    name: 'Eli Eijadi',
    email: 'eli@agilitee.com',
    userType: SEAT_TYPES.MEMBER,
    workspaces: ['Americal Eagle', 'Agilitee']
  },
  {
    name: 'Jack Nichols',
    email: 'jack@agilitee.com',
    userType: SEAT_TYPES.ADMIN,
    workspaces: ['Americal Eagle', 'Dollar General', 'Agilitee', 'Control4', 'Subway', 'Long Branch']
  }
];

<UsersTable users={exampleUsers} />
```

## Testing

The component includes comprehensive tests covering:

- Rendering with empty user list
- Correct display of headers
- User data rendering
- Workspace formatting and truncation
- Handling of edge cases (null/undefined workspaces)
- CSS class application

Run tests with:
```bash
npm run test UsersTable.test.jsx
```

## Accessibility

- Uses semantic HTML structure
- Proper heading hierarchy with table headers
- Text contrast follows WCAG guidelines
- No interactive elements, so no keyboard navigation needed

## Dependencies

- User component (molecules)
- SeatType component (molecules)
- React (functional component with hooks)
- SCSS modules for styling