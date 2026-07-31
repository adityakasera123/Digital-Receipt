import { CalendarDays, Clock3 } from "lucide-react";

const UpcomingWarrantyCard = ({
  product,
  brand,
  store,
  expiryDate,
  daysLeft,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="flex items-start justify-between">

        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {product}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {brand} • {store}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
          <Clock3 size={16} />
          {daysLeft} Days Left
        </div>

      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
        <CalendarDays size={16} />
        Expires on {expiryDate}
      </div>

    </div>
  );
};

export default UpcomingWarrantyCard;