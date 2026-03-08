// site-builder.types.ts — Site Builder domain types

export type ComponentType = 'NAVBAR' | 'HERO' | 'FEATURES' | 'FOOTER' | 'CONTACT' | 'PRICING';

export interface SiteElement {
    id: string;
    type: ComponentType;
    content: Record<string, any>;
    styles: Record<string, any>;
}

export interface SiteTheme {
    primaryColor: string;
    fontFamily: string;
    borderRadius: string;
    backgroundColor: string;
    textColor: string;
}

export interface SiteDNA {
    theme: SiteTheme;
    pages: Record<string, SiteElement[]>;
}

export interface Site {
    id?: string;
    tenantId: string;
    slug: string;
    brandName: string;
    dna: SiteDNA;
    createdAt: string;
    updatedAt?: string;
    status: 'active' | 'suspended';
}
