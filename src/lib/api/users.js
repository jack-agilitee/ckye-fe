export async function getUsers(filters = {}, cookieHeader = null) {
  try {
    // Build query params from filters
    const params = new URLSearchParams();
    if (filters.userTypes && filters.userTypes.length > 0) {
      params.append('userTypes', filters.userTypes.join(','));
    }
    if (filters.accountTypes && filters.accountTypes.length > 0) {
      params.append('accountTypes', filters.accountTypes.join(','));
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    const queryString = params.toString();
    
    // Use absolute URL for server-side requests
    const url = typeof window === 'undefined' 
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/users${queryString ? `?${queryString}` : ''}`
      : `/api/users${queryString ? `?${queryString}` : ''}`;
      
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

export async function updateUser(userData, cookieHeader = null) {
  try {
    // Use absolute URL for server-side requests
    const url = typeof window === 'undefined' 
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/users`
      : '/api/users';
      
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies if provided
      },
      credentials: 'same-origin', // Include cookies for client-side requests
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(userId, cookieHeader = null) {
  try {
    // Use absolute URL for server-side requests
    const url = typeof window === 'undefined' 
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/users`
      : '/api/users';
      
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies if provided
      },
      credentials: 'same-origin', // Include cookies for client-side requests
      body: JSON.stringify({ id: userId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}