import { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import SearchBar from '../../components/search/SearchBar';
import SearchFilters from '../../components/search/SearchFilters';
import SearchSort from '../../components/search/SearchSort';
import SearchResults from '../../components/search/SearchResults';
import SearchSkeleton from '../../components/search/SearchSkeleton';
import SearchStoreFilter from '../../components/search/SearchStoreFilter';
import SearchAmountFilter from '../../components/search/SearchAmountFilter';
import SearchDateFilter from '../../components/search/SearchDateFilter';

import { getReceipts } from '../../services/receiptService';
import { getWarranties } from '../../services/warrantyService';
import { searchReceipts } from '../../services/searchService';

import { getWarrantyStatus } from '../../utils/warrantyStatus';
import { getReturnStatus } from '../../utils/returnUtils';

import { AuthContext } from '../../context/AuthContext';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user } = useContext(AuthContext);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStore, setSelectedStore] = useState('All');

  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [warrantyStatus, setWarrantyStatus] = useState('All');
  const [returnStatus, setReturnStatus] = useState('All');

  const [sortBy, setSortBy] = useState('newest');

  const [receipts, setReceipts] = useState([]);
  const [warranties, setWarranties] = useState([]);

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  // ===============================
  // Load Receipts + Warranties
  // Current User Only
  // ===============================
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [receiptData, warrantyData] = await Promise.all([
          getReceipts(user.uid),
          getWarranties(),
        ]);

        setReceipts(receiptData);
        setWarranties(warrantyData);
      } catch (error) {
        console.error('Failed to load search data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
  // Create Receipt → Warranty Status Map
  // ===============================
  const warrantyStatusMap = {};

  warranties.forEach((warranty) => {
    if (!warranty.receiptId) return;

    warrantyStatusMap[warranty.receiptId] = getWarrantyStatus(
      warranty.expiryDate,
      warranty.warrantyDuration
    );
  });

  // ===============================
  // Create Receipt → Return Status Map
  // ===============================
  const returnStatusMap = {};

  receipts.forEach((receipt) => {
    if (!receipt.returnTracking) {
      returnStatusMap[receipt.id] = 'Unknown';
      return;
    }

    returnStatusMap[receipt.id] = getReturnStatus(
      receipt.returnEndDate
    );
  });

  // ===============================
  // Search + Filter + Sort
  // ===============================
  useEffect(() => {
    const filteredResults = searchReceipts({
      receipts,
      query,
      category: selectedCategory,
      store: selectedStore,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      warrantyStatus,
      warrantyStatusMap,
      returnStatus,
      returnStatusMap,
      sortBy,
    });

    setResults(filteredResults);
  }, [
    query,
    selectedCategory,
    selectedStore,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    warrantyStatus,
    returnStatus,
    sortBy,
    receipts,
    warranties,
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

        {/* Category Filters */}
        <div className="mb-4 w-full overflow-x-auto pb-1">
          <div className="flex min-w-max gap-3">
            <SearchFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex flex-wrap items-center gap-4">
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

          {/* Date Filter */}
          <SearchDateFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          {/* Warranty Filter */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="search-warranty-status"
              className="text-sm font-medium text-secondary"
            >
              Warranty
            </label>

            <select
              id="search-warranty-status"
              value={warrantyStatus}
              onChange={(e) => setWarrantyStatus(e.target.value)}
              className="rounded-xl border border-default bg-surface px-4 py-2 text-sm text-primary outline-none transition-theme focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="expiring">Expiring Soon</option>
              <option value="expired">Expired</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>

          {/* Return Filter */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="search-return-status"
              className="text-sm font-medium text-secondary"
            >
              Return
            </label>

            <select
              id="search-return-status"
              value={returnStatus}
              onChange={(e) => setReturnStatus(e.target.value)}
              className="rounded-xl border border-default bg-surface px-4 py-2 text-sm text-primary outline-none transition-theme focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Ending Soon">Ending Soon</option>
              <option value="Expired">Expired</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
        </div>

        {/* Sorting */}
        <div className="mt-4 flex justify-end">
          <SearchSort
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
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