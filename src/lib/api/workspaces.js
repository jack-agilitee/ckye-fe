export async function getWorkspaces() {
  try {
    // Use absolute URL for server-side requests
    const url = typeof window === 'undefined' 
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/workspaces`
      : '/api/workspaces';
      
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

export async function createWorkspace(workspaceData) {
  console.log('j', workspaceData)
  try {
    // Use absolute URL for server-side requests
    const url = typeof window === 'undefined' 
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/workspaces`
      : '/api/workspaces';
      
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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