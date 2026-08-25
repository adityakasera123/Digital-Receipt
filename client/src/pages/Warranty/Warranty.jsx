import { useEffect, useMemo, useState, useContext } from "react";

import WarrantyHeader from "../../components/warranty/WarrantyHeader";
import WarrantyStats from "../../components/warranty/WarrantyStats";
import UpcomingWarranty from "../../components/warranty/UpcomingWarranty";
import WarrantyFilters from "../../components/warranty/WarrantyFilters";
import WarrantyTable from "../../components/warranty/WarrantyTable";

import { getWarranties } from "../../services/warrantyService";
import { AuthContext } from "../../context/AuthContext";
import { getWarrantyStatus } from "../../utils/warrantyStatus";

const Warranty = () => {
  const { user } = useContext(AuthContext);

  const [warranties, setWarranties] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // ===============================
  // Fetch Warranties
  // ===============================
  const fetchWarranties = async () => {
    try {
      if (!user) return;

      const data = await getWarranties(user.uid);

      setWarranties(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, [user]);

  // ===============================
  // Filter Warranties
  // ===============================
  const filteredWarranties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return warranties.filter((warranty) => {
      // -------------------------------
      // Search Filter
      // -------------------------------
      const matchesSearch =
        !query ||
        warranty.productName?.toLowerCase().includes(query) ||
        warranty.category?.toLowerCase().includes(query) ||
        warranty.storeName?.toLowerCase().includes(query);

      if (!matchesSearch) {
        return false;
      }

      // -------------------------------
      // Status Filter
      // -------------------------------
      const status = getWarrantyStatus(
        warranty.expiryDate,
        warranty.warrantyDuration
      );

      const matchesStatus =
        selectedStatus === "all" ||
        status === selectedStatus;

      return matchesStatus;
    });
  }, [warranties, searchQuery, selectedStatus]);

  return (
    <div className="space-y-8 transition-theme">
      <WarrantyHeader />

      <WarrantyStats warranties={warranties} />

      <UpcomingWarranty warranties={warranties} />

      <WarrantyFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <WarrantyTable
        warranties={filteredWarranties}
        onDelete={fetchWarranties}
      />
    </div>
  );
};

export default Warranty;