import Card from '../ui/Card';
import WarrantyRow from './WarrantyRow';
import { getWarrantyStatus } from '../../utils/warrantyStatus';

const WarrantyTable = ({ warranties, onDelete }) => {
  return (
    <Card>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-primary">
          All Warranties
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-hidden">
        <table className="w-full">
          {/* Desktop Header */}
          <thead className="hidden bg-surface lg:table-header-group">
            <tr className="border-b border-default">
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                Product
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                Purchase
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                Expiry
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                Status
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
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
                  status={getWarrantyStatus(
                    item.expiryDate,
                    item.warrantyDuration
                  )}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-secondary"
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