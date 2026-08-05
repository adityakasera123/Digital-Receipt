import {
  Receipt,
  IndianRupee,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

import AnalyticsCard from "./AnalyticsCard";

const AnalyticsSummaryGrid = ({ analytics }) => {
  const summaryData = [
    {
      title: "Total Expenses",
      value: `₹${analytics.totalExpenses.toLocaleString("en-IN")}`,
      subtitle: "Overall spending",
      icon: <IndianRupee size={26} />,
      trend: "--",
    },
    {
      title: "Total Receipts",
      value: analytics.totalReceipts,
      subtitle: "Stored receipts",
      icon: <Receipt size={26} />,
      trend: "--",
    },
    {
      title: "Average Purchase",
      value: `₹${Math.round(
        analytics.averagePurchase
      ).toLocaleString("en-IN")}`,
      subtitle: "Per receipt",
      icon: <BarChart3 size={26} />,
      trend: "--",
    },
    {
      title: "Highest Purchase",
      value: analytics.highestPurchase
        ? `₹${Number(
            analytics.highestPurchase.amount
          ).toLocaleString("en-IN")}`
        : "₹0",
      subtitle: analytics.highestPurchase?.productName || "No data",
      icon: <ShieldCheck size={26} />,
      trend: "--",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {summaryData.map((card) => (
        <AnalyticsCard
          key={card.title}
          {...card}
        />
      ))}
    </div>
  );
};

export default AnalyticsSummaryGrid;