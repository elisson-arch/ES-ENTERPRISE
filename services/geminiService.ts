
// @google/genai guidelines followed: Using Type for schema and Correct response properties
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ChatSession } from "../types";

export const geminiService = {
  // VISION - gemini-3-pro-preview
  async analyzeFile(fileData: string, mimeType: string, prompt: string = "Analise este anexo e extraia informações técnicas relevantes.") {
    // Guidelines: Create instance right before call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts = [
      { inlineData: { data: fileData.split(',')[1], mimeType } },
      { text: prompt }
    ];
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction: "Você é um especialista em manutenção predial e industrial de alto nível. Forneça laudos técnicos precisos baseados na imagem fornecida."
      }
    });
    // Guidelines: response.text is a property
    return response.text;
  },

  // FAST RESPONSES (Low Latency) - gemini-flash-lite-latest
  async getFastResponse(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
    });
    return response.text;
  },

  // DEEP THINKING - gemini-3-pro-preview (32k budget)
  async getDeepResponse(prompt: string, context: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        systemInstruction: `Você é o SGC Pro Master Brain especializado em ${context}. Use raciocínio profundo para resolver problemas complexos.`
      }
    });
    return response.text;
  },

  // SEARCH GROUNDING - gemini-3-flash-preview
  async searchWeb(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    // Guidelines: Extract website URLs from groundingChunks
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Fonte',
      uri: chunk.web?.uri || ''
    })) || [];
    return { text: response.text, sources };
  },

  // NANO BANANA (IMAGE EDITING) - gemini-2.5-flash-image
  async editImage(base64Image: string, mimeType: string, prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType } },
          { text: prompt }
        ]
      }
    });
    // Guidelines: Iterate through parts to find the image part
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  // GENERATE IMAGES - gemini-3-pro-image-preview
  async generateImage(prompt: string, aspectRatio: string = "1:1") {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio, imageSize: "1K" }
      }
    });
    // Guidelines: Iterate through parts to find the image part
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  async getChatResponse(prompt: string, context: string, modelId: string = 'gemini-3-pro-preview') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { systemInstruction: `Você é o SGC Pro Assistant especializado em ${context}.` }
    });
    return response.text;
  },

  async generateSectionJSON(userPrompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        responseMimeType: "application/json",
        // Guidelines: Using Type enum for schema definition
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            content: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                brandName: { type: Type.STRING },
                links: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      href: { type: Type.STRING }
                    }
                  }
                },
                columns: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      links: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  }
                },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      desc: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            styles: {
              type: Type.OBJECT,
              properties: {
                columns: { type: Type.NUMBER },
                backgroundColor: { type: Type.STRING },
                backgroundGradient: { type: Type.BOOLEAN }
              }
            }
          },
          required: ["type", "content", "styles"]
        },
        systemInstruction: "Você é um gerador de JSON para um construtor de sites SaaS. Retorne apenas o JSON no esquema solicitado."
      }
    });
    return response.text || "";
  }
};
