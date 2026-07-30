import { ChevronRight, ShieldAlert } from "lucide-react";

function WarrantyAlerts() {
    const alerts = [
  {
    id: 1,
    product: "HP Laptop",
    daysLeft: "5 days left",
  },
  {
    id: 2,
    product: "Boat Airdopes",
    daysLeft: "12 days left",
  },
  {
    id: 3,
    product: "LG Smart TV",
    daysLeft: "20 days left",
  },
];
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
  <h2 className="text-xl font-semibold text-gray-900">
    Warranty Alerts
  </h2>

  <button className="flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700">
    View All
    <ChevronRight size={16} />
  </button>
</div>
<div className="space-y-4">
  {alerts.map((item) => (
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
          {item.product}
        </h3>

        <p className="text-sm text-orange-600">
          {item.daysLeft}
        </p>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}

export default WarrantyAlerts;