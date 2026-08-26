const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getFirestore} = require("firebase-admin/firestore");
const vision = require("@google-cloud/vision");
const path = require("path");
const {GoogleGenAI} = require("@google/genai");

// Firebase Admin
initializeApp();

const adminAuth = getAuth();
const db = getFirestore();

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
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

      // Browser preflight
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

        // ==========================================
        // Firebase Authentication
        // ==========================================
        const authorization = req.get("Authorization");

        if (!authorization ||
            !authorization.startsWith("Bearer ")) {
          return res.status(401).json({
            success: false,
            error: "Authentication required.",
          });
        }

        const idToken = authorization.split("Bearer ")[1];

        if (!idToken) {
          return res.status(401).json({
            success: false,
            error: "Invalid authentication token.",
          });
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // ==========================================
        // Validate message
        // ==========================================
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

        // ==========================================
        // Fetch ONLY current user's receipts
        // ==========================================
        const receiptsSnapshot = await db
            .collection("receipts")
            .where("userId", "==", userId)
            .get();

        // ==========================================
        // Fetch ONLY current user's warranties
        // ==========================================
        const warrantiesSnapshot = await db
            .collection("warranties")
            .where("userId", "==", userId)
            .get();

        // ==========================================
        // Build safe receipt context
        // ==========================================
        const receipts = receiptsSnapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            productName: data.productName || "",
            storeName: data.storeName || "",
            purchaseDate: data.purchaseDate || "",
            amount: Number(data.amount || 0),
            category: data.category || "",
            paymentMethod: data.paymentMethod || "",
            platform: data.platform || "",
            returnTracking: Boolean(data.returnTracking),
            returnType: data.returnType || "",
            returnDurationDays:
              Number(data.returnDurationDays || 0),
            returnStartDate: data.returnStartDate || "",
            returnEndDate: data.returnEndDate || "",
          };
        });

        // ==========================================
        // Build safe warranty context
        // ==========================================
        // ==========================================
        // Build safe warranty context
        // ==========================================
        const currentDate = new Date().toISOString().slice(0, 10);

        const warranties = warrantiesSnapshot.docs.map((doc) => {
          const data = doc.data();
          const expiryDate = data.expiryDate || "";

          let expiryStatus = "unknown";
          let daysRemaining = null;

          if (expiryDate) {
            const todayMs = Date.parse(`${currentDate}T00:00:00Z`);
            const expiryMs = Date.parse(`${expiryDate}T00:00:00Z`);

            if (!Number.isNaN(expiryMs)) {
              daysRemaining = Math.round(
                  (expiryMs - todayMs) / (1000 * 60 * 60 * 24),
              );

              if (daysRemaining < 0) {
                expiryStatus = "expired";
              } else if (daysRemaining === 0) {
                expiryStatus = "expires_today";
              } else {
                expiryStatus = "active";
              }
            }
          }

          return {
            id: doc.id,
            receiptId: data.receiptId || "",
            productName: data.productName || "",
            storeName: data.storeName || "",
            category: data.category || "",
            purchaseDate: data.purchaseDate || "",
            warrantyDuration: data.warrantyDuration || "",
            expiryDate,
            expiryStatus,
            daysRemaining,
          };
        });

        // ==========================================
        // AI context
        // ==========================================
        const context = {
          receipts,
          warranties,
        };

        const systemInstruction = `
You are Ask Billvora, the personal purchase intelligence
assistant inside Billvora.

You are answering questions using the user's private Billvora
purchase data provided in the context below.

IMPORTANT RULES:

1. Only use the provided Billvora context for personal purchase,
   receipt, warranty, return-window, spending, and shopping-history
   questions.

2. Never claim to know personal purchase information that is not
   present in the provided context.

3. Never invent receipt, warranty, amount, date, store, or product
   information.

4. If the provided context does not contain the requested
   information, clearly say that the information is not available
   in the user's Billvora data.

5. Treat the provided data as belonging only to the currently
   authenticated Billvora user.

6. Do not reveal internal implementation details, authentication
   tokens, API keys, secrets, database credentials, or security
   information.

7. For calculations such as total spending, use the receipt amounts
   provided in the context and calculate carefully.

8. For warranty questions, use the warranty data provided in the
   context.

9. For return-window questions, use the receipt return fields
   provided in the context.

10. You can answer general knowledge questions normally, even when
    they are unrelated to Billvora purchases.

11. Be concise, friendly, and helpful.

Billvora user data context:
${JSON.stringify(context)}
`;

        // ==========================================
        // Gemini
        // ==========================================
        const ai = new GoogleGenAI({
          apiKey: geminiApiKey.value(),
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                  `${systemInstruction}\n\nUser question:\n${trimmedMessage}`,
                },
              ],
            },
          ],
        });

        return res.status(200).json({
          success: true,
          message: response.text ||
            "I couldn't generate a response.",
        });
      } catch (error) {
        console.error("Ask Billvora Error:", error);

        if (error.code === "auth/id-token-expired") {
          return res.status(401).json({
            success: false,
            error: "Your session has expired. Please sign in again.",
          });
        }

        if (error.code === "auth/argument-error") {
          return res.status(401).json({
            success: false,
            error: "Invalid authentication token.",
          });
        }

        return res.status(500).json({
          success: false,
          error: "Unable to get a response from Billvora.",
        });
      }
    },
);
