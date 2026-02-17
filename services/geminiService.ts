import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

/**
 * ES Maintenance Intelligence Service
 * Utiliza exclusivamente process.env.API_KEY injetada pelo Vite (via VITE_GEMINI_API_KEY ou GEMINI_API_KEY)
 */
export const geminiService = {
  // Vision Analysis - Gemini 3 Pro
  async analyzeFile(fileData: string, mimeType: string, prompt: string = "Analise este anexo técnico.") {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const parts = [
      { inlineData: { data: fileData.split(',')[1], mimeType } },
      { text: prompt }
    ];
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction: "Você é um perito em manutenção técnica industrial da ES Enterprise."
      }
    });
    return response.text;
  },

  // Deep Reasoning - Gemini 3 Pro (32k Budget)
  async getDeepResponse(prompt: string, context: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        systemInstruction: `Especialista ES Enterprise em ${context}. Use raciocínio profundo.`
      }
    });
    return response.text;
  },

  // Fast Response - Gemini Flash Lite
  async getChatResponse(prompt: string, context: string, modelId: string = 'gemini-3-pro-preview') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { systemInstruction: `Assistente SGC Pro: ${context}.` }
    });
    return response.text;
  },

  // Web Search - Gemini 3 Flash
  async searchWeb(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Referência',
      uri: chunk.web?.uri || ''
    })) || [];
    return { text: response.text, sources };
  },

  // Image Generation - Gemini 3 Pro Image
  async generateImage(prompt: string, aspectRatio: string = "1:1") {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio, imageSize: "1K" }
      }
    });
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  // Edit Image - Gemini 2.5 Flash Image
  async editImage(base64ImageData: string, mimeType: string, prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData.split(',')[1] || base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  },

  // Site Section Generator (JSON)
  async generateSectionJSON(userPrompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            content: { type: Type.OBJECT },
            styles: { type: Type.OBJECT }
          },
          required: ["type", "content", "styles"]
        },
        systemInstruction: "Gerador de componentes JSON para ES Architect Pro."
      }
    });
    return response.text || "";
  }
};