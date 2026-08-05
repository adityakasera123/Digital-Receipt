import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import AnalyticsSummaryGrid from "../../components/analytics/AnalyticsSummaryGrid";
import MonthlyExpenseChart from "../../components/analytics/MonthlyExpenseChart";
import CategorySpending from "../../components/analytics/CategorySpending";
import RecentActivity from "../../components/analytics/RecentActivity";
import QuickInsights from "../../components/analytics/QuickInsights";

const Analytics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <AnalyticsHeader />

      {/* KPI Cards */}
      <AnalyticsSummaryGrid />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MonthlyExpenseChart />
        </div>

        <div>
          <CategorySpending />
        </div>
      </div>

      {/* Quick Insights */}
      <QuickInsights />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Analytics;