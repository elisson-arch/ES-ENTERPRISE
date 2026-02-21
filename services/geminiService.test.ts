import { describe, it, expect, vi, beforeEach } from 'vitest';
import { geminiService } from './geminiService';

describe('geminiService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve chamar o proxy do backend corretamente no getChatResponse', async () => {
        const mockResponse = {
            candidates: [{
                content: {
                    parts: [{ text: 'Resposta da IA' }]
                }
            }]
        };

        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockResponse
        });

        const result = await geminiService.getChatResponse('Olá', 'Contexto');

        expect(global.fetch).toHaveBeenCalledWith('/api/ai/generate', expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('gemini-3-flash-preview')
        }));
        expect(result).toBe('Resposta da IA');
    });

    it('deve lançar erro se o proxy retornar erro', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Erro de teste' })
        });

        await expect(geminiService.getChatResponse('Olá', 'Contexto'))
            .rejects.toThrow('Erro de teste');
    });
});
