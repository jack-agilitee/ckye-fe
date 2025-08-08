'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import VariantCard from '@/components/organisms/VariantCard/VariantCard';
import styles from './ExperimentsModal.module.scss';

const ExperimentsModal = ({ 
  isOpen = false,
  onClose,
  onEndExperiment,
  experimentTitle = 'Clade.md version 3',
  comparisonText = 'master vs. version 3',
  // Results section data
  resultsData = {
    improvementPercentage: 25,
    confidenceLevel: 95,
    description: 'Variant 3 improved the 1st-try code acceptance rate by 25% compared to Master. Based on the data collected, we can be 95% confident that this improvement is real and not just due to random chance.'
  },
  // Stats for Nerds section data
  statsData = {
    pValue: '0.00000083',
    masterConfidenceInterval: '42.7% – 57.3%',
    variantConfidenceInterval: '68.5% – 81.5%'
  },
  // Potential Impact section data
  impactDescription = 'For every 100 code generations, approximately 25 more would be accepted on the first try by developers.',
  // Variant card data for master
  masterData = {
    variantName: 'Master',
    createdDate: 'July 7, 2025',
    currentValue: 89,
    totalValue: 178,
    percentage: 50,
    metricLabel: '1st Shot Acceptance Rate'
  },
  // Variant card data for variant
  variantData = {
    variantName: 'Variant 3',
    createdDate: 'Aug 25, 2025',
    currentValue: 126,
    totalValue: 168,
    percentage: 75,
    metricLabel: '1st Shot Acceptance Rate'
  }
}) => {
  const modalRef = useRef(null);

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

  // Format the results description with highlighted percentages
  const formatResultsDescription = () => {
    const parts = resultsData.description.split(/(\d+%)/g);
    return parts.map((part, index) => {
      if (part.match(/\d+%/)) {
        return <span key={index} className={styles['experiments-modal__highlight']}>{part}</span>;
      }
      return part;
    });
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

          {/* Results Section */}
          <div className={styles['experiments-modal__section']}>
            <h3 className={styles['experiments-modal__section-title']}>Results</h3>
            <p className={styles['experiments-modal__section-description']}>
              {formatResultsDescription()}
            </p>
          </div>

          {/* Stats for Nerds Section */}
          <div className={styles['experiments-modal__section']}>
            <h3 className={styles['experiments-modal__section-title']}>Stats for Nerds</h3>
            <div className={styles['experiments-modal__stats']}>
              <p className={styles['experiments-modal__stat']}>
                A two-proportion Z-Test resulted in a one-tailed p-value of{' '}
                <span className={styles['experiments-modal__stat-value--green']}>
                  {statsData.pValue}
                </span>
              </p>
              <p className={styles['experiments-modal__stat']}>
                95% Confidence Interval for Master:{' '}
                <span className={styles['experiments-modal__stat-value']}>
                  {statsData.masterConfidenceInterval}
                </span>
              </p>
              <p className={styles['experiments-modal__stat']}>
                95% Confidence Interval for Variant 3:{' '}
                <span className={styles['experiments-modal__stat-value']}>
                  {statsData.variantConfidenceInterval}
                </span>
              </p>
            </div>
          </div>

          {/* Potential Impact Section */}
          <div className={styles['experiments-modal__section']}>
            <h3 className={styles['experiments-modal__section-title']}>Potential Impact</h3>
            <p className={styles['experiments-modal__section-description']}>
              {impactDescription}
            </p>
          </div>

          {/* Charts Section with Variant Cards */}
          <div className={styles['experiments-modal__charts']}>
            <VariantCard 
              {...masterData}
              className={styles['experiments-modal__chart']}
            />
            <VariantCard 
              {...variantData}
              className={styles['experiments-modal__chart']}
            />
          </div>

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
        </div>
      </div>
    </div>
  );
};

export default ExperimentsModal;