// domains/site-builder/services/siteService.ts
import { firestoreService } from '@shared/services/firestoreService';
import { auditService } from '@shared/services/auditService';
import { tenantService } from '@auth/services/tenantService';
import { Site, SiteDNA } from '../types/site-builder.types';
import { where } from 'firebase/firestore';

const COLLECTION_NAME = 'sites';

export const siteService = {
  // Gera um slug amigável (único) para a URL
  generateSlug(brandName: string) {
    return brandName
      .toLowerCase()
      .trim()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Busca um site pelo slug único (ex: ver o site online)
  async getSiteBySlug(slug: string): Promise<Site | null> {
    const sites = await firestoreService.query<Site>(
      COLLECTION_NAME,
      where('slug', '==', slug)
    );
    return sites.length > 0 ? sites[0] : null;
  },

  // Busca todos os sites do tenant logado (para painel admin)
  async getSitesByTenant(): Promise<Site[]> {
    const tenantId = tenantService.getCurrentOrgId();
    if (!tenantId) throw new Error("Usuário não autenticado em uma organização.");

    return firestoreService.query<Site>(
      COLLECTION_NAME,
      where('tenantId', '==', tenantId)
    );
  },

  // Publica / Salva o site no Firestore e gera log de auditoria
  async publishSite(brandName: string, dna: SiteDNA, siteId?: string): Promise<{ success: boolean; slug: string; id: string }> {
    const tenantId = tenantService.getCurrentOrgId();
    if (!tenantId) throw new Error("Falha de autenticação ao tentar publicar.");

    const slug = this.generateSlug(brandName);
    const now = new Date().toISOString();

    const siteData: Partial<Site> = {
      tenantId,
      slug,
      brandName,
      dna,
      updatedAt: now
    };

    let finalId = siteId;

    if (finalId) {
      // Atualizar site existente
      await firestoreService.update<Site>(COLLECTION_NAME, finalId, siteData);

      await auditService.log({
        organizationId: tenantId,
        entityType: 'site',
        entityId: finalId,
        action: 'SITE_UPDATED',
        after: siteData as Record<string, unknown>
      });
    } else {
      // Criar novo site
      siteData.createdAt = now;
      siteData.status = 'active';

      // Validação de unicidade do slug (básica)
      const existing = await this.getSiteBySlug(slug);
      if (existing) {
        siteData.slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }

      finalId = await firestoreService.add<Omit<Site, 'id'>>(COLLECTION_NAME, siteData as Omit<Site, 'id'>);

      await auditService.log({
        organizationId: tenantId,
        entityType: 'site',
        entityId: finalId,
        action: 'SITE_PUBLISHED',
        after: { ...siteData, id: finalId } as Record<string, unknown>
      });
    }

    return { success: true, slug: siteData.slug as string, id: finalId as string };
  }
};
