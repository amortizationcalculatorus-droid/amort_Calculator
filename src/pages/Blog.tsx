import { Layout } from '@/components/Layout';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollAnimations';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { posts } from '@/lib/blogData';

const Blog = () => {
  const featured = posts.find(p => p.featured);
  const rest = posts.filter(p => !p.featured);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <h1 className="text-2xl  font-serif font-bold mb-4">AmortIQ Blog</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Data-driven insights, mathematical deep dives, and evidence-based strategies for optimizing your loans and building financial literacy.
          </p>
        </motion.div>

        {/* Featured Article */}
        {/* {featured && (
          <ScrollReveal>
            <Link to={`/blog/${featured.slug}`}>
              <motion.article
                className="bg-card rounded-2xl overflow-hidden border border-border/50 warm-shadow-xl mb-10 cursor-pointer group"
                whileHover={{ y: -3 }}
              >
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full">Featured</span>
                      <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">{featured.category}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {featured.readTime}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{featured.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read Article <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          </ScrollReveal>
        )} */}

        {/* Article Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.06}>
          {rest.map((post) => (
            <StaggerItem key={post.slug}>
              <Link to={`/blog/${post.slug}`}>
                <motion.article
                  className="bg-card rounded-2xl overflow-hidden border border-border/50 warm-shadow hover:warm-shadow-lg transition-all cursor-pointer group h-full flex flex-col"
                  whileHover={{ y: -4 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-semibold bg-card/90 backdrop-blur text-primary px-2.5 py-1 rounded-full">{post.category}</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="font-serif  font-bold mb-2 group-hover:text-primary transition-colors leading-snug">{post.title}</h2>
                    <p className=" text-muted-foreground leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center pt-4 border-t border-border/40">
                      <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read article <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </Layout>
  );
};

export default Blog;
