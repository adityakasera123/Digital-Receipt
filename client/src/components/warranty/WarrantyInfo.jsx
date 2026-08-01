import { Calendar, Tag, FileText } from "lucide-react";

const WarrantyInfo = ({ warranty }) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Purchase Information
        </h2>

        <p className="mt-2 text-slate-500">
          Original purchase details associated with this warranty.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl border border-slate-200 p-5">
          <Calendar className="mb-3 text-indigo-600" size={22} />

          <p className="text-sm text-slate-500">
            Purchase Date
          </p>

          <h3 className="mt-2 font-semibold text-slate-900">
            {warranty?.purchaseDate}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <Tag className="mb-3 text-indigo-600" size={22} />

          <p className="text-sm text-slate-500">
            Category
          </p>

          <h3 className="mt-2 font-semibold text-slate-900">
            {warranty?.category}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <FileText className="mb-3 text-indigo-600" size={22} />

          <p className="text-sm text-slate-500">
            Receipt ID
          </p>

          <h3 className="mt-2 break-all font-semibold text-slate-900">
            {warranty?.receiptId}
          </h3>
        </div>

      </div>

    </section>
  );
};

export default WarrantyInfo;