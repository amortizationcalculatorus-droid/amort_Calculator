import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type SeoMeta = Tables<'seo_metadata'>;

const AdminSeo = () => {
  const [items, setItems] = useState<SeoMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<SeoMeta> | null>(null);

  const fetchItems = async () => {
    const { data } = await supabase.from('seo_metadata').select('*').order('page_path');
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!editing?.page_path) return toast.error('Page path is required');

    const payload = {
      page_path: editing.page_path,
      title: editing.title ?? null,
      description: editing.description ?? null,
      og_title: editing.og_title ?? null,
      og_description: editing.og_description ?? null,
      og_image: editing.og_image ?? null,
      keywords: editing.keywords ?? [],
    };

    if (editing.id) {
      const { error } = await supabase.from('seo_metadata').update(payload).eq('id', editing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from('seo_metadata').insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success('Saved!');
    setEditing(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    await supabase.from('seo_metadata').delete().eq('id', id);
    toast.success('Deleted');
    fetchItems();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold">SEO Metadata</h1>
            <p className="text-sm text-muted-foreground">Manage page titles, descriptions, and Open Graph tags</p>
          </div>
          <button onClick={() => setEditing({ page_path: '', title: '', description: '', keywords: [] })} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Page
          </button>
        </div>

        {editing && (
          <div className="bg-card rounded-2xl p-6 border border-border/50 warm-shadow space-y-4">
            <h3 className="font-semibold">{editing.id ? 'Edit SEO' : 'New Page SEO'}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Page Path</label>
                <input value={editing.page_path ?? ''} onChange={e => setEditing({ ...editing, page_path: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="/ or /about" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Page Title</label>
                <input value={editing.title ?? ''} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Page Title (max 60 chars)" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Meta Description</label>
              <textarea value={editing.description ?? ''} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={2} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" placeholder="Page description (max 160 chars)" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">OG Title</label>
                <input value={editing.og_title ?? ''} onChange={e => setEditing({ ...editing, og_title: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">OG Image URL</label>
                <input value={editing.og_image ?? ''} onChange={e => setEditing({ ...editing, og_image: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Keywords (comma-separated)</label>
              <input value={(editing.keywords ?? []).join(', ')} onChange={e => setEditing({ ...editing, keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="mortgage, calculator, amortization" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium"><Save className="w-4 h-4" /> Save</button>
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-sm border border-border hover:bg-muted transition-colors">Cancel</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No SEO entries yet.</div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-card rounded-xl p-4 border border-border/50 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{item.page_path}</span>
                  <h3 className="font-semibold text-sm mt-1">{item.title || '(No title)'}</h3>
                  {item.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setEditing(item)} className="px-3 py-1.5 rounded-lg text-xs border border-border hover:bg-muted transition-colors">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSeo;
