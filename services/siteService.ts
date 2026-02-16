
import { SiteDNA } from '../types';

const DB_KEY = 'sgc_published_sites';

export const siteService = {
  // Salva localmente para cache rápido
  saveLocal(slug: string, dna: SiteDNA) {
    const database = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    database[slug] = { dna, publishedAt: new Date().toISOString() };
    localStorage.setItem(DB_KEY, JSON.stringify(database));
  },

  // Publicação Real no Google Workspace (Sheets via Apps Script)
  async publishToGoogleCloud(dna: SiteDNA, brandName: string) {
    // IMPORTANTE: O usuário deve colar a URL do Web App gerada no Google Apps Script aqui
    const GAS_URL = localStorage.getItem('sgc_gas_url');
    
    if (!GAS_URL) {
      throw new Error("URL do Google Apps Script não configurada nas integrações.");
    }

    const payload = {
      brandName,
      dna,
      timestamp: new Date().toISOString()
    };

    const response = await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script requer no-cors para POST simples ou redirecionamento
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Como usamos no-cors, o fetch não retorna o body por segurança, 
    // então assumimos sucesso se não houver erro de rede.
    return { success: true, slug: this.generateSlug(brandName) };
  },

  getSiteBySlug(slug: string): SiteDNA | null {
    const database = JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    return database[slug]?.dna || null;
  },

  generateSlug(brandName: string) {
    return brandName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
};
