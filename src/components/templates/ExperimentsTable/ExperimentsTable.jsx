'use client';

import { useState } from 'react';
import Image from 'next/image';
import User from '@/components/molecules/User/User';
import styles from './ExperimentsTable.module.scss';

const ExperimentsTable = ({ 
  experiments = [],
  onViewReport,
  loading = false
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleViewReport = (experiment) => {
    if (onViewReport) {
      onViewReport(experiment);
    } else {
      console.log('View report for experiment:', experiment);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  };

  const getStatusClass = (status) => {
    const normalizedStatus = status?.toLowerCase();
    if (normalizedStatus === 'active') {
      return styles['experiments-table__status--active'];
    }
    return styles['experiments-table__status--closed'];
  };

  if (loading) {
    return (
      <div className={styles['experiments-table']}>
        <div className={styles['experiments-table__loading']}>
          Loading experiments...
        </div>
      </div>
    );
  }

  if (!experiments || experiments.length === 0) {
    return (
      <div className={styles['experiments-table']}>
        <div className={styles['experiments-table__empty']}>
          No experiments found
        </div>
      </div>
    );
  }

  return (
    <div className={styles['experiments-table']}>
      <div className={styles['experiments-table__header']}>
        <div className={styles['experiments-table__header-cell']}>
          Experiment
        </div>
        <div className={styles['experiments-table__header-cell']}>
          Status
        </div>
        <div className={styles['experiments-table__header-cell']}>
          Created Date
        </div>
        <div className={styles['experiments-table__header-cell']}>
          Created By
        </div>
        <div className={styles['experiments-table__header-cell']}></div>
      </div>
      
      <div className={styles['experiments-table__body']}>
        {experiments.map((experiment, index) => (
          <div 
            key={experiment.id || index}
            className={`${styles['experiments-table__row']} ${
              hoveredRow === index ? styles['experiments-table__row--hovered'] : ''
            }`}
            onMouseEnter={() => setHoveredRow(index)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div className={styles['experiments-table__cell']}>
              <div className={styles['experiments-table__experiment-info']}>
                <div className={styles['experiments-table__experiment-name']}>
                  {experiment.name || 'Unnamed Experiment'}
                </div>
                <div className={styles['experiments-table__experiment-comparison']}>
                  {experiment.comparison || ''}
                </div>
              </div>
            </div>
            
            <div className={styles['experiments-table__cell']}>
              <span className={`${styles['experiments-table__status']} ${getStatusClass(experiment.status)}`}>
                {experiment.status || 'Unknown'}
              </span>
            </div>
            
            <div className={styles['experiments-table__cell']}>
              <span className={styles['experiments-table__date']}>
                {formatDate(experiment.createdDate)}
              </span>
            </div>
            
            <div className={styles['experiments-table__cell']}>
              <User 
                name={experiment.createdBy?.name || 'Unknown User'}
                email={experiment.createdBy?.email || ''}
                initial={experiment.createdBy?.initial}
                className={styles['experiments-table__user']}
              />
            </div>
            
            <div className={styles['experiments-table__cell']}>
              <button 
                className={styles['experiments-table__action']}
                onClick={() => handleViewReport(experiment)}
                aria-label={`View report for ${experiment.name}`}
              >
                <Image 
                  src="/report.svg"
                  alt=""
                  width={16}
                  height={16}
                  className={styles['experiments-table__action-icon']}
                />
                <span className={styles['experiments-table__action-text']}>
                  View Report
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperimentsTable;