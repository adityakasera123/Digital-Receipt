import Card from '../ui/Card';

function AnalyticsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-secondary">
            {title}
          </p>

          <h3 className="mt-3 text-2xl font-bold leading-tight text-primary sm:text-3xl break-words">
            {value}
          </h3>

          <p className="mt-2 text-sm text-secondary break-words">
            {subtitle}
          </p>

          <p className="mt-4 text-xs font-medium text-secondary">
            {trend}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-default bg-surface sm:h-12 sm:w-12">
          {Icon && (
            <Icon
              size={20}
              className="text-primary sm:h-[22px] sm:w-[22px]"
            />
          )}
        </div>
      </div>
    </Card>
  );
}

export default AnalyticsCard;