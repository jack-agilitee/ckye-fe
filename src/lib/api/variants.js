const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Fetch all variants with optional filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.workspaceName - Filter by workspace name
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
 * @param {string} workspaceName - The workspace name
 * @param {Object} options - Additional query options
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export async function getVariantsByWorkspace(workspaceName, options = {}) {
  return getVariants({
    workspaceName,
    ...options
  });
}

/**
 * Fetch the most recent variant for a workspace
 * @param {string} workspaceName - The workspace name
 * @returns {Promise<Object|null>}
 */
export async function getLatestVariantForWorkspace(workspaceName) {
  try {
    const response = await getVariants({
      workspaceName
    });
    
    // Since results are already sorted by createdAt desc in the API
    return response.data[0] || null;
  } catch (error) {
    console.error(`Error fetching latest variant for workspace ${workspaceName}:`, error);
    throw error;
  }
}

/**
 * Create a new variant
 * @param {Object} variantData - The variant data
 * @param {string} variantData.content - The markdown content
 * @param {string} variantData.summary - The variant summary/name
 * @param {string} variantData.workspaceName - The workspace name
 * @returns {Promise<Object>}
 */
export async function createVariant(variantData) {
  try {
    const response = await fetch(`${API_BASE}/api/variants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(variantData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create variant');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating variant:', error);
    throw error;
  }
}

/**
 * Set a variant as master (update/create page and delete variant)
 * @param {string} variantId - The variant ID
 * @param {string} company - The company name
 * @param {string} pageName - Optional page name to use
 * @returns {Promise<Object>}
 */
export async function setVariantToMaster(variantId, company, pageName = null) {
  try {
    const response = await fetch(`${API_BASE}/api/variants/set-to-master`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId,
        company,
        pageName
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to set variant to master');
    }

    return await response.json();
  } catch (error) {
    console.error('Error setting variant to master:', error);
    throw error;
  }
}