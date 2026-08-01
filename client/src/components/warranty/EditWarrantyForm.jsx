import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { updateWarranty } from "../../services/warrantyService";

const EditWarrantyForm = ({ warranty }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    warrantyDuration: "",
    expiryDate: "",
  });

  // Prefill form when warranty data is loaded
  useEffect(() => {
    if (warranty) {
      setFormData({
        warrantyDuration: warranty.warrantyDuration || "",
        expiryDate: warranty.expiryDate || "",
      });
    }
  }, [warranty]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateWarranty(warranty.id, {
        ...warranty,
        warrantyDuration: formData.warrantyDuration,
        expiryDate: formData.expiryDate,
      });

      toast.success("Warranty updated successfully!");

      navigate("/warranty");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update warranty.");
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Edit Warranty
        </h1>

        <p className="mt-2 text-slate-500">
          Update warranty information without changing the original receipt details.
        </p>
      </div>

      {/* Form */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Product */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Product Name
          </label>

          <input
            type="text"
            value={warranty?.productName || ""}
            readOnly
            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3"
          />
        </div>

        {/* Store */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Store Name
          </label>

          <input
            type="text"
            value={warranty?.storeName || ""}
            readOnly
            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>

          <input
            type="text"
            value={warranty?.category || ""}
            readOnly
            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3"
          />
        </div>

        {/* Purchase Date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Purchase Date
          </label>

          <input
            type="text"
            value={warranty?.purchaseDate || ""}
            readOnly
            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3"
          />
        </div>

        {/* Warranty Duration */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Warranty Duration
          </label>

          <select
            name="warrantyDuration"
            value={formData.warrantyDuration}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          >
            <option value="">Select Duration</option>
            <option value="3 Months">3 Months</option>
            <option value="6 Months">6 Months</option>
            <option value="12 Months">12 Months</option>
            <option value="24 Months">24 Months</option>
            <option value="36 Months">36 Months</option>
          </select>
        </div>

        {/* Expiry Date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Warranty Expiry Date
          </label>

          <input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </div>

      </div>

      {/* Button */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>

    </section>
  );
};

export default EditWarrantyForm;