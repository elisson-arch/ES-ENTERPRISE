import React from 'react';
import { 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Smartphone, 
  Globe,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Github,
  Mail
} from 'lucide-react';

const SectionWrapper = ({ children, styles }: any) => (
  <section 
    className={`w-full py-24 px-6 flex flex-col items-center transition-all duration-500 ${styles?.backgroundGradient ? 'bg-gradient-to-br from-slate-50 via-white to-indigo-50/20' : ''}`}
    style={{ 
      backgroundColor: styles?.backgroundColor || 'transparent', 
      textAlign: styles?.textAlign || 'center',
      paddingTop: styles?.paddingTop,
      paddingBottom: styles?.paddingBottom
    }}
  >
    <div className="max-w-7xl mx-auto w-full">
      {children}
    </div>
  </section>
);

const SocialIcon = ({ platform, size = 18 }: { platform: string, size?: number }) => {
  const icons: Record<string, any> = {
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
    github: Github,
    mail: Mail
  };
  const Icon = icons[platform.toLowerCase()] || Globe;
  return <Icon size={size} />;
};

export const NavbarRenderer = ({ content, styles }: any) => (
  <nav 
    className="w-full bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] py-5 transition-all"
    style={{ backgroundColor: styles?.navBg }}
  >
    <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 group cursor-pointer">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-xl transition-transform group-hover:rotate-12" 
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          {content.brandName?.charAt(0) || 'S'}
        </div>
        <span className="font-black text-xl italic tracking-tighter uppercase text-slate-900">
          {content.brandName || "SGC Pro"}
        </span>
      </div>
      
      <div className="hidden lg:flex gap-10">
        {content.links?.map((link: any, i: number) => (
          <a 
            key={i} 
            href={link.href || '#'} 
            className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] hover:text-indigo-600 transition-colors"
          >
            {link.label || link}
          </a>
        ))}
      </div>

      <button 
        className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-2xl hover:scale-105 active:scale-95 transition-all" 
        style={{ backgroundColor: content.ctaColor || 'var(--primary-color)' }}
      >
        {content.ctaText || 'Iniciar Jornada'}
      </button>
    </div>
  </nav>
);

export const HeroRenderer = ({ content, styles }: any) => (
  <SectionWrapper styles={styles}>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div className="space-y-8 text-left animate-in fade-in slide-in-from-left-8 duration-1000">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
           <Zap size={14} className="fill-indigo-600"/>
           <span className="text-[9px] font-black uppercase tracking-[0.2em]">{content.badge || 'Empresa Certificada'}</span>
        </div>
        <h1 
          className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter italic leading-[0.95]"
          style={{ color: styles?.titleColor }}
        >
          {content.title}
        </h1>
        <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl">
          {content.subtitle}
        </p>
        <div className="flex flex-wrap gap-5 pt-4">
          <button 
            className="px-12 py-6 font-black text-[10px] uppercase tracking-[0.3em] text-white shadow-2xl hover:-translate-y-1 active:scale-95 transition-all" 
            style={{ backgroundColor: 'var(--primary-color)', borderRadius: 'var(--radius)' }}
          >
            {content.buttonText || 'Começar Agora'}
          </button>
        </div>
      </div>
      <div className="relative animate-in zoom-in duration-1000">
         <div className="aspect-square bg-slate-100 rounded-[4rem] shadow-2xl overflow-hidden border-[16px] border-white relative group">
            {content.heroImage && <img src={content.heroImage} alt="Hero" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
         </div>
      </div>
    </div>
  </SectionWrapper>
);

export const FeatureRenderer = ({ content, styles }: any) => {
  const columnCount = parseInt(styles?.columns) || 3;
  const gridMapping: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <SectionWrapper styles={styles}>
      <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
         <h2 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">{content.headline}</h2>
         <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">{content.subheadline}</p>
      </div>
      <div className={`grid ${gridMapping[columnCount] || gridMapping[3]} gap-10`}>
        {content.items?.map((item: any, i: number) => (
          <div key={i} className="p-12 bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group rounded-[3rem] text-left">
            <div className="w-16 h-16 rounded-2xl mb-10 flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-6" style={{ backgroundColor: 'var(--primary-color)' }}>
              <Database size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tighter uppercase leading-none">{item.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed text-sm mb-8">{item.desc || item.description}</p>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-indigo-600 tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
               Ver Mais <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export const FooterRenderer = ({ content }: any) => (
  <footer className="w-full py-24 px-10 border-t border-slate-100 bg-white">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
      <div className="space-y-6 md:col-span-1 text-left">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
              {content.brandName?.charAt(0) || 'S'}
            </div>
            <span className="font-bold text-slate-900 tracking-tighter uppercase italic">{content.brandName || "SGC Pro"}</span>
         </div>
         <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-widest">
           {content.description || "Inovação SaaS integrada ao seu Workspace."}
         </p>
         {content.socials && (
           <div className="flex gap-4 pt-4">
             {content.socials.map((social: any, i: number) => (
               <a key={i} href={social.url} className="text-slate-300 hover:text-indigo-600 transition-colors">
                 <SocialIcon platform={social.platform} />
               </a>
             ))}
           </div>
         )}
      </div>

      {content.columns?.map((col: any, i: number) => (
        <div key={i} className="text-left">
           <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-[0.2em] mb-8 border-b border-slate-50 pb-2">{col.title}</h4>
           <ul className="space-y-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {col.links?.map((link: any, j: number) => (
                <li key={j} className="hover:text-indigo-600 cursor-pointer transition-colors">
                  <a href={link.href || '#'}>{link.label || link}</a>
                </li>
              ))}
           </ul>
        </div>
      ))}
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
       <p className="text-[9px] font-black uppercase text-slate-300 tracking-[0.4em]">
         {content.copyright || `© ${new Date().getFullYear()} Todos os direitos reservados.`}
       </p>
       <div className="flex items-center gap-6">
          <ShieldCheck size={16} className="text-slate-200" />
          <Database size={16} className="text-slate-200" />
       </div>
    </div>
  </footer>
);

export const PricingRenderer = ({ content, styles }: any) => (
  <SectionWrapper styles={styles}>
    <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter mb-16">{content.title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {content.plans?.map((plan: any, i: number) => (
        <div key={i} className={`p-10 bg-white border rounded-[3rem] text-left transition-all hover:scale-[1.02] ${i === 1 ? 'border-indigo-600 shadow-2xl ring-1 ring-indigo-600' : 'border-slate-100 shadow-sm'}`}>
          <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest italic">{plan.name}</h3>
          <p className="text-4xl font-black text-indigo-600 mb-8 tracking-tighter">{plan.price}</p>
          <ul className="space-y-4 mb-10">
            {plan.features?.map((f: string, j: number) => (
              <li key={j} className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-500" /> {f}
              </li>
            ))}
          </ul>
          <button className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${i === 1 ? 'bg-indigo-600 text-white shadow-xl' : 'bg-slate-900 text-white'}`}>Selecionar</button>
        </div>
      ))}
    </div>
  </SectionWrapper>
);