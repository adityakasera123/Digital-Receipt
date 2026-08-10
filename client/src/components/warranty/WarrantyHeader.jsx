import { ShieldCheck, Plus } from "lucide-react";
import Card from "../ui/Card";

const WarrantyHeader = () => {
  return (
    <Card className="transition-theme">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Section */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-500/15">
              <ShieldCheck
                size={28}
                className="text-indigo-600 dark:text-indigo-300"
              />
            </div>

            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">
                Warranty Management
              </span>

              <h1 className="mt-1 text-4xl font-bold tracking-tight text-primary">
                Warranty Vault
              </h1>
            </div>
          </div>

          <p className="mt-6 text-base leading-7 text-secondary">
            Keep all your product warranties in one secure place. Track expiry
            dates, monitor active coverage, and stay prepared for future warranty
            claims without searching through old receipts.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-start gap-3 lg:items-end">
          <button
            type="button"
            className="button-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition-theme"
          >
            <Plus size={18} />
            Add Warranty
          </button>

          <p className="text-sm text-secondary">
            Add products with warranty information.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WarrantyHeader;