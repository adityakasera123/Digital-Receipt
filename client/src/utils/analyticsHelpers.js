/**
 * -----------------------------------------
 * TOTAL EXPENSES
 * -----------------------------------------
 */
export const calculateTotalExpenses = (receipts = []) => {
  return receipts.reduce((total, receipt) => {
    return total + (Number(receipt.amount) || 0);
  }, 0);
};

/**
 * -----------------------------------------
 * TOTAL RECEIPTS
 * -----------------------------------------
 */
export const calculateTotalReceipts = (receipts = []) => {
  return receipts.length;
};

/**
 * -----------------------------------------
 * AVERAGE PURCHASE
 * -----------------------------------------
 */
export const calculateAveragePurchase = (receipts = []) => {
  if (!receipts.length) return 0;

  return Math.round(
    calculateTotalExpenses(receipts) / receipts.length
  );
};

/**
 * -----------------------------------------
 * HIGHEST PURCHASE
 * -----------------------------------------
 */
export const calculateHighestPurchase = (receipts = []) => {
  if (!receipts.length) return null;

  return receipts.reduce((highest, current) =>
    Number(current.amount) > Number(highest.amount)
      ? current
      : highest
  );
};

/**
 * -----------------------------------------
 * LOWEST PURCHASE
 * -----------------------------------------
 */
export const calculateLowestPurchase = (receipts = []) => {
  if (!receipts.length) return null;

  return receipts.reduce((lowest, current) =>
    Number(current.amount) < Number(lowest.amount)
      ? current
      : lowest
  );
};

/**
 * -----------------------------------------
 * MONTHLY EXPENSES
 * -----------------------------------------
 */
/**
 * -----------------------------------------
 * MONTHLY EXPENSES
 * -----------------------------------------
 */
export const calculateMonthlyExpenses = (
  receipts = [],
  year = new Date().getFullYear()
) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = months.map((month) => ({
    month,
    amount: 0,
  }));

  receipts.forEach((receipt) => {
    if (!receipt.purchaseDate) return;

    let date;

    // Firestore Timestamp
    if (receipt.purchaseDate?.toDate) {
      date = receipt.purchaseDate.toDate();
    }
    // Date String
    else {
      date = new Date(receipt.purchaseDate);
    }

    if (isNaN(date.getTime())) return;

    // Ignore receipts from other years
    if (date.getFullYear() !== year) return;

    const monthIndex = date.getMonth();

    monthlyData[monthIndex].amount +=
      Number(receipt.amount) || 0;
  });

  return monthlyData;
};
/**
 * -----------------------------------------
 * CATEGORY SPENDING
 * -----------------------------------------
 */
