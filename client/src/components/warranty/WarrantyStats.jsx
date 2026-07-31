import {
  ShieldCheck,
  Clock3,
  ShieldX,
  Infinity,
} from "lucide-react";

import WarrantyStatCard from "./WarrantyStatCard";

const WarrantyStats = ({ warranties }) => {
  const today = new Date();

  const activeCount = warranties.filter((item) => {
    const expiry = new Date(item.expiryDate);
    return expiry >= today;
  }).length;

  const expiredCount = warranties.filter((item) => {
    const expiry = new Date(item.expiryDate);
    return expiry < today;
  }).length;

  const expiringCount = warranties.filter((item) => {
    const expiry = new Date(item.expiryDate);

    const diffDays = Math.ceil(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );

    return diffDays >= 0 && diffDays <= 30;
  }).length;

  const lifetimeCount = warranties.filter(
    (item) =>
      item.warrantyDuration?.toLowerCase() === "lifetime"
  ).length;

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      <WarrantyStatCard
        title="Active Warranties"
        count={activeCount}
        description="Products currently under warranty."
        icon={<ShieldCheck size={22} />}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
      />

      <WarrantyStatCard
        title="Expiring Soon"
        count={expiringCount}
        description="Expiring within 30 days."
        icon={<Clock3 size={22} />}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
      />

      <WarrantyStatCard
        title="Expired"
        count={expiredCount}
        description="Warranty period has ended."
        icon={<ShieldX size={22} />}
        iconBg="bg-red-100"
        iconColor="text-red-600"
      />

      <WarrantyStatCard
        title="Lifetime"
        count={lifetimeCount}
        description="Products with lifetime warranty."
        icon={<Infinity size={22} />}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
      />

    </section>
  );
};

export default WarrantyStats;