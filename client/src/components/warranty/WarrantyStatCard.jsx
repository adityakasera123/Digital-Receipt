const WarrantyStatCard = ({
  title,
  count,
  description,
  icon,
  iconBg = "bg-indigo-100",
  iconColor = "text-indigo-600",
}) => {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}
        >
          <span className={iconColor}>{icon}</span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-slate-500">
          {title}
        </h3>

        <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          {count}
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

    </div>
  );
};

export default WarrantyStatCard;