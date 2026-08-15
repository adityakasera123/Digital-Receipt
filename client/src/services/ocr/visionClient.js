const GOOGLE_VISION_URL =
  "https://vision.googleapis.com/v1/images:annotate";

export async function detectTextWithGoogleVision(file) {
  const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;

  if (!apiKey) {
    throw new Error("Google Vision API key is missing.");
  }

  // Convert image to base64
  const base64 = await fileToBase64(file);

  const response = await fetch(`${GOOGLE_VISION_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        {
          image: {
            content: base64,
          },
          features: [
            {
              type: "DOCUMENT_TEXT_DETECTION",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Google Vision OCR request failed.");
  }

  const data = await response.json();

  const text =
    data.responses?.[0]?.fullTextAnnotation?.text || "";

  return {
    rawText: text,
    response: data,
  };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result.split(",")[1];
      resolve(result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}