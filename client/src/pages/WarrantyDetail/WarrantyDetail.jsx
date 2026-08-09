import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { getWarrantyById } from '../../services/warrantyService';
import WarrantyOverview from '../../components/warranty/WarrantyOverview';
import WarrantyInfo from '../../components/warranty/WarrantyInfo';
import WarrantyActions from '../../components/warranty/WarrantyActions';

const WarrantyDetail = () => {
const { id } = useParams();
const navigate = useNavigate();
const location = useLocation();

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

const handleBack = () => {
const from = location.state?.from || '/warranty';
navigate(from);
};

if (loading) {
return ( <div className="container-custom py-8"> <h2 className="text-xl font-semibold">Loading Warranty...</h2> </div>
);
}

return ( <div className="container-custom py-8 space-y-8">
{/* Back Button */} <button
     onClick={handleBack}
     className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
   > <ArrowLeft size={16} />
Back </button>

  <WarrantyOverview warranty={warranty} />

  <WarrantyInfo warranty={warranty} />

  <WarrantyActions warranty={warranty} />
</div>


);
};

export default WarrantyDetail;
