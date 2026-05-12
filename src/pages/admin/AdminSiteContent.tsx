import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { invalidateSiteContentCache } from '@/hooks/useSiteContent';
import {
  Save, Home, Info, BookOpen, Mail, PanelTop, PanelBottom, Settings,
  ChevronRight, Plus, Trash2, GripVertical,
  Share2,
} from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Globe } from 'lucide-react';

type SiteContent = Tables<'site_content'>;

const PAGES = [
  {
    id: 'branding',
    label: 'Branding & Identity',
    icon: Settings,
    description: 'Site name, logo, favicon, and global identity',
    sections: [
      { key: 'site_brand', label: 'Site Identity', fields: ['title:Site Name', 'subtitle:Tagline', 'meta.logo_url:Logo URL (SVG/PNG)',  'meta.logo_icon:Logo Icon (Lucide name)', 'meta.favicon_url:Favicon URL'] },
    ],
  },
  {
    id: 'header',
    label: 'Header & Navigation',
    icon: PanelTop,
    description: 'Navigation links and header settings',
    sections: [
      { key: 'header_brand', label: 'Header Brand', fields: ['title:Brand Name'] },
      { key: 'header_nav', label: 'Navigation Links', fields: ['meta.links:nav_links'] },
    ],
  },
  {
    id: 'footer',
    label: 'Footer',
    icon: PanelBottom,
    description: 'Footer brand, newsletter, copyright, and stats',
    sections: [
      { key: 'footer_brand', label: 'Footer Brand', fields: ['title:Brand Name', 'subtitle:Description', 'meta.stats:stats'] },
      { key: 'footer_newsletter', label: 'Newsletter CTA', fields: ['title:Heading', 'subtitle:Description'] },
      { key: 'footer_copyright', label: 'Copyright', fields: ['title:Copyright Text', 'subtitle:Subtitle'] },
    ],
  },
  {
    id: 'homepage',
    label: 'Homepage',
    icon: Home,
    description: 'Hero, features, how it works, FAQ, CTA sections',
    sections: [
      { key: 'home_hero', label: 'Hero Section', fields: ['title:Main Heading', 'subtitle:Subheading / Description', 'content:Badge Text', 'meta.cta_text:CTA Button Text', 'meta.cta_link:CTA Link', 'meta.trust_badges:trust_badges'] },
      { key: 'home_calculator', label: 'Calculator Section', fields: ['title:Section Title', 'subtitle:Description', 'content:Badge Text'] },
      { key: 'home_features', label: 'Features Section', fields: ['title:Section Title', 'subtitle:Description', 'meta.features:features'] },
      { key: 'home_howitworks', label: 'How It Works', fields: ['title:Section Title', 'subtitle:Description', 'meta.steps:steps'] },
      { key: 'home_faq', label: 'FAQ Section', fields: ['title:Section Title', 'subtitle:Description', 'meta.questions:faq'] },
      { key: 'home_cta', label: 'CTA Section', fields: ['title:Heading', 'subtitle:Description', 'meta.cta_text:Button Text', 'meta.cta_link:Button Link'] },
    ],
  },
  {
    id: 'about',
    label: 'About Page',
    icon: Info,
    description: 'Mission, vision, values, capabilities, disclaimer',
    sections: [
      { key: 'about_header', label: 'Page Header', fields: ['title:Page Title', 'subtitle:Description'] },
      { key: 'about_mission', label: 'Mission', fields: ['title:Title', 'content:Content'] },
      { key: 'about_vision', label: 'Vision', fields: ['title:Title', 'content:Content'] },
      { key: 'about_values', label: 'Core Values', fields: ['title:Section Title', 'subtitle:Description', 'meta.values:values'] },
      { key: 'about_features', label: 'Platform Capabilities', fields: ['title:Section Title', 'meta.features:string_list'] },
      { key: 'about_disclaimer', label: 'Disclaimer', fields: ['title:Title', 'content:Disclaimer Text'] },
    ],
  },
  {
    id: 'howto',
    label: 'How to Use',
    icon: BookOpen,
    description: 'Guide steps, example scenario, formula',
    sections: [
      { key: 'howto_header', label: 'Page Header', fields: ['title:Page Title', 'subtitle:Description', 'content:Badge Text'] },
      { key: 'howto_steps', label: 'Guide Steps', fields: ['meta.steps:steps'] },
      { key: 'howto_example', label: 'Example Scenario', fields: ['title:Section Title', 'meta.standard:example_scenario', 'meta.extra:example_scenario'] },
      { key: 'howto_formula', label: 'Formula', fields: ['title:Section Title', 'content:Formula Expression', 'meta.variables:variables'] },
    ],
  },
   {
    id: 'social',
    label: 'Social Links',
    icon: Share2, // Import Share2 from lucide-react
    description: 'Manage social media links displayed in footer',
    sections: [
      { key: 'footer_social', label: 'Social Media Links', fields: ['meta.links:social_links'] },
    ],
  },
  {
    id: 'contact',
    label: 'Contact Page',
    icon: Mail,
    description: 'Contact form header and info cards',
    sections: [
      { key: 'contact_header', label: 'Page Header', fields: ['title:Page Title', 'subtitle:Description', 'content:Badge Text'] },
      { key: 'contact_cards', label: 'Info Cards', fields: ['meta.cards:contact_cards'] },
    ],
  },
];

