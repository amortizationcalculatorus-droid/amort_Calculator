import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { invalidateSiteContentCache } from '@/hooks/useSiteContent';
import {
  Save, Palette, PanelTop, PanelBottom, Image, Type, Link2, Plus, Trash2, GripVertical,
} from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { ImageUpload } from '@/components/ImageUpload';

type SiteContent = Tables<'site_content'>;

const AdminAppearance = () => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'branding' | 'header' | 'footer'>('branding');

  // Editable state
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [logoIcon, setLogoIcon] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');

  const [headerBrand, setHeaderBrand] = useState('');
  const [navLinks, setNavLinks] = useState<Array<{ to: string; label: string }>>([]);

  const [footerBrand, setFooterBrand] = useState('');
  const [footerDesc, setFooterDesc] = useState('');
  const [footerStats, setFooterStats] = useState<Array<{ label: string; value: string }>>([]);
  const [newsletterTitle, setNewsletterTitle] = useState('');
  const [newsletterDesc, setNewsletterDesc] = useState('');
  const [copyrightText, setCopyrightText] = useState('');
  const [copyrightSub, setCopyrightSub] = useState('');

  const fetchContent = async () => {
    const { data } = await supabase.from('site_content').select('*');
    setContent(data ?? []);
    setLoading(false);

    const get = (key: string) => data?.find(i => i.section_key === key);
    const meta = (key: string) => (get(key)?.metadata as Record<string, any>) ?? {};

    // Branding
    const brand = get('site_brand');
    setBrandName(brand?.title ?? 'AmortIQ');
    setTagline(brand?.subtitle ?? '');
    setLogoIcon(meta('site_brand')?.logo_icon ?? 'BarChart3');
    setFaviconUrl(meta('site_brand')?.favicon_url ?? '/favicon.ico');

    // Header
    setHeaderBrand(get('header_brand')?.title ?? '');
    setNavLinks((meta('header_nav')?.links as any[]) ?? [
      { to: '/', label: 'Calculator' },
      { to: '/how-to-use', label: 'How to Use' },
      { to: '/about', label: 'About Us' },
      { to: '/blog', label: 'Blog' },
      { to: '/contact', label: 'Contact' },
    ]);

    // Footer
    setFooterBrand(get('footer_brand')?.title ?? '');
    setFooterDesc(get('footer_brand')?.subtitle ?? '');
    setFooterStats((meta('footer_brand')?.stats as any[]) ?? []);
    setNewsletterTitle(get('footer_newsletter')?.title ?? '');
    setNewsletterDesc(get('footer_newsletter')?.subtitle ?? '');
    setCopyrightText(get('footer_copyright')?.title ?? '');
    setCopyrightSub(get('footer_copyright')?.subtitle ?? '');
  };

  useEffect(() => { fetchContent(); }, []);

  const upsert = async (key: string, payload: any) => {
    const existing = content.find(c => c.section_key === key);
    if (existing) {
      await supabase.from('site_content').update(payload).eq('id', existing.id);
    } else {
      await supabase.from('site_content').insert({ section_key: key, ...payload });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === 'branding') {
        await upsert('site_brand', { title: brandName, subtitle: tagline, metadata: { logo_icon: logoIcon, favicon_url: faviconUrl } });
      } else if (activeTab === 'header') {
        await upsert('header_brand', { title: headerBrand });
        await upsert('header_nav', { metadata: { links: navLinks } });
      } else {
        await upsert('footer_brand', { title: footerBrand, subtitle: footerDesc, metadata: { stats: footerStats } });
        await upsert('footer_newsletter', { title: newsletterTitle, subtitle: newsletterDesc });
        await upsert('footer_copyright', { title: copyrightText, subtitle: copyrightSub });
      }
      toast.success('Saved!');
      invalidateSiteContentCache();
      fetchContent();
    } catch (err: any) {
      toast.error(err.message);
    }
    setSaving(false);
  };

  const tabs = [
    { id: 'branding' as const, label: 'Branding', icon: Palette },
    { id: 'header' as const, label: 'Header', icon: PanelTop },
    { id: 'footer' as const, label: 'Footer', icon: PanelBottom },
  ];

  const inputCls = "w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
  const labelCls = "text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-1.5";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
              <Palette className="w-6 h-6 text-primary" /> Appearance
            </h1>
            <p className="text-sm text-muted-foreground">Customize your site's look — branding, header, and footer</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium warm-shadow"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === t.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <div className="bg-card rounded-xl border border-border/50 p-6">
            {/* BRANDING TAB */}
            {activeTab === 'branding' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Type className="w-4 h-4 text-primary" /> Site Identity
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Site Name</label>
                      <input value={brandName} onChange={e => setBrandName(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Tagline</label>
                      <input value={tagline} onChange={e => setTagline(e.target.value)} className={inputCls} placeholder="A short description of your site" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Image className="w-4 h-4 text-primary" /> Logo & Favicon
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Logo Icon (Lucide icon name)</label>
                      <input value={logoIcon} onChange={e => setLogoIcon(e.target.value)} className={inputCls} placeholder="BarChart3" />
                      <p className="text-[10px] text-muted-foreground mt-1">Browse icons at lucide.dev/icons</p>
                    </div>
                    <ImageUpload
                      label="Favicon"
                      value={faviconUrl}
                      onChange={setFaviconUrl}
                      accept="image/*,.ico"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* HEADER TAB */}
            {activeTab === 'header' && (
              <div className="space-y-6">
                <div className="max-w-xl">
                  <label className={labelCls}>Header Brand Name</label>
                  <input value={headerBrand} onChange={e => setHeaderBrand(e.target.value)} className={inputCls} placeholder="Appears in the site header" />
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-primary" /> Navigation Links
                  </h3>
                  <div className="space-y-2">
                    {navLinks.map((link, i) => (
                      <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-2.5">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                        <input
                          value={link.label}
                          onChange={e => {
                            const updated = [...navLinks];
                            updated[i] = { ...updated[i], label: e.target.value };
                            setNavLinks(updated);
                          }}
                          className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm"
                          placeholder="Label"
                        />
                        <input
                          value={link.to}
                          onChange={e => {
                            const updated = [...navLinks];
                            updated[i] = { ...updated[i], to: e.target.value };
                            setNavLinks(updated);
                          }}
                          className="w-40 bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-mono"
                          placeholder="/path"
                        />
                        <button
                          onClick={() => setNavLinks(navLinks.filter((_, j) => j !== i))}
                          className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setNavLinks([...navLinks, { to: '/', label: 'New Link' }])}
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Navigation Link
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER TAB */}
            {activeTab === 'footer' && (
              <div className="space-y-8">
                {/* Footer Brand */}
                <div className="max-w-xl space-y-4">
                  <h3 className="font-semibold text-sm mb-2">Footer Brand</h3>
                  <div>
                    <label className={labelCls}>Brand Name</label>
                    <input value={footerBrand} onChange={e => setFooterBrand(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <textarea value={footerDesc} onChange={e => setFooterDesc(e.target.value)} rows={3} className={inputCls + ' resize-none'} />
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <h3 className="font-semibold text-sm mb-3">Footer Stats</h3>
                  <div className="space-y-2">
                    {footerStats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-2.5">
                        <input
                          value={stat.value}
                          onChange={e => {
                            const updated = [...footerStats];
                            updated[i] = { ...updated[i], value: e.target.value };
                            setFooterStats(updated);
                          }}
                          className="w-24 bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-mono"
                          placeholder="Value"
                        />
                        <input
                          value={stat.label}
                          onChange={e => {
                            const updated = [...footerStats];
                            updated[i] = { ...updated[i], label: e.target.value };
                            setFooterStats(updated);
                          }}
                          className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm"
                          placeholder="Label"
                        />
                        <button onClick={() => setFooterStats(footerStats.filter((_, j) => j !== i))} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => setFooterStats([...footerStats, { value: '', label: '' }])} className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                      <Plus className="w-3.5 h-3.5" /> Add Stat
                    </button>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="max-w-xl space-y-4">
                  <h3 className="font-semibold text-sm mb-2">Newsletter Section</h3>
                  <div>
                    <label className={labelCls}>Heading</label>
                    <input value={newsletterTitle} onChange={e => setNewsletterTitle(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <input value={newsletterDesc} onChange={e => setNewsletterDesc(e.target.value)} className={inputCls} />
                  </div>
                </div>

                {/* Copyright */}
                <div className="max-w-xl space-y-4">
                  <h3 className="font-semibold text-sm mb-2">Copyright</h3>
                  <div>
                    <label className={labelCls}>Copyright Text</label>
                    <input value={copyrightText} onChange={e => setCopyrightText(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Subtitle</label>
                    <input value={copyrightSub} onChange={e => setCopyrightSub(e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAppearance;
