import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { getReceipts } from "../services/receiptService";

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
  const { user } = useContext(AuthContext);

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
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const receipts = await getReceipts(user.uid);

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
  }, [user]);

  return {
    loading,
    analytics,
  };
};

export default useAnalytics;