// ─── Array Editor Components ──────────────────────────────────────────────────

const AddBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 border border-dashed border-primary/40 hover:border-primary/60 px-3 py-1.5 rounded-lg transition-colors"
  >
    <Plus className="w-3 h-3" /> Add Item
  </button>
);

const ItemShell = ({
  index,
  children,
  onDelete,
}: {
  index: number;
  children: React.ReactNode;
  onDelete: () => void;
}) => (
  <div className="border border-border/50 rounded-xl p-4 bg-background space-y-3 group">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <GripVertical className="w-3.5 h-3.5 opacity-40" /> Item {index + 1}
      </span>
      <button
        onClick={onDelete}
        className="text-muted-foreground/40 hover:text-destructive transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
    {children}
  </div>
);

const Field = ({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) => (
  <div className="space-y-1">
    <label className="text-[11px] text-muted-foreground font-medium">{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
      />
    ) : (
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    )}
  </div>
);

const SocialLinksEditor = ({ value, onChange }: { value: any[]; onChange: (v: any[]) => void }) => {
  const items: { platform: string; url: string; icon?: string }[] = Array.isArray(value) ? value : [];
  
  const platforms = [
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'website', label: 'Website', icon: Globe },
  ];
  
  const update = (i: number, key: string, v: string) => {
    onChange(items.map((item, idx) => idx === i ? { ...item, [key]: v } : item));
  };
  
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const SelectedIcon = platforms.find(p => p.value === item.platform?.toLowerCase())?.icon || Globe;
        return (
          <div key={i} className="border border-border/50 rounded-xl p-4 bg-background space-y-3 group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <SelectedIcon className="w-3.5 h-3.5" /> Social Link {i + 1}
              </span>
              <button
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="text-muted-foreground/40 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-medium">Platform</label>
                <select
                  value={item.platform || ''}
                  onChange={e => update(i, 'platform', e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select platform</option>
                  {platforms.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground font-medium">URL</label>
                <input
                  value={item.url || ''}
                  onChange={e => update(i, 'url', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
        );
      })}
      <button
        onClick={() => onChange([...items, { platform: '', url: '' }])}
        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 border border-dashed border-primary/40 hover:border-primary/60 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Plus className="w-3 h-3" /> Add Social Link
      </button>
    </div>
  );
};

// nav links: [{label, href}]
const NavLinksEditor = ({ value, onChange }: { value: any[]; onChange: (v: any[]) => void }) => {
  const items: { label: string; href: string }[] = Array.isArray(value) ? value : [];
  const update = (i: number, key: string, v: string) => {
    const next = items.map((item, idx) => idx === i ? { ...item, [key]: v } : item);
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <ItemShell key={i} index={i} onDelete={() => onChange(items.filter((_, idx) => idx !== i))}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Label" value={item.label ?? ''} onChange={v => update(i, 'label', v)} placeholder="e.g. Home" />
            <Field label="Link (href)" value={item.href ?? ''} onChange={v => update(i, 'href', v)} placeholder="/home" />
          </div>
        </ItemShell>
      ))}
      <AddBtn onClick={() => onChange([...items, { label: '', href: '' }])} />
    </div>
  );
};

// stats: [{value, label}]
const StatsEditor = ({ value, onChange }: { value: any[]; onChange: (v: any[]) => void }) => {
  const items: { value: string; label: string }[] = Array.isArray(value) ? value : [];
  const update = (i: number, key: string, v: string) => {
    onChange(items.map((item, idx) => idx === i ? { ...item, [key]: v } : item));
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <ItemShell key={i} index={i} onDelete={() => onChange(items.filter((_, idx) => idx !== i))}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Number / Value" value={item.value ?? ''} onChange={v => update(i, 'value', v)} placeholder="e.g. 10K+" />
            <Field label="Label" value={item.label ?? ''} onChange={v => update(i, 'label', v)} placeholder="e.g. Users" />
          </div>
        </ItemShell>
      ))}
      <AddBtn onClick={() => onChange([...items, { value: '', label: '' }])} />
    </div>
  );
};

// trust_badges: string[]
const StringListEditor = ({ value, onChange, placeholder = 'e.g. Free to use' }: { value: any[]; onChange: (v: any[]) => void; placeholder?: string }) => {
  const items: string[] = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={item}
            onChange={e => onChange(items.map((v, idx) => idx === i ? e.target.value : v))}
            placeholder={placeholder}
            className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-muted-foreground/40 hover:text-destructive transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <AddBtn onClick={() => onChange([...items, ''])} />
    </div>
  );
};

// features: [{icon, title, description}]
const FeaturesEditor = ({ value, onChange }: { value: any[]; onChange: (v: any[]) => void }) => {
  const items = Array.isArray(value) ? value : [];
  const update = (i: number, key: string, v: string) => {
    onChange(items.map((item, idx) => idx === i ? { ...item, [key]: v } : item));
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <ItemShell key={i} index={i} onDelete={() => onChange(items.filter((_, idx) => idx !== i))}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Icon (Lucide name)" value={item.icon ?? ''} onChange={v => update(i, 'icon', v)} placeholder="e.g. Zap" />
            <Field label="Title" value={item.title ?? ''} onChange={v => update(i, 'title', v)} placeholder="Feature title" />
          </div>
          <Field label="Description" value={item.description ?? ''} onChange={v => update(i, 'description', v)} multiline placeholder="Short description..." />
        </ItemShell>
      ))}
      <AddBtn onClick={() => onChange([...items, { icon: '', title: '', description: '' }])} />
    </div>
  );
};

// steps: [{step, title, description}] OR [{number, title, description}]
const StepsEditor = ({ value, onChange }: { value: any[]; onChange: (v: any[]) => void }) => {
  const items = Array.isArray(value) ? value : [];
  const update = (i: number, key: string, v: string) => {
    onChange(items.map((item, idx) => idx === i ? { ...item, [key]: v } : item));
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <ItemShell key={i} index={i} onDelete={() => onChange(items.filter((_, idx) => idx !== i))}>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Step #" value={item.step ?? item.number ?? String(i + 1)} onChange={v => update(i, 'step', v)} placeholder={String(i + 1)} />
            <div className="col-span-2">
              <Field label="Title" value={item.title ?? ''} onChange={v => update(i, 'title', v)} placeholder="Step title" />
            </div>
          </div>
          <Field label="Description" value={item.description ?? ''} onChange={v => update(i, 'description', v)} multiline placeholder="Explain this step..." />
        </ItemShell>
      ))}
      <AddBtn onClick={() => onChange([...items, { step: String(items.length + 1), title: '', description: '' }])} />
    </div>
  );
};

// faq: [{question, answer}]
const FAQEditor = ({ value, onChange }: { value: any[]; onChange: (v: any[]) => void }) => {
  const items = Array.isArray(value) ? value : [];
  const update = (i: number, key: string, v: string) => {
    onChange(items.map((item, idx) => idx === i ? { ...item, [key]: v } : item));
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <ItemShell key={i} index={i} onDelete={() => onChange(items.filter((_, idx) => idx !== i))}>
          <Field label="Question" value={item.question ?? ''} onChange={v => update(i, 'question', v)} placeholder="e.g. How does this work?" />
          <Field label="Answer" value={item.answer ?? ''} onChange={v => update(i, 'answer', v)} multiline placeholder="Answer..." />
        </ItemShell>
      ))}
      <AddBtn onClick={() => onChange([...items, { question: '', answer: '' }])} />
    </div>
  );
};

// values: [{icon, title, description}]  — same shape as features
const ValuesEditor = FeaturesEditor;

