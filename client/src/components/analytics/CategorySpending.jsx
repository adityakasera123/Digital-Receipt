import AnalyticsSection from "./AnalyticsSection";
import CategoryProgress from "./CategoryProgress";

const categories = [
  {
    title: "Electronics",
    amount: 18540,
    percentage: 46,
    color: "bg-blue-600",
  },
  {
    title: "Food",
    amount: 8250,
    percentage: 24,
    color: "bg-emerald-600",
  },
  {
    title: "Fashion",
    amount: 5420,
    percentage: 16,
    color: "bg-amber-500",
  },
  {
    title: "Others",
    amount: 3200,
    percentage: 14,
    color: "bg-violet-600",
  },
];

const CategorySpending = () => {
  return (
    <AnalyticsSection
      title="Category Spending"
      description="See where your money is spent."
    >
      <div className="space-y-8">
        {categories.map((category) => (
          <CategoryProgress
            key={category.title}
            {...category}
          />
        ))}
      </div>
    </AnalyticsSection>
  );
};

export default CategorySpending;