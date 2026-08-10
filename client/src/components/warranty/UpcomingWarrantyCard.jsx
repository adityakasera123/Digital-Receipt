import { CalendarDays, Clock3 } from 'lucide-react';
import Card from '../ui/Card';

const UpcomingWarrantyCard = ({
  product,
  brand,
  store,
  expiryDate,
  daysLeft,
}) => {
  return (
    <Card className='transition-theme'>
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-primary'>{product}</h3>

          <p className='mt-1 text-sm text-secondary'>
            {brand} • {store}
          </p>
        </div>

        <div className='flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700'>
          <Clock3 size={16} />
          {daysLeft} Days Left
        </div>
      </div>

      <div className='mt-5 flex items-center gap-2 text-sm text-secondary'>
        <CalendarDays size={16} />
        Expires on {expiryDate}
      </div>
    </Card>
  );
};

export default UpcomingWarrantyCard;