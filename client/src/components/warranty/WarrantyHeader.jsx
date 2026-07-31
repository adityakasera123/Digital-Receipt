import { ShieldCheck, Plus } from "lucide-react";

const WarrantyHeader = () => {
  return (
    <section className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      
      {/* Left Section */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
            <ShieldCheck
              size={28}
              className="text-indigo-600"
            />
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Warranty Management
            </span>

            <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
              Warranty Vault
            </h1>
          </div>
        </div>

        <p className="mt-6 text-base leading-7 text-slate-600">
          Keep all your product warranties in one secure place. Track expiry
          dates, monitor active coverage, and stay prepared for future warranty
          claims without searching through old receipts.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-start gap-3 lg:items-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
        >
          <Plus size={18} />
          Add Warranty
        </button>

        <p className="text-sm text-slate-500">
          Add products with warranty information.
        </p>
      </div>
    </section>
  );
};

export default WarrantyHeader;