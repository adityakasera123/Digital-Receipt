import { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import SearchBar from '../../components/search/SearchBar';
import SearchFilters from '../../components/search/SearchFilters';
import SearchSort from '../../components/search/SearchSort';
import SearchResults from '../../components/search/SearchResults';
import SearchSkeleton from '../../components/search/SearchSkeleton';

import { getReceipts } from '../../services/receiptService';
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

  // Load Receipts (Current Logged-in User Only)
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

  // Read URL Query
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Search + Filter + Sort
  useEffect(() => {
    let filtered = [...receipts];

    // Category Filter
    if (selectedCategory !== 'All') {
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
      case 'highest':
        filtered.sort((a, b) => Number(b.amount) - Number(a.amount));
        break;

      case 'lowest':
        filtered.sort((a, b) => Number(a.amount) - Number(b.amount));
        break;

      case 'oldest':
        filtered.sort(
          (a, b) =>
            new Date(a.purchaseDate) - new Date(b.purchaseDate)
        );
        break;

      case 'newest':
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.purchaseDate) - new Date(a.purchaseDate)
        );
        break;
    }

    setResults(filtered);
  }, [query, selectedCategory, sortBy, receipts]);

  // Open Receipt Detail
  const handleView = (id) => {
    navigate(`/receipts/${id}`, {
      state: {
        from: 'search',
      },
    });
  };

  if (loading) {
    return (
      <main className='min-h-screen bg-background transition-theme'>
        <div className='mx-auto max-w-7xl p-8'>
          <SearchSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-background transition-theme'>
      <div className='mx-auto max-w-7xl p-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold tracking-tight text-primary'>
            Search
          </h1>

          <p className='mt-2 text-secondary'>
            Find receipts by product, store or category.
          </p>
        </div>

        {/* Search Bar */}
        <div className='mb-8'>
          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={setQuery}
            placeholder='Search receipts...'
          />
        </div>

        {/* Filters + Sorting */}
        <div className='mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
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
        <div className='mb-6'>
          <p className='text-sm font-medium text-secondary'>
            Showing {results.length} receipt
            {results.length !== 1 ? 's' : ''}
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