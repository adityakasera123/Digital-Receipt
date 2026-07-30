import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function ExpenseChart() {
  const data = [
    { month: "Jan", amount: 12000 },
    { month: "Feb", amount: 18000 },
    { month: "Mar", amount: 15000 },
    { month: "Apr", amount: 24000 },
    { month: "May", amount: 21000 },
    { month: "Jun", amount: 28000 },
  ];

  return (
    <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Monthly Spending
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Track your monthly expenses
          </p>
        </div>

        <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          This Month
        </button>
      </div>

      {/* Chart */}
      <div className="mt-8 h-[420px]">
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
              stroke="#E5E7EB"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 13 }}
            />

            <YAxis
              tickFormatter={(value) => `₹${value / 1000}k`}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 13 }}
            />

            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString()}`, "Spending"]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
            />

            <Line
              type="monotone"
              dataKey="amount"
              stroke="#2563EB"
              strokeWidth={4}
              dot={{
                r: 4,
                fill: "#2563EB",
              }}
              activeDot={{
                r: 7,
                stroke: "#2563EB",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpenseChart;