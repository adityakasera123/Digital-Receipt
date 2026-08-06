import { Receipt } from "lucide-react";

import AnalyticsSection from "./AnalyticsSection";
import ActivityItem from "./ActivityItem";

const RecentActivity = ({ receipts = [] }) => {
  const recentReceipts = receipts.slice(0, 5);

  return (
    <AnalyticsSection
      title="Recent Activity"
      description="Latest receipt activity."
      action={
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          View All →
        </button>
      }
    >
      {recentReceipts.length === 0 ? (
        <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-500">
            No recent activity found.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentReceipts.map((receipt) => (
            <ActivityItem
              key={receipt.id}
              id={receipt.id}
              icon={<Receipt size={20} />}
              title={receipt.productName || "Untitled Product"}
              subtitle={`${receipt.storeName || "Unknown Store"} • ₹${Number(
                receipt.amount || 0
              ).toLocaleString("en-IN")}`}
              time={receipt.purchaseDate || "--"}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
          ))}
        </div>
      )}
    </AnalyticsSection>
  );
};

export default RecentActivity;