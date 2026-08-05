const AnalyticsSection = ({
  title,
  description,
  action,
  children,
}) => {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {title}
          </h2>

          {description && (
            <p className="mt-2 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>

        {action && action}
      </div>

      {children}
    </section>
  );
};

export default AnalyticsSection;