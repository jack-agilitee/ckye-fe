const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Fetch experiments for a specific workspace
 * @param {string} workspaceId - The workspace ID (required)
 * @param {Object} params - Additional query parameters
 * @param {string} params.status - Filter by status (active, inactive, completed)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export async function getExperimentsByWorkspace(workspaceId, params = {}) {
  try {
    if (!workspaceId) {
      throw new Error('workspaceId is required');
    }

    const queryParams = {
      workspaceId,
      ...params
    };
    
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`${API_BASE}/api/experiments?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch experiments');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching experiments:', error);
    throw error;
  }
}

/**
 * Get active experiments for a workspace
 * @param {string} workspaceId - The workspace ID
 * @returns {Promise<{data: Array, meta: Object}>}
 */
export async function getActiveExperiments(workspaceId) {
  return getExperimentsByWorkspace(workspaceId, { 
    status: 'active',
    sortBy: 'startDate',
    sortOrder: 'desc'
  });
}

/**
 * Create a new experiment
 * @param {Object} data - The experiment data
 * @param {string} data.name - Experiment name (required)
 * @param {string} data.workspaceId - Workspace ID (required)
 * @param {string} data.description - Experiment description
 * @param {string} data.variantId - Associated variant ID
 * @param {string} data.status - Initial status (default: inactive)
 * @param {Date} data.startDate - Start date
 * @param {Date} data.endDate - End date
 * @param {Object} data.metrics - Experiment metrics
 * @param {string} data.createdBy - User ID who created it
 * @returns {Promise<Object>}
 */
export async function createExperiment(data) {
  try {
    if (!data.name || !data.workspaceId) {
      throw new Error('name and workspaceId are required');
    }

    const response = await fetch(`${API_BASE}/api/experiments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create experiment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating experiment:', error);
    throw error;
  }
}

/**
 * Update experiment status (activate, deactivate, complete)
 * @param {string} id - The experiment ID
 * @param {string} status - New status (active, inactive, completed)
 * @param {Object} options - Additional options
 * @param {Object} options.metrics - Updated metrics
 * @param {boolean} options.preserveDates - Don't auto-set start/end dates
 * @returns {Promise<Object>}
 */
export async function updateExperimentStatus(id, status, options = {}) {
  try {
    if (!id || !status) {
      throw new Error('id and status are required');
    }

    const validStatuses = ['active', 'inactive', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const body = {
      id,
      status,
      ...options
    };

    const response = await fetch(`${API_BASE}/api/experiments`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update experiment');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating experiment ${id}:`, error);
    throw error;
  }
}

/**
 * Activate an experiment
 * @param {string} id - The experiment ID
 * @param {Object} options - Additional options
 * @returns {Promise<Object>}
 */
export async function activateExperiment(id, options = {}) {
  return updateExperimentStatus(id, 'active', options);
}

/**
 * Deactivate an experiment
 * @param {string} id - The experiment ID
 * @param {Object} options - Additional options
 * @returns {Promise<Object>}
 */
export async function deactivateExperiment(id, options = {}) {
  return updateExperimentStatus(id, 'inactive', options);
}

/**
 * Complete an experiment
 * @param {string} id - The experiment ID
 * @param {Object} metrics - Final metrics for the experiment
 * @returns {Promise<Object>}
 */
export async function completeExperiment(id, metrics = null) {
  const options = {};
  if (metrics) {
    options.metrics = metrics;
  }
  return updateExperimentStatus(id, 'completed', options);
}

/**
 * Create and immediately activate an experiment
 * @param {Object} data - The experiment data
 * @returns {Promise<Object>}
 */
export async function createAndActivateExperiment(data) {
  try {
    // Create the experiment as active with startDate
    const experimentData = {
      ...data,
      status: 'active',
      startDate: data.startDate || new Date()
    };
    
    return await createExperiment(experimentData);
  } catch (error) {
    console.error('Error creating and activating experiment:', error);
    throw error;
  }
}