import {
  Upload,
  ShieldPlus,
  Receipt,
  BarChart3,
  ChevronRight,
} from "lucide-react";
const actions = [
  {
    id: 1,
    title: "Upload Receipt",
    subtitle: "Add a new purchase receipt",
    icon: Upload,
  },
  {
    id: 2,
    title: "Add Warranty",
    subtitle: "Register a product warranty",
    icon: ShieldPlus,
  },
  {
    id: 3,
    title: "View Receipts",
    subtitle: "Browse all saved receipts",
    icon: Receipt,
  },
  {
    id: 4,
    title: "Analytics",
    subtitle: "View spending insights",
    icon: BarChart3,
  },
];
function QuickActions() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Quick Actions
      </h2>

      <div className="mt-6 space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            className="group flex w-full items-center justify-between rounded-2xl border border-gray-100 p-4 text-left transition-all duration-300 hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 transition group-hover:bg-blue-100">
                <action.icon
                  size={20}
                  className="text-gray-700 group-hover:text-blue-600"
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  {action.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {action.subtitle}
                </p>
              </div>
            </div>

            <ChevronRight
              size={18}
              className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;