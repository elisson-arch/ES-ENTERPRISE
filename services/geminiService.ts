import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const HVAC_SYSTEM_INSTRUCTION = `Você é o Ricardo IA, o Engenheiro Chefe da ES Enterprise. 
Sua especialidade absoluta é Climatização, Refrigeração (HVAC) e Gestão de Manutenção Industrial/Residencial.
Ao responder:
1. Use terminologia técnica precisa (BTUs, Compressor, Inverter, PMOC, Válvula de Expansão).
2. Priorize diagnósticos baseados em eficiência energética e durabilidade do equipamento.
3. Seja proativo sugerindo manutenções preventivas baseadas nos sintomas relatados.
4. Mantenha um tom profissional, ágil e focado em soluções práticas de campo.`;

export const geminiService = {
  // Vision Analysis - Gemini 3 Pro
  async analyzeFile(fileData: string, mimeType: string, prompt: string = "Analise este componente técnico.") {
    // Correct initialization strictly from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts = [
      { inlineData: { data: fileData.split(',')[1], mimeType } },
      { text: prompt }
    ];
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: { systemInstruction: HVAC_SYSTEM_INSTRUCTION }
    });
    return response.text;
  },

  // Deep Technical Reasoning - Gemini 3 Pro (32k Budget)
  async getDeepResponse(prompt: string, context: string = "Diagnóstico Técnico de Campo") {
    // Correct initialization strictly from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        systemInstruction: `${HVAC_SYSTEM_INSTRUCTION}\nContexto atual: ${context}.`
      }
    });
    return response.text;
  },

  // Chat Ágil - Gemini 3 Flash
  async getChatResponse(prompt: string, context: string, modelId: string = 'gemini-3-flash-preview') {
    // Correct initialization strictly from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { systemInstruction: `${HVAC_SYSTEM_INSTRUCTION}\nContexto do Atendimento: ${context}.` }
    });
    return response.text;
  },

  // Pesquisa Técnica em Tempo Real
  async searchWeb(prompt: string) {
    // Correct initialization strictly from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Referência Técnica',
      uri: chunk.web?.uri || ''
    })) || [];
    return { text: response.text, sources };
  },

  // Geração de Imagens de Projetos (3 Pro Image)
  async generateImage(prompt: string, aspectRatio: string = "16:9") {
    // Correct initialization strictly from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: `Projeto 3D profissional de climatização: ${prompt}` }] },
      config: { imageConfig: { aspectRatio, imageSize: "1K" } }
    });
    // Iterate through all parts to find the image part as per guidelines
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  // Editor de Imagens via Nano Banana
  async editImage(base64ImageData: string, mimeType: string, prompt: string) {
    // Correct initialization strictly from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64ImageData.split(',')[1] || base64ImageData, mimeType } },
          { text: prompt }
        ],
      },
    });
    // Iterate through all parts to find the image part as per guidelines
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  // Fix: Added missing generateSectionJSON method for website builder
  async generateSectionJSON(prompt: string) {
    // Correct initialization strictly from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "Você é um arquiteto de software especialista em React e UI/UX. Gere o JSON de um componente SiteElement baseado no comando do usuário. O objeto deve ter as propriedades: 'type' (NAVBAR, HERO, FEATURES, FOOTER, CONTACT, PRICING), 'content' (objeto com dados da seção) e 'styles' (objeto com estilos). Responda apenas com o JSON bruto.",
        responseMimeType: "application/json"
      }
    });
    return response.text;
  }
};