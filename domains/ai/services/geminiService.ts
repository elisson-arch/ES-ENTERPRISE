import { APP_CONFIG } from '@shared/config/config';

const HVAC_SYSTEM_INSTRUCTION = APP_CONFIG.AI.SYSTEM_INSTRUCTIONS.RICARDO_IA;

/**
 * Helper to handle specific Gemini API errors and notify the UI
 */
export const handleApiError = (err: Error | Record<string, any>) => {
  if (err?.message?.includes("Requested entity was not found.")) {
    window.dispatchEvent(new CustomEvent('aistudio_key_reset'));
  }
  throw err;
};

export const geminiService = {
  /**
   * Helper unificado para chamadas ao Proxy do Backend
   */
  async callProxy(model: string, contents: Record<string, unknown>, config: Record<string, unknown> = {}) {
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, contents, config })
      });

      if (!response.ok) {
        const err = await response.json();
        if (err.error?.includes("not found")) {
          window.dispatchEvent(new CustomEvent('aistudio_key_reset'));
        }
        throw new Error(err.error || 'Erro na resposta do proxy');
      }

      const data = await response.json();

      return {
        text: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
        candidates: data.candidates,
        data
      };
    } catch (err) {
      console.error('[FRONTEND] Erro GeminiService:', err);
      throw err;
    }
  },

  async analyzeFile(fileData: string, mimeType: string, prompt: string = "Analise este componente técnico.") {
    const contents = {
      parts: [
        { inlineData: { data: fileData.split(',')[1] || fileData, mimeType } },
        { text: prompt }
      ]
    };
    const res = await this.callProxy(APP_CONFIG.AI.MODELS.PRIMARY, contents, { systemInstruction: HVAC_SYSTEM_INSTRUCTION });
    return res.text;
  },

  async getDeepResponse(prompt: string, context: string = "Diagnóstico Técnico de Campo") {
    const contents = { parts: [{ text: prompt }] };
    const res = await this.callProxy(APP_CONFIG.AI.MODELS.PRIMARY, contents, {
      thinkingConfig: { thinkingBudget: 32768 },
      systemInstruction: `${HVAC_SYSTEM_INSTRUCTION}\nContexto atual: ${context}.`
    });
    return res.text;
  },

  async getChatResponse(prompt: string, context: string, modelId: string = APP_CONFIG.AI.MODELS.FAST) {
    const contents = { parts: [{ text: prompt }] };
    const res = await this.callProxy(modelId, contents, {
      systemInstruction: `${HVAC_SYSTEM_INSTRUCTION}\nContexto do Atendimento: ${context}.`
    });
    return res.text;
  },

  async searchWeb(prompt: string) {
    const contents = { parts: [{ text: prompt }] };
    const res = await this.callProxy(APP_CONFIG.AI.MODELS.FAST, contents, {
      tools: [{ googleSearch: {} }]
    });

    const sources = res.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Referência Técnica',
      uri: chunk.web?.uri || ''
    })) || [];

    return { text: res.text, sources };
  },

  async generateImage(prompt: string, aspectRatio: string = "16:9") {
    const contents = { parts: [{ text: `Projeto 3D profissional de climatização: ${prompt}` }] };
    const res = await this.callProxy(APP_CONFIG.AI.MODELS.IMAGE, contents, {
      imageConfig: { aspectRatio, imageSize: "1K" }
    });

    if (res.candidates?.[0]?.content?.parts) {
      for (const part of res.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  async editImage(base64ImageData: string, mimeType: string, prompt: string) {
    const contents = {
      parts: [
        { inlineData: { data: base64ImageData.split(',')[1] || base64ImageData, mimeType } },
        { text: prompt }
      ],
    };
    const res = await this.callProxy(APP_CONFIG.AI.MODELS.IMAGE_EDIT, contents);

    if (res.candidates?.[0]?.content?.parts) {
      for (const part of res.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  async generateSectionJSON(prompt: string) {
    const contents = { parts: [{ text: prompt }] };
    const res = await this.callProxy(APP_CONFIG.AI.MODELS.PRIMARY, contents, {
      systemInstruction: "Você é um arquiteto de software especialista em React e UI/UX. Gere o JSON de um componente SiteElement baseado no comando do usuário. Responda apenas com o JSON bruto.",
      responseMimeType: "application/json"
    });
    return res.text;
  }
};
