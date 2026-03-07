
import { where, doc, setDoc } from 'firebase/firestore';
import { firestoreService } from '@shared/services/firestoreService';
import { db, auth } from '@shared/config/firebase';

export interface Organization {
  id: string;
  name: string;
  ownerEmail: string;
  ownerName: string;
  ownerPicture?: string;
  createdAt: string;
  plan: 'free' | 'pro';
}


/**
 * Cria (ou atualiza) o documento do usuário em /organizations/{orgId}/users/{uid}.
 * Este documento é exigido pelas Firestore security rules para autorizar operações.
 */
async function ensureOrgUserDoc(orgId: string, profile: { email: string; name: string; picture?: string }) {
  const uid = auth.currentUser?.uid;
  if (!uid) return; // modo contingência ou Firebase Auth não inicializado

  const userRef = doc(db, 'organizations', orgId, 'users', uid);
  await setDoc(userRef, {
    uid,
    email: profile.email,
    name: profile.name,
    picture: profile.picture ?? '',
    role: 'owner',
    status: 'active',
    updatedAt: new Date().toISOString()
  }, { merge: true });
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
      await ensureOrgUserDoc(existing[0].id, profile);
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
    await ensureOrgUserDoc(orgId, profile);
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
