import Card from '../ui/Card';
import UpcomingWarrantyCard from './UpcomingWarrantyCard';

const UpcomingWarranty = ({ warranties }) => {
  const today = new Date();

  const upcomingWarranties = warranties
    .map((item) => {
      const expiry = new Date(item.expiryDate);

      const daysLeft = Math.ceil(
        (expiry - today) / (1000 * 60 * 60 * 24)
      );

      return {
        ...item,
        daysLeft,
      };
    })
    .filter((item) => item.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 4);

  return (
    <Card className='transition-theme'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-primary'>
          Upcoming Warranties
        </h2>

        <p className='mt-1 text-secondary'>
          Products that require your attention soon.
        </p>
      </div>

      <div className='grid gap-5 lg:grid-cols-2'>
        {upcomingWarranties.length > 0 ? (
          upcomingWarranties.map((item) => (
            <UpcomingWarrantyCard
              key={item.id}
              product={item.productName}
              brand={item.category}
              store={item.storeName}
              expiryDate={item.expiryDate}
              daysLeft={item.daysLeft}
            />
          ))
        ) : (
          <div className='rounded-2xl border border-dashed border-default bg-surface p-8 text-center text-secondary transition-theme'>
            No upcoming warranties found.
          </div>
        )}
      </div>
    </Card>
  );
};

export default UpcomingWarranty;