import { detectTextWithGoogleVision } from "./visionClient";
import { extractText } from "./extractText";
import { parseReceipt } from "../../parsers/parserRouter";

export async function runOCR(file) {
  const visionResult = await detectTextWithGoogleVision(file);

  const text = extractText(visionResult);

  const parsed = parseReceipt(text);

  return {
    text,
    raw: visionResult.response,
    ...parsed,
  };
}