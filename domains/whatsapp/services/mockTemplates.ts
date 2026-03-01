
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

export const INITIAL_SITE_DATA: SiteElement[] = [
  {
    id: 'nav-1',
    type: 'NAVBAR',
    content: {
      brandName: 'ES Architect Pro',
      links: [
        { label: 'Visão Geral', href: '#hero' },
        { label: 'Funcionalidades', href: '#features' },
        { label: 'Preços', href: '#pricing' }
      ],
      ctaText: 'Criar Site',
      ctaColor: '#6366f1'
    },
    styles: {
      navBg: '#ffffff'
    }
  },
  {
    id: 'hero-1',
    type: 'HERO',
    content: {
      title: 'A sua empresa no próximo nível.',
      subtitle: 'ES transforma o Google Workspace em um motor de crescimento com sites gerados por IA em segundos.',
      buttonText: 'Explorar Demonstração',
      badge: 'Ricardo IA v5.0'
    },
    styles: {
      textAlign: 'left',
      paddingTop: '6rem',
      paddingBottom: '6rem',
      backgroundGradient: true
    }
  },
  {
    id: 'feat-1',
    type: 'FEATURES',
    content: {
      headline: 'Diferenciais da Engine',
      subheadline: 'Construído sobre a segurança do Google Cloud',
      items: [
        { title: 'Sincronização Cloud', desc: 'Sua base de dados sempre espelhada no Drive e Sheets corporativo.' },
        { title: 'IA Generativa', desc: 'Análise vision de fotos de campo e diagnóstico preditivo instantâneo.' },
        { title: 'Sites Dinâmicos', desc: 'Crie landing pages para seus clientes direto do seu banco de dados.' }
      ]
    },
    styles: {
      columns: 3
    }
  },
  {
    id: 'footer-1',
    type: 'FOOTER',
    content: {
      brandName: 'ES Enterprise',
      description: 'A fundação tecnológica para o futuro da manutenção técnica industrial.',
      columns: [
        { 
          title: 'Produto', 
          links: [
            { label: 'Funcionalidades', href: '#' },
            { label: 'Segurança API', href: '#' }
          ] 
        },
        { 
          title: 'Suporte', 
          links: [
            { label: 'Central de Ajuda', href: '#' },
            { label: 'Falar com Tech', href: '#' }
          ] 
        }
      ],
      socials: [
        { platform: 'instagram', url: 'https://instagram.com' },
        { platform: 'linkedin', url: 'https://linkedin.com' }
      ],
      copyright: '© 2024 ES • Todos os direitos reservados.'
    },
    styles: {}
  }
];