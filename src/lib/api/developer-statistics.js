const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Fetch all developer statistics by workspace ID
 * @param {string} workspaceId - The workspace ID to filter by
 * @returns {Promise<{data: Array}>}
 */
export async function getDeveloperStatsByWorkspace(workspaceId) {
  try {
    if (!workspaceId) {
      throw new Error('Workspace ID is required');
    }
    
    const queryString = new URLSearchParams({ workspaceId }).toString();
    const response = await fetch(`${API_BASE}/api/developer-statistics?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch developer statistics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching developer statistics:', error);
    throw error;
  }
}

/**
 * Create a new developer statistic entry
 * @param {Object} data - The developer statistic data
 * @param {string} data.user - GitHub username
 * @param {string} data.workspaceId - Workspace ID
 * @param {number} data.prNumber - Pull request number
 * @param {string|Date} data.mergedDate - When the PR was merged
 * @param {number} [data.estimatedTime] - Estimated time in hours (optional)
 * @returns {Promise<Object>}
 */
export async function createDeveloperStat(data) {
  try {
    // Validate required fields
    if (!data.user || !data.workspaceId || !data.prNumber || !data.mergedDate) {
      throw new Error('User, workspaceId, prNumber, and mergedDate are required');
    }

    const response = await fetch(`${API_BASE}/api/developer-statistics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create developer statistic');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating developer statistic:', error);
    throw error;
  }
}

/**
 * Calculate summary statistics for a workspace
 * @param {string} workspaceId - The workspace ID
 * @returns {Promise<Object>} Summary statistics including total PRs, average time, etc.
 */
export async function getWorkspaceSummaryStats(workspaceId) {
  try {
    const { data } = await getDeveloperStatsByWorkspace(workspaceId, {
      limit: 1000 // Get all stats for summary calculation
    });

    if (!data || data.length === 0) {
      return {
        totalPRs: 0,
        totalEstimatedHours: 0,
        averageTimePerPR: 0,
        developerCount: 0,
        topContributors: []
      };
    }

    // Calculate summary statistics
    const totalPRs = data.length;
    const totalEstimatedHours = data.reduce((sum, stat) => sum + (stat.estimatedTime || 0), 0);
    const averageTimePerPR = totalEstimatedHours / totalPRs;
    
    // Get unique developers
    const developerStats = {};
    data.forEach(stat => {
      if (!developerStats[stat.user]) {
        developerStats[stat.user] = {
          user: stat.user,
          prCount: 0,
          totalHours: 0
        };
      }
      developerStats[stat.user].prCount++;
      developerStats[stat.user].totalHours += stat.estimatedTime || 0;
    });

    const topContributors = Object.values(developerStats)
      .sort((a, b) => b.prCount - a.prCount)
      .slice(0, 5);

    return {
      totalPRs,
      totalEstimatedHours: Math.round(totalEstimatedHours * 10) / 10,
      averageTimePerPR: Math.round(averageTimePerPR * 10) / 10,
      developerCount: Object.keys(developerStats).length,
      topContributors
    };
  } catch (error) {
    console.error('Error calculating workspace summary stats:', error);
    throw error;
  }
}