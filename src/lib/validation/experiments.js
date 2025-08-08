/**
 * Validate experiment input data
 * @param {Object} data - The data to validate
 * @returns {{isValid: boolean, errors: Object}}
 */
export function validateExperimentInput(data) {
  const errors = {};
  
  // Required fields
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Experiment name is required';
  } else if (data.name.length > 255) {
    errors.name = 'Experiment name must be less than 255 characters';
  }
  
  if (!data.workspaceId || data.workspaceId.trim().length === 0) {
    errors.workspaceId = 'Workspace ID is required';
  }
  
  // Optional field validations
  if (data.description && data.description.length > 1000) {
    errors.description = 'Description must be less than 1000 characters';
  }
  
  // Status validation
  const validStatuses = ['active', 'inactive', 'completed'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
  }
  
  // Date validations
  if (data.startDate) {
    const startDate = new Date(data.startDate);
    if (isNaN(startDate.getTime())) {
      errors.startDate = 'Invalid start date';
    }
  }
  
  if (data.endDate) {
    const endDate = new Date(data.endDate);
    if (isNaN(endDate.getTime())) {
      errors.endDate = 'Invalid end date';
    } else if (data.startDate) {
      const startDate = new Date(data.startDate);
      if (endDate < startDate) {
        errors.endDate = 'End date must be after start date';
      }
    }
  }
  
  // Metrics validation (should be valid JSON if provided)
  if (data.metrics && typeof data.metrics === 'string') {
    try {
      JSON.parse(data.metrics);
    } catch (e) {
      errors.metrics = 'Metrics must be valid JSON';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validate status update input
 * @param {Object} data - The data to validate
 * @returns {{isValid: boolean, errors: Object}}
 */
export function validateStatusUpdate(data) {
  const errors = {};
  
  if (!data.id || data.id.trim().length === 0) {
    errors.id = 'Experiment ID is required';
  }
  
  const validStatuses = ['active', 'inactive', 'completed'];
  if (!data.status || !validStatuses.includes(data.status)) {
    errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
  }
  
  // Validate metrics if provided
  if (data.metrics && typeof data.metrics === 'string') {
    try {
      JSON.parse(data.metrics);
    } catch (e) {
      errors.metrics = 'Metrics must be valid JSON';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Sanitize experiment input data
 * @param {Object} data - The data to sanitize
 * @returns {Object} Sanitized data
 */
export function sanitizeExperimentInput(data) {
  const sanitized = {};
  
  // Sanitize string fields
  if (data.name) {
    sanitized.name = data.name.trim();
  }
  
  if (data.description) {
    sanitized.description = data.description.trim();
  }
  
  if (data.workspaceId) {
    sanitized.workspaceId = data.workspaceId.trim();
  }
  
  if (data.variantId) {
    sanitized.variantId = data.variantId.trim();
  }
  
  if (data.createdBy) {
    sanitized.createdBy = data.createdBy.trim();
  }
  
  // Pass through valid status
  const validStatuses = ['active', 'inactive', 'completed'];
  if (data.status && validStatuses.includes(data.status)) {
    sanitized.status = data.status;
  }
  
  // Process dates
  if (data.startDate) {
    const date = new Date(data.startDate);
    if (!isNaN(date.getTime())) {
      sanitized.startDate = date.toISOString();
    }
  }
  
  if (data.endDate) {
    const date = new Date(data.endDate);
    if (!isNaN(date.getTime())) {
      sanitized.endDate = date.toISOString();
    }
  }
  
  // Process metrics
  if (data.metrics) {
    if (typeof data.metrics === 'object') {
      sanitized.metrics = data.metrics;
    } else if (typeof data.metrics === 'string') {
      try {
        sanitized.metrics = JSON.parse(data.metrics);
      } catch (e) {
        // Invalid JSON, skip
      }
    }
  }
  
  return sanitized;
}

/**
 * Check if experiment can be activated
 * @param {Object} experiment - The experiment object
 * @returns {{canActivate: boolean, reason: string}}
 */
export function canActivateExperiment(experiment) {
  if (!experiment) {
    return { canActivate: false, reason: 'Experiment not found' };
  }
  
  if (experiment.status === 'active') {
    return { canActivate: false, reason: 'Experiment is already active' };
  }
  
  if (experiment.status === 'completed') {
    return { canActivate: false, reason: 'Cannot activate a completed experiment' };
  }
  
  return { canActivate: true, reason: null };
}

/**
 * Check if experiment can be completed
 * @param {Object} experiment - The experiment object
 * @returns {{canComplete: boolean, reason: string}}
 */
export function canCompleteExperiment(experiment) {
  if (!experiment) {
    return { canComplete: false, reason: 'Experiment not found' };
  }
  
  if (experiment.status === 'completed') {
    return { canComplete: false, reason: 'Experiment is already completed' };
  }
  
  if (experiment.status !== 'active') {
    return { canComplete: false, reason: 'Only active experiments can be completed' };
  }
  
  return { canComplete: true, reason: null };
}