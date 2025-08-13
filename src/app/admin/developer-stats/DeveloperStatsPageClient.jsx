'use client';

import { useState, useEffect, useMemo } from 'react';
import { getDeveloperStatsByWorkspace } from '@/lib/api/developer-statistics';
import styles from './DeveloperStatsPageClient.module.scss';

const DeveloperStatsPageClient = ({ workspaces }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [allStats, setAllStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch statistics when workspace is selected
  useEffect(() => {
    if (selectedWorkspace) {
      fetchStatistics();
    }
  }, [selectedWorkspace]);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDeveloperStatsByWorkspace(selectedWorkspace);
      
      setAllStats(response.data || []);
    } catch (err) {
      setError('Failed to load developer statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Process statistics by developer
  const developerStats = useMemo(() => {
    if (allStats.length === 0) return [];

    // Group stats by developer
    const statsByDeveloper = {};
    
    allStats.forEach(stat => {
      if (!statsByDeveloper[stat.user]) {
        statsByDeveloper[stat.user] = {
          user: stat.user,
          prs: [],
          uniqueDays: new Set(),
          totalEstimatedHours: 0
        };
      }
      
      statsByDeveloper[stat.user].prs.push(stat);
      
      // Add unique day (ignore time, just get the date)
      if (stat.mergedDate) {
        const dateOnly = new Date(stat.mergedDate).toDateString();
        statsByDeveloper[stat.user].uniqueDays.add(dateOnly);
      }
      
      // Add estimated time
      if (stat.estimatedTime) {
        statsByDeveloper[stat.user].totalEstimatedHours += stat.estimatedTime;
      }
    });

    // Convert to array and calculate final metrics
    return Object.values(statsByDeveloper).map(dev => ({
      user: dev.user,
      daysUsingCkye: dev.uniqueDays.size,
      totalPRs: dev.prs.length,
      totalEstimatedHours: dev.totalEstimatedHours,
      // Calculate workdays saved (8 hour workday)
      workdaysSaved: Math.round((dev.totalEstimatedHours / 8) * 10) / 10,
      prs: dev.prs.sort((a, b) => {
        const dateA = new Date(a.mergedDate || 0).getTime();
        const dateB = new Date(b.mergedDate || 0).getTime();
        return dateB - dateA; // Most recent first
      })
    })).sort((a, b) => b.workdaysSaved - a.workdaysSaved); // Sort by time saved descending
  }, [allStats]);

  const handleWorkspaceChange = (e) => {
    setSelectedWorkspace(e.target.value);
    setAllStats([]); // Clear stats when changing workspace
  };

  return (
    <div className={styles.page}>
      <div className={styles.page__header}>
        <h1 className={styles.page__title}>Developer Statistics</h1>
        
        <div className={styles.page__controls}>
          <div className={styles.page__dropdown}>
            <label htmlFor="workspace-select" className={styles.page__label}>
              Select Workspace:
            </label>
            <select
              id="workspace-select"
              value={selectedWorkspace}
              onChange={handleWorkspaceChange}
              className={styles.page__select}
            >
              <option value="">Choose a workspace...</option>
              {workspaces.map(workspace => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedWorkspace && (
        <div className={styles.page__content}>
          {loading ? (
            <div className={styles.page__loading}>Loading statistics...</div>
          ) : error ? (
            <div className={styles.page__error}>{error}</div>
          ) : developerStats.length === 0 ? (
            <div className={styles.page__empty}>
              No developer statistics found for this workspace.
            </div>
          ) : (
            <div className={styles.page__developers}>
              {developerStats.map((dev) => (
                <div key={dev.user} className={styles.developerCard}>
                  <div className={styles.developerCard__header}>
                    <h3 className={styles.developerCard__name}>{dev.user}</h3>
                    <span className={styles.developerCard__prCount}>
                      {dev.totalPRs} PR{dev.totalPRs !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className={styles.developerCard__metrics}>
                    <div className={styles.metric}>
                      <div className={styles.metric__value}>
                        {dev.daysUsingCkye}
                      </div>
                      <div className={styles.metric__label}>
                        Day{dev.daysUsingCkye !== 1 ? 's' : ''} using Ckye
                      </div>
                    </div>
                    
                    <div className={styles.metric}>
                      <div className={styles.metric__value}>
                        {dev.workdaysSaved}
                      </div>
                      <div className={styles.metric__label}>
                        Workday{dev.workdaysSaved !== 1 ? 's' : ''} saved
                      </div>
                      <div className={styles.metric__sublabel}>
                        ({dev.totalEstimatedHours} hours total)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeveloperStatsPageClient;