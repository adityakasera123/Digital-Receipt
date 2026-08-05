import AnalyticsSection from "./AnalyticsSection";
import CategoryProgress from "./CategoryProgress";

const CategorySpending = ({ categories = [] }) => {
  return (
    <AnalyticsSection
      title="Category Spending"
      description="See where your money is spent."
    >
      {categories.length === 0 ? (
        <div className="flex h-60 items-center justify-center rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-500">
            No spending data available.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <CategoryProgress
              key={category.title}
              title={category.title}
              amount={category.amount}
              percentage={category.percentage}
              color={category.color}
            />
          ))}
        </div>
      )}
    </AnalyticsSection>
  );
};

export default CategorySpending;