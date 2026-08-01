import {
  ShieldCheck,
  CalendarDays,
  Store,
  Package,
} from "lucide-react";

const WarrantyOverview = ({ warranty }) => {
  const getStatus = () => {
    if (!warranty?.expiryDate) {
      return {
        text: "Unknown",
        color: "text-slate-600",
        bg: "bg-slate-100",
      };
    }

    const today = new Date();
    const expiry = new Date(warranty.expiryDate);

    if (expiry < today) {
      return {
        text: "Expired",
        color: "text-red-600",
        bg: "bg-red-100",
      };
    }

    const diffDays = Math.ceil(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 30) {
      return {
        text: "Expiring Soon",
        color: "text-amber-600",
        bg: "bg-amber-100",
      };
    }

    return {
      text: "Active",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    };
  };

  const status = getStatus();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {warranty?.productName || "Unknown Product"}
          </h2>

          <p className="mt-2 text-slate-500">
            Warranty overview
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${status.bg} ${status.color}`}
        >
          {status.text}
        </div>

      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 p-5">
          <Package
            className="mb-3 text-indigo-600"
            size={22}
          />

          <p className="text-sm text-slate-500">
            Category
          </p>

          <h3 className="mt-2 font-semibold text-slate-900">
            {warranty?.category}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <Store
            className="mb-3 text-indigo-600"
            size={22}
          />

          <p className="text-sm text-slate-500">
            Store
          </p>

          <h3 className="mt-2 font-semibold text-slate-900">
            {warranty?.storeName}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <ShieldCheck
            className="mb-3 text-indigo-600"
            size={22}
          />

          <p className="text-sm text-slate-500">
            Warranty
          </p>

          <h3 className="mt-2 font-semibold text-slate-900">
            {warranty?.warrantyDuration}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <CalendarDays
            className="mb-3 text-indigo-600"
            size={22}
          />

          <p className="text-sm text-slate-500">
            Expiry Date
          </p>

          <h3 className="mt-2 font-semibold text-slate-900">
            {warranty?.expiryDate}
          </h3>
        </div>

      </div>

    </section>
  );
};

export default WarrantyOverview;