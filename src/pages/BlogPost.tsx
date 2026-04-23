import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ScrollReveal } from '@/components/ScrollAnimations';
import { motion } from 'framer-motion';
import { getPostBySlug, posts } from '@/lib/blogData';
import { Clock, ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react';
import { SEO } from '@/components/SEO';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug || '');

  if (!post) {
    return (
      <Layout>
        <SEO
          title="Article Not Found | AmortIQ"
          description="The requested article could not be found. Browse our collection of loan and mortgage guides."
          url={`${window.location.origin}/blog/${slug}`}
        />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Link to="/blog" className="text-primary font-semibold hover:underline">← Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  const currentIndex = posts.findIndex(p => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  let relatedPosts = posts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 2);
  if (relatedPosts.length < 2) {
    const others = posts.filter(p => p.slug !== post.slug && !relatedPosts.includes(p)).slice(0, 2 - relatedPosts.length);
    relatedPosts = [...relatedPosts, ...others];
  }

  // Helper function to render markdown content
  const renderContent = (content: string[]) => {
    return content.map((line, index) => {
      // Handle H2 headings (## )
      if (line.startsWith('## ')) {
        return (
          <ScrollReveal key={index}>
            <h2 className="text-2xl  font-serif font-bold mt-12 mb-4 text-foreground">
              {line.replace('## ', '')}
            </h2>
          </ScrollReveal>
        );
      }
      
      // Handle H3 headings (### )
      if (line.startsWith('### ')) {
        return (
          <ScrollReveal key={index}>
            <h3 className="text-xl md:text-2xl font-serif font-semibold mt-8 mb-3 text-foreground">
              {line.replace('### ', '')}
            </h3>
          </ScrollReveal>
        );
      }
      
      // Handle bold text (**text**)
      if (line.includes('**') && !line.startsWith('- ')) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const content = parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        return (
          <ScrollReveal key={index} delay={0.02}>
            <p className="text-base text-muted-foreground leading-[1.85] mb-5">{content}</p>
          </ScrollReveal>
        );
      }
      
      // Handle unordered lists (- item)
      if (line.startsWith('- ')) {
        return (
          <ScrollReveal key={index} delay={0.02}>
            <li className="text-base text-muted-foreground leading-[1.85] mb-2 ml-6 list-disc">
              {line.replace('- ', '')}
            </li>
          </ScrollReveal>
        );
      }
      
      // Handle list items that might be part of a list group
      if (line.startsWith('    - ') || line.startsWith('  - ')) {
        return (
          <ScrollReveal key={index} delay={0.02}>
            <li className="text-base text-muted-foreground leading-[1.85] mb-2 ml-8 list-circle">
              {line.trim().replace('- ', '')}
            </li>
          </ScrollReveal>
        );
      }
      
      // Handle empty lines (skip them)
      if (line.trim() === '') {
        return null;
      }
      
      // Handle regular paragraphs
      return (
        <ScrollReveal key={index} delay={0.02}>
          <p className="text-base text-muted-foreground leading-[1.85] mb-5">
            {line}
          </p>
        </ScrollReveal>
      );
    });
  };

  // Generate URL for canonical and OG tags
  const postUrl = `${window.location.origin}/blog/${post.slug}`;
  
  // Use post.seoTitle if available, otherwise fallback to post.title
  const seoTitle = post.seoTitle || `${post.title} | AmortIQ`;
  
  // Use post.metaDescription if available, otherwise fallback to post.excerpt
  const metaDescription = post.metaDescription || post.excerpt;

  return (
    <Layout>
      {/* SEO Component */}
      <SEO 
        title={seoTitle}
        description={metaDescription}
        url={postUrl}
      />

      {/* Hero Header */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={post.image} alt={post.title} loading="eager" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mb-4 hover:gap-2.5 transition-all">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full">{post.category}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="text-2xl  font-serif font-bold max-w-3xl leading-tight">{post.title}</h1>
          </motion.div>
        </div>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-10 max-w-5xl mx-auto">
          {/* Main Content */}
          <motion.div
            className="prose-custom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {renderContent(post.content)}

            {/* Tags */}
            <div className="mt-12 pt-6 border-t border-border/50 flex items-center gap-3 flex-wrap">
              <Tag className="w-4 h-4 text-muted-foreground" />
              {['Amortization', 'Mortgage', post.category, 'Finance'].map(tag => (
                <span key={tag} className=" font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>

            {/* Prev/Next Navigation */}
            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {prevPost && (
                <Link to={`/blog/${prevPost.slug}`} className="group bg-card rounded-2xl p-5 border border-border/50 warm-shadow hover:warm-shadow-lg transition-all">
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><ArrowLeft className="w-3 h-3" /> Previous</span>
                  <span className="text-sm font-semibold group-hover:text-primary transition-colors leading-snug line-clamp-2">{prevPost.title}</span>
                </Link>
              )}
              {nextPost && (
                <Link to={`/blog/${nextPost.slug}`} className="group bg-card rounded-2xl p-5 border border-border/50 warm-shadow hover:warm-shadow-lg transition-all sm:text-right">
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2 sm:justify-end">Next <ArrowRight className="w-3 h-3" /></span>
                  <span className="text-sm font-semibold group-hover:text-primary transition-colors leading-snug line-clamp-2">{nextPost.title}</span>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <ScrollReveal direction="right">
              <div className="bg-card rounded-2xl p-6 border border-border/50 warm-shadow-lg sticky top-20">
                <h3 className="font-serif  font-bold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.map(rp => (
                    <Link key={rp.slug} to={`/blog/${rp.slug}`} className="group flex gap-3 items-start">
                      <img src={rp.image} alt={rp.title} loading="lazy" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">{rp.title}</h4>
                        <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {rp.readTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-border/50 my-5" />

                <h3 className="font-serif  font-bold mb-3">Try the Calculator</h3>
                <p className="text-sm text-muted-foreground mb-4">Put these insights into practice with our real-time amortization analytics engine.</p>
                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold warm-shadow hover:warm-shadow-lg transition-shadow"
                >
                  Launch Calculator <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </aside>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;