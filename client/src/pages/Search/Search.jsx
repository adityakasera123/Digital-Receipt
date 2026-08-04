import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import SearchFilters from "../../components/search/SearchFilters";
import SearchSort from "../../components/search/SearchSort";
import SearchResults from "../../components/search/SearchResults";

import { getReceipts } from "../../services/receiptService";
import SearchSkeleton from "../../components/search/SearchSkeleton";

const Search = () => {
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [receipts, setReceipts] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  // Load Receipts
 // Load Receipts
useEffect(() => {
  const loadReceipts = async () => {
    try {
      const data = await getReceipts();
        await new Promise((resolve) => setTimeout(resolve, 1000));

      setReceipts(data);
    } catch (error) {
      console.error("Failed to load receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  loadReceipts();
}, []);

  // Read URL Query
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // Search + Filter + Sort
  useEffect(() => {
    let filtered = [...receipts];

    // Category Filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (receipt) => receipt.category === selectedCategory
      );
    }

    // Search
    if (query.trim()) {
      const search = query.trim().toLowerCase();

      filtered = filtered.filter((receipt) => {
        return (
          receipt.productName?.toLowerCase().includes(search) ||
          receipt.storeName?.toLowerCase().includes(search) ||
          receipt.category?.toLowerCase().includes(search)
        );
      });
    }

    // Sorting
    switch (sortBy) {
      case "highest":
        filtered.sort((a, b) => Number(b.amount) - Number(a.amount));
        break;

      case "lowest":
        filtered.sort((a, b) => Number(a.amount) - Number(b.amount));
        break;

      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.purchaseDate) - new Date(b.purchaseDate)
        );
        break;

      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.purchaseDate) - new Date(a.purchaseDate)
        );
        break;
    }

    setResults(filtered);
  }, [query, selectedCategory, sortBy, receipts]);

  const handleView = (id) => {
    console.log("View Receipt:", id);

    // Later
    // navigate(`/receipts/${id}`);
  };

  if (loading) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <SearchSkeleton />
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Search
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Find receipts by product, store or category.
          </p>
        </div>

        {/* Filters + Sorting */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <SearchFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <SearchSort
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Result Count */}
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-500">
            Showing {results.length} receipt
            {results.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Results */}
        <SearchResults
          results={results}
          onView={handleView}
        />
      </div>
    </main>
  );
};

export default Search;