export const calculateCategorySpending = (receipts = []) => {
  const totalExpenses = calculateTotalExpenses(receipts);

  if (!receipts.length || totalExpenses === 0) {
    return [];
  }

  const grouped = {};

  receipts.forEach((receipt) => {
    const category = receipt.category || "Others";
    const amount = Number(receipt.amount) || 0;

    grouped[category] = (grouped[category] || 0) + amount;
  });

  const colors = [
    "bg-blue-600",
    "bg-emerald-600",
    "bg-amber-500",
    "bg-violet-600",
    "bg-pink-600",
    "bg-cyan-600",
    "bg-indigo-600",
  ];

  return Object.entries(grouped)
    .map(([title, amount], index) => ({
      title,
      amount,
      percentage: Math.round((amount / totalExpenses) * 100),
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.amount - a.amount);
};

/**
 * -----------------------------------------
 * TOP SPENDING CATEGORY
 * -----------------------------------------
 */
export const calculateTopCategory = (receipts = []) => {
  const categorySpending = calculateCategorySpending(receipts);

  if (!categorySpending.length) {
    return null;
  }

  return categorySpending[0];
};

/**
 * -----------------------------------------
 * YEARLY SPENDING
 * -----------------------------------------
 */
export const calculateYearlySpending = (receipts = []) => {
  const yearlyData = {};

  receipts.forEach((receipt) => {
    if (!receipt.purchaseDate) return;

    let date;

    // Firestore Timestamp
    if (receipt.purchaseDate?.toDate) {
      date = receipt.purchaseDate.toDate();
    }
    // Date String
    else {
      date = new Date(receipt.purchaseDate);
    }

    if (isNaN(date.getTime())) return;

    const year = date.getFullYear();
    const amount = Number(receipt.amount) || 0;

    yearlyData[year] = (yearlyData[year] || 0) + amount;
  });

  return Object.entries(yearlyData)
    .map(([year, amount]) => ({
      year: Number(year),
      amount,
    }))
    .sort((a, b) => a.year - b.year);
};

/**
 * -----------------------------------------
 * STORE SPENDING
 * -----------------------------------------
 */
export const calculateStoreSpending = (receipts = []) => {
  const grouped = {};

  receipts.forEach((receipt) => {
    const storeName = receipt.storeName?.trim() || "Unknown Store";
    const amount = Number(receipt.amount) || 0;

    grouped[storeName] = (grouped[storeName] || 0) + amount;
  });

  return Object.entries(grouped)
    .map(([storeName, amount]) => ({
      storeName,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);
};

/**
 * -----------------------------------------
 * TOP SPENDING STORE
 * -----------------------------------------
 */
export const calculateTopStore = (receipts = []) => {
  const storeSpending = calculateStoreSpending(receipts);

  if (!storeSpending.length) {
    return null;
  }

  return storeSpending[0];
};

/**
 * -----------------------------------------
 * MONTHLY COMPARISON
 * -----------------------------------------
 */
export const calculateMonthlyComparison = (receipts = []) => {
  const now = new Date();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Previous month
  const previousMonthDate = new Date(
    currentYear,
    currentMonth - 1,
    1
  );

  const previousYear = previousMonthDate.getFullYear();
  const previousMonth = previousMonthDate.getMonth();

  let currentMonthTotal = 0;
  let previousMonthTotal = 0;

  receipts.forEach((receipt) => {
    if (!receipt.purchaseDate) return;

    let date;

    // Firestore Timestamp
    if (receipt.purchaseDate?.toDate) {
      date = receipt.purchaseDate.toDate();
    }
    // Date String
    else {
      date = new Date(receipt.purchaseDate);
    }

    if (isNaN(date.getTime())) return;

    const amount = Number(receipt.amount) || 0;

    if (
      date.getFullYear() === currentYear &&
      date.getMonth() === currentMonth
    ) {
      currentMonthTotal += amount;
    }

    if (
      date.getFullYear() === previousYear &&
      date.getMonth() === previousMonth
    ) {
      previousMonthTotal += amount;
    }
  });

  let percentageChange = 0;

  if (previousMonthTotal > 0) {
    percentageChange = Math.round(
      ((currentMonthTotal - previousMonthTotal) /
        previousMonthTotal) *
        100
    );
  }

  let trend = 'stable';

  if (percentageChange > 0) {
    trend = 'increase';
  } else if (percentageChange < 0) {
    trend = 'decrease';
  }

  return {
    currentMonth: {
      year: currentYear,
      month: currentMonth,
      amount: currentMonthTotal,
    },

    previousMonth: {
      year: previousYear,
      month: previousMonth,
      amount: previousMonthTotal,
    },

    difference:
      currentMonthTotal - previousMonthTotal,

    percentageChange,

    trend,
  };
};

/**
 * -----------------------------------------
 * SPENDING TREND
 * -----------------------------------------
 */
export const calculateSpendingTrend = (monthlyComparison) => {
  if (!monthlyComparison) {
    return {
      trend: "no-data",
      percentageChange: 0,
      difference: 0,
    };
  }

  const {
    currentMonth,
    previousMonth,
    percentageChange,
    difference,
  } = monthlyComparison;

  // Cannot calculate a meaningful trend
  // when there is no previous-month spending.
  if (!previousMonth || previousMonth.amount === 0) {
    return {
      trend: "no-data",
      percentageChange: 0,
      difference: difference || 0,
    };
  }

  let trend = "stable";

  if (percentageChange > 0) {
    trend = "increase";
  } else if (percentageChange < 0) {
    trend = "decrease";
  }

  return {
    trend,
    percentageChange,
    difference,
  };
};

/**
 * -----------------------------------------
 * SPENDING INSIGHTS
 * -----------------------------------------
 */
export const calculateSpendingInsights = ({
  totalExpenses = 0,
  highestPurchase = null,
  topCategory = null,
  topStore = null,
  monthlyComparison = null,
} = {}) => {
  const insights = [];

  // Highest purchase
  if (highestPurchase) {
    insights.push({
      type: "highest-purchase",
      title: "Highest Purchase",
      message: `Your highest purchase was ₹${Number(
        highestPurchase.amount || 0
      ).toLocaleString("en-IN")}.`,
    });
  }

  // Top category
  if (topCategory) {
    insights.push({
      type: "top-category",
      title: "Top Category",
      message: `${topCategory.title} is your highest spending category.`,
    });
  }

  // Top store
  if (topStore) {
    insights.push({
      type: "top-store",
      title: "Top Store",
      message: `${topStore.storeName} is your highest spending store.`,
    });
  }

  // Monthly comparison
  if (
    monthlyComparison?.previousMonth?.amount > 0
  ) {
    if (monthlyComparison.trend === "increase") {
      insights.push({
        type: "monthly-increase",
        title: "Spending Trend",
        message: `Your spending increased by ${Math.abs(
          monthlyComparison.percentageChange
        )}% compared with last month.`,
      });
    }

    if (monthlyComparison.trend === "decrease") {
      insights.push({
        type: "monthly-decrease",
        title: "Spending Trend",
        message: `Your spending decreased by ${Math.abs(
          monthlyComparison.percentageChange
        )}% compared with last month.`,
      });
    }

    if (monthlyComparison.trend === "stable") {
      insights.push({
        type: "monthly-stable",
        title: "Spending Trend",
        message:
          "Your spending is stable compared with last month.",
      });
    }
  }

  // Total spending
  if (totalExpenses > 0) {
    insights.push({
      type: "total-spending",
      title: "Total Spending",
      message: `You have spent ₹${Number(
        totalExpenses
      ).toLocaleString("en-IN")} in total.`,
    });
  }

  return insights;
};