import { ChevronRight, ShieldAlert } from "lucide-react";

function WarrantyAlerts({ warranties = [] }) {
  // Calculate remaining days
  const getDaysLeft = (expiryDate) => {
    if (!expiryDate) return "No expiry";

    const today = new Date();
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Expires Today";
    if (diffDays === 1) return "1 day left";

    return `${diffDays} days left`;
  };

  // Sort by nearest expiry
  const sortedWarranties = [...warranties].sort(
    (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
  );

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Warranty Alerts
        </h2>

        <button className="flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700">
          View All
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Empty State */}
      {sortedWarranties.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          No warranties found.
        </div>
      ) : (
        <div className="space-y-4">
          {sortedWarranties.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
                <ShieldAlert
                  size={20}
                  className="text-orange-600"
                />
              </div>

              <div>
                <h3 className="font-medium text-gray-900">
                  {item.productName}
                </h3>

                <p className="text-sm text-orange-600">
                  {getDaysLeft(item.expiryDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WarrantyAlerts;