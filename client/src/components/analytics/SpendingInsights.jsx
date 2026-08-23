import {
  Trophy,
  Tags,
  Store,
  TrendingUp,
  Wallet,
} from 'lucide-react';

import AnalyticsSection from './AnalyticsSection';

const iconMap = {
  'highest-purchase': Trophy,
  'top-category': Tags,
  'top-store': Store,
  'monthly-increase': TrendingUp,
  'monthly-decrease': TrendingUp,
  'monthly-stable': TrendingUp,
  'total-spending': Wallet,
};

const SpendingInsights = ({ insights = [] }) => {
  if (!insights.length) {
    return null;
  }

  return (
    <AnalyticsSection
      title="Spending Insights"
      description="Useful insights based on your purchase history."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {insights.map((insight) => {
          const Icon = iconMap[insight.type] || Wallet;

          return (
            <div
              key={insight.type}
              className="group rounded-2xl border border-default bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-default hover:shadow-lg transition-theme"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-secondary transition-theme">
                  <Icon
                    size={21}
                    className="text-primary"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary">
                    {insight.title}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-secondary">
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AnalyticsSection>
  );
};

export default SpendingInsights;