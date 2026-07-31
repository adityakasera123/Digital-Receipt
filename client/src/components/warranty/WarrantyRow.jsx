import { Eye, Pencil, Trash2 } from "lucide-react";
import WarrantyStatusBadge from "./WarrantyStatusBadge";

const WarrantyRow = ({
  product,
  brand,
  purchaseDate,
  expiryDate,
  status,
}) => {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition">
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-slate-900">{product}</p>
          <p className="text-sm text-slate-500">{brand}</p>
        </div>
      </td>

      <td className="px-6 py-4">{purchaseDate}</td>

      <td className="px-6 py-4">{expiryDate}</td>

      <td className="px-6 py-4">
        <WarrantyStatusBadge status={status} />
      </td>

      <td className="px-6 py-4">
        <div className="flex gap-3">
          <button className="text-slate-500 hover:text-indigo-600">
            <Eye size={18} />
          </button>

          <button className="text-slate-500 hover:text-amber-600">
            <Pencil size={18} />
          </button>

          <button className="text-slate-500 hover:text-red-600">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default WarrantyRow;