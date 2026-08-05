const InsightCard = ({ title, value, subtitle }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:border-gray-200 hover:bg-white hover:shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        {value}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {subtitle}
      </p>
    </div>
  );
};

export default InsightCard;