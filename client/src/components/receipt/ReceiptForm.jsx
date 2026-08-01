const ReceiptForm = ({ receiptData, onInputChange ,errors}) => {
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

        {/* Product Name */}

<div>

  <label className="mb-2 block text-sm font-medium text-slate-700">
    Product Name
  </label>

  <input
    type="text"
    name="productName"
    value={receiptData.productName}
    onChange={onInputChange}
    placeholder="iPhone 16 Pro, AirPods Pro..."
    className={`w-full rounded-xl bg-white px-4 py-3 outline-none transition focus:border-indigo-500 ${
      errors.productName
        ? "border border-red-500"
        : "border border-slate-200"
    }`}
  />

  {errors.productName && (
    <p className="mt-2 text-sm text-red-500">
      {errors.productName}
    </p>
  )}

</div>

        {/* Store Name */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Store Name
          </label>

          <input
            type="text"
            name="storeName"
  value={receiptData.storeName}
  onChange={onInputChange}
            placeholder="Amazon, Flipkart..."
            className={`w-full rounded-xl bg-white px-4 py-3 outline-none transition focus:border-indigo-500 ${
  errors.storeName
    ? "border border-red-500"
    : "border border-slate-200"
}`}
          />
          {errors.storeName && (
  <p className="mt-2 text-sm text-red-500">
    {errors.storeName}
  </p>
)}

        </div>

        {/* Purchase Date */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Purchase Date
          </label>

          <input
  type="date"
  name="purchaseDate"
  value={receiptData.purchaseDate}
  onChange={onInputChange}
  className={`w-full rounded-xl bg-white px-4 py-3 outline-none transition focus:border-indigo-500 ${
  errors.purchaseDate
    ? "border border-red-500"
    : "border border-slate-200"
}`}
/>
{errors.purchaseDate && (
  <p className="mt-2 text-sm text-red-500">
    {errors.purchaseDate}
  </p>
)}

        </div>

        {/* Category */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>

          <select
            name="category"
            value={receiptData.category}
            onChange={onInputChange} 

        className={`w-full rounded-xl bg-white px-4 py-3 outline-none transition focus:border-indigo-500 ${
  errors.category
    ? "border border-red-500"
    : "border border-slate-200"
}`}
        >
            

          <option value="">Select Category</option>
<option value="Electronics">Electronics</option>
<option value="Fashion">Fashion</option>
<option value="Grocery">Grocery</option>
<option value="Home">Home</option>
<option value="Others">Others</option>

          </select>
          {errors.category && (
  <p className="mt-2 text-sm text-red-500">
    {errors.category}
  </p>
)}

        </div>

        {/* Amount */}

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Amount
          </label>

          <input
            type="number"
                 name="amount"
             value={receiptData.amount}
             onChange={onInputChange}
            placeholder="₹ 0.00"
           
          className={`w-full rounded-xl bg-white px-4 py-3 outline-none transition focus:border-indigo-500 ${
  errors.amount
    ? "border border-red-500"
    : "border border-slate-200"
}`}
            /> 
            {errors.amount && (
  <p className="mt-2 text-sm text-red-500">
    {errors.amount}
  </p>
)}
        </div>

      </div>

      {/* Payment Method */}

      <div className="mt-6">

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Payment Method
        </label>

        <select

  name="paymentMethod"
  value={receiptData.paymentMethod}
  onChange={onInputChange}


         className={`w-full rounded-xl bg-white px-4 py-3 outline-none transition focus:border-indigo-500 ${
  errors.paymentMethod
    ? "border border-red-500"
    : "border border-slate-200"
}`}
        >
            {errors.paymentMethod && (
  <p className="mt-2 text-sm text-red-500">
    {errors.paymentMethod}
  </p>
)}

         <option value="">Select Payment Method</option>
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