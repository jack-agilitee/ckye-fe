import styles from './ChartSection.module.scss';

const ChartSection = ({ 
  title = 'Results',
  description = 'Variant 3 improved the 1st-try code acceptance rate by 25% compared to Master. Based on the data collected, we can be 95% confident that this improvement is real and not just due to random chance.',
  className = ''
}) => {
  return (
    <div className={`${styles['chart-section']} ${className}`}>
      <h2 className={styles['chart-section__title']}>{title}</h2>
      <p className={styles['chart-section__description']}>{description}</p>
    </div>
  );
};

export default ChartSection;