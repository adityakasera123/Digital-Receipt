import {
  IndianRupee,
  TrendingDown,
  BarChart3,
  Trophy,
  Store,
  ChevronRight,
} from 'lucide-react';
import Card from '../ui/Card';

const QuickInsights = ({ analytics }) => {
  const insights = [
    {
      title: 'Highest Purchase',
      value: analytics.highestPurchase
        ? `₹${Number(
            analytics.highestPurchase.amount
          ).toLocaleString('en-IN')}`
        : '₹0',
      icon: Trophy,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Lowest Purchase',
      value: analytics.lowestPurchase
        ? `₹${Number(
            analytics.lowestPurchase.amount
          ).toLocaleString('en-IN')}`
        : '₹0',
      icon: TrendingDown,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'Average Purchase',
      value: `₹${Number(
        analytics.averagePurchase || 0
      ).toLocaleString('en-IN')}`,
      icon: BarChart3,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
  title: 'Top Category',
  value: analytics.topCategory
    ? analytics.topCategory.title
    : 'N/A',
  icon: IndianRupee,
  color: 'bg-amber-100 text-amber-600',
},

{
  title: 'Top Store',
  value: analytics.topStore
    ? analytics.topStore.storeName
    : 'N/A',
  icon: Store,
  color: 'bg-violet-100 text-violet-600',
},
  ];

  return (
    <Card className="mb-8 transition-theme">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Quick Insights
        </h2>

        <p className="mt-2 text-secondary">
          Your spending highlights at a glance.
        </p>
      </div>

     <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {insights.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="group cursor-pointer rounded-2xl border border-default bg-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={20} />
                </div>

                <ChevronRight
                  size={16}
                  className="text-secondary transition group-hover:text-blue-600"
                />
              </div>

              <p className="mt-5 text-sm font-medium text-secondary">
                {item.title}
              </p>

              <h3 className="mt-2 text-xl font-bold text-primary">
                {item.value}
              </h3>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickInsights;