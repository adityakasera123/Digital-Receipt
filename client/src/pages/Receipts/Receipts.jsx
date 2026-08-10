import { useContext, useEffect, useState } from 'react';

import ReceiptSearch from '../../components/receipt/ReceiptSearch';
import ReceiptFilters from '../../components/receipt/ReceiptFilters';
import ReceiptGrid from '../../components/receipt/ReceiptGrid';

import { AuthContext } from '../../context/AuthContext';
import { getReceipts } from '../../services/receiptService';

function Receipts() {
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchReceipts = async () => {
      try {
        setLoading(true);

        const data = await getReceipts(user.uid);

        setReceipts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [user]);

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-5xl font-bold tracking-tight text-primary'>
          Receipts
        </h1>

        <p className='mt-3 text-lg text-secondary'>
          Manage and organize all your purchase receipts.
        </p>
      </div>

      <ReceiptSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <ReceiptFilters
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <ReceiptGrid
        receipts={receipts}
        loading={loading}
        searchTerm={searchTerm}
        activeCategory={activeCategory}
      />
    </div>
  );
}

export default Receipts;