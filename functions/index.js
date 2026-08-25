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

// Ask Billvora AI assistant
exports.askBillvora = onRequest(
    {
      secrets: [geminiApiKey],
    },
    async (req, res) => {
      // CORS
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");

      // Handle browser preflight request
      if (req.method === "OPTIONS") {
        return res.status(204).send("");
      }

      try {
        if (req.method !== "POST") {
          return res.status(405).json({
            success: false,
            error: "Method not allowed",
          });
        }

        const {message} = req.body || {};

        if (!message || typeof message !== "string") {
          return res.status(400).json({
            success: false,
            error: "Message is required.",
          });
        }

        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
          return res.status(400).json({
            success: false,
            error: "Message cannot be empty.",
          });
        }

        if (trimmedMessage.length > 2000) {
          return res.status(400).json({
            success: false,
            error: "Message is too long.",
          });
        }

        const ai = new GoogleGenAI({
          apiKey: geminiApiKey.value(),
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
          contents: trimmedMessage,
        });

        return res.status(200).json({
          success: true,
          message: response.text ||
            "I couldn't generate a response.",
        });
      } catch (error) {
        console.error("Ask Billvora Error:", error);

        return res.status(500).json({
          success: false,
          error: "Unable to get a response from Billvora.",
        });
      }
    },
);
