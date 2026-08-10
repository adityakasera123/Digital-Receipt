import Card from '../ui/Card';

const NotesField = ({ receiptData, onInputChange }) => {
  return (
    <Card className='transition-theme'>
      <div className='mb-6'>
        <h2 className='text-xl font-semibold text-primary'>
          Additional Notes
        </h2>

        <p className='mt-1 text-sm text-secondary'>
          Add any extra information related to this purchase.
        </p>
      </div>

      <textarea
        name='notes'
        value={receiptData.notes}
        onChange={onInputChange}
        rows={5}
        placeholder='Example: Purchased during sale, gift for someone, warranty card stored separately...'
        className='input-surface w-full resize-none rounded-xl px-4 py-3 outline-none transition-theme'
      />
    </Card>
  );
};

export default NotesField;