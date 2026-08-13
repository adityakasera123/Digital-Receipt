export default function ReturnStatusBadge({ status }) {
  const styles = {
    Active:
      "bg-green-100 text-green-700 border border-green-200 dark:bg-green-700/20 dark:text-green-500 dark:border-green-800",
    "Ending Soon":
      "bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
    Expired:
      "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}