

import ReceiptSearch from "../../components/receipt/ReceiptSearch";
import ReceiptFilters from "../../components/receipt/ReceiptFilters";
import ReceiptGrid from "../../components/receipt/ReceiptGrid";

import { useEffect, useState } from "react";
import { getReceipts } from "../../services/receiptService";



function Receipts() {
    const [searchTerm, setSearchTerm] = useState("");
const [activeCategory, setActiveCategory] = useState("All");
const [receipts, setReceipts] = useState([]);
const [loading, setLoading] = useState(true);
 useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const data = await getReceipts();
        setReceipts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  return (
  
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Receipts
        </h1>

        <p className="mt-3 text-lg text-gray-500">
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