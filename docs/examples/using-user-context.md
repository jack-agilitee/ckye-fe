# Using the User Context

The User Context provides global access to the logged-in user's data and their workspaces throughout the application.

## Available Data

The `useUser` hook provides:
- `user`: The complete user object with id, email, name, userType, etc.
- `workspaces`: Array of workspaces the user belongs to, each with:
  - `id`: Workspace ID
  - `name`: Workspace name
  - `shortName`: Workspace short name
  - `userCount`: Number of users in the workspace
- `isLoading`: Boolean indicating if user data is being fetched
- `error`: Error message if fetching failed
- `refetch`: Function to manually refetch user data

## Usage in Components

### Client Component Example

```jsx
'use client';

import { useUser } from '@/context/UserContext';
import LoadingSpinner from '@/components/atoms/LoadingSpinner/LoadingSpinner';

export default function UserProfile() {
  const { user, workspaces, isLoading, error } = useUser();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading user data: {error}</div>;
  if (!user) return <div>No user data available</div>;

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Type: {user.userType}</p>
      
      <h3>Your Workspaces</h3>
      <ul>
        {workspaces.map(workspace => (
          <li key={workspace.id}>
            {workspace.name} ({workspace.userCount} users)
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Accessing Specific Workspace

```jsx
'use client';

import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function WorkspaceSelector() {
  const { workspaces, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <div>Loading workspaces...</div>;

  const handleWorkspaceSelect = (workspace) => {
    router.push(`/dashboard/${workspace.shortName}`);
  };

  return (
    <div>
      <h3>Select a Workspace</h3>
      {workspaces.map(workspace => (
        <button
          key={workspace.id}
          onClick={() => handleWorkspaceSelect(workspace)}
        >
          {workspace.name}
        </button>
      ))}
    </div>
  );
}
```

### Refetching User Data

```jsx
'use client';

import { useUser } from '@/context/UserContext';

export default function RefreshButton() {
  const { refetch } = useUser();

  const handleRefresh = async () => {
    await refetch();
    alert('User data refreshed!');
  };

  return (
    <button onClick={handleRefresh}>
      Refresh User Data
    </button>
  );
}
```

## Notes

- The UserContext automatically fetches user data when the user logs in
- Data is refetched whenever the session changes
- The context is available in all Client Components
- Server Components cannot directly use the context but can pass data as props