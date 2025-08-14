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
    if (allStats.length === 0) return { past30: {}, past90: {}, pastYear: {}, allTime: {} };

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const calculatePeriodStats = (startDate) => {
      const periodStats = startDate ? allStats.filter(stat => 
        stat.mergedDate && new Date(stat.mergedDate) >= startDate
      ) : allStats;

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
        firstTryRate,
        totalHours: Math.round(totalHours)
      };
    };

    return {
      past30: calculatePeriodStats(thirtyDaysAgo),
      past90: calculatePeriodStats(ninetyDaysAgo),
      pastYear: calculatePeriodStats(oneYearAgo),
      allTime: calculatePeriodStats(null)
    };
  }, [allStats]);

  // Prepare data for bar charts
  const chartData = useMemo(() => {
    if (allStats.length === 0) return { hoursChart: [], firstTryChart: [] };

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Create objects to store data by day
    const hoursByDay = {};
    const firstTryByDay = {};
    const totalByDay = {};
    
    // Initialize all days with 0 values
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
      hoursByDay[dateKey] = 0;
      firstTryByDay[dateKey] = 0;
      totalByDay[dateKey] = 0;
    }

    // Sum up data for each day
    allStats.forEach(stat => {
      if (stat.mergedDate && new Date(stat.mergedDate) >= thirtyDaysAgo) {
        const date = new Date(stat.mergedDate);
        const dateKey = `${date.getMonth() + 1}/${date.getDate()}`;
        if (hoursByDay[dateKey] !== undefined) {
          hoursByDay[dateKey] += parseFloat(stat.estimatedTime) || 0;
          totalByDay[dateKey]++;
          if (stat.firstTry) {
            firstTryByDay[dateKey]++;
          }
        }
      }
    });

    // Convert to array format for BarChart
    const hoursChart = Object.entries(hoursByDay).map(([date, hours]) => ({
      date: date,
      value: Math.round(hours)
    }));

    const firstTryChart = Object.entries(firstTryByDay).map(([date, firstTry]) => ({
      date: date,
      value: totalByDay[date] > 0 ? Math.round((firstTry / totalByDay[date]) * 100) : 0
    }));

    return { hoursChart, firstTryChart };
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
      {/* 4 KPI Cards Section with 3 metrics each */}
      <div className={styles.view__kpiGrid}>
        <KpiCard 
          title="Past 30 Days"
          chipText={`${summaryStats.past30.totalPRs} PRs`}
          metrics={[
            { value: summaryStats.past30.developers, label: 'Active Developers' },
            { value: summaryStats.past30.firstTryRate, label: 'First Try Rate %' },
            { value: summaryStats.past30.workdaysSaved, label: 'Workdays Saved' }
          ]}
        />
        <KpiCard 
          title="Past 90 Days"
          chipText={`${summaryStats.past90.totalPRs} PRs`}
          metrics={[
            { value: summaryStats.past90.developers, label: 'Active Developers' },
            { value: summaryStats.past90.firstTryRate, label: 'First Try Rate %' },
            { value: summaryStats.past90.workdaysSaved, label: 'Workdays Saved' }
          ]}
        />
        <KpiCard 
          title="Past Year"
          chipText={`${summaryStats.pastYear.totalPRs} PRs`}
          metrics={[
            { value: summaryStats.pastYear.developers, label: 'Active Developers' },
            { value: summaryStats.pastYear.firstTryRate, label: 'First Try Rate %' },
            { value: summaryStats.pastYear.workdaysSaved, label: 'Workdays Saved' }
          ]}
        />
        <KpiCard 
          title="All Time"
          chipText={`${summaryStats.allTime.totalPRs} PRs`}
          metrics={[
            { value: summaryStats.allTime.developers, label: 'Total Developers' },
            { value: summaryStats.allTime.firstTryRate, label: 'First Try Rate %' },
            { value: summaryStats.allTime.workdaysSaved, label: 'Workdays Saved' }
          ]}
        />
      </div>

      {/* Two Bar Chart Sections */}
      <div className={styles.view__chartsGrid}>
        <div className={styles.view__chartSection}>
          <BarChart 
            title="Development Hours Saved"
            dateRange={`Past 30 Days: ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            data={chartData.hoursChart}
            maxValue={150}
            yAxisLabel="Hours"
            xAxisLabel="Date"
            barColor="#8ED09C"
          />
        </div>
        <div className={styles.view__chartSection}>
          <BarChart 
            title="First Try Acceptance Rate"
            dateRange={`Past 30 Days: ${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            data={chartData.firstTryChart}
            maxValue={100}
            yAxisLabel="Percentage"
            xAxisLabel="Date"
            barColor="#74A0C8"
          />
        </div>
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