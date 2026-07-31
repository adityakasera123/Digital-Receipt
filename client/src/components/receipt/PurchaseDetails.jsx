import {
  Hash,
  FileText,
  Building2,
  ShoppingBag,
  CalendarClock,
  StickyNote,
} from "lucide-react";

function PurchaseDetails({ receipt }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Purchase Details
      </h2>

      <p className="mt-2 text-slate-500">
        Additional information about this purchase.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-6">

        <InfoItem
          icon={<Hash size={20} />}
          label="Order ID"
          value={receipt.orderId}
        />

        <InfoItem
          icon={<FileText size={20} />}
          label="Invoice Number"
          value={receipt.invoiceNumber}
        />

        <InfoItem
          icon={<Building2 size={20} />}
          label="Brand"
          value={receipt.brand}
        />

        <InfoItem
          icon={<ShoppingBag size={20} />}
          label="Seller"
          value={receipt.seller}
        />

       <InfoItem
  icon={<CalendarClock size={20} />}
  label="Warranty Ends"
  value={receipt.warrantyExpiry}
/>

        <InfoItem
          icon={<StickyNote size={20} />}
          label="Notes"
          value={receipt.notes}
        />

      </div>

    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-sm">{label}</span>
      </div>

      <p className="mt-3 font-semibold text-slate-900">
        {value || "—"}
      </p>

    </div>
  );
}

export default PurchaseDetails;