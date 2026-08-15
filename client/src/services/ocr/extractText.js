export function extractText(visionResult) {
  if (!visionResult) return "";

  return visionResult.rawText || "";
}