const WarrantyForm = () => {
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

          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500">
            <option>Select Duration</option>
            <option>3 Months</option>
            <option>6 Months</option>
            <option>12 Months</option>
            <option>24 Months</option>
            <option>36 Months</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Warranty Expiry Date
          </label>

          <input
            type="date"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500"
          />
        </div>
      </div>
    </section>
  );
};

export default WarrantyForm;