import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import AnalyticsSummaryGrid from "../../components/analytics/AnalyticsSummaryGrid";
import MonthlyExpenseChart from "../../components/analytics/MonthlyExpenseChart";
import CategorySpending from "../../components/analytics/CategorySpending";
import RecentActivity from "../../components/analytics/RecentActivity";
import QuickInsights from "../../components/analytics/QuickInsights";
import useAnalytics from "../../hooks/useAnalytics";

const Analytics = () => {
  const { loading, analytics } = useAnalytics();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-lg text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnalyticsHeader />

      {/* KPI Cards */}
      <AnalyticsSummaryGrid analytics={analytics} />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MonthlyExpenseChart
  data={analytics.monthlyExpenses}
/>
        </div>

        <div>
          <CategorySpending
  categories={analytics.categorySpending}
/>
        </div>
      </div>

      {/* Quick Insights */}
      <QuickInsights analytics={analytics} />

      {/* Recent Activity */}
    <RecentActivity receipts={analytics.receipts} />
    </div>
  );
};

export default Analytics;