import { GoogleGenAI } from "@google/genai";

export const translationService = {
  /**
   * Translates text to Brazilian Portuguese using Gemini.
   */
  async translateToPTBR(text: string): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `Traduza o seguinte texto para o Português do Brasil (PT-BR). Mantenha o tom original e quaisquer marcações ou emojis. Se o texto já estiver em Português do Brasil, retorne-o exatamente como está.\n\nTexto:\n${text}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "Você é um tradutor especializado em tradução técnica e informal para Português do Brasil."
        }
      });

      return response.text || text;
    } catch (err) {
      console.error("Translation error:", err);
      return text; // Fallback to original text on error
    }
  }
};
