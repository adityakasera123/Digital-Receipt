import { Search, SlidersHorizontal } from "lucide-react";

const WarrantyFilters = () => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}

        <div className="relative w-full lg:max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search by product, brand or store..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:bg-white"
          />

        </div>

        {/* Filters */}

        <div className="flex items-center gap-3">

          <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none">
            <option>All Status</option>
            <option>Active</option>
            <option>Expiring</option>
            <option>Expired</option>
            <option>Lifetime</option>
          </select>

          <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 transition hover:bg-slate-50">
            <SlidersHorizontal size={18} />
            Filters
          </button>

        </div>

      </div>
    </section>
  );
};

export default WarrantyFilters;