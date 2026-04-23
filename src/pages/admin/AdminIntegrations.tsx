import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, Plug, BarChart3, Search, DollarSign, Code, CheckCircle2, AlertCircle, ExternalLink, Globe, Tag, FileCode } from 'lucide-react';

interface Integration {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  fields: { key: string; label: string; placeholder: string; helpText?: string }[];
  docsUrl?: string;
}

const integrations: Integration[] = [
  {
    key: 'google_analytics',
    label: 'Google Analytics (GA4)',
    description: 'Track website traffic, user behavior, and conversions with Google Analytics 4.',
    icon: BarChart3,
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    docsUrl: 'https://analytics.google.com/',
    fields: [
      { key: 'measurement_id', label: 'Measurement ID', placeholder: 'G-XXXXXXXXXX', helpText: 'Found in GA4 → Admin → Data Streams → your stream' },
    ],
  },
  {
    key: 'google_search_console',
    label: 'Google Search Console',
    description: 'Verify site ownership and monitor search performance, indexing, and crawl issues.',
    icon: Search,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    docsUrl: 'https://search.google.com/search-console',
    fields: [
      { key: 'verification_code', label: 'HTML Tag Verification Code', placeholder: 'abc123xyz...', helpText: 'Go to Search Console → Settings → Ownership verification → HTML tag → copy only the content value' },
    ],
  },
  {
    key: 'google_ads',
    label: 'Google Ads',
    description: 'Add Google Ads conversion tracking and remarketing tags to your site.',
    icon: DollarSign,
    color: 'text-green-500 bg-green-500/10 border-green-500/20',
    docsUrl: 'https://ads.google.com/',
    fields: [
      { key: 'conversion_id', label: 'Conversion ID', placeholder: 'AW-XXXXXXXXX', helpText: 'Found in Google Ads → Tools → Conversions → Tag setup' },
      { key: 'conversion_label', label: 'Conversion Label (optional)', placeholder: 'AbCdEfGhIjKlMn', helpText: 'Required for specific conversion actions' },
    ],
  },
  {
    key: 'google_tag_manager',
    label: 'Google Tag Manager',
    description: 'Manage all your marketing and analytics tags in one place without editing code.',
    icon: Tag,
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    docsUrl: 'https://tagmanager.google.com/',
    fields: [
      { key: 'container_id', label: 'Container ID', placeholder: 'GTM-XXXXXXX', helpText: 'Found in GTM → Admin → Container Settings' },
    ],
  },
  {
    key: 'bing_webmaster',
    label: 'Bing Webmaster Tools',
    description: 'Verify your site with Bing and monitor search performance on Microsoft search.',
    icon: Globe,
    color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
    docsUrl: 'https://www.bing.com/webmasters',
    fields: [
      { key: 'verification_code', label: 'Verification Meta Content', placeholder: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', helpText: 'Bing Webmaster → Add site → HTML Meta Tag → copy the content value' },
    ],
  },
  {
    key: 'facebook_pixel',
    label: 'Facebook / Meta Pixel',
    description: 'Track conversions from Facebook ads, optimize targeting, and build audiences.',
    icon: Code,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    docsUrl: 'https://business.facebook.com/events_manager',
    fields: [
      { key: 'pixel_id', label: 'Pixel ID', placeholder: '123456789012345', helpText: 'Found in Meta Events Manager → Data Sources → your Pixel' },
    ],
  },
  {
    key: 'custom_head_scripts',
    label: 'Custom Head Scripts',
    description: 'Add any custom scripts, meta tags, or code snippets to the <head> of every page.',
    icon: FileCode,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    fields: [
      { key: 'code', label: 'Custom Code', placeholder: '<script>...</script> or <meta ...>', helpText: 'Paste any valid HTML/script tags. They will be injected into the <head> section.' },
    ],
  },
];

const AdminIntegrations = () => {
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from('site_content').select('*').like('section_key', 'integration_%').then(({ data }) => {
      const map: Record<string, Record<string, string>> = {};
      (data ?? []).forEach(item => {
        // section_key format: integration_google_analytics
        const intKey = item.section_key.replace('integration_', '');
        try {
          map[intKey] = (item.metadata as Record<string, string>) ?? {};
        } catch {
          map[intKey] = {};
        }
      });
      setValues(map);
      setLoaded(true);
    });
  }, []);

  const getField = (integrationKey: string, fieldKey: string) =>
    values[integrationKey]?.[fieldKey] ?? '';

  const setField = (integrationKey: string, fieldKey: string, value: string) =>
    setValues(prev => ({
      ...prev,
      [integrationKey]: { ...prev[integrationKey], [fieldKey]: value },
    }));

  const isConnected = (integrationKey: string) => {
    const v = values[integrationKey];
    if (!v) return false;
    return Object.values(v).some(val => val && val.trim().length > 0);
  };

  const handleSave = async (integration: Integration) => {
    setSaving(integration.key);
    const sectionKey = `integration_${integration.key}`;
    const metadata = values[integration.key] ?? {};

    // Upsert
    const { data: existing } = await supabase
      .from('site_content')
      .select('id')
      .eq('section_key', sectionKey)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('site_content')
        .update({ metadata, title: integration.label })
        .eq('id', existing.id);
      if (error) { toast.error(error.message); setSaving(null); return; }
    } else {
      const { error } = await supabase
        .from('site_content')
        .insert({ section_key: sectionKey, title: integration.label, metadata });
      if (error) { toast.error(error.message); setSaving(null); return; }
    }

    toast.success(`${integration.label} settings saved!`);
    setSaving(null);
  };

  const handleDisconnect = async (integration: Integration) => {
    if (!confirm(`Remove ${integration.label} integration?`)) return;
    const sectionKey = `integration_${integration.key}`;
    await supabase.from('site_content').delete().eq('section_key', sectionKey);
    setValues(prev => { const n = { ...prev }; delete n[integration.key]; return n; });
    toast.success(`${integration.label} disconnected`);
  };

  if (!loaded) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
            <Plug className="w-6 h-6 text-primary" /> Integrations & Connections
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your site with Google Console, Analytics, Ads, and other marketing tools. Tracking codes are injected automatically.
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {integrations.slice(0, 4).map(int => (
            <div key={int.key} className="bg-card rounded-xl border border-border/50 p-3 flex items-center gap-2">
              {isConnected(int.key) ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
              )}
              <span className="text-xs font-medium truncate">{int.label.split('(')[0].trim()}</span>
            </div>
          ))}
        </div>

        {/* Integration Cards */}
        <div className="space-y-4">
          {integrations.map(integration => {
            const connected = isConnected(integration.key);
            const Icon = integration.icon;
            const isSaving = saving === integration.key;
            const isCustomCode = integration.key === 'custom_head_scripts';

            return (
              <div key={integration.key} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${integration.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{integration.label}</h3>
                        {connected && (
                          <span className="text-[10px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded font-medium uppercase tracking-wide">Connected</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
                    </div>
                  </div>
                  {integration.docsUrl && (
                    <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Docs
                    </a>
                  )}
                </div>

                {/* Fields */}
                <div className="p-5 space-y-4">
                  {integration.fields.map(field => (
                    <div key={field.key} className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{field.label}</label>
                      {isCustomCode && field.key === 'code' ? (
                        <textarea
                          value={getField(integration.key, field.key)}
                          onChange={e => setField(integration.key, field.key, e.target.value)}
                          placeholder={field.placeholder}
                          rows={4}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                        />
                      ) : (
                        <input
                          value={getField(integration.key, field.key)}
                          onChange={e => setField(integration.key, field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      )}
                      {field.helpText && (
                        <p className="text-[11px] text-muted-foreground/70">{field.helpText}</p>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleSave(integration)}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    {connected && (
                      <button
                        onClick={() => handleDisconnect(integration)}
                        className="px-4 py-2 rounded-xl text-sm border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminIntegrations;
