import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
} from 'lucide-react';

import AnalyticsSection from './AnalyticsSection';

const SpendingTrend = ({ trend }) => {
  if (!trend) return null;

  const hasPreviousSpending =
  trend.trend !== 'no-data';

  const isIncrease = trend.trend === 'increase';
  const isDecrease = trend.trend === 'decrease';
  const isStable = trend.trend === 'stable';

  const Icon = isIncrease
    ? TrendingUp
    : isDecrease
      ? TrendingDown
      : isStable
        ? Minus
        : AlertCircle;

  const title = hasPreviousSpending
    ? isIncrease
      ? 'Spending Increased'
      : isDecrease
        ? 'Spending Decreased'
        : 'Spending is Stable'
    : 'Not Enough Data';

  const description = hasPreviousSpending
    ? `${Math.abs(trend.percentageChange)}% ${
        isIncrease
          ? 'higher'
          : isDecrease
            ? 'lower'
            : 'change'
      } compared with last month.`
    : 'No previous-month spending to compare.';

  return (
    <AnalyticsSection
      title="Spending Trend"
      description="Understand how your spending is changing over time."
    >
      <div className="rounded-2xl border border-default bg-surface-secondary p-5 transition-theme sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface">
            <Icon
              size={23}
              className="text-primary"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-bold text-primary sm:text-xl">
              {title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-secondary sm:text-base">
              {description}
            </p>
          </div>
        </div>

        {hasPreviousSpending && (
          <div className="mt-5 rounded-xl border border-default bg-surface px-4 py-3 transition-theme">
            <p className="text-sm text-secondary">
              Spending difference
            </p>

            <p className="mt-1 text-xl font-bold text-primary">
              {trend.difference >= 0 ? '+' : '-'}₹
              {Math.abs(trend.difference).toLocaleString('en-IN')}
            </p>
          </div>
        )}
      </div>
    </AnalyticsSection>
  );
};

export default SpendingTrend;