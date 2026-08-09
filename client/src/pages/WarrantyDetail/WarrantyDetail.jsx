import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getWarrantyById } from '../../services/warrantyService';
import WarrantyOverview from '../../components/warranty/WarrantyOverview';
import WarrantyInfo from '../../components/warranty/WarrantyInfo';
import WarrantyActions from '../../components/warranty/WarrantyActions';

const WarrantyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
      <div className="flex min-h-[300px] items-center justify-center text-secondary">
        Loading Warranty...
      </div>
    );
  }

  if (!warranty) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-secondary">
        Warranty not found.
      </div>
    );
  }

  return (
    <div>
      {/* Warranty Overview */}
      <WarrantyOverview warranty={warranty} />

      {/* Purchase Information */}
      <WarrantyInfo warranty={warranty} />

      {/* Actions */}
     <WarrantyActions warranty={warranty} />
    </div>
  );
};

export default WarrantyDetail;