import styles from './KpiCard.module.scss';

const KpiCard = ({ 
  title = 'Past 30 Days',
  chipText = '66 PRs',
  metrics = [
    { value: 9, label: 'Developers Using Ckye' },
    { value: 102, label: 'Workdays Saved' }
  ],
  className = ''
}) => {
  return (
    <div className={`${styles['kpi-card']} ${className}`}>
      <div className={styles['kpi-card__header']}>
        <h3 className={styles['kpi-card__title']}>{title}</h3>
        <div className={styles['kpi-card__chip']}>
          <span className={styles['kpi-card__chip-text']}>{chipText}</span>
        </div>
      </div>
      
      <div className={styles['kpi-card__divider']} />
      
      <div className={styles['kpi-card__stats']}>
        {metrics.map((metric, index) => (
          <div key={index} className={styles['kpi-card__metric']}>
            <div className={styles['kpi-card__metric-value']}>
              {metric.value}
            </div>
            <div className={styles['kpi-card__metric-label']}>
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KpiCard;