'use client';

import { useState, useEffect, useMemo } from 'react';
import { getDeveloperStatsByWorkspace } from '@/lib/api/developer-statistics';
import { getWorkspaces } from '@/lib/api/workspaces';
import KpiCard from '@/components/molecules/KpiCard/KpiCard';
import BarChart from '@/components/templates/BarChart/BarChart';
import styles from './AnalyticsView.module.scss';

const AnalyticsView = ({ companyName }) => {
  const [allStats, setAllStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch statistics when companyName is available
  useEffect(() => {
    if (companyName) {
      fetchStatistics();
    }
  }, [companyName]);

  const fetchStatistics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First, fetch all workspaces and find the one matching the shortName
      const workspacesResponse = await getWorkspaces();
      const workspaceShortName = companyName?.toUpperCase() || 'AE';
      const workspace = workspacesResponse.data?.find(
        ws => ws.shortName === workspaceShortName
      );

      if (!workspace) {
        setError(`Workspace with shortname "${workspaceShortName}" not found`);
        setAllStats([]);
        return;
      }

      // Use the workspace ID to fetch developer statistics
      const response = await getDeveloperStatsByWorkspace(workspace.id);
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
          totalEstimatedHours: 0,
          firstTryCount: 0,
          totalPRCount: 0
        };
      }
      
      statsByDeveloper[stat.user].prs.push(stat);
      statsByDeveloper[stat.user].totalPRCount++;
      
      // Count first-try PRs
      if (stat.firstTry) {
        statsByDeveloper[stat.user].firstTryCount++;
      }
      
      // Add unique day (ignore time, just get the date)
      if (stat.mergedDate) {
        const dateOnly = new Date(stat.mergedDate).toDateString();
        statsByDeveloper[stat.user].uniqueDays.add(dateOnly);
      }
      
      // Add estimated time (convert string to number)
      if (stat.estimatedTime) {
        statsByDeveloper[stat.user].totalEstimatedHours += parseFloat(stat.estimatedTime) || 0;
      }
    });

    // Convert to array and calculate final metrics
    return Object.values(statsByDeveloper).map(dev => {
      const daysUsingCkye = dev.uniqueDays.size;
      const workdaysWithoutCkye = dev.totalEstimatedHours / 8;
      // Workdays saved = time it would have taken - actual days spent
      const workdaysSaved = Math.max(0, Math.round((workdaysWithoutCkye - daysUsingCkye) * 10) / 10);
      const firstTryRate = dev.totalPRCount > 0 ? Math.round((dev.firstTryCount / dev.totalPRCount) * 100) : 0;
      
      return {
        user: dev.user,
        daysUsingCkye,
        totalPRs: dev.prs.length,
        totalEstimatedHours: dev.totalEstimatedHours,
        workdaysSaved,
        firstTryCount: dev.firstTryCount,
        firstTryRate,
        prs: dev.prs.sort((a, b) => {
          const dateA = new Date(a.mergedDate || 0).getTime();
          const dateB = new Date(b.mergedDate || 0).getTime();
          return dateB - dateA; // Most recent first
        })
      };
    }).sort((a, b) => b.workdaysSaved - a.workdaysSaved); // Sort by time saved descending
  }, [allStats]);

  // Calculate summary statistics for different time periods
  const summaryStats = useMemo(() => {
    if (allStats.length === 0) return { past30: {}, past90: {}, pastYear: {} };

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const calculatePeriodStats = (startDate) => {
      const periodStats = allStats.filter(stat => 
        stat.mergedDate && new Date(stat.mergedDate) >= startDate
      );

      const uniqueDevs = new Set();
      let totalHours = 0;
      let firstTryCount = 0;
      const uniqueDays = new Set();

      periodStats.forEach(stat => {
        uniqueDevs.add(stat.user);
        totalHours += parseFloat(stat.estimatedTime) || 0;
        if (stat.firstTry) {
          firstTryCount++;
        }
        if (stat.mergedDate) {
          uniqueDays.add(new Date(stat.mergedDate).toDateString());
        }
      });

      const workdaysWithoutCkye = totalHours / 8;
      const workdaysSaved = Math.max(0, Math.round((workdaysWithoutCkye - uniqueDays.size) * 10) / 10);
      const firstTryRate = periodStats.length > 0 ? Math.round((firstTryCount / periodStats.length) * 100) : 0;

      return {
        developers: uniqueDevs.size,
        workdaysSaved,
        totalPRs: periodStats.length,
        firstTryCount,
        firstTryRate
      };
    };

    return {
      past30: calculatePeriodStats(thirtyDaysAgo),
      past90: calculatePeriodStats(ninetyDaysAgo),
      pastYear: calculatePeriodStats(oneYearAgo)
    };
  }, [allStats]);

  // Prepare data for bar chart (last 30 days)
  const chartData = useMemo(() => {
    if (allStats.length === 0) return [];

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Create an object to store hours by day
    const hoursByDay = {};
    
    // Initialize all days with 0 hours
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
      hoursByDay[dateKey] = 0;
    }

    // Sum up hours for each day
    allStats.forEach(stat => {
      if (stat.mergedDate && new Date(stat.mergedDate) >= thirtyDaysAgo) {
        const date = new Date(stat.mergedDate);
        const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
        if (hoursByDay[dateKey] !== undefined) {
          hoursByDay[dateKey] += parseFloat(stat.estimatedTime) || 0;
        }
      }
    });

    // Convert to array format for BarChart
    return Object.entries(hoursByDay).map(([date, hours]) => ({
      date: date,
      value: Math.round(hours)
    }));
  }, [allStats]);

  if (loading) {
    return <div className={styles.view__loading}>Loading analytics...</div>;
  }

  if (error) {
    return <div className={styles.view__error}>{error}</div>;
  }

  if (allStats.length === 0) {
    return (
      <div className={styles.view__empty}>
        No developer statistics found for this workspace.
      </div>
    );
  }

  return (
    <div className={styles.view}>
      {/* KPI Cards Section - Time Savings */}
      <div className={styles.view__kpiSection}>
        <KpiCard 
          title="Past 30 Days"
          chipText={`${summaryStats.past30.totalPRs} PRs`}
          metrics={[
            { value: summaryStats.past30.developers, label: 'Developers Using Ckye' },
            { value: summaryStats.past30.workdaysSaved, label: 'Workdays Saved' }
          ]}
        />
        <KpiCard 
          title="Past 90 Days"
          chipText={`${summaryStats.past90.totalPRs} PRs`}
          metrics={[
            { value: summaryStats.past90.developers, label: 'Developers Using Ckye' },
            { value: summaryStats.past90.workdaysSaved, label: 'Workdays Saved' }
          ]}
        />
        <KpiCard 
          title="Past Year"
          chipText={`${summaryStats.pastYear.totalPRs} PRs`}
          metrics={[
            { value: summaryStats.pastYear.developers, label: 'Developers Using Ckye' },
            { value: summaryStats.pastYear.workdaysSaved, label: 'Workdays Saved' }
          ]}
        />
      </div>

      {/* KPI Cards Section - First Try Acceptance */}
      <div className={styles.view__kpiSection}>
        <KpiCard 
          title="First Try - 30 Days"
          chipText={`${summaryStats.past30.firstTryRate}%`}
          metrics={[
            { value: summaryStats.past30.firstTryCount, label: 'First Try PRs' },
            { value: summaryStats.past30.totalPRs - summaryStats.past30.firstTryCount, label: 'Multi-Try PRs' }
          ]}
        />
        <KpiCard 
          title="First Try - 90 Days"
          chipText={`${summaryStats.past90.firstTryRate}%`}
          metrics={[
            { value: summaryStats.past90.firstTryCount, label: 'First Try PRs' },
            { value: summaryStats.past90.totalPRs - summaryStats.past90.firstTryCount, label: 'Multi-Try PRs' }
          ]}
        />
        <KpiCard 
          title="First Try - Year"
          chipText={`${summaryStats.pastYear.firstTryRate}%`}
          metrics={[
            { value: summaryStats.pastYear.firstTryCount, label: 'First Try PRs' },
            { value: summaryStats.pastYear.totalPRs - summaryStats.pastYear.firstTryCount, label: 'Multi-Try PRs' }
          ]}
        />
      </div>

      {/* Bar Chart Section */}
      <div className={styles.view__chartSection}>
        <BarChart 
          title="Development Hours Saved"
          dateRange={`Past 30 Days: ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          data={chartData}
          maxValue={150}
          yAxisLabel="Hours"
          xAxisLabel="Date"
          barColor="#8ED09C"
        />
      </div>

      {/* Developer Performance Table */}
      <div className={styles.view__table}>
        <h2 className={styles.view__tableTitle}>Developer Performance</h2>
        <table className={styles.view__performanceTable}>
          <thead>
            <tr>
              <th>Developer</th>
              <th>Total PRs</th>
              <th>First Try</th>
              <th>Success Rate</th>
              <th>Days Using</th>
              <th>Days Saved</th>
            </tr>
          </thead>
          <tbody>
            {developerStats.map((dev) => (
              <tr key={dev.user}>
                <td>{dev.user}</td>
                <td>{dev.totalPRs}</td>
                <td>{dev.firstTryCount}</td>
                <td>
                  <span className={dev.firstTryRate >= 70 ? styles['view__rate--high'] : dev.firstTryRate >= 40 ? styles['view__rate--medium'] : styles['view__rate--low']}>
                    {dev.firstTryRate}%
                  </span>
                </td>
                <td>{dev.daysUsingCkye}</td>
                <td>{dev.workdaysSaved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Individual Developer Cards */}
      <div className={styles.view__developers}>
        {developerStats.map((dev) => (
          <KpiCard 
            key={dev.user}
            title={dev.user}
            chipText={`${dev.firstTryRate}% First Try`}
            metrics={[
              { value: dev.totalPRs, label: 'Total PRs' },
              { value: dev.workdaysSaved, label: 'Workdays Saved' }
            ]}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalyticsView;