import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import {
  FileText, Newspaper, Globe, Phone, TrendingUp, Clock, Eye, PenLine,
  BarChart3, ArrowUpRight, Calendar, Activity, Image, Settings, Layout,
  ExternalLink, Plus,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type BlogPost = Tables<'blog_posts'>;

const AdminDashboard = () => {
  const [stats, setStats] = useState({ content: 0, blogs: 0, published: 0, drafts: 0, seo: 0, contact: 0 });
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [recentContent, setRecentContent] = useState<Tables<'site_content'>[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [content, blogs, published, drafts, seo, contact, posts, contentItems] = await Promise.all([
        supabase.from('site_content').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('published', false),
        supabase.from('seo_metadata').select('id', { count: 'exact', head: true }),
        supabase.from('contact_info').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*').order('updated_at', { ascending: false }).limit(5),
        supabase.from('site_content').select('*').order('updated_at', { ascending: false }).limit(5),
      ]);
      setStats({
        content: content.count ?? 0,
        blogs: blogs.count ?? 0,
        published: published.count ?? 0,
        drafts: drafts.count ?? 0,
        seo: seo.count ?? 0,
        contact: contact.count ?? 0,
      });
      setRecentPosts(posts.data ?? []);
      setRecentContent(contentItems.data ?? []);
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: 'Total Blog Posts', count: stats.blogs, icon: Newspaper, color: 'bg-primary/10 text-primary', href: '/admin/blog' },
    { label: 'Published', count: stats.published, icon: Eye, color: 'bg-primary/10 text-primary', href: '/admin/blog' },
    { label: 'Drafts', count: stats.drafts, icon: PenLine, color: 'bg-accent/10 text-accent', href: '/admin/blog' },
    { label: 'Content Sections', count: stats.content, icon: FileText, color: 'bg-primary/10 text-primary', href: '/admin/content' },
    { label: 'SEO Pages', count: stats.seo, icon: Globe, color: 'bg-primary/10 text-primary', href: '/admin/seo' },
    { label: 'Contact Entries', count: stats.contact, icon: Phone, color: 'bg-primary/10 text-primary', href: '/admin/contact' },
  ];

  const quickActions = [
    { label: 'New Blog Post', icon: Plus, href: '/admin/blog', desc: 'Create & publish articles' },
    { label: 'Edit Pages', icon: Layout, href: '/admin/content', desc: 'Update all page content' },
    { label: 'Upload Media', icon: Image, href: '/admin/media', desc: 'Manage images & files' },
    { label: 'SEO Settings', icon: Globe, href: '/admin/seo', desc: 'Optimize for search' },
    { label: 'Analytics', icon: BarChart3, href: '/admin/analytics', desc: 'View site metrics' },
    { label: 'Settings', icon: Settings, href: '/admin/settings', desc: 'Account & site settings' },
  ];

  const pages = [
    { name: 'Homepage', path: '/', sections: 'Hero, Calculator, Features, How It Works, FAQ, CTA', prefix: 'home_' },
    { name: 'About', path: '/about', sections: 'Mission, Vision, Values, Features, Disclaimer', prefix: 'about_' },
    { name: 'How to Use', path: '/how-to-use', sections: 'Guide steps, Example, Formula', prefix: 'howto_' },
    { name: 'Contact', path: '/contact', sections: 'Contact form, Info cards', prefix: 'contact_' },
    { name: 'Header', path: '', sections: 'Brand name, Logo, Navigation links', prefix: 'header_' },
    { name: 'Footer', path: '', sections: 'Brand, Newsletter, Copyright, Stats', prefix: 'footer_' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Manage your entire website from here.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(), 'EEEE, MMM d, yyyy')}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map(({ label, count, icon: Icon, color, href }) => (
            <Link key={label} to={href} className="bg-card rounded-xl p-4 border border-border/50 warm-shadow hover:warm-shadow-lg transition-all group">
              <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-2`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-2xl font-bold font-mono block">{count}</span>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
            </Link>
          ))}
        </div>

        {/* Quick Actions - WordPress Style */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map(({ label, icon: Icon, href, desc }) => (
              <Link key={label} to={href} className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-all group text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium block">{label}</span>
                <span className="text-[10px] text-muted-foreground">{desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Pages Overview - WordPress Style */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Layout className="w-4 h-4 text-primary" /> Pages & Sections
            </h3>
            <Link to="/admin/content" className="text-xs text-primary hover:underline">Edit All →</Link>
          </div>
          <div className="divide-y divide-border/50">
            {pages.map(page => (
              <div key={page.name} className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-muted/10 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{page.name}</span>
                    {page.path && (
                      <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">{page.path}</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{page.sections}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Link to="/admin/content" className="px-2.5 py-1.5 rounded-lg text-xs border border-border hover:bg-muted transition-colors">
                    Edit
                  </Link>
                  {page.path && (
                    <a href={page.path} target="_blank" className="px-2.5 py-1.5 rounded-lg text-xs border border-border hover:bg-muted transition-colors">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Blog Posts */}
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-primary" /> Recent Blog Posts
              </h3>
              <Link to="/admin/blog" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-border/50">
              {recentPosts.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">No posts yet</div>
              ) : recentPosts.map(post => (
                <div key={post.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{post.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${post.published ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {format(new Date(post.updated_at), 'MMM d')}
                      </span>
                    </div>
                  </div>
                  <Link to="/admin/blog" className="text-xs text-primary hover:underline shrink-0">Edit</Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Site Content */}
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Recent Content Updates
              </h3>
              <Link to="/admin/content" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-border/50">
              {recentContent.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">No content yet</div>
              ) : recentContent.map(item => (
                <div key={item.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{item.title || item.section_key}</p>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {format(new Date(item.updated_at), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded shrink-0">{item.section_key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
