'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './VariantCard.module.scss';

const VariantCard = ({ 
  variantName = 'Master',
  createdDate = 'July 7, 2025',
  currentValue = 89,
  totalValue = 178,
  percentage = 50,
  metricLabel = '1st Shot Acceptance Rate',
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const needleRef = useRef(null);

  // Calculate needle rotation based on percentage (0-100 maps to -90 to 90 degrees)
  const calculateNeedleRotation = (percent) => {
    // Map percentage (0-100) to rotation angle (-90 to 90)
    return (percent / 100) * 180 - 90;
  };

  // Animate needle and percentage on mount or when percentage changes
  useEffect(() => {
    setIsAnimating(true);
    
    // Animate percentage counter
    const duration = 1000; // 1 second animation
    const steps = 30;
    const stepDuration = duration / steps;
    const increment = percentage / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setDisplayPercentage(Math.round(increment * currentStep));
      } else {
        setDisplayPercentage(percentage);
        clearInterval(interval);
      }
    }, stepDuration);

    // Cleanup
    return () => clearInterval(interval);
  }, [percentage]);

  return (
    <div className={`${styles['variant-card']} ${className}`}>
      {/* Header Section */}
      <div className={styles['variant-card__header']}>
        <h3 className={styles['variant-card__name']}>{variantName}</h3>
        <span className={styles['variant-card__date']}>Created {createdDate}</span>
      </div>

      {/* Stats Section */}
      <div className={styles['variant-card__stats']}>
        <div className={styles['variant-card__stats-container']}>
          <span className={styles['variant-card__current-value']}>{currentValue}</span>
          <span className={styles['variant-card__total-value']}>/{totalValue}</span>
        </div>
        <p className={styles['variant-card__metric-label']}>{metricLabel}</p>
      </div>

      {/* Gauge Visualization */}
      <div className={styles['variant-card__gauge']}>
        {/* Gauge background image with gradient included */}
        <Image 
          src="/gauge-background.png"
          alt=""
          width={280}
          height={160}
          className={styles['variant-card__gauge-background']}
          priority
        />

        {/* Needle - properly centered */}
        <div 
          ref={needleRef}
          className={styles['variant-card__needle']}
          style={{
            transform: `translateX(-50%) rotate(${calculateNeedleRotation(displayPercentage)}deg)`,
            transition: isAnimating ? 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
          }}
        >
          <Image 
            src="/needle.png"
            alt=""
            width={16}
            height={100}
            className={styles['variant-card__needle-image']}
            priority
          />
        </div>

        {/* Percentage display */}
        <div className={styles['variant-card__percentage']}>
          {displayPercentage}%
        </div>
      </div>
    </div>
  );
};

export default VariantCard;