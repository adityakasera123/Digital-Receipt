const UploadActions = ({ onSave, mode = 'add' }) => {
  return (
    <div className='flex items-center justify-end gap-3 pt-2'>
      <button
        type='button'
        className='button-secondary rounded-xl px-6 py-3 text-sm font-medium transition-theme'
      >
        Cancel
      </button>

      <button
        type='button'
        onClick={onSave}
        className='button-primary rounded-xl px-6 py-3 text-sm font-medium transition-theme'
      >
        {mode === 'edit' ? 'Update Receipt' : 'Save Receipt'}
      </button>
    </div>
  );
};

export default UploadActions;