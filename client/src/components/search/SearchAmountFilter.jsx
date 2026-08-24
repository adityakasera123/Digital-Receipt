const SearchAmountFilter = ({
  minAmount,
  maxAmount,
  onMinAmountChange,
  onMaxAmountChange,
}) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <span className="text-sm font-medium text-secondary">
        Amount
      </span>

      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-secondary">
            ₹
          </span>

          <input
            type="number"
            min="0"
            value={minAmount}
            onChange={(e) => onMinAmountChange(e.target.value)}
            placeholder="Min"
            aria-label="Minimum amount"
            className="w-28 rounded-xl border border-default bg-surface py-2 pl-7 pr-3 text-sm text-primary outline-none transition-theme placeholder:text-secondary focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        <span className="text-secondary">—</span>

        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-secondary">
            ₹
          </span>

          <input
            type="number"
            min="0"
            value={maxAmount}
            onChange={(e) => onMaxAmountChange(e.target.value)}
            placeholder="Max"
            aria-label="Maximum amount"
            className="w-28 rounded-xl border border-default bg-surface py-2 pl-7 pr-3 text-sm text-primary outline-none transition-theme placeholder:text-secondary focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchAmountFilter;