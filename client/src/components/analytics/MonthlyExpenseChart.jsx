import AnalyticsSection from "./AnalyticsSection";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const MonthlyExpenseChart = ({ data = [] }) => {
  return (
    <AnalyticsSection
      title="Monthly Spending"
      description="Track your monthly expenses."
      action={
        <button className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium transition hover:bg-gray-100">
          This Year
        </button>
      }
    >
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
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
              stroke="#F1F5F9"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              domain={[0, "auto"]}
            />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Expenses",
              ]}
            />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#2563EB"
              strokeWidth={3}
              connectNulls
              dot={{
                r: 5,
                fill: "#2563EB",
              }}
              activeDot={{
                r: 8,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsSection>
  );
};

export default MonthlyExpenseChart;