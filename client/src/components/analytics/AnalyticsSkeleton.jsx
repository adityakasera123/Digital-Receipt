const CardSkeleton = () => (
  <div className="animate-pulse rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="mb-6 flex items-center justify-between">
      <div>
        <div className="h-4 w-24 rounded bg-gray-200"></div>
        <div className="mt-3 h-8 w-20 rounded bg-gray-300"></div>
      </div>

      <div className="h-12 w-12 rounded-2xl bg-gray-200"></div>
    </div>

    <div className="h-3 w-28 rounded bg-gray-200"></div>
  </div>
);

const SectionSkeleton = ({ height = "h-96" }) => (
  <div
    className={`animate-pulse rounded-3xl border border-gray-200 bg-white p-8 shadow-sm ${height}`}
  >
    <div className="mb-8">
      <div className="h-6 w-48 rounded bg-gray-300"></div>

      <div className="mt-3 h-4 w-64 rounded bg-gray-200"></div>
    </div>

    <div className="h-full rounded-2xl bg-gray-100"></div>
  </div>
);

const AnalyticsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-pulse">
        <div className="h-8 w-56 rounded bg-gray-300"></div>

        <div className="mt-3 h-4 w-80 rounded bg-gray-200"></div>
      </div>

      {/* Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionSkeleton />
        </div>

        <SectionSkeleton />
      </div>

      {/* Insights */}
      <SectionSkeleton height="h-72" />

      {/* Recent Activity */}
      <SectionSkeleton />
    </div>
  );
};

export default AnalyticsSkeleton;