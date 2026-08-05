const ActivityItem = ({
  icon,
  title,
  subtitle,
  time,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
}) => {
  return (
    <div className="group flex cursor-pointer items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>

        <div>
          <h4 className="text-[15px] font-semibold text-gray-900">
            {title}
          </h4>

          <p className="text-sm text-gray-500">
            {subtitle}
          </p>
        </div>
      </div>

      <span className="text-sm text-gray-400 transition group-hover:text-gray-600">
        {time}
      </span>
    </div>
  );
};

export default ActivityItem;Analytics