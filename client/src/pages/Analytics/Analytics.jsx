import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import AnalyticsSummaryGrid from "../../components/analytics/AnalyticsSummaryGrid";
import MonthlyExpenseChart from "../../components/analytics/MonthlyExpenseChart";
import CategorySpending from "../../components/analytics/CategorySpending";

const Analytics = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <AnalyticsHeader />

      {/* KPI Cards */}
      <AnalyticsSummaryGrid />

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Monthly Chart */}
        <div className="xl:col-span-2">
          <MonthlyExpenseChart />
        </div>

        {/* Category Spending */}
        <div className="xl:col-span-1">
          <CategorySpending />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Recent Activity */}
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm xl:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Recent Activity
          </h2>

          <p className="mt-2 text-gray-500">
            Latest receipts and warranty updates will appear here.
          </p>
        </section>

        {/* Insights */}
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            Quick Insights
          </h2>

          <p className="mt-2 text-gray-500">
            Smart spending insights will appear here.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Analytics;