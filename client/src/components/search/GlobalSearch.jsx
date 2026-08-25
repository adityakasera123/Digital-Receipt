import { Search, X } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';
import { getReceipts } from '../../services/receiptService';
import { searchReceipts } from '../../services/searchService';

function GlobalSearch() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const containerRef = useRef(null);

  const [search, setSearch] = useState('');
  const [receipts, setReceipts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===============================
  // Load Current User Receipts
  // ===============================
  useEffect(() => {
    if (!user?.uid) {
      setReceipts([]);
      return;
    }

    const loadReceipts = async () => {
      try {
        setLoading(true);

        const receiptData = await getReceipts(user.uid);

        setReceipts(receiptData);
      } catch (error) {
        console.error(
          'Failed to load global search receipts:',
          error
        );

        setReceipts([]);
      } finally {
        setLoading(false);
      }
    };

    loadReceipts();
  }, [user]);

  // ===============================
  // Close Dropdown On Outside Click
  // ===============================
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      );
    };
  }, []);

  // ===============================
  // Live Search Results
  // ===============================
  const results = searchReceipts({
    receipts,
    query: search,
    sortBy: 'newest',
  }).slice(0, 5);

  // ===============================
  // Input Change
  // ===============================
  const handleChange = (e) => {
    const value = e.target.value;

    setSearch(value);
    setIsOpen(Boolean(value.trim()));
  };

  // ===============================
  // Submit Search
  // ===============================
  const handleSubmit = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      navigate('/search');
      setIsOpen(false);
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);

    setIsOpen(false);
  };

  // ===============================
  // Open Receipt
  // ===============================
  const handleResultClick = (id) => {
    navigate(`/receipts/${id}`);

    setSearch('');
    setIsOpen(false);
  };

  // ===============================
  // View All Results
  // ===============================
  const handleViewAll = () => {
    const query = search.trim();

    if (!query) {
      navigate('/search');
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }

    setIsOpen(false);
  };

  // ===============================
  // Clear Search
  // ===============================
  const handleClear = () => {
    setSearch('');
    setIsOpen(false);
  };

  // ===============================
  // Keyboard Controls
  // ===============================
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative min-w-0 flex-1 lg:max-w-2xl"
    >
      {/* Search Form */}
      <form onSubmit={handleSubmit}>
        <div className="flex h-10 lg:h-12 items-center gap-2 rounded-xl lg:rounded-2xl border border-default bg-surface px-3 lg:px-4 transition-theme focus-within:border-blue-500">
          <Search
            size={16}
            className="shrink-0 text-secondary"
          />

          <input
            type="text"
            value={search}
            onChange={handleChange}
            onFocus={() => {
              if (search.trim()) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search receipts..."
            className="min-w-0 w-full bg-transparent text-sm text-primary outline-none placeholder:text-secondary"
            aria-label="Search receipts"
          />

          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 rounded-md p-1 text-secondary transition-theme hover:bg-surface-hover hover:text-primary"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-default bg-surface shadow-2xl">
          {/* Dropdown Header */}
          <div className="border-b border-default bg-surface-secondary px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
              Search Results
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-medium text-primary">
                Loading receipts...
              </p>

              <p className="mt-1 text-xs text-secondary">
                Preparing your search results
              </p>
            </div>
          )}

          {/* Results */}
          {!loading && results.length > 0 && (
            <div className="px-2 py-2">
              {results.map((receipt) => (
                <button
                  key={receipt.id}
                  type="button"
                  onClick={() => handleResultClick(receipt.id)}
                  className="mx-0 flex w-full items-center justify-between gap-4 rounded-xl px-3 py-3 text-left transition-theme hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {/* Receipt Information */}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-primary">
                      {receipt.productName || 'Unnamed Product'}
                    </p>

                    <p className="mt-1 truncate text-xs text-secondary">
                      {receipt.storeName || 'Unknown Store'}
                    </p>
                  </div>

                  {/* Amount */}
                  <p className="shrink-0 text-sm font-semibold text-primary">
                    ₹
                    {Number(receipt.amount || 0).toLocaleString(
                      'en-IN'
                    )}
                  </p>
                </button>
              ))}

              {/* View All Results */}
              <button
                type="button"
                onClick={handleViewAll}
                className="mt-2 flex w-full items-center justify-center rounded-xl border border-default bg-surface-secondary px-4 py-3 text-sm font-semibold text-primary transition-theme hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                View all results →
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading &&
            search.trim() &&
            results.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-semibold text-primary">
                  No receipts found
                </p>

                <p className="mt-1 text-xs text-secondary">
                  No receipts found for "{search.trim()}"
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;