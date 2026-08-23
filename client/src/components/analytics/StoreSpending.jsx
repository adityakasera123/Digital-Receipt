import AnalyticsSection from './AnalyticsSection';

const StoreSpending = ({ stores = [] }) => {
  if (!stores.length) {
    return (
      <AnalyticsSection
        title="Store Spending"
        description="See how much you spend across different stores."
      >
        <div className="flex min-h-44 items-center justify-center">
          <p className="text-base text-secondary">
            No store spending data available.
          </p>
        </div>
      </AnalyticsSection>
    );
  }

  const totalSpending = stores.reduce(
    (total, store) => total + store.amount,
    0
  );

  return (
    <AnalyticsSection
      title="Store Spending"
      description="See how much you spend across different stores."
    >
      <div className="space-y-6">
        {stores.map((store, index) => {
          const percentage =
            totalSpending > 0
              ? Math.round((store.amount / totalSpending) * 100)
              : 0;

          return (
            <div
              key={store.storeName}
              className="rounded-2xl border border-default bg-surface-secondary p-4 transition-theme sm:p-5"
            >
              {/* Store Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-sm font-bold text-primary shadow-sm">
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-primary sm:text-lg">
                        {store.storeName}
                      </p>

                      <p className="mt-0.5 text-sm text-secondary">
                        {percentage}% of total spending
                      </p>
                    </div>
                  </div>
                </div>

                <p className="shrink-0 text-lg font-bold tracking-tight text-primary sm:text-xl">
                  ₹{Number(store.amount).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-2.5 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-accent-primary transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AnalyticsSection>
  );
};

export default StoreSpending;