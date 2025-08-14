'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
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
  // Default sample data if none provided (30 days like in Figma)
  const defaultData = [
    { date: '7/15', value: 110 },
    { date: '', value: 72 },
    { date: '7/17', value: 90 },
    { date: '', value: 105 },
    { date: '7/19', value: 86 },
    { date: '', value: 112 },
    { date: '7/21', value: 51 },
    { date: '', value: 107 },
    { date: '7/23', value: 86 },
    { date: '', value: 96 },
    { date: '7/25', value: 112 },
    { date: '', value: 51 },
    { date: '7/27', value: 86 },
    { date: '', value: 112 },
    { date: '7/29', value: 105 },
    { date: '', value: 95 },
    { date: '7/31', value: 85 },
    { date: '', value: 75 },
    { date: '8/2', value: 65 },
    { date: '', value: 80 },
    { date: '8/4', value: 90 },
    { date: '', value: 85 },
    { date: '8/6', value: 95 },
    { date: '', value: 100 },
    { date: '8/8', value: 105 },
    { date: '', value: 95 },
    { date: '8/10', value: 88 },
    { date: '', value: 92 },
    { date: '8/12', value: 110 },
    { date: '', value: 85 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles['bar-chart__tooltip']}>
          <p className={styles['bar-chart__tooltip-label']}>
            {label || 'Value'}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tick for rotated x-axis labels
  const CustomXAxisTick = ({ x, y, payload, index }) => {
    // Show every 2nd label to match Figma
    if (index % 2 !== 0) return null;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#D5D5D5"
          transform="rotate(-30)"
          fontSize={12}
          fontFamily="SF Mono, Monaco, monospace"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // Custom Y-axis label
  const YAxisLabel = () => (
    <text
      x={-25}
      y={150}
      transform="rotate(-90, -25, 150)"
      textAnchor="middle"
      fill="#9B9B9B"
      fontSize={12}
      fontWeight={600}
    >
      {yAxisLabel}
    </text>
  );

  return (
    <div className={`${styles['bar-chart']} ${className}`}>
      <div className={styles['bar-chart__header']}>
        <h3 className={styles['bar-chart__title']}>{title}</h3>
        <p className={styles['bar-chart__date-range']}>{dateRange}</p>
      </div>

      <div className={styles['bar-chart__body']}>
        <ResponsiveContainer width="100%" height={350}>
          <RechartsBarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="rgba(155, 155, 155, 0.2)"
            />
            <XAxis 
              dataKey="date" 
              tick={<CustomXAxisTick />}
              interval={0}
              axisLine={{ stroke: '#9B9B9B' }}
              tickLine={false}
            />
            <YAxis 
              domain={[0, maxValue]}
              ticks={[0, 25, 50, 75, 100, 125, 150]}
              axisLine={{ stroke: '#9B9B9B' }}
              tickLine={false}
              tick={{ fill: '#D5D5D5', fontSize: 10, fontWeight: 600 }}
              label={<YAxisLabel />}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            />
            <Bar 
              dataKey="value" 
              radius={[2, 2, 0, 0]}
              maxBarSize={16}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={barColor} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
        
        <div className={styles['bar-chart__x-label']}>
          {xAxisLabel}
        </div>
      </div>
    </div>
  );
};

export default BarChart;