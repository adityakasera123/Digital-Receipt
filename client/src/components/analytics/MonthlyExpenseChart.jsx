import AnalyticsSection from "./AnalyticsSection";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", amount: 12000 },
  { month: "Feb", amount: 18000 },
  { month: "Mar", amount: 15000 },
  { month: "Apr", amount: 24000 },
  { month: "May", amount: 21000 },
  { month: "Jun", amount: 28000 },
];

const MonthlyExpenseChart = () => {
  return (
    <AnalyticsSection
      title="Monthly Spending"
      description="Track your monthly expenses."
      action={
        <button className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100">
          This Month
        </button>
      }
    >
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 13 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 13 }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#2563EB"
              strokeWidth={4}
              dot={{
                r: 5,
                strokeWidth: 2,
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