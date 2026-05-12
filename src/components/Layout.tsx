import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Menu, X, ArrowRight, Heart, Calculator, TrendingUp, Mail, Chrome, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useTrackingScripts } from '@/hooks/useTrackingScripts';
import { 
  Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Globe
} from 'lucide-react';
import { FaMedium, FaPinterest, FaQuora } from 'react-icons/fa';
const defaultNavLinks = [
  { to: '/', label: 'Calculator' },
  { to: '/how-to-use', label: 'How to Use' },
  { to: '/about', label: 'About Us' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

const socialIconMap: Record<string, any> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  medium: FaMedium,
  pinterest: FaPinterest,
  quora: FaQuora,
  website: Globe,
};

const defaultStats = [
  { label: 'Calculations', value: '100K+' },
  { label: 'Accuracy', value: '99.9%' },
  { label: 'Cost', value: 'Free' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { getText, getMeta, loading } = useSiteContent();
  useTrackingScripts();

  // Header content from DB
  const brandTitle = getText('header_brand', 'title') || 'AmortIQ';
  const navMeta = getMeta('header_nav');
  const navLinks = (navMeta?.links as Array<{ to: string; label: string }>) ?? defaultNavLinks;

  // Footer content from DB
  const footerBrandTitle = getText('footer_brand', 'title') || 'AmortIQ';
  const footerBrandDesc = getText('footer_brand', 'subtitle') || 'Professional-grade amortization analytics for smarter financial decisions. Free, private, and precision-engineered.';
  const footerStats = (getMeta('footer_brand')?.stats as Array<{ label: string; value: string }>) ?? defaultStats;
  const newsletterTitle = getText('footer_newsletter', 'title') || 'Stay Financially Sharp';
  const newsletterDesc = getText('footer_newsletter', 'subtitle') || 'Get monthly insights on loan optimization and financial strategies.';
  const copyrightText = getText('footer_copyright', 'title') || `© ${new Date().getFullYear()} AmortIQ. All rights reserved. For educational purposes only.`;
  const copyrightSub = getText('footer_copyright', 'subtitle') || 'Built with ❤ for financial literacy';

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Subscribed! You\'ll receive our latest financial insights.');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <nav className="sticky top-0 z-50 glass-strong border-b border-border/40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <BarChart3 className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-xl font-serif font-bold tracking-tight">
              <span className="gradient-text">{brandTitle.substring(0, 5)}</span>
              <span className="text-foreground">{brandTitle.substring(5)}</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${location.pathname === link.to ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  {link.label}
                </span>
              </Link>
            ))}
            {/* Chrome Extension Button */}
            <motion.a
              href="https://chromewebstore.google.com/detail/amortizekit-%E2%80%93-loan-calcul/onpilnphbmodhbcaibhjaegjicojcopb"
              className="ml-2 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
               target="_blank"
               rel="noopener noreferrer"
            >
              <Chrome className="w-4 h-4" />
              <span>Chrome Extension</span>
            </motion.a>
          </div>

          <motion.button
            className="md:hidden p-2 text-muted-foreground rounded-lg hover:bg-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-border/30"
            >
              <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        location.pathname === link.to
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                {/* Chrome Extension Button for Mobile */}
                <motion.a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2.5 mt-2 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: Add Chrome extension link
                    console.log('Chrome Extension clicked');
                  }}
                >
                  <Chrome className="w-4 h-4" />
                  <span>Chrome Extension</span>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>{children}</main>

      {/* Enhanced Footer */}
     <footer className="relative mt-12 overflow-hidden">
  {/* Main Footer */}
  <div className="bg-warm-100 border-t border-border/40">
    <div className="container mx-auto px-4 pt-14 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 mb-12">
        {/* Brand Column */}
        <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-serif font-bold">
              <span className="gradient-text">{footerBrandTitle.substring(0, 5)}</span>{footerBrandTitle.substring(5)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
            {footerBrandDesc}
          </p>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {footerStats.map(s => (
              <div key={s.label} className="text-center bg-card rounded-xl p-3 warm-shadow">
                <div className="text-lg font-bold font-mono text-primary">{s.value}</div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" /> Product
          </h4>
          <div className="space-y-3">
            {[
              { to: '/', label: 'Amortization Calculator' },
              { to: '/how-to-use', label: 'User Guide' },
              { to: '/blog', label: 'Financial Blog' },
            ].map(link => (
              <Link key={link.to} to={link.to} className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Company
          </h4>
          <div className="space-y-3">
            {[
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact' },
              { to: '/disclaimer', label: 'Disclaimer' },
              { to: '/terms', label: 'Terms & Conditions' },
              { to: '/privacy', label: 'Privacy Policy' },
            ].map((link, i) => (
              <Link key={i} to={link.to} className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Resources and Social Links Container */}
        <div className="lg:col-span-1">
          {/* Resources */}
        

          {/* Social Links - positioned below Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-primary" /> Follow Us
            </h4>
            <div className="space-y-3">
              {(() => {
                const socialMeta = getMeta('footer_social');
                const socialLinks = socialMeta?.links as Array<{ platform: string; url: string; icon?: string }> || [];
                
                if (socialLinks.length === 0) {
                  return <p className="text-sm text-muted-foreground">No social links configured</p>;
                }
                
                return socialLinks.map((link, i) => {
                  const IconComponent = socialIconMap[link.platform?.toLowerCase()] || Globe;
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="capitalize">{link.platform}</span>
                    </a>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{copyrightText}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {copyrightSub.includes('❤') ? (
            <>Built with <Heart className="w-3 h-3 text-destructive fill-destructive" /> for financial literacy</>
          ) : copyrightSub}
        </p>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}