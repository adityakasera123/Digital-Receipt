import {
  ShieldAlert,
  RotateCcw,
  X,
  Calendar,
  Store,
} from "lucide-react";

function UrgentReminderModal({
  isOpen,
  notification,
  onClose,
  onRemindLater,
  onViewWarranty,
}) {
  if (!isOpen || !notification) return null;

  const isReturnNotification =
    notification.type === "return_window";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div
          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
            isReturnNotification
              ? "bg-orange-100"
              : "bg-red-100"
          }`}
        >
          {isReturnNotification ? (
            <RotateCcw
              size={28}
              className="text-orange-600"
            />
          ) : (
            <ShieldAlert
              size={28}
              className="text-red-600"
            />
          )}
        </div>

        {/* Title */}
        <div className="mb-2">
          <p
            className={`text-sm font-medium ${
              isReturnNotification
                ? "text-orange-600"
                : "text-red-600"
            }`}
          >
            {isReturnNotification
              ? "Return Reminder"
              : "Urgent Reminder"}
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            {notification.title}
          </h2>
        </div>

        {/* Description */}
        <p className="mb-6 text-gray-600">
  {isReturnNotification ? (
    <>
      Your return window for {" "}
      <span className="font-semibold text-gray-900">
        {notification.productName}
      </span>{" "}
      is ending soon. Take action now before the return deadline passes.
    </>
  ) : (
    <>
      Your {" "}
      <span className="font-semibold text-gray-900">
        {notification.productName}
      </span>{" "}
      warranty is about to expire. Take action now to avoid
      missing warranty coverage.
    </>
  )}
</p>

        {/* Info Card */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <Store size={18} className="text-gray-500" />

            <div>
              <p className="text-xs text-gray-500">
                {isReturnNotification ? "Platform" : "Store"}
              </p>

              <p className="font-medium text-gray-900">
                {isReturnNotification
                  ? notification.platform || "Amazon"
                  : notification.storeName || "Apple Store"}
              </p>
            </div>
          </div>

          <div className="my-4 border-t border-gray-200" />

          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-gray-500" />

            <div>
              <p className="text-xs text-gray-500">
                {isReturnNotification
                  ? "Return Deadline"
                  : "Expiry Date"}
              </p>

              <p className="font-medium text-gray-900">
                {isReturnNotification
                  ? notification.returnEndDate
                  : notification.formattedExpiryDate}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRemindLater}
            className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Remind Later
          </button>

          <button
            onClick={onViewWarranty}
            className="flex-1 rounded-2xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-900"
          >
            {isReturnNotification
              ? "View Receipt"
              : "View Warranty"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UrgentReminderModal;