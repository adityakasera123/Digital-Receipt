import { useEffect, useState } from "react";

import { getAllReceipts } from "../services/analyticsService";

import {
  calculateTotalExpenses,
  calculateTotalReceipts,
  calculateAveragePurchase,
  calculateHighestPurchase,
  calculateLowestPurchase,
  calculateMonthlyExpenses,
  calculateCategorySpending,
} from "../utils/analyticsHelpers";

const useAnalytics = () => {
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState({
    receipts: [],
    totalExpenses: 0,
    totalReceipts: 0,
    averagePurchase: 0,
    highestPurchase: null,
    lowestPurchase: null,
    monthlyExpenses: [],
    categorySpending: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const receipts = await getAllReceipts();

        const monthlyExpenses =
          calculateMonthlyExpenses(receipts);

        const categorySpending =
          calculateCategorySpending(receipts);

        setAnalytics({
          receipts,

          totalExpenses:
            calculateTotalExpenses(receipts),

          totalReceipts:
            calculateTotalReceipts(receipts),

          averagePurchase:
            calculateAveragePurchase(receipts),

          highestPurchase:
            calculateHighestPurchase(receipts),

          lowestPurchase:
            calculateLowestPurchase(receipts),

          monthlyExpenses,

          categorySpending,
        });
      } catch (error) {
        console.error("Analytics Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return {
    loading,
    analytics,
  };
};

export default useAnalytics;