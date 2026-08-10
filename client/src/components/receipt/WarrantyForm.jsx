import Card from '../ui/Card';

const WarrantyForm = ({ receiptData, onInputChange, errors }) => {
  return (
    <Card className='transition-theme'>
      {/* Header */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold text-primary'>
          Warranty Information
        </h2>

        <p className='mt-1 text-sm text-secondary'>
          Add warranty details to receive reminders before your warranty expires.
        </p>
      </div>

      {/* Warranty Available */}
      <div className='mb-8 flex items-center gap-3'>
        <input
          id='hasWarranty'
          type='checkbox'
          name='hasWarranty'
          checked={receiptData.hasWarranty}
          onChange={onInputChange}
          className='h-5 w-5 rounded border-default accent-black'
        />

        <label
          htmlFor='hasWarranty'
          className='text-sm font-medium text-primary'
        >
          This product has warranty
        </label>
      </div>

      {/* Fields */}
      <div className='grid gap-6 md:grid-cols-2'>
        <div>
          <label className='mb-2 block text-sm font-medium text-primary'>
            Warranty Duration
          </label>

          <select
            name='warrantyDuration'
            value={receiptData.warrantyDuration}
            onChange={onInputChange}
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${
              errors.warrantyDuration ? 'border-red-500' : ''
            }`}
          >
            <option value=''>Select Duration</option>
            <option>3 Months</option>
            <option>6 Months</option>
            <option>1 Year</option>
            <option>2 Years</option>
            <option>3 Years</option>
            <option>5 Years</option>
          </select>

          {errors.warrantyDuration && (
            <p className='mt-2 text-sm text-red-500'>
              {errors.warrantyDuration}
            </p>
          )}
        </div>

        <div>
          <label className='mb-2 block text-sm font-medium text-primary'>
            Warranty Expiry Date
          </label>

          <input
            type='date'
            name='warrantyExpiry'
            value={receiptData.warrantyExpiry}
            onChange={onInputChange}
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${
              errors.warrantyExpiry ? 'border-red-500' : ''
            }`}
          />

          {errors.warrantyExpiry && (
            <p className='mt-2 text-sm text-red-500'>
              {errors.warrantyExpiry}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WarrantyForm;