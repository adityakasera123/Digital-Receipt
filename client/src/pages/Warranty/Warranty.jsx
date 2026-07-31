import WarrantyHeader from "../../components/warranty/WarrantyHeader";
import WarrantyStats from "../../components/warranty/WarrantyStats";
import UpcomingWarranty from "../../components/warranty/UpcomingWarranty";
import WarrantyFilters from "../../components/warranty/WarrantyFilters";
import WarrantyTable from "../../components/warranty/WarrantyTable";
import { useEffect, useState } from "react";
import { getWarranties } from "../../services/warrantyService";

const Warranty = () => {
    const [warranties, setWarranties] = useState([]);
    useEffect(() => {
  const fetchWarranties = async () => {
    try {
      const data = await getWarranties();
      setWarranties(data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchWarranties();
}, []);
console.log(warranties);
  return (
    <div className="container-custom py-8 space-y-10">
      <WarrantyHeader />
<WarrantyStats warranties={warranties} />
      <UpcomingWarranty warranties={warranties} />
      <WarrantyFilters />
     <WarrantyTable warranties={warranties} />
    </div>
  );
};

export default Warranty;