import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getWarrantyById } from "../../services/warrantyService";
import EditWarrantyForm from "../../components/warranty/EditWarrantyForm";

const EditWarranty = () => {
  const { id } = useParams();

  const [warranty, setWarranty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarranty = async () => {
      try {
        const data = await getWarrantyById(id);
        setWarranty(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWarranty();
  }, [id]);

  if (loading) {
    return (
      <div className="container-custom py-8">
        <h2 className="text-xl font-semibold">
          Loading Warranty...
        </h2>
      </div>
    );
  }

    return (
  <div className="container-custom py-8 space-y-8">
    <EditWarrantyForm warranty={warranty} />
  </div>
);
};

export default EditWarranty;