import { parseReceiptText } from '../utils/ocrParser.legacy';

const OCR_API_KEY = import.meta.env.VITE_OCR_SPACE_API_KEY;

export async function extractReceiptData(file) {
if (!OCR_API_KEY) {
throw new Error('OCR API key not configured');
}

const formData = new FormData();

formData.append('file', file);
formData.append('language', 'eng');
formData.append('isOverlayRequired', 'false');
formData.append('detectOrientation', 'true');
formData.append('scale', 'true');
formData.append('OCREngine', '2');

const response = await fetch('https://api.ocr.space/parse/image', {
method: 'POST',
headers: {
apikey: OCR_API_KEY,
},
body: formData,
});

if (!response.ok) {
throw new Error('OCR request failed');
}

const result = await response.json();

if (result.IsErroredOnProcessing) {
throw new Error(result.ErrorMessage?.[0] || 'OCR processing failed');
}

const rawText =
result.ParsedResults?.map((r) => r.ParsedText).join('\n') || '';

// OCR ka original text console me print hoga
console.log("OCR Raw Text:", rawText);
return parseReceiptText(rawText);


}
