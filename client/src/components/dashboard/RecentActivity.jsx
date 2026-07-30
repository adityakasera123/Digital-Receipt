import {
  Receipt,
  ShieldCheck,
  Pencil,
  Clock,
} from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Receipt Uploaded",
    subtitle: "iPhone 15 Pro",
    time: "2 min ago",
    icon: Receipt,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    title: "Warranty Added",
    subtitle: "HP Laptop",
    time: "15 min ago",
    icon: ShieldCheck,
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 3,
    title: "Receipt Updated",
    subtitle: "Boat Airdopes",
    time: "Yesterday",
    icon: Pencil,
    color: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: 4,
    title: "Warranty Expiring Soon",
    subtitle: "LG Smart TV",
    time: "2 days ago",
    icon: Clock,
    color: "bg-red-100",
    iconColor: "text-red-600",
  },
];

function RecentActivity() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Recent Activity
      </h2>

      <div className="mt-6 space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${activity.color}`}
              >
                <activity.icon
                  size={20}
                  className={activity.iconColor}
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  {activity.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {activity.subtitle}
                </p>
              </div>
            </div>

            <span className="text-sm text-gray-500">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;