import {
  Receipt,
  IndianRupee,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

import AnalyticsCard from "./AnalyticsCard";

const summaryData = [
  {
    title: "Total Expenses",
    value: "₹54,280",
    subtitle: "Overall spending",
    icon: <IndianRupee size={26} />,
    trend: "+18%",
  },
  {
    title: "Total Receipts",
    value: "28",
    subtitle: "Stored receipts",
    icon: <Receipt size={26} />,
    trend: "+5",
  },
  {
    title: "Average Purchase",
    value: "₹1,938",
    subtitle: "Per receipt",
    icon: <BarChart3 size={26} />,
    trend: "+8%",
  },
  {
    title: "Active Warranty",
    value: "12",
    subtitle: "Products covered",
    icon: <ShieldCheck size={26} />,
    trend: "100%",
  },
];

const AnalyticsSummaryGrid = () => {
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