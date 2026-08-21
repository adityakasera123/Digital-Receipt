import Card from '../ui/Card';
import { Sparkles, Package } from 'lucide-react';

const ReceiptForm = ({
  receiptData,
  onInputChange,
  errors,
  ocrData,
}) => {
  const products = Array.isArray(receiptData?.products)
    ? receiptData.products
    : [];

  const isMultiProduct =
    products.length > 1 ||
    receiptData?.isMultiProduct === true;

  const isDetected = (field) => Boolean(ocrData?.[field]);

  const detectedInputClass = (field) =>
    isDetected(field)
      ? 'border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/20'
      : '';

  const Label = ({ title, field }) => (
    <div className='mb-2 flex items-center justify-between gap-2'>
      <span className='text-sm font-medium text-primary'>
        {title}
      </span>

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
        {/* ==========================================
            PRODUCT / PRODUCTS
        ========================================== */}

        <div>
          {isMultiProduct ? (
            <>
              {/* Multi Product Header */}
              <div className='mb-3 flex items-center justify-between gap-3'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium text-primary'>
                    Products
                  </span>

                  <span className='inline-flex items-center rounded-full bg-surface-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary'>
                    {products.length}
                  </span>
                </div>

                {isDetected('productName') && (
                  <span className='inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300'>
                    <Sparkles size={12} />
                    Detected
                  </span>
                )}
              </div>

              {/* Multi Product List */}
              <div className='space-y-3'>
                {products.map((product, index) => (
                  <div
                    key={`${product.productName}-${index}`}
                    className='rounded-xl border border-default bg-surface-secondary p-4 transition-theme'
                  >
                    <div className='flex items-start gap-3'>
                      {/* Number */}
                      <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-xs font-semibold text-secondary'>
                        {index + 1}
                      </div>

                      {/* Product Info */}
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium text-primary'>
                          {product.productName}
                        </p>

                        {product.category && (
                          <p className='mt-1 text-xs text-secondary'>
                            {product.category}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Multi Product Info */}
              <div className='mt-3 flex items-center gap-2 text-xs text-secondary'>
                <Package size={14} />

                <span>
                  {products.length} products detected from this receipt
                </span>
              </div>

              {/* Hidden compatibility input */}
              <input
                type='hidden'
                name='productName'
                value={receiptData.productName || ''}
                readOnly
              />

              {errors.productName && (
                <p className='mt-2 text-sm text-red-500'>
                  {errors.productName}
                </p>
              )}
            </>
          ) : (
            <>
              {/* Existing Single Product UI */}
              <Label
                title='Product Name'
                field='productName'
              />

              <input
                type='text'
                name='productName'
                value={receiptData.productName}
                onChange={onInputChange}
                placeholder='iPhone 16 Pro, AirPods Pro...'
                className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${detectedInputClass(
                  'productName'
                )} ${
                  errors.productName
                    ? 'border-red-500'
                    : ''
                }`}
              />

              {errors.productName && (
                <p className='mt-2 text-sm text-red-500'>
                  {errors.productName}
                </p>
              )}
            </>
          )}
        </div>

        {/* ==========================================
            STORE NAME
        ========================================== */}

        <div>
          <Label
            title='Store Name'
            field='storeName'
          />

          <input
            type='text'
            name='storeName'
            value={receiptData.storeName}
            onChange={onInputChange}
            placeholder='Amazon, Flipkart...'
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${detectedInputClass(
              'storeName'
            )} ${
              errors.storeName
                ? 'border-red-500'
                : ''
            }`}
          />

          {errors.storeName && (
            <p className='mt-2 text-sm text-red-500'>
              {errors.storeName}
            </p>
          )}
        </div>

        {/* ==========================================
            PURCHASE DATE
        ========================================== */}

        <div>
          <Label
            title='Purchase Date'
            field='purchaseDate'
          />

          <input
            type='date'
            name='purchaseDate'
            value={receiptData.purchaseDate}
            onChange={onInputChange}
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${detectedInputClass(
              'purchaseDate'
            )} ${
              errors.purchaseDate
                ? 'border-red-500'
                : ''
            }`}
          />

          {errors.purchaseDate && (
            <p className='mt-2 text-sm text-red-500'>
              {errors.purchaseDate}
            </p>
          )}
        </div>

        {/* ==========================================
            CATEGORY
        ========================================== */}

        <div>
          <Label
            title='Category'
            field='category'
          />

          <select
            name='category'
            value={receiptData.category}
            onChange={onInputChange}
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${detectedInputClass(
              'category'
            )} ${
              errors.category
                ? 'border-red-500'
                : ''
            }`}
          >
            <option value=''>
              Select Category
            </option>

            <option value='Electronics'>
              Electronics
            </option>

            <option value='Fashion'>
              Fashion
            </option>

            <option value='Skin Care'>
              Skin Care
            </option>

            <option value='Food'>
              Food
            </option>

            <option value='Travel'>
              Travel
            </option>

            <option value='Home'>
              Home
            </option>

            <option value='Groceries'>
              Groceries
            </option>

            <option value='Personal Care'>
              Personal Care
            </option>

            <option value='Household'>
              Household
            </option>

            <option value='Others'>
              Others
            </option>

            {isMultiProduct && (
              <option value='Multiple'>
                Multiple
              </option>
            )}
          </select>

          {errors.category && (
            <p className='mt-2 text-sm text-red-500'>
              {errors.category}
            </p>
          )}
        </div>

        {/* ==========================================
            AMOUNT
        ========================================== */}

        <div>
          <Label
            title='Amount'
            field='amount'
          />

          <input
            type='number'
            name='amount'
            value={receiptData.amount}
            onChange={onInputChange}
            placeholder='₹ 0.00'
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${detectedInputClass(
              'amount'
            )} ${
              errors.amount
                ? 'border-red-500'
                : ''
            }`}
          />

          {errors.amount && (
            <p className='mt-2 text-sm text-red-500'>
              {errors.amount}
            </p>
          )}
        </div>

        {/* ==========================================
            PAYMENT METHOD
        ========================================== */}

        <div>
          <Label
            title='Payment Method'
            field='paymentMethod'
          />

          <select
            name='paymentMethod'
            value={receiptData.paymentMethod}
            onChange={onInputChange}
            className={`input-surface w-full rounded-xl px-4 py-3 outline-none transition-theme ${detectedInputClass(
              'paymentMethod'
            )} ${
              errors.paymentMethod
                ? 'border-red-500'
                : ''
            }`}
          >
            <option value=''>
              Select Payment Method
            </option>

            <option value='UPI'>
              UPI
            </option>

            <option value='Credit Card'>
              Credit Card
            </option>

            <option value='Debit Card'>
              Debit Card
            </option>

            <option value='Cash'>
              Cash
            </option>

            <option value='Cash on Delivery'>
              Cash on Delivery
            </option>

            <option value='Net Banking'>
              Net Banking
            </option>

            <option value='Wallet'>
              Wallet
            </option>

            <option value='Card'>
              Card
            </option>
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