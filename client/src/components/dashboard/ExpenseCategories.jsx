import {
  Laptop,
  UtensilsCrossed,
  Plane,
  Package,
} from "lucide-react";

function ExpenseCategories() {
  const categories = [
    {
      id: 1,
      name: "Electronics",
      amount: "₹80,000",
      percentage: 65,
      color: "bg-blue-600",
      icon: Laptop,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      name: "Food",
      amount: "₹20,000",
      percentage: 20,
      color: "bg-green-500",
      icon: UtensilsCrossed,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: 3,
      name: "Travel",
      amount: "₹10,000",
      percentage: 10,
      color: "bg-orange-500",
      icon: Plane,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: 4,
      name: "Others",
      amount: "₹5,000",
      percentage: 5,
      color: "bg-gray-500",
      icon: Package,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
  ];

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Expense Categories
      </h2>

      <div className="mt-6 space-y-6">
        {categories.map((category) => (
          <div key={category.id}>
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${category.iconBg}`}
                >
                  <category.icon
                    size={18}
                    className={category.iconColor}
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {category.amount}
                  </p>
                </div>
              </div>

              <span className="text-sm font-medium text-gray-500">
                {category.percentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2.5 w-full rounded-full bg-gray-100">
              <div
                className={`h-2.5 rounded-full ${category.color} transition-all duration-500`}
                style={{
                  width: `${category.percentage}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseCategories;