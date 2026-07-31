const WarrantyForm = ({ receiptData, onInputChange, errors }) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900">
          Warranty Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add warranty details to receive reminders before your warranty expires.
        </p>
      </div>

      {/* Warranty Available */}
      <div className="mb-8 flex items-center gap-3">
      <input
  id="hasWarranty"
  type="checkbox"
  name="hasWarranty"
  checked={receiptData.hasWarranty}
  onChange={onInputChange}
  className="h-5 w-5 rounded border-slate-300 accent-indigo-600"
/>
        <label
          htmlFor="hasWarranty"
          className="text-sm font-medium text-slate-700"
        >
          This product has warranty
        </label>
      </div>

      {/* Fields */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Warranty Duration
          </label>

          <select
  name="warrantyDuration"
  value={receiptData.warrantyDuration}
  onChange={onInputChange}
  className={`w-full rounded-xl border px-4 py-3 ${
  errors.warrantyDuration ? "border-red-500" : "border-slate-200"
}`}
  >
    
             <option value="">Select Duration</option>
  <option value="3 Months">3 Months</option>
  <option value="6 Months">6 Months</option>
  <option value="12 Months">12 Months</option>
  <option value="24 Months">24 Months</option>
  <option value="36 Months">36 Months</option>
          </select>
          {errors.warrantyDuration && (
  <p className="mt-2 text-sm text-red-500">
    {errors.warrantyDuration}
  </p>
)}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Warranty Expiry Date
          </label>

         <input
  type="date"
  name="warrantyExpiry"
  value={receiptData.warrantyExpiry}
  onChange={onInputChange}
 className={`w-full rounded-xl px-4 py-3 outline-none transition focus:border-indigo-500 ${
  errors.warrantyExpiry
    ? "border border-red-500"
    : "border border-slate-200"
}`}
/>
{errors.warrantyExpiry && (
  <p className="mt-2 text-sm text-red-500">
    {errors.warrantyExpiry}
  </p>
)}
        </div>
      </div>
    </section>
  );
};

export default WarrantyForm;