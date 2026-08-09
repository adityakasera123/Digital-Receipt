import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import Card from '../ui/Card';
import { useTheme } from '../../context/ThemeContext';

function ExpenseChart({ data = [] }) {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  const gridColor = isDark ? '#232428' : '#E5E7EB';
  const axisColor = isDark ? '#A1A1AA' : '#6B7280';
  const tooltipBg = isDark ? '#111214' : '#FFFFFF';
  const tooltipBorder = isDark ? '#232428' : '#E5E7EB';
  const tooltipText = isDark ? '#FFFFFF' : '#111827';
  const lineColor = '#7EF0C2';

  return (
    <Card>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">
            Monthly Spending
          </h2>

          <p className="mt-1 text-sm text-secondary">
            Track your monthly expenses
          </p>
        </div>

        <button
          type="button"
          className="button-secondary shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-theme"
        >
          This Month
        </button>
      </div>

      {/* Chart */}
      <div className="mt-6 h-[280px] w-full sm:h-[340px] lg:mt-8 lg:h-[420px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-secondary">
            No spending data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 8,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                stroke={gridColor}
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: axisColor,
                  fontSize: 11,
                }}
                tickMargin={8}
              />

              <YAxis
                tickFormatter={(value) =>
                  `₹${Math.round(value / 1000)}k`
                }
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: axisColor,
                  fontSize: 11,
                }}
                width={42}
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString('en-IN')}`,
                  'Spending',
                ]}
                contentStyle={{
                  background: tooltipBg,
                  borderRadius: '12px',
                  border: `1px solid ${tooltipBorder}`,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
                  color: tooltipText,
                }}
                labelStyle={{ color: tooltipText }}
                itemStyle={{ color: tooltipText }}
              />

              <Line
                type="monotone"
                dataKey="amount"
                stroke={lineColor}
                strokeWidth={4}
                dot={{
                  r: 4,
                  fill: lineColor,
                }}
                activeDot={{
                  r: 7,
                  stroke: lineColor,
                  strokeWidth: 2,
                  fill: lineColor,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

export default ExpenseChart;