import { useEffect, useState, useMemo } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart3, TrendingUp, FileText, Newspaper, Eye, Clock, Calendar,
  ArrowUp, ArrowDown, Users, Globe,
} from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import type { Tables } from '@/integrations/supabase/types';

type BlogPost = Tables<'blog_posts'>;

const CHART_COLORS = [
  'hsl(25, 85%, 52%)',   // primary
  'hsl(18, 75%, 48%)',   // accent
  'hsl(160, 55%, 42%)',  // chart-2
  'hsl(210, 60%, 50%)',  // chart-3
  'hsl(340, 65%, 52%)',  // chart-4
  'hsl(45, 90%, 55%)',   // chart-5
];

const AdminAnalytics = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [contentCount, setContentCount] = useState(0);
  const [seoCount, setSeoCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const [postsRes, contentRes, seoRes] = await Promise.all([
        supabase.from('blog_posts').select('*').order('created_at', { ascending: true }),
        supabase.from('site_content').select('id', { count: 'exact', head: true }),
        supabase.from('seo_metadata').select('id', { count: 'exact', head: true }),
      ]);
      setPosts(postsRes.data ?? []);
      setContentCount(contentRes.count ?? 0);
      setSeoCount(seoRes.count ?? 0);
    };
    fetchData();
  }, []);

  // Generate content growth data over last 30 days
  const growthData = useMemo(() => {
    const days = 30;
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      const dayStart = startOfDay(date);
      const postsUntil = posts.filter(p => new Date(p.created_at) <= dayStart).length;
      return {
        date: format(date, 'MMM d'),
        posts: postsUntil,
      };
    });
  }, [posts]);

  // Category distribution
  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    posts.forEach(p => {
      const cat = p.category || 'Uncategorized';
      cats[cat] = (cats[cat] || 0) + 1;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [posts]);

  // Published vs Draft
  const publishData = useMemo(() => [
    { name: 'Published', value: posts.filter(p => p.published).length },
    { name: 'Draft', value: posts.filter(p => !p.published).length },
  ], [posts]);

  // Posts by month
  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    posts.forEach(p => {
      const month = format(new Date(p.created_at), 'MMM yyyy');
      months[month] = (months[month] || 0) + 1;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [posts]);

  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.published).length;
  const featuredPosts = posts.filter(p => p.featured).length;
  const avgReadTime = posts.reduce((sum, p) => sum + (parseInt(p.read_time || '0') || 0), 0) / (totalPosts || 1);

  const summaryCards = [
    { label: 'Total Posts', value: totalPosts, icon: Newspaper, trend: '+' + totalPosts },
    { label: 'Published', value: publishedPosts, icon: Eye, trend: Math.round((publishedPosts / (totalPosts || 1)) * 100) + '%' },
    { label: 'Featured', value: featuredPosts, icon: TrendingUp, trend: featuredPosts + ' active' },
    { label: 'Avg Read Time', value: Math.round(avgReadTime) + 'm', icon: Clock, trend: 'per article' },
    { label: 'Content Sections', value: contentCount, icon: FileText, trend: 'managed' },
    { label: 'SEO Pages', value: seoCount, icon: Globe, trend: 'configured' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> Analytics
          </h1>
          <p className="text-sm text-muted-foreground">Content performance and site metrics overview</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {summaryCards.map(({ label, value, icon: Icon, trend }) => (
            <div key={label} className="bg-card rounded-xl p-4 border border-border/50 warm-shadow">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-[10px] text-muted-foreground">{trend}</span>
              </div>
              <span className="text-xl font-bold font-mono block">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Content Growth */}
          <div className="bg-card rounded-xl border border-border/50 p-5">
            <h3 className="text-sm font-semibold mb-4">Content Growth (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(25, 85%, 52%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(25, 85%, 52%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(35, 20%, 88%)', fontSize: '12px' }} />
                <Area type="monotone" dataKey="posts" stroke="hsl(25, 85%, 52%)" fill="url(#colorPosts)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Posts by Month */}
          <div className="bg-card rounded-xl border border-border/50 p-5">
            <h3 className="text-sm font-semibold mb-4">Posts by Month</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(35, 20%, 88%)', fontSize: '12px' }} />
                <Bar dataKey="count" fill="hsl(25, 85%, 52%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-card rounded-xl border border-border/50 p-5">
            <h3 className="text-sm font-semibold mb-4">Posts by Category</h3>
            {categoryData.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">No data yet</div>
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={4} dataKey="value">
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(35, 20%, 88%)', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {categoryData.map((cat, i) => (
                    <div key={cat.name} className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-muted-foreground">{cat.name}</span>
                      <span className="font-mono font-medium">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Published vs Draft */}
          <div className="bg-card rounded-xl border border-border/50 p-5">
            <h3 className="text-sm font-semibold mb-4">Published vs Draft</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={publishData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={4} dataKey="value">
                    <Cell fill="hsl(25, 85%, 52%)" />
                    <Cell fill="hsl(35, 18%, 80%)" />
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(35, 20%, 88%)', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="w-3 h-3 rounded-sm bg-primary" />
                    Published
                  </div>
                  <span className="text-2xl font-bold font-mono">{publishData[0].value}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="w-3 h-3 rounded-sm bg-muted" />
                    Draft
                  </div>
                  <span className="text-2xl font-bold font-mono">{publishData[1].value}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/50">
            <h3 className="text-sm font-semibold">All Blog Posts Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Category</th>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Read Time</th>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Created</th>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-medium max-w-[200px] truncate">{post.title}</td>
                    <td className="px-5 py-3 text-muted-foreground">{post.category || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${post.published ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{post.read_time || '—'}</td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">{format(new Date(post.created_at), 'MMM d, yyyy')}</td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">{format(new Date(post.updated_at), 'MMM d, yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
