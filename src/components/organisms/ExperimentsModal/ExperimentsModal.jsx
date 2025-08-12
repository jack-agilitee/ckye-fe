'use client';

import { useEffect, useRef } from 'react';
import jStat from 'jstat';
import Image from 'next/image';
import VariantCard from '@/components/organisms/VariantCard/VariantCard';
import ChartSection from '@/components/molecules/ChartSection/ChartSection';
import styles from './ExperimentsModal.module.scss';

const ExperimentsModal = ({
  isOpen = false,
  onClose,
  onEndExperiment,
  experimentId,
  experimentTitle,
  experimentStatus,
  comparisonText,
  pageName,
  variantName,
  pageStats,
  variantStats
}) => {
  const modalRef = useRef(null);

  // Calculate statistics for page (master)
  const pageStatsData = {
    variantName: pageName || 'Master',
    createdDate: 'July 7, 2025', // You may want to pass actual dates
    currentValue: pageStats?.firstTrySuccess || 0,
    totalValue: pageStats?.totalPRs || 0,
    percentage: pageStats?.totalPRs > 0
      ? Math.round((pageStats.firstTrySuccess / pageStats.totalPRs) * 100)
      : 0,
    metricLabel: '1st Shot Acceptance Rate'
  };

  // Calculate statistics for variant
  const variantStatsData = {
    variantName: variantName || 'Variant',
    createdDate: 'Aug 25, 2025', // You may want to pass actual dates
    currentValue: variantStats?.firstTrySuccess || 0,
    totalValue: variantStats?.totalPRs || 0,
    percentage: variantStats?.totalPRs > 0
      ? Math.round((variantStats.firstTrySuccess / variantStats.totalPRs) * 100)
      : 0,
    metricLabel: '1st Shot Acceptance Rate'
  };

  const calculatePValue = () => {
    const x1 = pageStatsData.currentValue, n1 = pageStatsData.totalValue;
    const x2 = variantStatsData.currentValue, n2 = variantStatsData.totalValue;

    if (n1 === 0 || n2 === 0) return 'N/A';

    const p1 = x1 / n1;
    const p2 = x2 / n2;

    const betterX = p1 >= p2 ? x1 : x2;
    const betterN = p1 >= p2 ? n1 : n2;
    const worseX = p1 >= p2 ? x2 : x1;
    const worseN = p1 >= p2 ? n2 : n1;

    const betterP = betterX / betterN;
    const worseP = worseX / worseN;

    const p = (betterX + worseX) / (betterN + worseN);
    const se = Math.sqrt(p * (1 - p) * (1 / betterN + 1 / worseN));
    if (se === 0) return 'N/A';

    const z = (betterP - worseP) / se;
    const pValue = 1 - jStat.normal.cdf(z, 0, 1);

    // Format as decimal with up to 10 decimal places, removing trailing zeros
    return pValue.toFixed(10).replace(/\.?0+$/, '');
  };

  const calculateIntervals = (successes, total) => {
    // Handle edge cases
    if (total === 0 || isNaN(successes) || isNaN(total)) {
      return 'N/A';
    }

    const p = successes / total;
    const z = 1.645; // 90% CI
    const se = Math.sqrt((p * (1 - p)) / total);

    // Calculate bounds
    let lower = p - z * se;
    let upper = p + z * se;

    // Clamp values between 0 and 1
    lower = Math.max(0, Math.min(1, lower));
    upper = Math.max(0, Math.min(1, upper));

    // Convert to percentage and format to 2 decimal places
    const lowerPercent = (lower * 100).toFixed(2);
    const upperPercent = (upper * 100).toFixed(2);

    return `${lowerPercent}% – ${upperPercent}%`;
  }

  // Stats for Nerds section data
  const statsData = {
    pValue: calculatePValue(),
    masterConfidenceInterval: calculateIntervals(pageStatsData.currentValue, pageStatsData.totalValue),
    variantConfidenceInterval: calculateIntervals(variantStatsData.currentValue, variantStatsData.totalValue),
  };

  // Calculate results data based on actual statistics
  const calculateResultsData = () => {
    const pagePercent = pageStatsData.percentage;
    const variantPercent = variantStatsData.percentage;

    // Calculate the absolute percentage point difference
    const percentagePointDifference = variantPercent - pagePercent;

    // Calculate relative improvement/decrease percentage
    let relativeChangePercentage = 0;
    if (pagePercent > 0) {
      relativeChangePercentage = Math.round(((variantPercent - pagePercent) / pagePercent) * 100);
    } else if (variantPercent > 0) {
      relativeChangePercentage = 100; // If baseline is 0 and variant is not, it's 100% improvement
    }

    // Calculate confidence level from p-value
    let confidenceLevel = 0;
    const pVal = statsData.pValue;
    if (pVal !== 'N/A' && !isNaN(pVal)) {
      confidenceLevel = ((1 - pVal) * 100).toFixed(2);
    }

    // Determine the winner and create appropriate description
    let description;
    let winner = null;
    
    if (percentagePointDifference > 0) {
      // Variant is better
      winner = 'variant';
      description = `Variant increased 1st-try code acceptance rates by +${Math.abs(percentagePointDifference)}% compared to Master. Based on the data collected, we can be ${confidenceLevel}% confident that this improvement is real and not just due to random chance.`;
    } else if (percentagePointDifference < 0) {
      // Master is better
      winner = 'master';
      description = `Variant decreased 1st-try code acceptance rates by ${Math.abs(percentagePointDifference)}% compared to Master. Based on the data collected, we can be ${confidenceLevel}% confident that this improvement is real and not just due to random chance.`;
    } else {
      description = `Variant showed no significant change in the 1st-try code acceptance rate compared to Master.`;
    }

    // Add winner statement with emoji or non-significant statement
    let winnerStatement = '';
    const pValueThreshold = 0.10; // p < 0.10 for statistical significance
    
    if (winner && pVal !== 'N/A' && !isNaN(pVal)) {
      const pValueNum = parseFloat(pVal);
      if (pValueNum < pValueThreshold) {
        // Statistically significant
        if (winner === 'variant') {
          winnerStatement = `Variant is the winner ✅. This result is statistically significant to p<.10.`;
        } else {
          winnerStatement = `Master is the winner ✅. This result is statistically significant to p<.05.`;
        }
      } else {
        // Not statistically significant
        if (winner === 'variant') {
          winnerStatement = `Although Variant is the winner the result is not statistically significant to p<.10.`;
        } else {
          winnerStatement = `Although Master is the winner the result is not statistically significant to p<.10.`;
        }
      }
    }

    return {
      improvementPercentage: relativeChangePercentage,
      percentagePointDifference,
      confidenceLevel,
      description,
      winner,
      winnerStatement
    };
  };

  const resultsData = calculateResultsData();

  // Calculate potential impact description
  const calculateImpactDescription = () => {
    const pagePercent = pageStatsData.percentage;
    const variantPercent = variantStatsData.percentage;

    if (pagePercent === variantPercent || (pagePercent === 0 && variantPercent === 0)) {
      return 'No significant impact detected based on current data.';
    }

    const difference = variantPercent - pagePercent;
    const absoluteDifference = Math.abs(difference);
    
    // Check if result is statistically significant
    const pVal = statsData.pValue;
    const isSignificant = pVal !== 'N/A' && !isNaN(pVal) && parseFloat(pVal) < 0.10;
    
    if (!isSignificant) {
      // Not statistically significant - show range of possible impacts
      const changeWord = difference > 0 ? 'increase' : 'change';
      return `Variant is expected to ${changeWord} 1st-try acceptance by roughly ${absoluteDifference} more MRs per 100. However, because the test did not achieve statistical significance, the true impact could plausibly range from -7 to +14 per 100. Treat this results as directional evidence and consider the nuances of the changes prior to rollout.`;
    }

    if (difference > 0) {
      // Variant is better and significant
      return `Variant is expected to increase 1st-try code acceptance by roughly ${absoluteDifference} more MRs per 100.`;
    } else {
      // Master is better and significant
      return `Variant is expected to decrease 1st-try code acceptance by roughly ${absoluteDifference} fewer MRs per 100.`;
    }
  };

  const impactDescription = calculateImpactDescription();
  
  // Calculate total PRs across both variants
  const totalPRs = (pageStatsData.totalValue || 0) + (variantStatsData.totalValue || 0);
  const hasEnoughData = totalPRs >= 200;

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render if not open
  if (!isOpen) return null;

  const handleEndExperiment = () => {
    onEndExperiment?.();
    onClose?.();
  };


  return (
    <div className={styles['experiments-modal']}>
      <div className={styles['experiments-modal__container']} ref={modalRef}>
        <div className={styles['experiments-modal__content']}>
          {/* Header */}
          <div className={styles['experiments-modal__header']}>
            <div className={styles['experiments-modal__header-content']}>
              <h2 className={styles['experiments-modal__title']}>{experimentTitle}</h2>
              <span className={styles['experiments-modal__comparison']}>{comparisonText}</span>
            </div>
            <button
              className={styles['experiments-modal__close']}
              onClick={onClose}
              aria-label="Close modal"
            >
              <Image
                src="/cross.svg"
                alt=""
                width={16}
                height={16}
              />
            </button>
          </div>

          {/* Divider */}
          <div className={styles['experiments-modal__divider']} />

          {/* Conditional content based on data availability */}
          {hasEnoughData ? (
            <>
              {/* Results Section */}
              <ChartSection
                title="Results"
                className={styles['experiments-modal__section']}
              >
                <p className={styles['experiments-modal__section-description']}>
                  {(() => {
                    // Split on percentages, "Variant", and "Master"
                    const parts = resultsData.description.split(/([\+\-]?\d+(?:\.\d+)?%|Variant|Master)/g);
                    let seenFirstPercentage = false;
                    
                    return parts.map((part, index) => {
                      // Highlight "Variant" and "Master" in yellow
                      if (part === 'Variant' || part === 'Master') {
                        return <span key={index} className={styles['experiments-modal__highlight--yellow']}>{part}</span>;
                      }
                      // Handle percentage values
                      if (part.match(/[\+\-]?\d+(?:\.\d+)?%/)) {
                        // The first percentage is the change percentage, the second is the confidence
                        if (!seenFirstPercentage) {
                          seenFirstPercentage = true;
                          // This is the change percentage - green (positive) or red (negative)
                          const isNegative = resultsData.winner === 'master'; // Master wins means variant decreased
                          return <span key={index} className={isNegative ? styles['experiments-modal__highlight--red'] : styles['experiments-modal__highlight--green']}>{part}</span>;
                        } else {
                          // This is the confidence percentage - always blue
                          return <span key={index} className={styles['experiments-modal__highlight']}>{part}</span>;
                        }
                      }
                      return part;
                    });
                  })()}
                </p>
                {resultsData.winnerStatement && (
                  <p className={styles['experiments-modal__winner-statement']}>
                    {(() => {
                      // Split on "Variant" and "Master" to highlight them in yellow
                      const parts = resultsData.winnerStatement.split(/(Variant|Master)/g);
                      return parts.map((part, index) => {
                        if (part === 'Variant' || part === 'Master') {
                          return <span key={index} className={styles['experiments-modal__highlight--yellow']}>{part}</span>;
                        }
                        return part;
                      });
                    })()}
                  </p>
                )}
              </ChartSection>

              {/* Stats for Nerds Section */}
              <ChartSection
                title="Stats for Nerds"
                className={styles['experiments-modal__section']}
              >
                <div className={styles['experiments-modal__stats']}>
                  <p className={styles['experiments-modal__stat']}>
                    A two-proportion Z-Test resulted in a one-tailed p-value of{' '}
                    <span className={
                      statsData.pValue !== 'N/A' && !isNaN(statsData.pValue) && parseFloat(statsData.pValue) >= 0.10
                        ? styles['experiments-modal__stat-value--red']
                        : styles['experiments-modal__stat-value--green']
                    }>
                      {statsData.pValue}
                    </span>
                  </p>
                  <p className={styles['experiments-modal__stat']}>
                    90% Confidence Interval for Master:{' '}
                    <span className={styles['experiments-modal__stat-value']}>
                      {statsData.masterConfidenceInterval}
                    </span>
                  </p>
                  <p className={styles['experiments-modal__stat']}>
                    90% Confidence Interval for Variant:{' '}
                    <span className={styles['experiments-modal__stat-value']}>
                      {statsData.variantConfidenceInterval}
                    </span>
                  </p>
                </div>
              </ChartSection>

              {/* Potential Impact Section */}
              <ChartSection
                title="Potential Impact"
                className={styles['experiments-modal__section']}
              >
                <p className={styles['experiments-modal__section-description']}>
                  {(() => {
                    // Split on "Variant", "increase/decrease", and "n more/fewer" patterns (without MRs)
                    const parts = impactDescription.split(/(Variant|increase|decrease|\d+\s+(?:more|fewer))/g);
                    const isDecrease = impactDescription.includes('decrease');
                    
                    return parts.map((part, index) => {
                      // Highlight "Variant" in yellow
                      if (part === 'Variant') {
                        return <span key={index} className={styles['experiments-modal__highlight--yellow']}>{part}</span>;
                      }
                      // Highlight "increase" in green or "decrease" in red
                      if (part === 'increase') {
                        return <span key={index} className={styles['experiments-modal__highlight--green']}>{part}</span>;
                      }
                      if (part === 'decrease') {
                        return <span key={index} className={styles['experiments-modal__highlight--red']}>{part}</span>;
                      }
                      // Highlight "n more" in green or "n fewer" in red (without MRs)
                      if (part.match(/\d+\s+(?:more|fewer)/)) {
                        const colorClass = isDecrease ? styles['experiments-modal__highlight--red'] : styles['experiments-modal__highlight--green'];
                        return <span key={index} className={colorClass}>{part}</span>;
                      }
                      return part;
                    });
                  })()}
                </p>
              </ChartSection>
            </>
          ) : (
            <>
              {/* Insufficient Data Message */}
              <ChartSection
                title="Results"
                className={styles['experiments-modal__section']}
              >
                <p className={styles['experiments-modal__section-description']}>
                  Ckye requires 200 total MRs before posting results. Currently this test has reviewed {totalPRs} MRs.
                </p>
              </ChartSection>
            </>
          )}

          {/* Charts Section with Variant Cards */}
          <div className={styles['experiments-modal__charts']}>
            <VariantCard
              {...pageStatsData}
              className={styles['experiments-modal__chart']}
            />
            <VariantCard
              {...variantStatsData}
              className={styles['experiments-modal__chart']}
            />
          </div>

          {/* Only show divider and action button if experiment is active */}
          {experimentStatus === 'Active' && (
            <>
              {/* Divider */}
              <div className={styles['experiments-modal__divider']} />

              {/* Action Button */}
              <div className={styles['experiments-modal__actions']}>
                <button
                  className={styles['experiments-modal__end-button']}
                  onClick={handleEndExperiment}
                >
                  End Experiment
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperimentsModal;