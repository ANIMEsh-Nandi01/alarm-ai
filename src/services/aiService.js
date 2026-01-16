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
      You are an environment verification system for an alarm clock.
      I will provide reference photos of a user's bedroom (the first 3 images) and new "live" photos (the last 2 images).
      
      Task: Determine if the "live" photos depict the same physical room/environment as the reference photos.
      - Ignore minor lighting changes (day vs night).
      - Ignore small angle changes.
      - Focus on furniture, wall color, bed style, and overall layout.
      
      Return ONLY valid JSON in this format:
      {
        "match": boolean,
        "confidence": number, // 0 to 1
        "reason": "short explanation"
      }
    `;

        const imageParts = [
            ...referencePhotos.map(fileToGenerativePart),
            ...livePhotos.map(fileToGenerativePart)
        ];

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();

        // Clean code blocks if present
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Gemini API Error:", error);
        return { match: false, reason: "AI Service Error: " + error.message };
    }
}
