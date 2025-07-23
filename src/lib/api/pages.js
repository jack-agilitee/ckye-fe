const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function getPages(companyName) {
  try {
    const response = await fetch(`${API_BASE}/api/pages?company=${encodeURIComponent(companyName)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch pages');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pages:', error);
    throw error;
  }
}

export async function getPageById(pageId) {
  try {
    const response = await fetch(`${API_BASE}/api/pages/${pageId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Page not found');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching page ${pageId}:`, error);
    throw error;
  }
}

export async function addPage(pageData) {
  try {
    const response = await fetch(`${API_BASE}/api/pages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create page');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating page:', error);
    throw error;
  }
}

export async function updatePage(pageId, pageData) {
  try {
    const response = await fetch(`${API_BASE}/api/pages/${pageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update page');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating page ${pageId}:`, error);
    throw error;
  }
}

export async function deletePage(pageId) {
  try {
    const response = await fetch(`${API_BASE}/api/pages/${pageId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete page');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting page ${pageId}:`, error);
    throw error;
  }
}