const AnalyticsCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendColor = "text-emerald-600",
}) => {
  return (
    <div className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
            {value}
          </h2>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors duration-300 group-hover:bg-black group-hover:text-white">
          {icon}
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {subtitle}
        </p>

        {trend && (
          <span className={`text-sm font-semibold ${trendColor}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCard;