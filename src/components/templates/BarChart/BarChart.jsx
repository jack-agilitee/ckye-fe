import styles from './BarChart.module.scss';

const BarChart = ({
  title = 'Development Hours Saved',
  dateRange = 'Past 30 Days: Sep 15 — Aug 12, 2025',
  data = [],
  maxValue = 150,
  yAxisLabel = 'Hours',
  xAxisLabel = 'Date',
  barColor = '#8ED09C',
  className = ''
}) => {
  // Generate Y-axis labels (6 evenly spaced values from 0 to maxValue)
  const yAxisValues = Array.from({ length: 6 }, (_, i) => 
    Math.round(maxValue - (maxValue / 5) * i)
  );

  // Calculate bar heights as percentages
  const calculateBarHeight = (value) => {
    return `${(value / maxValue) * 100}%`;
  };

  // Default sample data if none provided (30 days like in Figma)
  const chartData = data.length > 0 ? data : [
    { date: '7/15', value: 110, showLabel: true },
    { date: '', value: 72 },
    { date: '7/17', value: 90, showLabel: true },
    { date: '', value: 105 },
    { date: '7/19', value: 86, showLabel: true },
    { date: '', value: 112 },
    { date: '7/21', value: 51, showLabel: true },
    { date: '', value: 107 },
    { date: '7/23', value: 86, showLabel: true },
    { date: '', value: 96 },
    { date: '7/25', value: 112, showLabel: true },
    { date: '', value: 51 },
    { date: '7/27', value: 86, showLabel: true },
    { date: '', value: 112 },
    { date: '7/29', value: 105, showLabel: true },
    { date: '', value: 95 },
    { date: '7/31', value: 85, showLabel: true },
    { date: '', value: 75 },
    { date: '8/2', value: 65, showLabel: true },
    { date: '', value: 80 },
    { date: '8/4', value: 90, showLabel: true },
    { date: '', value: 85 },
    { date: '8/6', value: 95, showLabel: true },
    { date: '', value: 100 },
    { date: '8/8', value: 105, showLabel: true },
    { date: '', value: 95 },
    { date: '8/10', value: 88, showLabel: true },
    { date: '', value: 92 },
    { date: '8/12', value: 110, showLabel: true },
    { date: '', value: 85 }
  ];

  return (
    <div className={`${styles['bar-chart']} ${className}`}>
      <div className={styles['bar-chart__header']}>
        <h3 className={styles['bar-chart__title']}>{title}</h3>
        <p className={styles['bar-chart__date-range']}>{dateRange}</p>
      </div>

      <div className={styles['bar-chart__body']}>
        <div className={styles['bar-chart__y-axis']}>
          <div className={styles['bar-chart__y-lines']}>
            {yAxisValues.map((_, index) => (
              <div 
                key={index} 
                className={styles['bar-chart__grid-line']}
                style={{ 
                  opacity: index === 1 ? 0.4 : 0.2 
                }}
              />
            ))}
          </div>
          
          <div className={styles['bar-chart__y-labels']}>
            <div className={styles['bar-chart__y-values']}>
              {yAxisValues.map((value, index) => (
                <span 
                  key={index} 
                  className={styles['bar-chart__y-value']}
                >
                  {value}
                </span>
              ))}
            </div>
            <div className={styles['bar-chart__y-label-wrapper']}>
              <span className={styles['bar-chart__y-label']}>{yAxisLabel}</span>
            </div>
          </div>
        </div>

        <div className={styles['bar-chart__chart-area']}>
          <div className={styles['bar-chart__bars']}>
            {chartData.map((item, index) => (
              <div 
                key={index}
                className={styles['bar-chart__bar-wrapper']}
              >
                <div 
                  className={styles['bar-chart__bar']}
                  style={{ 
                    height: calculateBarHeight(item.value),
                    backgroundColor: barColor
                  }}
                  aria-label={`${item.date}: ${item.value} ${yAxisLabel}`}
                  role="img"
                />
              </div>
            ))}
          </div>

          <div className={styles['bar-chart__x-axis']}>
            <div className={styles['bar-chart__x-labels']}>
              {chartData.map((item, index) => (
                <div 
                  key={index}
                  className={styles['bar-chart__x-label-wrapper']}
                >
                  {(item.showLabel || item.date) && (
                    <span className={styles['bar-chart__x-label']}>
                      {item.date}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className={styles['bar-chart__x-axis-label']}>
              {xAxisLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;