const SkeletonBlock = ({ className = '' }) => (
  <div
    className={`animate-pulse rounded-xl bg-surface-secondary ${className}`}
  />
);

const CardSkeleton = () => (
  <div className='rounded-3xl border border-default bg-surface p-6 transition-theme'>
    <div className='flex items-center justify-between'>
      <SkeletonBlock className='h-5 w-24' />
      <SkeletonBlock className='h-12 w-12 rounded-2xl' />
    </div>

    <SkeletonBlock className='mt-6 h-10 w-28' />
    <SkeletonBlock className='mt-3 h-4 w-32' />
  </div>
);

const SectionSkeleton = ({ height = 'h-96' }) => (
  <div className='rounded-3xl border border-default bg-surface p-6 transition-theme'>
    <SkeletonBlock className='h-7 w-48' />
    <SkeletonBlock className='mt-3 h-4 w-64' />

    <div className={`mt-6 ${height} rounded-2xl bg-surface-secondary animate-pulse`} />
  </div>
);

const AnalyticsSkeleton = () => {
  return (
    <div className='space-y-8 transition-theme'>
      {/* Header */}
      <div>
        <SkeletonBlock className='h-10 w-64' />
        <SkeletonBlock className='mt-3 h-4 w-80' />
      </div>

      {/* Cards */}
      <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        <div className='xl:col-span-2'>
          <SectionSkeleton />
        </div>

        <SectionSkeleton />
      </div>

      {/* Insights */}
      <SectionSkeleton height='h-72' />

      {/* Recent Activity */}
      <SectionSkeleton />
    </div>
  );
};

export default AnalyticsSkeleton;