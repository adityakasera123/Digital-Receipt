import Card from '../ui/Card';
import WarrantyRow from './WarrantyRow';

const WarrantyTable = ({ warranties, onDelete }) => {
  const today = new Date();

  const getStatus = (expiryDate, duration) => {
    if (duration?.toLowerCase() === 'lifetime') {
      return 'lifetime';
    }

    const expiry = new Date(expiryDate);

    if (expiry < today) {
      return 'expired';
    }

    const diffDays = Math.ceil(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 30) {
      return 'expiring';
    }

    return 'active';
  };

  return (
    <Card className='transition-theme'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-primary'>All Warranties</h2>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-surface'>
            <tr className='border-b border-default'>
              <th className='px-6 py-4 text-left text-sm font-semibold text-primary'>
                Product
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-primary'>
                Purchase
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-primary'>
                Expiry
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-primary'>
                Status
              </th>
              <th className='px-6 py-4 text-left text-sm font-semibold text-primary'>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {warranties.length > 0 ? (
              warranties.map((item) => (
                <WarrantyRow
                  key={item.id}
                  id={item.id}
                  product={item.productName}
                  brand={item.category}
                  purchaseDate={item.purchaseDate}
                  expiryDate={item.expiryDate}
                  status={getStatus(
                    item.expiryDate,
                    item.warrantyDuration
                  )}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan='5'
                  className='px-6 py-10 text-center text-secondary'
                >
                  No warranties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default WarrantyTable;