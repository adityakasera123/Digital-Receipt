import AnalyticsSection from "./AnalyticsSection";
import CategoryProgress from "./CategoryProgress";
import AnalyticsEmptyState from "./AnalyticsEmptyState";

const CategorySpending = ({ categories = [] }) => {
  return (
    <AnalyticsSection
      title="Category Spending"
      description="See where your money is spent."
    >
      {categories.length === 0 ? (
        <AnalyticsEmptyState
          title="No Category Data"
          description="Upload receipts to see category-wise spending insights."
        />
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