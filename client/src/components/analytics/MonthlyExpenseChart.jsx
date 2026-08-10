import AnalyticsSection from './AnalyticsSection';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const MonthlyExpenseChart = ({ data = [] }) => {
  return (
    <AnalyticsSection
      title='Monthly Spending'
      description='Track your monthly expenses.'
      action={
        <button className='button-secondary rounded-xl px-4 py-2 text-sm font-medium transition-theme'>
          This Year
        </button>
      }
    >
      <div className='h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 10,
              bottom: 5,
            }}
          >
            <CartesianGrid
              stroke='var(--border-color)'
              strokeDasharray='4 4'
              vertical={false}
            />

            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--text-secondary)', fontSize: 13 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              domain={[0, 'auto']}
              tick={{ fill: 'var(--text-secondary)', fontSize: 13 }}
            />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString('en-IN')}`,
                'Expenses',
              ]}
              contentStyle={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                color: 'var(--text-primary)',
              }}
              labelStyle={{ color: 'var(--text-primary)' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />

            <Line
              type='monotone'
              dataKey='amount'
              stroke='var(--accent-primary)'
              strokeWidth={3}
              connectNulls
              dot={{
                r: 5,
                fill: 'var(--accent-primary)',
              }}
              activeDot={{
                r: 8,
                fill: 'var(--accent-primary)',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsSection>
  );
};

export default MonthlyExpenseChart;