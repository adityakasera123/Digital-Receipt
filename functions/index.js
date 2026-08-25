const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const vision = require("@google-cloud/vision");
const path = require("path");
const {GoogleGenAI} = require("@google/genai");

// Existing Vision OCR setup
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, "billvora-vision.json"),
});

// Gemini secret
const geminiApiKey = defineSecret("GEMINI_API_KEY");

// Existing OCR function — unchanged
exports.ocrReceipt = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({error: "Method not allowed"});
    }

    const {imageBase64} = req.body;

    if (!imageBase64) {
      return res.status(400).json({error: "Missing imageBase64"});
    }

    const [result] = await client.documentTextDetection({
      image: {
        content: imageBase64,
      },
    });

    const text = result.fullTextAnnotation ?
      result.fullTextAnnotation.text :
      "";

    return res.json({
      success: true,
      text,
    });
  } catch (error) {
    console.error("OCR Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Temporary Gemini connection test
exports.testGemini = onRequest(
    {
      secrets: [geminiApiKey],
    },
    async (req, res) => {
      try {
        if (req.method !== "GET") {
          return res.status(405).json({
            success: false,
            error: "Method not allowed",
          });
        }

        const ai = new GoogleGenAI({
          apiKey: geminiApiKey.value(),
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
          contents: "Reply with exactly: Hello from Billvora",
        });

        return res.status(200).json({
          success: true,
          message: response.text,
        });
      } catch (error) {
        console.error("Gemini Test Error:", error);

        return res.status(500).json({
          success: false,
          error: error.message,
        });
      }
    },
);
