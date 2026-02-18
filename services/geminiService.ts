import { GoogleGenAI, Type } from "@google/genai";

const HVAC_SYSTEM_INSTRUCTION = `Você é o Ricardo IA, o Engenheiro Chefe da ES Enterprise. 
Sua especialidade absoluta é Climatização, Refrigeração (HVAC) e Gestão de Manutenção Industrial/Residencial.
Ao responder:
1. Use terminologia técnica precisa (BTUs, Compressor, Inverter, PMOC, Válvula de Expansão).
2. Priorize diagnósticos baseados em eficiência energética e durabilidade do equipamento.
3. Seja proativo sugerindo manutenções preventivas baseadas nos sintomas relatados.
4. Mantenha um tom profissional, ágil e focado em soluções práticas de campo.`;

export const geminiService = {
  /**
   * Vision Analysis - Utiliza Gemini 3 Pro para identificar falhas em fotos
   */
  async analyzeFile(fileData: string, mimeType: string, prompt: string = "Analise este componente técnico.") {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts = [
      { inlineData: { data: fileData.split(',')[1] || fileData, mimeType } },
      { text: prompt }
    ];
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: { systemInstruction: HVAC_SYSTEM_INSTRUCTION }
    });
    return response.text;
  },

  /**
   * Deep Technical Reasoning - Raciocínio profundo para diagnósticos complexos
   */
  async getDeepResponse(prompt: string, context: string = "Diagnóstico Técnico de Campo") {
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

  /**
   * Chat Ágil - Respostas rápidas para suporte ao cliente
   */
  async getChatResponse(prompt: string, context: string, modelId: string = 'gemini-3-flash-preview') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { systemInstruction: `${HVAC_SYSTEM_INSTRUCTION}\nContexto do Atendimento: ${context}.` }
    });
    return response.text;
  },

  /**
   * Pesquisa Técnica Grounded - Busca informações técnicas na web
   */
  async searchWeb(prompt: string) {
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

  /**
   * Geração de Imagens Técnicas
   */
  async generateImage(prompt: string, aspectRatio: string = "16:9") {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: `Projeto 3D profissional de climatização: ${prompt}` }] },
      config: { imageConfig: { aspectRatio, imageSize: "1K" } }
    });
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  /**
   * Edição de Imagem Preditiva
   */
  async editImage(base64ImageData: string, mimeType: string, prompt: string) {
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

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  /**
   * Geração de JSON estruturado para seções de site
   */
  async generateSectionJSON(prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: "Você é um arquiteto de software especialista em React e UI/UX. Gere o JSON de um componente SiteElement baseado no comando do usuário. Responda apenas com o JSON bruto.",
        responseMimeType: "application/json"
      }
    });
    return response.text;
  }
};