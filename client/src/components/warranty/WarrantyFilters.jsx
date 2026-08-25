import { Search, SlidersHorizontal } from 'lucide-react';
import Card from '../ui/Card';

const WarrantyFilters = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <Card className="transition-theme">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by product, brand or store..."
            className="input-surface w-full py-3 pl-11 pr-4 outline-none transition-theme"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="input-surface rounded-xl px-4 py-3 outline-none transition-theme"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring Soon</option>
            <option value="expired">Expired</option>
            <option value="lifetime">Lifetime</option>
          </select>

          <button
            type="button"
            className="button-secondary flex items-center gap-2 rounded-xl px-4 py-3 transition-theme"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>
      </div>
    </Card>
  );
};

export default WarrantyFilters;