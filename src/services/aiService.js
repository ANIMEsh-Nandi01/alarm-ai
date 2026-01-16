import { GoogleGenerativeAI } from "@google/generative-ai";

// CAUTION: Exposing API Key on client side. Use only for personal/demo apps.
const API_KEY = "AIzaSyDw3x6ax9xeH_2392cW5lLpuZ0BAaSFgks";

// Helper to convert base64 data URL to GoogleGenerativeAI Part
function fileToGenerativePart(base64Data) {
    return {
        inlineData: {
            data: base64Data.split(",")[1], // Remove "data:image/jpeg;base64,"
            mimeType: "image/jpeg",
        },
    };
}

export async function verifyEnvironment(referencePhotos, livePhotos, userApiKey = null) {
    const key = userApiKey || API_KEY;

    if (!key) {
        console.error("No API Key found");
        return { match: false, reason: "Missing API Key. Please add VITE_GEMINI_API_KEY to .env or provide it in settings." };
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an environment verification system.
      Compare the first 3 reference photos with the last 2 live photos.
      Do they depict the same room?
      
      Return JSON: { "match": boolean, "reason": "string" }
    `;

        // Debug logging
        console.log("Sending to Gemini:", { refCount: referencePhotos.length, liveCount: livePhotos.length });

        const imageParts = [
            ...referencePhotos.map(p => fileToGenerativePart(p)),
            ...livePhotos.map(p => fileToGenerativePart(p))
        ];

        try {
            const result = await model.generateContent([prompt, ...imageParts]);
            const response = await result.response;
            const text = response.text();
            console.log("Gemini Response:", text);

            // Clean and parse
            const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(jsonStr);
        } catch (apiError) {
            console.error("Gemini API Call Failed:", apiError);
            throw apiError; // Re-throw to be caught by outer catch
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        return { match: false, reason: "AI Service Error: " + error.message };
    }
}
