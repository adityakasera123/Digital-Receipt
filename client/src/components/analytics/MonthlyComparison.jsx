import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import AnalyticsSection from './AnalyticsSection';

const MonthlyComparison = ({ comparison }) => {
  if (!comparison) return null;

  const {
    currentMonth,
    previousMonth,
    difference,
    percentageChange,
    trend,
  } = comparison;

  const currentMonthName = new Date(
    currentMonth.year,
    currentMonth.month,
    1
  ).toLocaleString('en-IN', {
    month: 'long',
  });

  const previousMonthName = new Date(
    previousMonth.year,
    previousMonth.month,
    1
  ).toLocaleString('en-IN', {
    month: 'long',
  });

  const TrendIcon =
    trend === 'increase'
      ? TrendingUp
      : trend === 'decrease'
        ? TrendingDown
        : Minus;

  const trendText =
    trend === 'increase'
      ? 'Spending increased'
      : trend === 'decrease'
        ? 'Spending decreased'
        : 'Spending is stable';

  const hasPreviousSpending = previousMonth.amount > 0;

  return (
    <AnalyticsSection
      title="Monthly Comparison"
      description="Compare your spending with the previous month."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Current Month */}
        <div className="rounded-2xl border border-default bg-surface-secondary p-5 transition-theme">
          <p className="text-sm font-medium text-secondary">
            {currentMonthName} Spending
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            ₹{Number(currentMonth.amount).toLocaleString('en-IN')}
          </p>
        </div>

        {/* Previous Month */}
        <div className="rounded-2xl border border-default bg-surface-secondary p-5 transition-theme">
          <p className="text-sm font-medium text-secondary">
            {previousMonthName} Spending
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            ₹{Number(previousMonth.amount).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Comparison Result */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-default bg-surface-secondary p-4 transition-theme sm:p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface">
          <TrendIcon
            size={21}
            className="text-primary"
          />
        </div>

        <div className="min-w-0">
          <p className="text-base font-semibold text-primary">
            {hasPreviousSpending
              ? `${Math.abs(percentageChange)}% ${trendText.toLowerCase()}`
              : 'No previous-month spending to compare'}
          </p>

          {hasPreviousSpending && (
            <p className="mt-1 text-sm text-secondary">
              {difference >= 0 ? '+' : '-'}₹
              {Math.abs(difference).toLocaleString('en-IN')}
              {' '}compared with {previousMonthName}
            </p>
          )}
        </div>
      </div>
    </AnalyticsSection>
  );
};

export default MonthlyComparison;