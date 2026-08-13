import { getRemainingReturnDays } from "../../utils/returnUtils";

export default function ReturnCountdown({ endDate }) {
  const days = getRemainingReturnDays(endDate);

  if (days === null) return "-";

  if (days < 0) {
    return `Expired ${-days} day${days === -1 ? "" : "s"} ago`;
  }

  if (days === 0) {
    return "Last day today";
  }

  return `${days} day${days === 1 ? "" : "s"} remaining`;
}