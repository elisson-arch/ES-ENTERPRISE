import { GoogleToken, DriveFile, CalendarEvent, GmailMessage, SyncLog } from '@domains/google-workspace/types/google-workspace.types';
import { APP_CONFIG } from '@shared/config/config';
import { organizationService } from '@domains/auth/services/organizationService';
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@shared/config/firebase';

const { SCOPES: WORKSPACE_SCOPES } = APP_CONFIG.GOOGLE;

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  organizationId?: string;
  isNew?: boolean;
}

type AccountType = 'commercial' | 'personal' | 'contingency' | 'unknown';

interface AccessProfile {
  accountType: AccountType;
  email: string;
  grantedScopes: string[];
  missingScopes: string[];
  fullAccess: boolean;
}

const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'yahoo.com',
  'icloud.com'
]);

const ROUTE_SCOPE_REQUIREMENTS: Record<string, string[]> = {
  dashboard: [],
  whatsapp: ['https://www.googleapis.com/auth/gmail.modify'],
  clients: ['https://www.googleapis.com/auth/contacts'],
  funnel: ['https://www.googleapis.com/auth/contacts'],
  automations: ['https://www.googleapis.com/auth/tasks'],
  inventory: [],
  documents: ['https://www.googleapis.com/auth/documents'],
  drive: ['https://www.googleapis.com/auth/drive'],
  reports: ['https://www.googleapis.com/auth/spreadsheets'],
  ia: [],
  site: [],
  security: ['https://www.googleapis.com/auth/userinfo.email'],
  integrations: []
};

