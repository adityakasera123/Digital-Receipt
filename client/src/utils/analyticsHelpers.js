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
export const calculateMonthlyExpenses = (receipts = []) => {
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

    const monthIndex = date.getMonth();

    monthlyData[monthIndex].amount += Number(receipt.amount) || 0;
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