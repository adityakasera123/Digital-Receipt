const statusStyles = {
  active:
    "bg-emerald-100 text-emerald-700",
  expiring:
    "bg-amber-100 text-amber-700",
  expired:
    "bg-red-100 text-red-700",
  lifetime:
    "bg-indigo-100 text-indigo-700",
};

const labels = {
  active: "Active",
  expiring: "Expiring Soon",
  expired: "Expired",
  lifetime: "Lifetime",
};

const WarrantyStatusBadge = ({ status }) => {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[status] || statusStyles.active
      }`}
    >
      {labels[status] || "Active"}
    </span>
  );
};

export default WarrantyStatusBadge;