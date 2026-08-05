import {
  Receipt,
  ShieldCheck,
  Pencil,
} from "lucide-react";

import AnalyticsSection from "./AnalyticsSection";
import ActivityItem from "./ActivityItem";

const activities = [
  {
    icon: <Receipt size={20} />,
    title: "Receipt Uploaded",
    subtitle: "iPhone 15 Pro",
    time: "2 min ago",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Warranty Added",
    subtitle: "HP Laptop",
    time: "15 min ago",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: <Pencil size={20} />,
    title: "Receipt Updated",
    subtitle: "Boat Airdopes",
    time: "Yesterday",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

const RecentActivity = () => {
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
      <div className="space-y-3">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.title}
            {...activity}
          />
        ))}
      </div>
    </AnalyticsSection>
  );
};

export default RecentActivity;