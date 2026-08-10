import { useEffect, useState, useContext } from "react";

import WarrantyHeader from "../../components/warranty/WarrantyHeader";
import WarrantyStats from "../../components/warranty/WarrantyStats";
import UpcomingWarranty from "../../components/warranty/UpcomingWarranty";
import WarrantyFilters from "../../components/warranty/WarrantyFilters";
import WarrantyTable from "../../components/warranty/WarrantyTable";

import { getWarranties } from "../../services/warrantyService";
import { AuthContext } from "../../context/AuthContext";

const Warranty = () => {
  const { user } = useContext(AuthContext);
  const [warranties, setWarranties] = useState([]);

  // Fetch all warranties
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

  return (
    <div className="space-y-8 transition-theme">
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