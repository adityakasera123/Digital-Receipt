import { Pencil, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WarrantyActions = ({ warranty }) => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-wrap justify-end gap-4">

      <button
        onClick={() => navigate("/warranty")}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <button
        onClick={() => navigate(`/warranty/edit/${warranty.id}`)}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
      >
        <Pencil size={18} />
        Edit Warranty
      </button>

    </section>
  );
};

export default WarrantyActions;