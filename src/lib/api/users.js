export async function getUsers(cookieHeader = null) {
  try {
    // Use absolute URL for server-side requests
    const url = typeof window === 'undefined' 
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/users`
      : '/api/users';
      
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
      throw new Error(error.error || 'Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function createUser(userData, cookieHeader = null) {
  try {
    // Use absolute URL for server-side requests
    const url = typeof window === 'undefined' 
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/users`
      : '/api/users';
      
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies if provided
      },
      credentials: 'same-origin', // Include cookies for client-side requests
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email, cookieHeader = null) {
  try {
    // Use absolute URL for server-side requests
    const url = typeof window === 'undefined' 
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/users/by-email?email=${encodeURIComponent(email)}`
      : `/api/users/by-email?email=${encodeURIComponent(email)}`;
      
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
      throw new Error(error.error || 'Failed to fetch user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}