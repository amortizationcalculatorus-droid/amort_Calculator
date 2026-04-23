import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2, Eye, EyeOff, Star, Search, Filter, ExternalLink, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';
import { ImageUpload } from '@/components/ImageUpload';

type BlogPost = Tables<'blog_posts'>;

const AdminBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [expandedEditor, setExpandedEditor] = useState(false);
  const [previewContent, setPreviewContent] = useState(false);

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.excerpt ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'published' ? post.published : !post.published);
    return matchesSearch && matchesFilter;
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    const updates: Partial<BlogPost> = { ...editing, title };
    // Auto-generate slug only for new posts
    if (!editing?.id) {
      updates.slug = generateSlug(title);
    }
    setEditing(updates);
  };

  const estimateReadTime = (content: string[]) => {
    const words = content.join(' ').split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min`;
  };

  const handleSave = async () => {
    if (!editing?.title || !editing?.slug) return toast.error('Title and slug are required');

    const content = editing.content ?? [];
    const payload = {
      slug: editing.slug,
      title: editing.title,
      excerpt: editing.excerpt ?? null,
      content,
      category: editing.category ?? null,
      image_url: editing.image_url ?? null,
      featured: editing.featured ?? false,
      read_time: editing.read_time || estimateReadTime(content),
      published: editing.published ?? false,
    };

    if (editing.id) {
      const { error } = await supabase.from('blog_posts').update(payload).eq('id', editing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from('blog_posts').insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success('Saved!');
    setEditing(null);
    setPreviewContent(false);
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    toast.success('Post deleted');
    fetchPosts();
  };

  const togglePublish = async (post: BlogPost) => {
    await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id);
    toast.success(post.published ? 'Unpublished' : 'Published');
    fetchPosts();
  };

  const duplicatePost = async (post: BlogPost) => {
    const { error } = await supabase.from('blog_posts').insert({
      slug: post.slug + '-copy-' + Date.now(),
      title: post.title + ' (Copy)',
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image_url: post.image_url,
      featured: false,
      read_time: post.read_time,
      published: false,
    });
    if (error) return toast.error(error.message);
    toast.success('Post duplicated as draft');
    fetchPosts();
  };

  const renderContentPreview = (content: string[]) => {
    return content.map((block, i) => {
      if (block.startsWith('## ')) {
        return <h3 key={i} className="text-base font-serif font-bold mt-4 mb-2">{block.replace('## ', '')}</h3>;
      }
      return <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2">{block}</p>;
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold">Blog Posts</h1>
            <p className="text-sm text-muted-foreground">{posts.length} total · {posts.filter(p => p.published).length} published · {posts.filter(p => !p.published).length} drafts</p>
          </div>
          <button onClick={() => { setEditing({ slug: '', title: '', excerpt: '', content: [], category: '', read_time: '', published: false, featured: false }); setExpandedEditor(true); }} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium warm-shadow hover:warm-shadow-lg transition-all">
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>

        {/* Editor */}
        {editing && (
          <div className="bg-card rounded-2xl border border-border/50 warm-shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
              <h3 className="font-semibold text-sm">{editing.id ? '✏️ Edit Post' : '📝 New Post'}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setPreviewContent(!previewContent)} className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
                  {previewContent ? 'Editor' : 'Preview'}
                </button>
                <button onClick={() => setExpandedEditor(!expandedEditor)} className="text-muted-foreground hover:text-foreground">
                  {expandedEditor ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Title & Slug */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Title *</label>
                  <input value={editing.title ?? ''} onChange={e => handleTitleChange(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium" placeholder="Post title" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Slug *</label>
                  <input value={editing.slug ?? ''} onChange={e => setEditing({ ...editing, slug: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono" placeholder="url-friendly-slug" />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Excerpt</label>
                <textarea value={editing.excerpt ?? ''} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} rows={2} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" placeholder="Brief summary of the article..." />
                <span className="text-[10px] text-muted-foreground">{(editing.excerpt ?? '').length}/300 characters</span>
              </div>

              {expandedEditor && (
                <>
                  {/* Content */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Content {previewContent ? '(Preview)' : '(one paragraph per line, use ## for headings)'}
                    </label>
                    {previewContent ? (
                      <div className="bg-background border border-border rounded-xl p-5 min-h-[200px] max-h-[400px] overflow-y-auto">
                        {renderContentPreview(editing.content ?? [])}
                      </div>
                    ) : (
                      <textarea
                        value={(editing.content ?? []).join('\n')}
                        onChange={e => setEditing({ ...editing, content: e.target.value.split('\n') })}
                        rows={14}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none font-mono leading-relaxed"
                        placeholder="Write your article content here...&#10;&#10;## Use ## for headings&#10;&#10;Each line becomes a paragraph."
                      />
                    )}
                    <span className="text-[10px] text-muted-foreground">
                      {(editing.content ?? []).filter(Boolean).length} paragraphs · ~{(editing.content ?? []).join(' ').split(/\s+/).length} words · Est. {estimateReadTime(editing.content ?? [])} read
                    </span>
                  </div>

                  {/* Featured Image & Metadata */}
                  <div className="space-y-4">
                    <ImageUpload
                      label="Featured Image"
                      value={editing.image_url ?? ''}
                      onChange={url => setEditing({ ...editing, image_url: url })}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</label>
                        <input value={editing.category ?? ''} onChange={e => setEditing({ ...editing, category: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Education" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Read Time</label>
                        <input value={editing.read_time ?? ''} onChange={e => setEditing({ ...editing, read_time: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Auto-calculated" />
                      </div>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={editing.published ?? false} onChange={e => setEditing({ ...editing, published: e.target.checked })} className="rounded border-border" />
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" /> Published
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={editing.featured ?? false} onChange={e => setEditing({ ...editing, featured: e.target.checked })} className="rounded border-border" />
                      <Star className="w-3.5 h-3.5 text-muted-foreground" /> Featured
                    </label>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <button onClick={handleSave} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium warm-shadow hover:warm-shadow-lg transition-all">
                  <Save className="w-4 h-4" /> {editing.id ? 'Update Post' : 'Create Post'}
                </button>
                {editing.published === false && (
                  <button onClick={() => { setEditing({ ...editing, published: true }); setTimeout(handleSave, 0); }} className="px-4 py-2.5 rounded-xl text-sm border border-primary/30 text-primary hover:bg-primary/5 transition-colors">
                    Save & Publish
                  </button>
                )}
                <button onClick={() => { setEditing(null); setPreviewContent(false); }} className="px-4 py-2.5 rounded-xl text-sm border border-border hover:bg-muted transition-colors ml-auto">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter */}
        {!editing && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Search posts..."
              />
            </div>
            <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
              {(['all', 'published', 'draft'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : !editing && filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">No posts found</p>
            <button onClick={() => setEditing({ slug: '', title: '', excerpt: '', content: [], category: '', read_time: '', published: false, featured: false })} className="text-sm text-primary hover:underline">Create your first post →</button>
          </div>
        ) : !editing && (
          <div className="space-y-2">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/20 transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {post.featured && <Star className="w-3.5 h-3.5 text-accent fill-accent" />}
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${post.published ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      {post.category && <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded">{post.category}</span>}
                      {post.read_time && <span className="text-[10px] text-muted-foreground">{post.read_time}</span>}
                    </div>
                    <h3 className="font-semibold text-sm mb-0.5">{post.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span>Created {format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                      <span>·</span>
                      <span>Updated {format(new Date(post.updated_at), 'MMM d, yyyy')}</span>
                      <span>·</span>
                      <span className="font-mono">/blog/{post.slug}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => togglePublish(post)} className="px-2.5 py-1.5 rounded-lg text-xs border border-border hover:bg-muted transition-colors" title={post.published ? 'Unpublish' : 'Publish'}>
                      {post.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => duplicatePost(post)} className="px-2.5 py-1.5 rounded-lg text-xs border border-border hover:bg-muted transition-colors" title="Duplicate">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { setEditing(post); setExpandedEditor(true); }} className="px-2.5 py-1.5 rounded-lg text-xs border border-border hover:bg-muted transition-colors">Edit</button>
                    {post.published && (
                      <a href={`/blog/${post.slug}`} target="_blank" className="px-2.5 py-1.5 rounded-lg text-xs border border-border hover:bg-muted transition-colors" title="View">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button onClick={() => handleDelete(post.id)} className="px-2.5 py-1.5 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBlogPosts;
