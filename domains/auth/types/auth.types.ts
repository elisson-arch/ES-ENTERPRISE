// auth.types.ts — Auth domain types

export type OrgUserRole = 'owner' | 'admin' | 'manager' | 'tech' | 'viewer';
export type OrgUserStatus = 'active' | 'disabled' | 'invited';

export interface OrganizationSettings {
    theme: 'light' | 'dark';
    aiModel: string;
    autoDispatch: boolean;
}

export interface OrganizationSubscription {
    tier: 'starter' | 'pro' | 'enterprise';
    status: 'active' | 'past_due' | 'canceled';
}

export interface OrganizationDoc {
    id: string;
    name: string;
    cnpj: string;
    settings: OrganizationSettings;
    subscription: OrganizationSubscription;
    featureFlags?: Record<string, boolean>;
    createdAt: string;
    updatedAt: string;
}

export interface OrgUserDoc {
    id: string;
    name: string;
    email: string;
    role: OrgUserRole;
    status: OrgUserStatus;
    permissions?: string[];
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}
