import { getRemainingReturnDays, getReturnStatus } from "./returnUtils";

export const getReturnNotificationSummary = (receipts = []) => {
const notifications = [];

receipts.forEach((receipt) => {
if (!receipt.returnTracking || !receipt.returnEndDate) return;


const daysRemaining = getRemainingReturnDays(receipt.returnEndDate);
const status = getReturnStatus(receipt.returnEndDate);

// Expired yesterday
if (daysRemaining === -1) {
  notifications.push({
    id: `return-expired-${receipt.id}`,
    receiptId: receipt.id,
    type: "return_window",
    title: "Return window expired",
    message: `${receipt.productName} return window expired yesterday.`,
    priority: "critical",
    reminderDays: -1,
    daysRemaining,
    productName: receipt.productName,
    storeName: receipt.storeName,
    platform: receipt.platform,
    returnEndDate: receipt.returnEndDate,
    status,
  });
  return;
}

// Last day
if (daysRemaining === 0) {
  notifications.push({
    id: `return-lastday-${receipt.id}`,
    receiptId: receipt.id,
    type: "return_window",
    title: "Last day to return",
    message: `Today is the last day to return ${receipt.productName}.`,
    priority: "critical",
    reminderDays: 0,
    daysRemaining,
    productName: receipt.productName,
    storeName: receipt.storeName,
    platform: receipt.platform,
    returnEndDate: receipt.returnEndDate,
    status,
  });
  return;
}

// Tomorrow
if (daysRemaining === 1) {
  notifications.push({
    id: `return-1day-${receipt.id}`,
    receiptId: receipt.id,
    type: "return_window",
    title: "Return window ends tomorrow",
    message: `Tomorrow is the last day to return ${receipt.productName}.`,
    priority: "high",
    reminderDays: 1,
    daysRemaining,
    productName: receipt.productName,
    storeName: receipt.storeName,
    platform: receipt.platform,
    returnEndDate: receipt.returnEndDate,
    status,
  });
  return;
}

// 2 days remaining
if (daysRemaining === 2) {
  notifications.push({
    id: `return-2days-${receipt.id}`,
    receiptId: receipt.id,
    type: "return_window",
    title: "Return window ending soon",
    message: `${receipt.platform || "Return"} return window for ${receipt.productName} ends in 2 days.`,
    priority: "high",
    reminderDays: 2,
    daysRemaining,
    productName: receipt.productName,
    storeName: receipt.storeName,
    platform: receipt.platform,
    returnEndDate: receipt.returnEndDate,
    status,
  });
  return;
}

// 3 days remaining
if (daysRemaining === 3) {
  notifications.push({
    id: `return-3days-${receipt.id}`,
    receiptId: receipt.id,
    type: "return_window",
    title: "Return window ending soon",
    message: `${receipt.platform || "Return"} return window for ${receipt.productName} ends in 3 days.`,
    priority: "medium",
    reminderDays: 3,
    daysRemaining,
    productName: receipt.productName,
    storeName: receipt.storeName,
    platform: receipt.platform,
    returnEndDate: receipt.returnEndDate,
    status,
  });
  return;
}


});

notifications.sort((a, b) => a.daysRemaining - b.daysRemaining);

return {
notifications,
hasUrgent: notifications.some(
(n) => n.priority === "critical" || n.priority === "high"
),
nextUrgent:
notifications.find(
(n) => n.priority === "critical" || n.priority === "high"
) || null,
};
};