// contact cards: [{icon, title, value}]
const ContactCardsEditor = ({ value, onChange }: { value: any[]; onChange: (v: any[]) => void }) => {
  const items = Array.isArray(value) ? value : [];
  const update = (i: number, key: string, v: string) => {
    onChange(items.map((item, idx) => idx === i ? { ...item, [key]: v } : item));
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <ItemShell key={i} index={i} onDelete={() => onChange(items.filter((_, idx) => idx !== i))}>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Icon (Lucide)" value={item.icon ?? ''} onChange={v => update(i, 'icon', v)} placeholder="e.g. Phone" />
            <Field label="Title" value={item.title ?? ''} onChange={v => update(i, 'title', v)} placeholder="e.g. Phone" />
            <Field label="Value / Contact" value={item.value ?? ''} onChange={v => update(i, 'value', v)} placeholder="e.g. +1 234 567" />
          </div>
        </ItemShell>
      ))}
      <AddBtn onClick={() => onChange([...items, { icon: '', title: '', value: '' }])} />
    </div>
  );
};

// formula variables: [{name, description}]
const VariablesEditor = ({ value, onChange }: { value: any[]; onChange: (v: any[]) => void }) => {
  const items = Array.isArray(value) ? value : [];
  const update = (i: number, key: string, v: string) => {
    onChange(items.map((item, idx) => idx === i ? { ...item, [key]: v } : item));
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <ItemShell key={i} index={i} onDelete={() => onChange(items.filter((_, idx) => idx !== i))}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Variable Name" value={item.name ?? ''} onChange={v => update(i, 'name', v)} placeholder="e.g. P" />
            <Field label="Description" value={item.description ?? ''} onChange={v => update(i, 'description', v)} placeholder="e.g. Principal amount" />
          </div>
        </ItemShell>
      ))}
      <AddBtn onClick={() => onChange([...items, { name: '', description: '' }])} />
    </div>
  );
};