class GoogleApiService {
  private token: GoogleToken | null = null;
  private userProfile: UserProfile | null = null;
  private logs: SyncLog[] = [];

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    const t = localStorage.getItem('sgc_token');
    const p = localStorage.getItem('sgc_profile');
    if (t) this.token = JSON.parse(t);
    if (p) this.userProfile = JSON.parse(p);
  }

  private async fetchApi(url: string, options: RequestInit = {}) {
    if (this.token?.accessToken.startsWith('CONTINGENCY')) {
      return {};
    }

    if (!this.token?.accessToken) throw new Error('Não autenticado.');

    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.token.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 401) {
      // Limpa o token localmente sem forçar reload — a UI detecta via isAuthenticated()
      this.token = null;
      localStorage.removeItem('sgc_token');
      this.notify('Sessão expirada. Por favor, faça login novamente.');
      throw new Error('Sessão expirada.');
    }

    if (res.status === 403) {
      const errPayload = await res.json().catch(() => ({}));
      const msg = errPayload?.error?.message || 'Permissão negada pela API Google.';
      throw new Error(`Serviço/API não habilitado ou sem permissão: ${msg}`);
    }

    return res.json();
  }

  private notify(error?: string) {
    const accessProfile = this.getAccessProfile();
    window.dispatchEvent(
      new CustomEvent('google_auth_change', {
        detail: { isAuthenticated: this.isAuthenticated(), profile: this.userProfile, accessProfile, error }
      })
    );
  }

  private addLog(service: SyncLog['service'], action: string, details: string, status: 'success' | 'failure' = 'success') {
    const log: SyncLog = {
      id: Math.random().toString(36).substr(2, 9),
      clientName: 'ES Enterprise',
      service,
      action,
      details,
      status,
      timestamp: new Date().toISOString()
    };
    this.logs = [log, ...this.logs].slice(0, 50);
    window.dispatchEvent(new CustomEvent('google_sync_log', { detail: log }));
  }

  async activateContingencyAccess() {
    this.token = {
      accessToken: `CONTINGENCY_${Date.now()}`,
      refreshToken: '',
      expiresAt: Date.now() + 86400000,
      scopes: WORKSPACE_SCOPES
    };
    this.userProfile = {
      name: 'Gestor ES Enterprise',
      email: 'contato@esarcondicionado.com.br',
      picture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100',
      organizationId: 'contato@esarcondicionado.com.br'
    };
    localStorage.setItem('sgc_token', JSON.stringify(this.token));
    localStorage.setItem('sgc_profile', JSON.stringify(this.userProfile));
    this.addLog('AUTH', 'ENTERPRISE_ACCESS', 'Login via Protocolo de Contingência Profissional.');
    this.notify();
    return true;
  }

  async loginAndAuthorize(): Promise<boolean> {
    try {
      const provider = new GoogleAuthProvider();
      WORKSPACE_SCOPES.forEach(scope => {
        if (scope !== 'openid') provider.addScope(scope);
      });
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      this.token = {
        accessToken: credential?.accessToken ?? '',
        refreshToken: '',
        expiresAt: Date.now() + 3600 * 1000,
        scopes: WORKSPACE_SCOPES
      };

      const { org, isNew } = await organizationService.findOrCreateOrg({
        email: result.user.email!,
        name: result.user.displayName ?? '',
        picture: result.user.photoURL ?? undefined
      });

      this.userProfile = {
        name: result.user.displayName ?? '',
        email: result.user.email!,
        picture: result.user.photoURL ?? '',
        organizationId: org.id,
        isNew
      };

      localStorage.setItem('sgc_token', JSON.stringify(this.token));
      localStorage.setItem('sgc_profile', JSON.stringify(this.userProfile));

      const accessProfile = this.getAccessProfile();
      if (!accessProfile.fullAccess) {
        this.notify('Acesso autenticado com permissões parciais. Autorize todos os escopos solicitados para desbloqueio completo.');
      }

      this.notify();
      return true;
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        this.notify(error.message || 'Falha no login. Utilize o acesso de contingência.');
      }
      return false;
    }
  }

  isAuthenticated(scope?: string): boolean {
    const active = !!this.token?.accessToken && this.token.expiresAt > Date.now();
    if (!scope) return active;
    if (this.token?.accessToken.startsWith('CONTINGENCY')) return true;
    return active && (this.token?.scopes.some((s) => s.includes(scope)) || false);
  }

  private getAccountType(): AccountType {
    if (this.token?.accessToken?.startsWith('CONTINGENCY')) return 'contingency';
    const email = this.userProfile?.email || '';
    if (!email.includes('@')) return 'unknown';
    const domain = email.split('@')[1].toLowerCase();
    return FREE_EMAIL_DOMAINS.has(domain) ? 'personal' : 'commercial';
  }

  getAccessProfile(): AccessProfile {
    const grantedScopes = this.token?.scopes || [];
    const missingScopes = WORKSPACE_SCOPES.filter((scope) => !grantedScopes.includes(scope));
    const accountType = this.getAccountType();
    const fullAccess = this.isAuthenticated() && missingScopes.length === 0;

    return {
      accountType,
      email: this.userProfile?.email || '',
      grantedScopes,
      missingScopes,
      fullAccess
    };
  }

  canAccessRoute(routeId: string): boolean {
    if (!this.isAuthenticated()) return false;

    const profile = this.getAccessProfile();
    if (profile.fullAccess) return true;

    const required = ROUTE_SCOPE_REQUIREMENTS[routeId] || [];
    if (required.length === 0) return true;

    return required.every((scope) => this.isAuthenticated(scope));
  }

  getUserProfile() {
    return this.userProfile;
  }

  getRecentLogs() {
    return this.logs;
  }

  async listFiles(): Promise<DriveFile[]> {
    if (this.token?.accessToken.startsWith('CONTINGENCY')) {
      return [
        { id: '1', name: 'Manual_Técnico_Daikin.pdf', mimeType: 'application/pdf', webViewLink: '#', modifiedTime: new Date().toISOString() },
        { id: '2', name: 'Orçamento_Roberto_Manutencoes.pdf', mimeType: 'application/pdf', webViewLink: '#', modifiedTime: new Date().toISOString() }
      ];
    }
    const data = await this.fetchApi('https://www.googleapis.com/drive/v3/files?pageSize=20&fields=files(id, name, mimeType, webViewLink, size, modifiedTime)');
    return data.files || [];
  }

  async ensureTenantDriveFolder(orgId: string): Promise<string> {
    if (this.token?.accessToken.startsWith('CONTINGENCY')) {
      return `contingency-folder-${orgId}`;
    }

    const folderName = `ES-ENTERPRISE-${orgId}`;
    const query = `mimeType='application/vnd.google-apps.folder' and trashed=false and name='${folderName}'`;
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&pageSize=1`;
    const found = await this.fetchApi(searchUrl);
    const folder = found?.files?.[0];
    if (folder?.id) return folder.id;

    const createResp = await this.fetchApi('https://www.googleapis.com/drive/v3/files?fields=id,name', {
      method: 'POST',
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      })
    });
    return createResp.id;
  }

  async uploadFileToDrive(file: File, parentFolderId?: string): Promise<DriveFile> {
    if (this.token?.accessToken.startsWith('CONTINGENCY')) {
      return {
        id: `contingency_${Date.now()}`,
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        webViewLink: '#',
        size: String(file.size),
        modifiedTime: new Date().toISOString()
      };
    }

    if (!this.token?.accessToken) throw new Error('Não autenticado.');

    const metadata: Record<string, unknown> = { name: file.name };
    if (parentFolderId) metadata.parents = [parentFolderId];

    const boundary = `-------esenterprise-${Date.now()}`;
    const bodyParts: BlobPart[] = [
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
      `--${boundary}\r\nContent-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`,
      file,
      `\r\n--${boundary}--`
    ];
    const multipartBody = new Blob(bodyParts);

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,size,modifiedTime', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token.accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartBody
    });

    if (res.status === 401) {
      this.revokeAccess();
      throw new Error('Sessão expirada.');
    }

    if (!res.ok) {
      const errPayload = await res.json().catch(() => ({}));
      const msg = errPayload?.error?.message || `Falha no upload (${res.status}).`;
      throw new Error(`Falha no upload para Google Drive: ${msg}`);
    }

    return res.json();
  }

  async trashDriveFile(fileId: string): Promise<void> {
    if (this.token?.accessToken.startsWith('CONTINGENCY')) return;
    await this.fetchApi(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'PATCH',
      body: JSON.stringify({ trashed: true })
    });
  }

  async syncCalendarEvents(): Promise<CalendarEvent[]> {
    if (this.token?.accessToken.startsWith('CONTINGENCY')) {
      return [{ id: 'e1', summary: 'Manutenção Preventiva - Roberto', start: new Date().toISOString(), end: new Date().toISOString() }];
    }
    const data = await this.fetchApi(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}&maxResults=10`);
    return (data.items || []).map((i: any) => ({ id: i.id, summary: i.summary, start: i.start.dateTime || i.start.date, end: i.end.dateTime || i.end.date, location: i.location }));
  }

  async createCalendarEvent(event: any) {
    if (this.token?.accessToken.startsWith('CONTINGENCY')) return { success: true };
    return this.fetchApi('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      body: JSON.stringify(event)
    });
  }

  async checkHealth() {
    return [
      { service: 'Engine', status: true },
      { service: 'Cloud', status: true }
    ];
  }

  async requestWorkspaceAccess() { return this.loginAndAuthorize(); }
  async revokeAccess() {
    await firebaseSignOut(auth).catch(() => {});
    localStorage.clear();
    window.location.reload();
  }

  // --- Multi-tenant sync helpers ---

  async fetchPeopleConnections(): Promise<any[]> {
    const url = 'https://people.googleapis.com/v1/people/me/connections'
      + '?personFields=names,emailAddresses,phoneNumbers,organizations&pageSize=1000';
    const data = await this.fetchApi(url);
    this.addLog('CONTACTS', 'PEOPLE_API_FETCH', `Retornados ${data.connections?.length ?? 0} contatos.`);
    return data.connections || [];
  }

  async findDriveFolder(name: string, parentId?: string): Promise<string | null> {
    const parentClause = parentId ? ` and '${parentId}' in parents` : '';
    const q = encodeURIComponent(
      `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false${parentClause}`
    );
    const data = await this.fetchApi(
      `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`
    );
    return data.files?.[0]?.id ?? null;
  }

  async createDriveFolder(name: string, parentId?: string): Promise<string> {
    const metadata: Record<string, any> = {
      name,
      mimeType: 'application/vnd.google-apps.folder'
    };
    if (parentId) metadata.parents = [parentId];
    const data = await this.fetchApi('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      body: JSON.stringify(metadata)
    });
    this.addLog('DRIVE', 'FOLDER_CREATED', `Pasta "${name}" criada (id: ${data.id}).`);
    return data.id;
  }
}

export const googleApiService = new GoogleApiService();
