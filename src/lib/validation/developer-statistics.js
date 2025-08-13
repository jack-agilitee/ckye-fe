/**
 * Validate developer statistics input data
 * @param {Object} data - The data to validate
 * @returns {{isValid: boolean, errors: Object}}
 */
export function validateDeveloperStatInput(data) {
  const errors = {};
  
  // Validate user (GitHub username)
  if (!data.user || typeof data.user !== 'string') {
    errors.user = 'GitHub username is required and must be a string';
  } else if (data.user.length < 1 || data.user.length > 100) {
    errors.user = 'GitHub username must be between 1 and 100 characters';
  } else if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(data.user)) {
    errors.user = 'Invalid GitHub username format';
  }

  // Validate workspaceId
  if (!data.workspaceId || typeof data.workspaceId !== 'string') {
    errors.workspaceId = 'Workspace ID is required and must be a string';
  } else if (data.workspaceId.length < 1) {
    errors.workspaceId = 'Workspace ID cannot be empty';
  }

  // Validate PR number
  if (data.prNumber === undefined || data.prNumber === null) {
    errors.prNumber = 'PR number is required';
  } else if (typeof data.prNumber !== 'number' || !Number.isInteger(data.prNumber)) {
    errors.prNumber = 'PR number must be an integer';
  } else if (data.prNumber < 1) {
    errors.prNumber = 'PR number must be greater than 0';
  }

  // Validate merged date
  if (!data.mergedDate) {
    errors.mergedDate = 'Merged date is required';
  } else {
    const date = new Date(data.mergedDate);
    if (isNaN(date.getTime())) {
      errors.mergedDate = 'Invalid date format for merged date';
    } else if (date > new Date()) {
      errors.mergedDate = 'Merged date cannot be in the future';
    }
  }

  // Validate estimated time if provided
  if (data.estimatedTime !== undefined && data.estimatedTime !== null) {
    if (typeof data.estimatedTime !== 'number') {
      errors.estimatedTime = 'Estimated time must be a number';
    } else if (data.estimatedTime < 0) {
      errors.estimatedTime = 'Estimated time cannot be negative';
    } else if (data.estimatedTime > 1000) {
      errors.estimatedTime = 'Estimated time seems unrealistic (max 1000 hours)';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Sanitize developer statistics input data
 * @param {Object} data - The data to sanitize
 * @returns {Object} Sanitized data
 */
export function sanitizeDeveloperStatInput(data) {
  const sanitized = {};

  // Sanitize user (trim whitespace)
  if (data.user) {
    sanitized.user = data.user.trim();
  }

  // Sanitize workspaceId (trim whitespace)
  if (data.workspaceId) {
    sanitized.workspaceId = data.workspaceId.trim();
  }

  // Ensure PR number is an integer
  if (data.prNumber !== undefined) {
    sanitized.prNumber = parseInt(data.prNumber, 10);
  }

  // Ensure merged date is a valid date string
  if (data.mergedDate) {
    const date = new Date(data.mergedDate);
    if (!isNaN(date.getTime())) {
      sanitized.mergedDate = date.toISOString();
    }
  }

  // Ensure estimated time is a float with max 2 decimal places
  if (data.estimatedTime !== undefined && data.estimatedTime !== null) {
    sanitized.estimatedTime = Math.round(parseFloat(data.estimatedTime) * 100) / 100;
  }

  return sanitized;
}

/**
 * Validate query parameters for GET request
 * @param {Object} params - The query parameters
 * @returns {{isValid: boolean, errors: Object}}
 */
export function validateQueryParams(params) {
  const errors = {};

  // Validate workspaceId (required for GET)
  if (!params.workspaceId) {
    errors.workspaceId = 'Workspace ID is required';
  }

  // Validate page
  if (params.page !== undefined) {
    const page = parseInt(params.page, 10);
    if (isNaN(page) || page < 1) {
      errors.page = 'Page must be a positive integer';
    }
  }

  // Validate limit
  if (params.limit !== undefined) {
    const limit = parseInt(params.limit, 10);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.limit = 'Limit must be between 1 and 100';
    }
  }

  // Validate sortBy
  if (params.sortBy) {
    const validSortFields = ['user', 'prNumber', 'mergedDate', 'estimatedTime', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(params.sortBy)) {
      errors.sortBy = `Sort field must be one of: ${validSortFields.join(', ')}`;
    }
  }

  // Validate sortOrder
  if (params.sortOrder) {
    if (!['asc', 'desc'].includes(params.sortOrder)) {
      errors.sortOrder = 'Sort order must be either "asc" or "desc"';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}