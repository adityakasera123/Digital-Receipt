import * as pdfjsLib from "pdfjs-dist";

const PDF_WORKER_URL = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;

// ==========================================
// Extract Text From PDF
// ==========================================
export const extractTextFromPDF = async (file) => {
  if (!file) {
    throw new Error("PDF file is required.");
  }

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are supported.");
  }

  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  let fullText = "";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);

    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .map((item) => item.str)
      .join(" ");

    fullText += `${pageText}\n`;
  }

  return {
    text: fullText.trim(),
    pageCount: pdf.numPages,
  };
};