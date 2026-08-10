import Card from '../ui/Card';

const AnalyticsSection = ({
  title,
  description,
  action,
  children,
}) => {
  return (
    <Card className="transition-theme">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary">
            {title}
          </h2>

          {description && (
            <p className="mt-2 text-sm text-secondary">
              {description}
            </p>
          )}
        </div>

        {action && action}
      </div>

      {children}
    </Card>
  );
};

export default AnalyticsSection;