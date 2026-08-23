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
  calculateYearlySpending,
  calculateStoreSpending,
  calculateTopCategory,
  calculateTopStore,
  calculateMonthlyComparison,
  calculateSpendingTrend,
  calculateSpendingInsights,
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
    yearlySpending: [],

    categorySpending: [],
    storeSpending: [],

    topCategory: null,
    topStore: null,

    monthlyComparison: null,
    spendingTrend: null,
    spendingInsights: [],
  });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const receipts = await getReceipts(user.uid);

        // -----------------------------------------
        // BASIC ANALYTICS
        // -----------------------------------------

        const totalExpenses =
          calculateTotalExpenses(receipts);

        const totalReceipts =
          calculateTotalReceipts(receipts);

        const averagePurchase =
          calculateAveragePurchase(receipts);

        const highestPurchase =
          calculateHighestPurchase(receipts);

        const lowestPurchase =
          calculateLowestPurchase(receipts);

        // -----------------------------------------
        // SPENDING ANALYTICS
        // -----------------------------------------

        const monthlyExpenses =
          calculateMonthlyExpenses(receipts);

        const yearlySpending =
          calculateYearlySpending(receipts);

        const categorySpending =
          calculateCategorySpending(receipts);

        const storeSpending =
          calculateStoreSpending(receipts);

        // -----------------------------------------
        // TOP CATEGORY / TOP STORE
        // -----------------------------------------

     const topCategory =
  calculateTopCategory(receipts);

const topStore =
  calculateTopStore(receipts);

        // -----------------------------------------
        // MONTHLY COMPARISON
        // -----------------------------------------

        const monthlyComparison =
          calculateMonthlyComparison(receipts);

        // -----------------------------------------
        // SPENDING TREND
        // -----------------------------------------

        const spendingTrend =
          calculateSpendingTrend(monthlyComparison);

        // -----------------------------------------
        // SPENDING INSIGHTS
        // -----------------------------------------

        const spendingInsights =
          calculateSpendingInsights({
            totalExpenses,
            highestPurchase,
            topCategory,
            topStore,
            monthlyComparison,
          });

        // -----------------------------------------
        // FINAL ANALYTICS STATE
        // -----------------------------------------

        setAnalytics({
          receipts,

          totalExpenses,
          totalReceipts,
          averagePurchase,
          highestPurchase,
          lowestPurchase,

          monthlyExpenses,
          yearlySpending,

          categorySpending,
          storeSpending,

          topCategory,
          topStore,

          monthlyComparison,
          spendingTrend,
          spendingInsights,
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