import Card from '../ui/Card';
import { Box, Sparkles } from 'lucide-react';

const ReceiptForm = ({
  receiptData,
  onInputChange,
  errors,
  ocrData,
}) => {
  // ==========================================
  // MULTI PRODUCT DETECTION
  // ==========================================

  const products = Array.isArray(receiptData?.products)
    ? receiptData.products
    : [];

  const isMultiProduct = products.length > 1;

  // ==========================================
  // DETECTION
  // ==========================================

  const isDetected = (field) => {
    if (field === 'products') {
      return Boolean(
        ocrData?.products &&
          Array.isArray(ocrData.products) &&
          ocrData.products.length > 0
      );
    }

    return Boolean(ocrData?.[field]);
  };

  const detectedInputClass = (field) =>
    isDetected(field)
      ? 'border-blue-400 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/20'
      : '';

  // ==========================================
  // LABEL
  // ==========================================

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

  // ==========================================
  // PRODUCT CARD
  // ==========================================

  const ProductCard = ({ product, index }) => {
    const productName =
      product?.productName ||
      product?.name ||
      product?.description ||
      '';

    const category =
      product?.category ||
      'Others';

    return (
      <div
        className='rounded-2xl border border-default bg-surface px-5 py-4 transition-theme'
      >
        <div className='flex items-start gap-4'>
          {/* Number */}
          <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-secondary text-sm font-semibold text-secondary'>
            {index + 1}
          </div>

          {/* Product information */}
          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-medium text-primary'>
              {productName || 'Unnamed Product'}
            </p>

            <p className='mt-1 text-xs text-secondary'>
              {category}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className='transition-theme'>
      {/* ======================================
          HEADER
      ====================================== */}

      <div className='mb-8'>
        <h2 className='text-xl font-semibold text-primary'>
          Receipt Information
        </h2>

        <p className='mt-1 text-sm text-secondary'>
          Review the extracted receipt details and edit any field before saving.
        </p>
      </div>

      {/* ======================================
          MULTI PRODUCT LAYOUT
      ====================================== */}

      {isMultiProduct ? (
        <>
          {/* ==================================
              PRODUCTS
          ================================== */}

          <div className='mb-8'>
            <div className='mb-4 flex items-center justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <h3 className='text-base font-semibold text-primary'>
                  Products
                </h3>

                <span className='text-sm font-medium text-secondary'>
                  {products.length}
                </span>
              </div>

              {isDetected('products') && (
                <span className='inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300'>
                  <Sparkles size={12} />
                  Detected
                </span>
              )}
            </div>

            {/* Product Grid */}
            <div className='grid gap-4 md:grid-cols-2'>
              {products.map((product, index) => (
                <ProductCard
                  key={`${product?.productName || product?.name || 'product'}-${index}`}
                  product={product}
                  index={index}
                />
              ))}
            </div>

            {/* Product count */}
            <div className='mt-4 flex items-center gap-2 text-sm text-secondary'>
              <Box size={16} />

              <span>
                {products.length} products detected from this receipt
              </span>
            </div>
          </div>

          {/* ==================================
              RECEIPT META DATA
          ================================== */}

          <div className='grid gap-6 md:grid-cols-2'>
            {/* Store Name */}
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

            {/* Purchase Date */}
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

            {/* Category */}
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

                <option value='Multiple'>
                  Multiple
                </option>

                <option value='Others'>
                  Others
                </option>
              </select>

              {errors.category && (
                <p className='mt-2 text-sm text-red-500'>
                  {errors.category}
                </p>
              )}
            </div>

            {/* Amount */}
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

            {/* Payment Method */}
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
        </>
      ) : (
        /* ====================================
           SINGLE PRODUCT LAYOUT
        ==================================== */

        <div className='grid gap-6 md:grid-cols-2'>
          {/* Product Name */}
          <div>
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
          </div>

          {/* Store Name */}
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

          {/* Purchase Date */}
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

          {/* Category */}
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

              <option value='Multiple'>
                Multiple
              </option>

              <option value='Others'>
                Others
              </option>
            </select>

            {errors.category && (
              <p className='mt-2 text-sm text-red-500'>
                {errors.category}
              </p>
            )}
          </div>

          {/* Amount */}
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

          {/* Payment Method */}
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
      )}
    </Card>
  );
};

export default ReceiptForm;