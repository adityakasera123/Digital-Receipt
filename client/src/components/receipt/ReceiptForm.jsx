import Card from '../ui/Card';
import { Sparkles } from 'lucide-react';

const ReceiptForm = ({ receiptData, onInputChange, errors, ocrData }) => {
  const isDetected = (field) => Boolean(ocrData?.[field]);

  const detectedInputClass = (field) =>
    isDetected(field)
      ? 'border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/20'
      : '';

  const Label = ({ title, field }) => (
    <div className='mb-2 flex items-center justify-between gap-2'>
      <span className='text-sm font-medium text-primary'>{title}</span>

      {isDetected(field) && (
        <span className='inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300'>
          <Sparkles size={12} />
          Detected
        </span>
      )}
    </div>
  );

  return (
    <Card className='transition-theme'>
      {/* Header */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold text-primary'>
          Receipt Information
        </h2>

        <p className='mt-1 text-sm text-secondary'>
          Review the extracted receipt details and edit any field before saving.
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Product Name */}
        <div>
          <Label title='Product Name' field='productName' />

          <input
            type='text'
            name='productName'
            value={receiptData.productName}
            onChange={onInputChange}
            placeholder='iPhone 16 Pro, AirPods Pro...'
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${detectedInputClass(
              'productName'
            )} ${errors.productName ? 'border-red-500' : ''}`}
          />

          {errors.productName && (
            <p className='mt-2 text-sm text-red-500'>
              {errors.productName}
            </p>
          )}
        </div>

        {/* Store Name */}
        <div>
          <Label title='Store Name' field='storeName' />

          <input
            type='text'
            name='storeName'
            value={receiptData.storeName}
            onChange={onInputChange}
            placeholder='Amazon, Flipkart...'
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${detectedInputClass(
              'storeName'
            )} ${errors.storeName ? 'border-red-500' : ''}`}
          />

          {errors.storeName && (
            <p className='mt-2 text-sm text-red-500'>
              {errors.storeName}
            </p>
          )}
        </div>

        {/* Purchase Date */}
        <div>
          <Label title='Purchase Date' field='purchaseDate' />

          <input
            type='date'
            name='purchaseDate'
            value={receiptData.purchaseDate}
            onChange={onInputChange}
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${detectedInputClass(
              'purchaseDate'
            )} ${errors.purchaseDate ? 'border-red-500' : ''}`}
          />

          {errors.purchaseDate && (
            <p className='mt-2 text-sm text-red-500'>
              {errors.purchaseDate}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <Label title='Category' field='category' />

          <select
            name='category'
            value={receiptData.category}
            onChange={onInputChange}
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${detectedInputClass(
              'category'
            )} ${errors.category ? 'border-red-500' : ''}`}
          >
            <option value=''>Select Category</option>
            <option value='Electronics'>Electronics</option>
            <option value='Fashion'>Fashion</option>
            <option value='Skin Care'>Skin Care</option>
            <option value='Food'>Food</option>
            <option value='Travel'>Travel</option>
            <option value='Home'>Home</option>
            <option value='Others'>Others</option>
          </select>

          {errors.category && (
            <p className='mt-2 text-sm text-red-500'>
              {errors.category}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <Label title='Amount' field='amount' />

          <input
            type='number'
            name='amount'
            value={receiptData.amount}
            onChange={onInputChange}
            placeholder='₹ 0.00'
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${detectedInputClass(
              'amount'
            )} ${errors.amount ? 'border-red-500' : ''}`}
          />

          {errors.amount && (
            <p className='mt-2 text-sm text-red-500'>
              {errors.amount}
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <Label title='Payment Method' field='paymentMethod' />

          <select
            name='paymentMethod'
            value={receiptData.paymentMethod}
            onChange={onInputChange}
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${detectedInputClass(
              'paymentMethod'
            )} ${errors.paymentMethod ? 'border-red-500' : ''}`}
          >
            <option value=''>Select Payment Method</option>
            <option value='UPI'>UPI</option>
            <option value='Credit Card'>Credit Card</option>
            <option value='Debit Card'>Debit Card</option>
            <option value='Cash'>Cash</option>
            <option value='Cash on Delivery'>Cash on Delivery</option>
            <option value='Net Banking'>Net Banking</option>
            <option value='Wallet'>Wallet</option>
            <option value='Card'>Card</option>
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