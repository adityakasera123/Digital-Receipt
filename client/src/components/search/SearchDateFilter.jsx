const SearchDateFilter = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
      <span className="text-sm font-medium text-secondary">
        Date
      </span>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          aria-label="Start date"
          className="rounded-xl border border-default bg-surface px-3 py-2 text-sm text-primary outline-none transition-theme focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />

        <span className="text-secondary">—</span>

        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          aria-label="End date"
          className="rounded-xl border border-default bg-surface px-3 py-2 text-sm text-primary outline-none transition-theme focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
      </div>
    </div>
  );
};

export default SearchDateFilter;