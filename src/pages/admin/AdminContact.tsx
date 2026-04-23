import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type ContactInfo = Tables<'contact_info'>;

const AdminContact = () => {
  const [items, setItems] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<ContactInfo> | null>(null);

  const fetchItems = async () => {
    const { data } = await supabase.from('contact_info').select('*').order('key');
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!editing?.key || !editing?.value) return toast.error('Key and value are required');

    const payload = { key: editing.key, value: editing.value, label: editing.label ?? null };

    if (editing.id) {
      const { error } = await supabase.from('contact_info').update(payload).eq('id', editing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from('contact_info').insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success('Saved!');
    setEditing(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    await supabase.from('contact_info').delete().eq('id', id);
    toast.success('Deleted');
    fetchItems();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold">Contact Info</h1>
            <p className="text-sm text-muted-foreground">Manage email, phone, address, and social links</p>
          </div>
          <button onClick={() => setEditing({ key: '', value: '', label: '' })} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium">
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        </div>

        {editing && (
          <div className="bg-card rounded-2xl p-6 border border-border/50 warm-shadow space-y-4">
            <h3 className="font-semibold">{editing.id ? 'Edit Entry' : 'New Entry'}</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Key</label>
                <input value={editing.key ?? ''} onChange={e => setEditing({ ...editing, key: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="email, phone, address" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Label</label>
                <input value={editing.label ?? ''} onChange={e => setEditing({ ...editing, label: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Display label" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Value</label>
                <input value={editing.value ?? ''} onChange={e => setEditing({ ...editing, value: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="contact@example.com" />
              </div>
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
          <div className="text-center py-12 text-muted-foreground">No contact entries yet.</div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-card rounded-xl p-4 border border-border/50 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{item.key}</span>
                    {item.label && <span className="text-xs text-muted-foreground">{item.label}</span>}
                  </div>
                  <p className="text-sm font-medium mt-1">{item.value}</p>
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

export default AdminContact;
