import { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import SearchBar from '../../components/search/SearchBar';
import SearchFilters from '../../components/search/SearchFilters';
import SearchSort from '../../components/search/SearchSort';
import SearchResults from '../../components/search/SearchResults';
import SearchSkeleton from '../../components/search/SearchSkeleton';

import { getReceipts } from '../../services/receiptService';
import { searchReceipts } from '../../services/searchService';
import { AuthContext } from '../../context/AuthContext';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user } = useContext(AuthContext);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

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
  // Search + Filter + Sort
  // ===============================
  useEffect(() => {
    const filteredResults = searchReceipts({
      receipts,
      query,
      category: selectedCategory,
      sortBy,
    });

    setResults(filteredResults);
  }, [query, selectedCategory, sortBy, receipts]);

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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Filters */}
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <SearchFilters
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>

          {/* Sorting */}
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