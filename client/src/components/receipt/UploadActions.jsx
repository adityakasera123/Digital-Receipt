const UploadActions = ({
  onSave,
  mode = "add",
}) => {
  return (
    <section className="flex items-center justify-end gap-4">
      <button
        type="button"
        className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Cancel
      </button>

      <button
        type="submit"
        onClick={onSave}
        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
    {mode === "edit"
  ? "Update Receipt"
  : "Save Receipt"}
      </button>
    </section>
  );
};

export default UploadActions;