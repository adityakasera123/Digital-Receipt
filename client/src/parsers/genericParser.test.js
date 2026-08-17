import { parseGenericReceipt } from "./genericParser";

const testInvoice = `
Sold By: ABC Retail Pvt Ltd
Product Name: Samsung USB Cable
Invoice Date: 12/08/2026
Grand Total: ₹599
Payment: UPI
`;

const result = parseGenericReceipt(testInvoice);

console.log("========== GENERIC PARSER TEST ==========");
console.log(result);
console.log("==========================================");
