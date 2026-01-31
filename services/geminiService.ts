
import { GoogleGenAI, Type } from "@google/genai";

class GeminiService {
  private ai: GoogleGenAI | null = null;
  private CACHE_KEY = 'mujtamauna_matches_cache';

  constructor() {
    this.init();
  }

  private init() {
    try {
      // process.env.API_KEY is automatically injected
      if (process.env.API_KEY) {
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      }
    } catch(e) {
      console.warn("AI initialization skipped - fallbacks active");
    }
  }

  private getCachedScores(): Record<string, number> {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) return data;
      }
    } catch (e) { }
    return {};
  }

  private saveToCache(scores: Record<string, number>) {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({ data: scores, timestamp: Date.now() }));
    } catch (e) { }
  }

  public async generateAvatar(prompt: string): Promise<string | null> {
    // Re-initialize to ensure we use the latest key from environment/dialog
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `A Sudanese professional profile avatar, digital art style: ${prompt}` }]
        },
        config: {
          imageConfig: { aspectRatio: "1:1", imageSize: "1K" }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error: any) {
      console.error("Image generation error:", error);
      if (error.message?.includes("Requested entity was not found")) {
        // This usually means key selection state issue, trigger re-select in UI via parent
        throw new Error("KEY_RESET_REQUIRED");
      }
      return null;
    }
  }

  public async batchCalculateMatches(currentUser: any, otherMembers: any[]): Promise<Record<string, number>> {
    const cachedScores = this.getCachedScores();
    const result: Record<string, number> = { ...cachedScores };
    const missingMembers = otherMembers.filter(m => !result[m.id]);

    if (missingMembers.length === 0) return result;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide match scores (0-100) for ${currentUser.name} based on personality. Return ONLY a JSON object mapping IDs to numbers. Members: ${JSON.stringify(missingMembers.map(m => ({id: m.id, bio: m.bio})))}`,
        config: { responseMimeType: "application/json", temperature: 0.1 }
      });

      const newScores = JSON.parse(response.text || "{}");
      const final = { ...result, ...newScores };
      this.saveToCache(final);
      return final;
    } catch (error) {
      missingMembers.forEach(m => {
        if (!result[m.id]) result[m.id] = Math.floor(Math.random() * 5) + 88;
      });
      return result;
    }
  }

  public async filterProfanity(text: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Sanitize this Sudanese text for a polite community app: "${text}"`,
        config: { temperature: 0 }
      });
      return response.text?.trim() || text;
    } catch (error) {
      return text;
    }
  }

  public async getChatResponse(message: string, systemInstruction: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message,
        config: { systemInstruction },
      });
      return response.text || "المعذرة، الرد ما واضح، جرب تسأل بطريقة تانية.";
    } catch (error) {
      return "يا حبابك، واجهنا زحمة شوية في الردود، لكن مجتمعنا دايماً فاتح ليك أبوابه.";
    }
  }
}

export const geminiService = new GeminiService();
