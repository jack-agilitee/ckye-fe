'use client';

import { useState, useEffect } from 'react';
import { getDeveloperStatsByWorkspace } from '@/lib/api/developer-statistics';
import styles from './DeveloperStatsPageClient.module.scss';

const DeveloperStatsPageClient = ({ workspaces }) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'mergedDate',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch statistics when workspace is selected
  useEffect(() => {
    if (selectedWorkspace) {
      fetchStatistics();
    }
  }, [selectedWorkspace, currentPage, sortConfig]);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDeveloperStatsByWorkspace(selectedWorkspace, {
        page: currentPage,
        limit: itemsPerPage,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.direction
      });
      
      setStats(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (err) {
      setError('Failed to load developer statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkspaceChange = (e) => {
    setSelectedWorkspace(e.target.value);
    setCurrentPage(1); // Reset to first page when workspace changes
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (hours) => {
    if (!hours) return '-';
    return `${hours}h`;
  };

  const getSortIndicator = (column) => {
    if (sortConfig.key !== column) {
      return <span className={styles['page__sort-indicator']}>⇅</span>;
    }
    return sortConfig.direction === 'asc' 
      ? <span className={styles['page__sort-indicator']}>↑</span>
      : <span className={styles['page__sort-indicator']}>↓</span>;
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
          ) : stats.length === 0 ? (
            <div className={styles.page__empty}>
              No developer statistics found for this workspace.
            </div>
          ) : (
            <>
              <div className={styles.page__table}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th 
                        onClick={() => handleSort('user')}
                        className={styles['table__header--sortable']}
                      >
                        Developer {getSortIndicator('user')}
                      </th>
                      <th 
                        onClick={() => handleSort('prNumber')}
                        className={styles['table__header--sortable']}
                      >
                        PR Number {getSortIndicator('prNumber')}
                      </th>
                      <th 
                        onClick={() => handleSort('mergedDate')}
                        className={styles['table__header--sortable']}
                      >
                        Merged Date {getSortIndicator('mergedDate')}
                      </th>
                      <th 
                        onClick={() => handleSort('estimatedTime')}
                        className={styles['table__header--sortable']}
                      >
                        Estimated Time {getSortIndicator('estimatedTime')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((stat) => (
                      <tr key={stat.id}>
                        <td className={styles.table__cell}>{stat.user}</td>
                        <td className={styles.table__cell}>#{stat.prNumber}</td>
                        <td className={styles.table__cell}>{formatDate(stat.mergedDate)}</td>
                        <td className={styles.table__cell}>{formatTime(stat.estimatedTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className={styles.page__pagination}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={styles.page__button}
                  >
                    Previous
                  </button>
                  <span className={styles.page__pageInfo}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.page__button}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DeveloperStatsPageClient;