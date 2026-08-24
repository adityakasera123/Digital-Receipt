import { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import SearchBar from '../../components/search/SearchBar';
import SearchFilters from '../../components/search/SearchFilters';
import SearchSort from '../../components/search/SearchSort';
import SearchResults from '../../components/search/SearchResults';
import SearchSkeleton from '../../components/search/SearchSkeleton';
import SearchStoreFilter from '../../components/search/SearchStoreFilter';

import { getReceipts } from '../../services/receiptService';
import { searchReceipts } from '../../services/searchService';
import { AuthContext } from '../../context/AuthContext';

import SearchAmountFilter from '../../components/search/SearchAmountFilter';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user } = useContext(AuthContext);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStore, setSelectedStore] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [minAmount, setMinAmount] = useState('');
const [maxAmount, setMaxAmount] = useState('');

  const [receipts, setReceipts] = useState([]);
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  // ===============================
  // Load Receipts (Current User Only)
  // ===============================
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadReceipts = async () => {
      try {
        const data = await getReceipts(user.uid);
        setReceipts(data);
      } catch (error) {
        console.error('Failed to load receipts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReceipts();
  }, [user]);

  // ===============================
  // Read URL Query
  // ===============================
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // ===============================
  // Get Unique Stores
  // ===============================
  const stores = [
    ...new Set(
      receipts
        .map((receipt) => receipt.storeName?.trim())
        .filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b));

  // ===============================
  // Search + Filter + Sort
  // ===============================
  useEffect(() => {
  const filteredResults = searchReceipts({
  receipts,
  query,
  category: selectedCategory,
  store: selectedStore,
  minAmount,
  maxAmount,
  sortBy,
});

    setResults(filteredResults);
  }, [
  query,
  selectedCategory,
  selectedStore,
  minAmount,
  maxAmount,
  sortBy,
  receipts,
]);

  // ===============================
  // Open Receipt Detail
  // ===============================
  const handleView = (id) => {
    navigate(`/receipts/${id}`, {
      state: {
        from: 'search',
      },
    });
  };

  // ===============================
  // Loading State
  // ===============================
  if (loading) {
    return (
      <main className="space-y-8">
        <SearchSkeleton />
      </main>
    );
  }

  // ===============================
  // Page
  // ===============================
  return (
    <main className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Search
        </h1>

        <p className="mt-2 text-secondary">
          Find receipts by product, store or category.
        </p>
      </div>

      {/* Sticky Search + Filters */}
      <div className="sticky top-0 z-20 -mx-2 rounded-3xl bg-app/95 px-2 py-3 backdrop-blur supports-[backdrop-filter]:bg-app/80">
        {/* Search Bar */}
        <div className="mb-5">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={setQuery}
            placeholder="Search receipts..."
          />
        </div>

        {/* Filters + Sorting */}
        {/* Filters + Sorting */}
<div className="space-y-4">
  {/* Advanced Filters */}
  <div className="w-full overflow-x-auto pb-1">
    <div className="flex min-w-max items-center gap-4">
      {/* Category Filters */}
      <SearchFilters
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Store Filter */}
      <SearchStoreFilter
        stores={stores}
        selectedStore={selectedStore}
        onStoreChange={setSelectedStore}
      />

      {/* Amount Filter */}
      <SearchAmountFilter
        minAmount={minAmount}
        maxAmount={maxAmount}
        onMinAmountChange={setMinAmount}
        onMaxAmountChange={setMaxAmount}
      />
    </div>
  </div>

  {/* Sorting */}
  <div className="flex justify-end">
    <SearchSort
      sortBy={sortBy}
      onSortChange={setSortBy}
    />
  </div>
</div>
      </div>

      {/* Result Count */}
      <div>
        <p className="text-sm font-medium text-secondary">
          Showing {results.length} receipt
          {results.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Results */}
      <SearchResults
        results={results}
        onView={handleView}
      />
    </main>
  );
};

export default Search;