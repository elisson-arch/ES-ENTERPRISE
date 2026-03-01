
import { where } from 'firebase/firestore';
import { firestoreService } from './firestoreService';

export interface Organization {
  id: string;
  name: string;
  ownerEmail: string;
  ownerName: string;
  ownerPicture?: string;
  createdAt: string;
  plan: 'free' | 'pro';
}

export const organizationService = {
  /**
   * Encontra a organização pelo e-mail do dono.
   * Se não existir, cria automaticamente (auto-cadastro).
   * Funciona para qualquer conta Google: Workspace ou pessoal (@gmail.com).
   */
  async findOrCreateOrg(profile: {
    email: string;
    name: string;
    picture?: string;
  }): Promise<{ org: Organization; isNew: boolean }> {
    const existing = await firestoreService.query<Organization>(
      'organizations',
      where('ownerEmail', '==', profile.email)
    );

    if (existing.length > 0) {
      return { org: existing[0], isNew: false };
    }

    const now = new Date().toISOString();
    const newOrgData: Omit<Organization, 'id'> = {
      name: profile.name,
      ownerEmail: profile.email,
      ownerName: profile.name,
      ownerPicture: profile.picture,
      createdAt: now,
      plan: 'free'
    };

    const orgId = await firestoreService.add('organizations', newOrgData);
    return { org: { id: orgId, ...newOrgData }, isNew: true };
  },

  async getOrgByEmail(email: string): Promise<Organization | null> {
    const results = await firestoreService.query<Organization>(
      'organizations',
      where('ownerEmail', '==', email)
    );
    return results[0] ?? null;
  }
};
