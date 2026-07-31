const NotesField = ({ receiptData, onInputChange }) => {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Additional Notes
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add any extra information related to this purchase.
        </p>
      </div>

      <textarea
 
       name="notes"
       value={receiptData.notes}
       onChange={onInputChange}

        rows={5}
        placeholder="Example: Purchased during sale, gift for someone, warranty card stored separately..."
        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500"
      />
    </section>
  );
};

export default NotesField;