import { GoogleGenAI } from "@google/genai";
import { PIXAR_TRANSFORMATION_PROMPT } from "../constants";

export const generatePixarCharacter = async (
  imageBase64: string,
  mimeType: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    // We use gemini-2.5-flash-image for efficient image editing/transformation tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64,
            },
          },
          {
            text: PIXAR_TRANSFORMATION_PROMPT,
          },
        ],
      },
      config: {
        // While responseMimeType isn't supported for nano banana models (flash-image),
        // we parse the parts manually below.
      }
    });

    // Iterate through parts to find the image
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini.");
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      throw new Error("No content found in response.");
    }

    for (const part of content.parts) {
      if (part.inlineData && part.inlineData.data) {
        // Return the full data URL
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    // If text was returned instead of an image (e.g. refusal or error description)
    const textPart = content.parts.find(p => p.text);
    if (textPart) {
      throw new Error(`Gemini returned text instead of an image: ${textPart.text}`);
    }

    throw new Error("No image data found in the generated response.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};
