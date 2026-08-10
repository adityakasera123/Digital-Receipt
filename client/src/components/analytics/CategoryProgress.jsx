const CategoryProgress = ({
  title,
  amount,
  percentage,
  color = 'bg-blue-600',
}) => {
  return (
    <div className="rounded-2xl border border-default bg-surface p-4 transition-theme">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-primary">
            {title}
          </h3>

          <p className="mt-1 text-sm text-secondary">
            ₹{amount.toLocaleString('en-IN')}
          </p>
        </div>

        <span className="text-sm font-semibold text-primary">
          {percentage}%
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-hover">
        <div
          className={`${color} h-full rounded-full transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default CategoryProgress;