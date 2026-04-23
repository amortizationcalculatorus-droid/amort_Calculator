import { Layout } from '@/components/Layout';
import { ScrollReveal } from '@/components/ScrollAnimations';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, MapPin, Clock, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useSiteContent } from '@/hooks/useSiteContent';

const iconMap: Record<string, any> = { MessageSquare, MapPin, Clock, Mail };

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const { getText, getMeta } = useSiteContent();

  const pageTitle = getText('contact_header', 'title') || 'Contact Us';
  const pageDesc = getText('contact_header', 'subtitle') || 'Have a question, feature request, or found a calculation issue? We\'d love to hear from you.';
  const pageBadge = getText('contact_header', 'content') || 'Get in Touch';
  const cards = (getMeta('contact_cards')?.cards as any[]) ?? [
    { icon: 'MessageSquare', title: 'General Inquiries', desc: 'Questions about features, capabilities, or partnerships.' },
    { icon: 'MapPin', title: 'Our Focus', desc: 'Building the most accurate financial tools for borrowers worldwide.' },
    { icon: 'Clock', title: 'Response Time', desc: 'We aim to respond within 24 hours on business days.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 text-xs font-semibold text-primary mb-4">
            <Mail className="w-3.5 h-3.5" /> {pageBadge}
          </div>
          <h1 className="text-2xl  font-serif font-bold mb-4">{pageTitle}</h1>
          <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">{pageDesc}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          <div className="space-y-4">
            {cards.map((card: any, i: number) => {
              const Icon = iconMap[card.icon] || MessageSquare;
              return (
                <ScrollReveal key={card.title}>
                  <motion.div className="bg-card rounded-2xl p-5 border border-border/50 warm-shadow" whileHover={{ y: -2 }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-primary" /></div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{card.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>

          <motion.form onSubmit={handleSubmit} className="md:col-span-2 bg-card rounded-2xl p-6 md:p-8 border border-border/50 warm-shadow-lg space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" placeholder="you@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" placeholder="What's this about?" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea required rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none" placeholder="Tell us what's on your mind..." />
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full flex items-center justify-center gap-2.5 bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm warm-shadow-lg hover:warm-shadow-xl transition-shadow">
              <Send className="w-4 h-4" /> Send Message
            </motion.button>
          </motion.form>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
