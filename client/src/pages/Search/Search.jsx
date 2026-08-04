import { useState } from "react";

import SearchBar from "../../components/search/SearchBar";
import SearchResults from "../../components/search/SearchResults";

const dummyReceipts = [
  {
    id: "1",
    productName: "MacBook Air M2",
    storeName: "Apple Store",
    category: "Electronics",
    amount: 99999,
    purchaseDate: "04 Aug 2026",
  },
  {
    id: "2",
    productName: "Nike Air Max",
    storeName: "Nike",
    category: "Fashion",
    amount: 7999,
    purchaseDate: "20 Jul 2026",
  },
  {
    id: "3",
    productName: "Boat Rockerz 550",
    storeName: "Amazon",
    category: "Electronics",
    amount: 1999,
    purchaseDate: "15 Jun 2026",
  },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(dummyReceipts);

  const handleSearch = (searchQuery) => {
    const search = searchQuery.toLowerCase();

    const filtered = dummyReceipts.filter((receipt) => {
      return (
        receipt.productName.toLowerCase().includes(search) ||
        receipt.storeName.toLowerCase().includes(search) ||
        receipt.category.toLowerCase().includes(search)
      );
    });

    setResults(filtered);
  };

  const handleView = (id) => {
    console.log("View Receipt:", id);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <section className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Search
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Quickly find receipts by product name, store name or category.
          </p>
        </section>

        {/* Search Bar */}
        <section className="mb-8">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            placeholder="Search by product, store or category..."
            autoFocus
          />
        </section>

        {/* Result Count */}
        <section className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-600">
            {results.length} Receipt{results.length !== 1 ? "s" : ""} Found
          </h2>
        </section>

        {/* Search Results */}
        <SearchResults
          results={results}
          onView={handleView}
        />
      </div>
    </main>
  );
};

export default Search;