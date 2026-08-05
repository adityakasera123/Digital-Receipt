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
  console.log("Chart Data:", data);

  return (
    <AnalyticsSection
      title="Monthly Spending"
      description="Track your monthly expenses."
    >
      {/* Temporary Debug */}
      <div className="mb-4 rounded-lg bg-slate-100 p-3 text-xs overflow-auto">
        {JSON.stringify(data, null, 2)}
      </div>

      <div
        style={{
          width: "100%",
          height: 400,
          border: "1px solid #e5e7eb",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#eee" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#2563EB"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AnalyticsSection>
  );
};

export default MonthlyExpenseChart;