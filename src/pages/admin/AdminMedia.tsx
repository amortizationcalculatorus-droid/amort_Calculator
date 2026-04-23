import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Image, Upload, Trash2, Copy, ExternalLink, Search, Grid, List } from 'lucide-react';

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
  metadata: Record<string, any>;
  url: string;
}

const AdminMedia = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [dragOver, setDragOver] = useState(false);

  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from('media').list('', {
      limit: 200,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (error) {
      console.error('Storage list error:', error);
      setLoading(false);
      return;
    }

    if (data) {
      const filesWithUrls = data
        .filter(f => f.name && f.name !== '.emptyFolderPlaceholder')
        .map(f => ({
          name: f.name,
          id: f.id ?? f.name,
          created_at: f.created_at ?? '',
          metadata: (f.metadata as Record<string, any>) ?? {},
          url: supabase.storage.from('media').getPublicUrl(f.name).data.publicUrl,
        }));
      setFiles(filesWithUrls);
    }
    setLoading(false);
  };

  useEffect(() => { fetchFiles(); }, []);

  const uploadFiles = async (fileList: FileList | File[]) => {
    setUploading(true);
    const filesToUpload = Array.from(fileList);
    let successCount = 0;

    for (const file of filesToUpload) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error } = await supabase.storage.from('media').upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
      });
      if (!error) successCount++;
      else console.error('Upload error:', error.message);
    }

    setUploading(false);
    if (successCount > 0) {
      toast.success(`${successCount} file(s) uploaded!`);
      fetchFiles();
    } else {
      toast.error('Upload failed');
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const handleDelete = async (name: string) => {
    if (!confirm('Delete this file?')) return;
    const { error } = await supabase.storage.from('media').remove([name]);
    if (error) return toast.error(error.message);
    toast.success('File deleted');
    fetchFiles();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!');
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImage = (name: string) => /\.(jpg|jpeg|png|gif|svg|webp|avif|ico)$/i.test(name);

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div
        className="space-y-6"
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
              <Image className="w-6 h-6 text-primary" /> Media Library
            </h1>
            <p className="text-sm text-muted-foreground">{files.length} files · Upload images for blog posts, logos, and page content</p>
          </div>
          <label className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer warm-shadow hover:warm-shadow-lg transition-all">
            <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Files'}
            <input type="file" className="hidden" onChange={handleUpload} accept="image/*,.pdf,.svg,.webp,.ico" multiple disabled={uploading} />
          </label>
        </div>

        {/* Search & View Toggle */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Search files..." />
          </div>
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}><List className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Drag Overlay */}
        {dragOver && (
          <div className="fixed inset-0 bg-primary/10 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card rounded-2xl p-12 border-2 border-dashed border-primary text-center">
              <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
              <p className="text-lg font-semibold">Drop files here to upload</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border-2 border-dashed border-border">
            <Image className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground mb-1">{search ? 'No files match your search' : 'No files uploaded yet'}</p>
            <p className="text-xs text-muted-foreground">Drag & drop files here or click "Upload Files" above</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(file => (
              <div key={file.id} className="bg-card rounded-xl border border-border/50 overflow-hidden group hover:warm-shadow-lg transition-all">
                <div className="aspect-square bg-muted/30 relative overflow-hidden">
                  {isImage(file.name) ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => copyUrl(file.url)} className="p-2 bg-background/90 rounded-lg hover:bg-background" title="Copy URL">
                      <Copy className="w-4 h-4" />
                    </button>
                    <a href={file.url} target="_blank" className="p-2 bg-background/90 rounded-lg hover:bg-background" title="Open">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => handleDelete(file.name)} className="p-2 bg-destructive/90 text-destructive-foreground rounded-lg hover:bg-destructive" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium truncate">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatSize(file.metadata?.size)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border/50 divide-y divide-border/30">
            {filtered.map(file => (
              <div key={file.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/10 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-muted/30 overflow-hidden shrink-0">
                  {isImage(file.name) ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Image className="w-4 h-4 text-muted-foreground/40" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatSize(file.metadata?.size)}</p>
                </div>
                <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => copyUrl(file.url)} className="px-2.5 py-1.5 rounded-lg text-xs border border-border hover:bg-muted">Copy URL</button>
                  <button onClick={() => handleDelete(file.name)} className="px-2.5 py-1.5 rounded-lg text-xs text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMedia;
