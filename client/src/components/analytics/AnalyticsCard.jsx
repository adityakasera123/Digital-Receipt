import Card from '../ui/Card';

function AnalyticsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}) {
  return (
    <Card className='transition-theme'>
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-sm font-medium text-secondary'>
            {title}
          </p>

          <h3 className='mt-3 text-3xl font-bold text-primary'>
            {value}
          </h3>

          <p className='mt-2 text-sm text-secondary'>
            {subtitle}
          </p>

          <p className='mt-4 text-xs font-medium text-secondary'>
            {trend}
          </p>
        </div>

        <div className='flex h-12 w-12 items-center justify-center rounded-xl border border-default bg-surface'>
          {Icon && (
            <Icon
              size={22}
              className='text-primary'
            />
          )}
        </div>
      </div>
    </Card>
  );
}

export default AnalyticsCard;