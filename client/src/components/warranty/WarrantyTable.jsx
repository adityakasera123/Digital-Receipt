import WarrantyRow from "./WarrantyRow";

const WarrantyTable = ({ warranties, onDelete }) => {
  const today = new Date();

  const getStatus = (expiryDate, duration) => {
    if (duration?.toLowerCase() === "lifetime") {
      return "lifetime";
    }

    const expiry = new Date(expiryDate);

    if (expiry < today) {
      return "expired";
    }

    const diffDays = Math.ceil(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 30) {
      return "expiring";
    }

    return "active";
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-slate-900">
          All Warranties
        </h2>
      </div>

      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left">Product</th>
            <th className="px-6 py-4 text-left">Purchase</th>
            <th className="px-6 py-4 text-left">Expiry</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {warranties.length > 0 ? (
            warranties.map((item) => (
              <WarrantyRow
                key={item.id}
                id={item.id}
                product={item.productName}          // Temporary
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
                colSpan="5"
                className="px-6 py-10 text-center text-slate-500"
              >
                No warranties found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default WarrantyTable;