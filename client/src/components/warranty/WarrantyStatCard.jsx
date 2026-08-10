import Card from '../ui/Card';

const WarrantyStatCard = ({
  title,
  count,
  description,
  icon,
  iconBg = 'bg-indigo-100',
  iconColor = 'text-indigo-600',
}) => {
  return (
    <Card className='transition-theme'>
      <div className='flex items-center justify-between'>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}
        >
          <span className={iconColor}>{icon}</span>
        </div>
      </div>

      <div className='mt-6'>
        <h3 className='text-sm font-medium text-secondary'>{title}</h3>

        <p className='mt-2 text-4xl font-bold tracking-tight text-primary'>
          {count}
        </p>

        <p className='mt-2 text-sm leading-6 text-secondary'>{description}</p>
      </div>
    </Card>
  );
};

export default WarrantyStatCard;