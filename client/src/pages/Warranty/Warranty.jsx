import { useEffect, useState } from "react";

import WarrantyHeader from "../../components/warranty/WarrantyHeader";
import WarrantyStats from "../../components/warranty/WarrantyStats";
import UpcomingWarranty from "../../components/warranty/UpcomingWarranty";
import WarrantyFilters from "../../components/warranty/WarrantyFilters";
import WarrantyTable from "../../components/warranty/WarrantyTable";

import { getWarranties } from "../../services/warrantyService";

const Warranty = () => {
  const [warranties, setWarranties] = useState([]);

  // Fetch all warranties
  const fetchWarranties = async () => {
    try {
      const data = await getWarranties();
      setWarranties(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  return (
    <div className="container-custom py-8 space-y-10">
      <WarrantyHeader />

      <WarrantyStats warranties={warranties} />

      <UpcomingWarranty warranties={warranties} />

      <WarrantyFilters />

      <WarrantyTable
        warranties={warranties}
        onDelete={fetchWarranties}
      />
    </div>
  );
};

export default Warranty;