const ReceiptForm = () => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      {/* Header */}

      <div className="mb-8">

        <h2 className="text-xl font-semibold text-slate-900">
          Receipt Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter your purchase details. Later, OCR can automatically fill these fields.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Store Name */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Store Name
          </label>

          <input
            type="text"
            placeholder="Amazon, Flipkart..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500"
          />

        </div>

        {/* Purchase Date */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Purchase Date
          </label>

          <input
            type="date"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500"
          />

        </div>

        {/* Category */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>

          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500"
          >

            <option>Select Category</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Grocery</option>
            <option>Home</option>
            <option>Others</option>

          </select>

        </div>

        {/* Amount */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Amount
          </label>

          <input
            type="number"
            placeholder="₹ 0.00"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500"
          />

        </div>

      </div>

      {/* Payment Method */}

      <div className="mt-6">

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Payment Method
        </label>

        <select
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500"
        >

          <option>Select Payment Method</option>
          <option>UPI</option>
          <option>Credit Card</option>
          <option>Debit Card</option>
          <option>Cash</option>
          <option>Net Banking</option>

        </select>

      </div>

    </section>
  );
};

export default ReceiptForm;