export async function getWorkspaces(cookieHeader = null) {
  try {
    // Use absolute URL for server-side requests
    const url = typeof window === 'undefined' 
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/workspaces`
      : '/api/workspaces';
      
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies if provided
      },
      credentials: 'same-origin', // Include cookies for client-side requests
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch workspaces');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    throw error;
  }
}

export async function getWorkspace(id, cookieHeader = null) {
  try {
    // Use absolute URL for server-side requests
    const url = typeof window === 'undefined' 
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/workspaces/${id}`
      : `/api/workspaces/${id}`;
      
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies if provided
      },
      credentials: 'same-origin', // Include cookies for client-side requests
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch workspace');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching workspace:', error);
    throw error;
  }
}

export async function createWorkspace(workspaceData, cookieHeader = null) {
  try {
    // Use absolute URL for server-side requests
    const url = typeof window === 'undefined'
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/workspaces`
      : '/api/workspaces';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies if provided
      },
      credentials: 'same-origin', // Include cookies for client-side requests
      body: JSON.stringify(workspaceData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create workspace');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating workspace:', error);
    throw error;
  }
}

export async function addUserToWorkspace(userId, workspaceId, role = 'member', cookieHeader = null) {
  try {
    // Use absolute URL for server-side requests
    const url = typeof window === 'undefined'
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/user-workspace`
      : '/api/user-workspace';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies if provided
      },
      credentials: 'same-origin', // Include cookies for client-side requests
      body: JSON.stringify({ userId, workspaceId, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add user to workspace');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding user to workspace:', error);
    throw error;
  }
}

export async function removeUserFromWorkspace(userId, workspaceId, cookieHeader = null) {
  try {
    // Use absolute URL for server-side requests
    const url = typeof window === 'undefined'
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/user-workspace`
      : '/api/user-workspace';

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies if provided
      },
      credentials: 'same-origin', // Include cookies for client-side requests
      body: JSON.stringify({ userId, workspaceId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove user from workspace');
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing user from workspace:', error);
    throw error;
  }
}