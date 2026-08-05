const CategoryProgress = ({
  title,
  amount,
  percentage,
  color = "bg-blue-600",
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">
            {title}
          </h4>

          <p className="mt-1 text-sm text-gray-500">
            ₹{amount.toLocaleString()}
          </p>
        </div>

        <span className="text-sm font-semibold text-gray-700">
          {percentage}%
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`${color} h-full rounded-full transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default CategoryProgress;