// example scenario object: {title, items: string[]} or similar flat object
const ExampleScenarioEditor = ({ value, onChange }: { value: any; onChange: (v: any) => void }) => {
  const obj = typeof value === 'object' && value !== null ? value : {};
  const updateKey = (key: string, v: any) => onChange({ ...obj, [key]: v });
  const keys = Object.keys(obj);
  return (
    <div className="space-y-3">
      {keys.map(key => {
        const val = obj[key];
        if (Array.isArray(val)) {
          return (
            <div key={key} className="space-y-2">
              <label className="text-[11px] text-muted-foreground font-medium capitalize">{key}</label>
              <StringListEditor value={val} onChange={v => updateKey(key, v)} />
            </div>
          );
        }
        return (
          <Field
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={String(val ?? '')}
            onChange={v => updateKey(key, v)}
          />
        );
      })}
      {keys.length === 0 && (
        <p className="text-xs text-muted-foreground italic">No data yet. Add the first field below.</p>
      )}
      <button
        onClick={() => {
          const newKey = prompt('Field name (e.g. title, amount):');
          if (newKey) updateKey(newKey, '');
        }}
        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 border border-dashed border-primary/40 hover:border-primary/60 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Plus className="w-3 h-3" /> Add Field
      </button>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminSiteContent = () => {
  const [allContent, setAllContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('homepage');
  const [dirty, setDirty] = useState<Record<string, Record<string, any>>>({});
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const fetchContent = async () => {
    const { data } = await supabase.from('site_content').select('*').order('section_key');
    setAllContent(data ?? []);
    setLoading(false);
    const page = PAGES.find(p => p.id === activePage);
    if (page) setExpandedSections(new Set(page.sections.map(s => s.key)));
  };

  useEffect(() => { fetchContent(); }, []);

  useEffect(() => {
    const page = PAGES.find(p => p.id === activePage);
    if (page) setExpandedSections(new Set(page.sections.map(s => s.key)));
  }, [activePage]);

  const getContent = (key: string): SiteContent | undefined =>
    allContent.find(i => i.section_key === key);

  const getDirtyOrOriginal = (key: string) => {
    if (dirty[key]) return dirty[key];
    const item = getContent(key);
    if (!item) return { title: '', subtitle: '', content: '', metadata: {} };
    return {
      title: item.title ?? '',
      subtitle: item.subtitle ?? '',
      content: item.content ?? '',
      metadata: (item.metadata as Record<string, any>) ?? {},
    };
  };

  const updateField = (sectionKey: string, fieldPath: string, value: any) => {
    const current = getDirtyOrOriginal(sectionKey);
    const updated = { ...current };
    if (fieldPath.startsWith('meta.')) {
      const metaKey = fieldPath.replace('meta.', '');
      updated.metadata = { ...(updated.metadata || {}), [metaKey]: value };
    } else {
      (updated as any)[fieldPath] = value;
    }
    setDirty(prev => ({ ...prev, [sectionKey]: updated }));
  };

  const getFieldValue = (sectionKey: string, fieldPath: string): any => {
    const data = getDirtyOrOriginal(sectionKey);
    if (fieldPath.startsWith('meta.')) {
      const metaKey = fieldPath.replace('meta.', '');
      return (data.metadata as any)?.[metaKey] ?? [];
    }
    return (data as any)[fieldPath] ?? '';
  };

 // In AdminSiteContent component's handleSaveAll function:
const handleSaveAll = async () => {
  if (Object.keys(dirty).length === 0) return toast.info('No changes to save');
  setSaving(true);
  
  try {
    for (const [key, values] of Object.entries(dirty)) {
      const existing = getContent(key);
      const payload = {
        section_key: key,
        title: values.title || null,
        subtitle: values.subtitle || null,
        content: values.content || null,
        metadata: values.metadata || {},
      };
      
      if (existing) {
        await supabase.from('site_content').update(payload).eq('id', existing.id);
      } else {
        await supabase.from('site_content').insert(payload);
      }
    }
    
    // Clear dirty state first
    setDirty({});
    
    // Refetch content from DB
    await fetchContent();
    
    // Invalidate cache for all other components
    invalidateSiteContentCache();
    
    toast.success(`Saved ${Object.keys(dirty).length} section(s)!`);
  } catch (error) {
    toast.error('Failed to save changes');
    console.error('Save error:', error);
  } finally {
    setSaving(false);
  }
};

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const currentPage = PAGES.find(p => p.id === activePage)!;
  const hasDirtyChanges = Object.keys(dirty).length > 0;

  // ─── Render a single field ───
  const renderField = (sectionKey: string, fieldDef: string) => {
    const colonIdx = fieldDef.indexOf(':');
    const path = fieldDef.slice(0, colonIdx);
    const label = fieldDef.slice(colonIdx + 1);
    const value = getFieldValue(sectionKey, path);
    const onChange = (v: any) => updateField(sectionKey, path, v);

    // Special handling for image URL fields
if (label.includes('URL') || label.includes('Logo URL')) {
  return (
    <div key={path} className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      {value && (
        <div className="mb-2 p-2 bg-muted/30 rounded-lg border border-border">
          <img 
            src={value} 
            alt="Logo preview" 
            className="h-12 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <input
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder="https://example.com/logo.svg"
        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}
// Add this after your other special editors (around line 600-650)
if (label === 'social_links') {
  return (
    <div key={path} className="space-y-2">
      <SectionLabel>Social Media Links</SectionLabel>
      <SocialLinksEditor value={value} onChange={onChange} />
    </div>
  );
}
    // ── Special array/object editors keyed by label ──
    if (label === 'nav_links') {
      return (
        <div key={path} className="space-y-2">
          <SectionLabel>Navigation Links</SectionLabel>
          <NavLinksEditor value={value} onChange={onChange} />
        </div>
      );
    }
    if (label === 'stats') {
      return (
        <div key={path} className="space-y-2">
          <SectionLabel>Stats</SectionLabel>
          <StatsEditor value={value} onChange={onChange} />
        </div>
      );
    }
    if (label === 'trust_badges') {
      return (
        <div key={path} className="space-y-2">
          <SectionLabel>Trust Badges</SectionLabel>
          <StringListEditor value={value} onChange={onChange} placeholder="e.g. No credit card required" />
        </div>
      );
    }
    if (label === 'features') {
      return (
        <div key={path} className="space-y-2">
          <SectionLabel>Features</SectionLabel>
          <FeaturesEditor value={value} onChange={onChange} />
        </div>
      );
    }
    if (label === 'steps') {
      return (
        <div key={path} className="space-y-2">
          <SectionLabel>Steps</SectionLabel>
          <StepsEditor value={value} onChange={onChange} />
        </div>
      );
    }
    if (label === 'faq') {
      return (
        <div key={path} className="space-y-2">
          <SectionLabel>FAQ Questions</SectionLabel>
          <FAQEditor value={value} onChange={onChange} />
        </div>
      );
    }
    if (label === 'values') {
      return (
        <div key={path} className="space-y-2">
          <SectionLabel>Core Values</SectionLabel>
          <ValuesEditor value={value} onChange={onChange} />
        </div>
      );
    }
    if (label === 'string_list') {
      return (
        <div key={path} className="space-y-2">
          <SectionLabel>Capabilities List</SectionLabel>
          <StringListEditor value={value} onChange={onChange} placeholder="e.g. Real-time calculation" />
        </div>
      );
    }
    if (label === 'example_scenario') {
      return (
        <div key={path} className="space-y-2">
          <SectionLabel>{path.includes('extra') ? 'Extra Payment Scenario' : 'Standard Scenario'}</SectionLabel>
          <ExampleScenarioEditor value={value} onChange={onChange} />
        </div>
      );
    }
    if (label === 'variables') {
      return (
        <div key={path} className="space-y-2">
          <SectionLabel>Formula Variables</SectionLabel>
          <VariablesEditor value={value} onChange={onChange} />
        </div>
      );
    }
    if (label === 'contact_cards') {
      return (
        <div key={path} className="space-y-2">
          <SectionLabel>Contact Info Cards</SectionLabel>
          <ContactCardsEditor value={value} onChange={onChange} />
        </div>
      );
    }

    // ── Normal text / textarea fields ──
    if (path === 'content') {
      return (
        <div key={path} className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
          <textarea
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            rows={4}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
        </div>
      );
    }

    return (
      <div key={path} className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
        <input
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-0">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif font-bold">Edit Pages</h1>
            <p className="text-sm text-muted-foreground">Edit all your website content — WordPress-style</p>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={!hasDirtyChanges || saving}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              hasDirtyChanges
                ? 'bg-primary text-primary-foreground warm-shadow hover:warm-shadow-lg'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : hasDirtyChanges ? `Save Changes (${Object.keys(dirty).length})` : 'No Changes'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left Sidebar */}
          <nav className="w-56 shrink-0 hidden lg:block">
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden sticky top-20">
              <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pages</h3>
              </div>
              <div className="py-1">
                {PAGES.map(page => {
                  const Icon = page.icon;
                  const isActive = activePage === page.id;
                  const dirtyCount = page.sections.filter(s => dirty[s.key]).length;
                  return (
                    <button
                      key={page.id}
                      onClick={() => setActivePage(page.id)}
                      className={`w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors text-sm ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 truncate">{page.label}</span>
                      {dirtyCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Mobile selector */}
          <div className="lg:hidden w-full mb-4">
            <select
              value={activePage}
              onChange={e => setActivePage(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm"
            >
              {PAGES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>

          {/* Main Content */}
          <div className="w-full flex-1 min-w-0 space-y-4">
            <div className="bg-card rounded-xl border border-border/50 px-5 py-4">
              <div className="flex items-center gap-3">
                {(() => { const Icon = currentPage.icon; return <Icon className="w-5 h-5 text-primary" />; })()}
                <div>
                  <h2 className="text-lg font-semibold">{currentPage.label}</h2>
                  <p className="text-xs text-muted-foreground">{currentPage.description}</p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading content...</div>
            ) : (
              currentPage.sections.map(section => {
                const isExpanded = expandedSections.has(section.key);
                const isDirty = !!dirty[section.key];
                const existing = getContent(section.key);

                return (
                  <div
                    key={section.key}
                    className={`bg-card rounded-xl border overflow-hidden transition-all ${
                      isDirty ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border/50'
                    }`}
                  >
                    <button
                      onClick={() => toggleSection(section.key)}
                      className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        <span className="text-sm font-semibold">{section.label}</span>
                        {isDirty && <span className="text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">Modified</span>}
                        {!existing && <span className="text-[10px] bg-accent/15 text-accent px-2 py-0.5 rounded-full font-medium">New</span>}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">{section.key}</span>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-border/30 space-y-4">
                        {section.fields.map(f => renderField(section.key, f))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sticky Save Bar */}
        {hasDirtyChanges && (
          <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border z-50 px-6 py-3">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                You have unsaved changes in {Object.keys(dirty).length} section(s)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setDirty({})}
                  className="px-4 py-2 rounded-xl text-sm border border-border hover:bg-muted transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-medium"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save All Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

// Small helper component to avoid repeating label styles
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
    {children}
  </label>
);

export default AdminSiteContent;