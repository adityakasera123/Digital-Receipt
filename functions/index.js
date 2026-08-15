const {onRequest} = require("firebase-functions/v2/https");
const vision = require("@google-cloud/vision");
const path = require("path");

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, "billvora-vision.json"),
});

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
