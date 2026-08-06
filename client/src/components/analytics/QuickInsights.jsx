import {
  IndianRupee,
  TrendingDown,
  BarChart3,
  Trophy,
  ChevronRight,
} from "lucide-react";

const QuickInsights = ({ analytics }) => {
  const insights = [
    {
      title: "Highest Purchase",
      value: analytics.highestPurchase
        ? `₹${Number(
            analytics.highestPurchase.amount
          ).toLocaleString("en-IN")}`
        : "₹0",
      icon: <IndianRupee size={18} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Lowest Purchase",
      value: analytics.lowestPurchase
        ? `₹${Number(
            analytics.lowestPurchase.amount
          ).toLocaleString("en-IN")}`
        : "₹0",
      icon: <TrendingDown size={18} />,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Average Purchase",
      value: `₹${Number(
        analytics.averagePurchase || 0
      ).toLocaleString("en-IN")}`,
      icon: <BarChart3 size={18} />,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Top Category",
      value:
        analytics.categorySpending?.length > 0
          ? analytics.categorySpending[0].title
          : "N/A",
      icon: <Trophy size={18} />,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Quick Insights
        </h2>

        <p className="mt-1 text-gray-500">
          Your spending highlights at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {insights.map((item) => (
          <div
            key={item.title}
            className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}
              >
                {item.icon}
              </div>

              <ChevronRight
                size={16}
                className="text-gray-300 transition group-hover:text-blue-600"
              />
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">
              {item.title}
            </p>

            <h3 className="mt-2 text-xl font-bold text-gray-900">
              {item.value}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickInsights;