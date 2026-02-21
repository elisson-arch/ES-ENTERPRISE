import { GoogleGenAI, Type } from "@google/genai";

const HVAC_SYSTEM_INSTRUCTION = `Você é o Ricardo IA, o Engenheiro Chefe da ES Enterprise. 
Sua especialidade absoluta é Climatização, Refrigeração (HVAC) e Gestão de Manutenção Industrial/Residencial.
Ao responder:
1. Use terminologia técnica precisa (BTUs, Compressor, Inverter, PMOC, Válvula de Expansão).
2. Priorize diagnósticos baseados em eficiência energética e durabilidade do equipamento.
3. Seja proativo sugerindo manutenções preventivas baseadas nos sintomas relatados.
4. Mantenha um tom profissional, ágil e focado em soluções práticas de campo.`;

/**
 * Helper to handle specific Gemini API errors and notify the UI
 */
const handleApiError = (err: any) => {
  // If the request fails with this specific message, we must prompt for a new key
  if (err?.message?.includes("Requested entity was not found.")) {
    window.dispatchEvent(new CustomEvent('aistudio_key_reset'));
  }
  throw err;
};

export const geminiService = {
  /**
   * Helper unificado para chamadas ao Proxy do Backend
   */
  async callProxy(model: string, contents: any, config: any = {}) {
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

      // Mapeamento simples para manter compatibilidade com o retorno do SDK original (.text)
      return {
        text: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
        candidates: data.candidates,
        data // Retorno completo se necessário
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
    const res = await this.callProxy('gemini-3-pro-preview', contents, { systemInstruction: HVAC_SYSTEM_INSTRUCTION });
    return res.text;
  },

  async getDeepResponse(prompt: string, context: string = "Diagnóstico Técnico de Campo") {
    const contents = { parts: [{ text: prompt }] };
    const res = await this.callProxy('gemini-3-pro-preview', contents, {
      thinkingConfig: { thinkingBudget: 32768 },
      systemInstruction: `${HVAC_SYSTEM_INSTRUCTION}\nContexto atual: ${context}.`
    });
    return res.text;
  },

  async getChatResponse(prompt: string, context: string, modelId: string = 'gemini-3-flash-preview') {
    const contents = { parts: [{ text: prompt }] };
    const res = await this.callProxy(modelId, contents, {
      systemInstruction: `${HVAC_SYSTEM_INSTRUCTION}\nContexto do Atendimento: ${context}.`
    });
    return res.text;
  },

  async searchWeb(prompt: string) {
    const contents = { parts: [{ text: prompt }] };
    const res = await this.callProxy('gemini-3-flash-preview', contents, {
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
    const res = await this.callProxy('gemini-3-pro-image-preview', contents, {
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
    const res = await this.callProxy('gemini-2.5-flash-image', contents);

    if (res.candidates?.[0]?.content?.parts) {
      for (const part of res.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  async generateSectionJSON(prompt: string) {
    const contents = { parts: [{ text: prompt }] };
    const res = await this.callProxy('gemini-3-pro-preview', contents, {
      systemInstruction: "Você é um arquiteto de software especialista em React e UI/UX. Gere o JSON de um componente SiteElement baseado no comando do usuário. Responda apenas com o JSON bruto.",
      responseMimeType: "application/json"
    });
    return res.text;
  }
};
