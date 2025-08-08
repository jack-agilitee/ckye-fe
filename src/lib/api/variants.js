const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Fetch all variants with optional filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.workspaceId - Filter by workspace ID
 * @param {string} params.search - Search term for content/summary
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export async function getVariants(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/api/variants${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch variants');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching variants:', error);
    throw error;
  }
}

/**
 * Fetch a single variant by ID
 * @param {string} id - The variant ID
 * @returns {Promise<Object>}
 */
export async function getVariantById(id) {
  try {
    const response = await fetch(`${API_BASE}/api/variants/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Variant not found');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching variant ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch all variants for a specific workspace
 * @param {string} workspaceId - The workspace ID
 * @param {Object} options - Additional query options
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export async function getVariantsByWorkspace(workspaceId, options = {}) {
  return getVariants({
    workspaceId,
    ...options
  });
}

/**
 * Fetch the most recent variant for a workspace
 * @param {string} workspaceId - The workspace ID
 * @returns {Promise<Object|null>}
 */
export async function getLatestVariantForWorkspace(workspaceId) {
  try {
    const response = await getVariants({
      workspaceId,
      limit: 1,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    
    return response.data[0] || null;
  } catch (error) {
    console.error(`Error fetching latest variant for workspace ${workspaceId}:`, error);
    throw error;
  }
}