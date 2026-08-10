import Card from '../ui/Card';

const ReceiptForm = ({ receiptData, onInputChange, errors }) => {
  return (
    <Card className='transition-theme'>
      {/* Header */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold text-primary'>
          Receipt Information
        </h2>

        <p className='mt-1 text-sm text-secondary'>
          Enter your purchase details. Later, OCR can automatically fill these
          fields.
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Product Name */}
        <div>
          <label className='mb-2 block text-sm font-medium text-primary'>
            Product Name
          </label>

          <input
            type='text'
            name='productName'
            value={receiptData.productName}
            onChange={onInputChange}
            placeholder='iPhone 16 Pro, AirPods Pro...'
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${
              errors.productName ? 'border-red-500' : ''
            }`}
          />

          {errors.productName && (
            <p className='mt-2 text-sm text-red-500'>{errors.productName}</p>
          )}
        </div>

        {/* Store Name */}
        <div>
          <label className='mb-2 block text-sm font-medium text-primary'>
            Store Name
          </label>

          <input
            type='text'
            name='storeName'
            value={receiptData.storeName}
            onChange={onInputChange}
            placeholder='Amazon, Flipkart...'
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${
              errors.storeName ? 'border-red-500' : ''
            }`}
          />

          {errors.storeName && (
            <p className='mt-2 text-sm text-red-500'>{errors.storeName}</p>
          )}
        </div>

        {/* Purchase Date */}
        <div>
          <label className='mb-2 block text-sm font-medium text-primary'>
            Purchase Date
          </label>

          <input
            type='date'
            name='purchaseDate'
            value={receiptData.purchaseDate}
            onChange={onInputChange}
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${
              errors.purchaseDate ? 'border-red-500' : ''
            }`}
          />

          {errors.purchaseDate && (
            <p className='mt-2 text-sm text-red-500'>{errors.purchaseDate}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className='mb-2 block text-sm font-medium text-primary'>
            Category
          </label>

          <select
            name='category'
            value={receiptData.category}
            onChange={onInputChange}
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${
              errors.category ? 'border-red-500' : ''
            }`}
          >
            <option value=''>Select Category</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Home</option>
            <option>Others</option>
          </select>

          {errors.category && (
            <p className='mt-2 text-sm text-red-500'>{errors.category}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className='mb-2 block text-sm font-medium text-primary'>
            Amount
          </label>

          <input
            type='number'
            name='amount'
            value={receiptData.amount}
            onChange={onInputChange}
            placeholder='₹ 0.00'
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${
              errors.amount ? 'border-red-500' : ''
            }`}
          />

          {errors.amount && (
            <p className='mt-2 text-sm text-red-500'>{errors.amount}</p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className='mb-2 block text-sm font-medium text-primary'>
            Payment Method
          </label>

          <select
            name='paymentMethod'
            value={receiptData.paymentMethod}
            onChange={onInputChange}
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${
              errors.paymentMethod ? 'border-red-500' : ''
            }`}
          >
            <option value=''>Select Payment Method</option>
            <option>UPI</option>
            <option>Credit Card</option>
            <option>Debit Card</option>
            <option>Cash</option>
            <option>Net Banking</option>
          </select>

          {errors.paymentMethod && (
            <p className='mt-2 text-sm text-red-500'>
              {errors.paymentMethod}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ReceiptForm;