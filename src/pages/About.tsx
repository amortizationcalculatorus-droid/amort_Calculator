import { Layout } from '@/components/Layout';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollAnimations';
import { motion } from 'framer-motion';
import { Target, Eye, Shield, Users, Award, Sparkles, CheckCircle } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';

const iconMap: Record<string, any> = { Shield, Users, Sparkles, Award, Target, Eye };

const defaultValues = [
  { icon: 'Shield', title: 'Precision', desc: 'Every calculation uses full floating-point precision with the standard amortization formula.' },
  { icon: 'Users', title: 'Accessibility', desc: 'Financial tools should be free and available to everyone.' },
  { icon: 'Sparkles', title: 'Transparency', desc: 'We show you exactly how every number is calculated.' },
  { icon: 'Award', title: 'Excellence', desc: 'We hold ourselves to the same standards as institutional financial software.' },
];

const defaultFeatures = [
  'Fixed-rate and variable payment support',
  'Monthly, biweekly, and weekly payment schedules',
  'Custom compounding (monthly, daily, annually)',
  'Extra recurring and lump-sum payment modeling',
  'Interest-only period support',
  'Real-time animated result updates',
  'Interactive chart visualizations',
  'AI-powered smart financial insights',
  'CSV export and print-ready output',
  'Zero data collection — 100% client-side',
];

const About = () => {
  const { getText, getMeta } = useSiteContent();

  const pageTitle = getText('about_header', 'title') || 'About AmortIQ';
  const pageDesc = getText('about_header', 'subtitle') || 'We\'re on a mission to democratize financial literacy by providing the most powerful, accurate, and beautiful loan analysis tools — completely free.';
  const missionTitle = getText('about_mission', 'title') || 'Our Mission';
  const missionContent = getText('about_mission', 'content') || 'To empower every borrower with professional-grade financial analytics.';
  const visionTitle = getText('about_vision', 'title') || 'Our Vision';
  const visionContent = getText('about_vision', 'content') || 'A world where every borrower understands the true cost of their loan before signing.';
  const valuesTitle = getText('about_values', 'title') || 'Our Core Values';
  const valuesDesc = getText('about_values', 'subtitle') || 'The principles that guide everything we build.';
  const values = (getMeta('about_values')?.values as any[]) ?? defaultValues;
  const featuresTitle = getText('about_features', 'title') || 'Platform Capabilities';
  const features = (getMeta('about_features')?.features as string[]) ?? defaultFeatures;
  const disclaimerTitle = getText('about_disclaimer', 'title') || 'Financial Disclaimer';
  const disclaimerContent = getText('about_disclaimer', 'content') || 'This tool is for educational and informational purposes only.';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-10 md:mb-16 max-w-3xl mx-auto">
          <h1 className="text-2xl  font-serif font-bold mb-4">{pageTitle}</h1>
          <p className="text-muted-foreground text-sm md:text-lg leading-relaxed">{pageDesc}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto mb-10 md:mb-16">
          <ScrollReveal>
            <motion.div className="bg-card rounded-2xl p-5 md:p-8 border border-border/50 warm-shadow-lg h-full" whileHover={{ y: -3 }}>
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 md:mb-5"><Target className="w-5 h-5 md:w-7 md:h-7 text-primary" /></div>
              <h2 className="font-serif  font-bold mb-2 md:mb-3">{missionTitle}</h2>
              {missionContent.split('\n\n').map((p, i) => <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed mt-2 md:mt-3">{p}</p>)}
            </motion.div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <motion.div className="bg-card rounded-2xl p-5 md:p-8 border border-border/50 warm-shadow-lg h-full" whileHover={{ y: -3 }}>
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 md:mb-5"><Eye className="w-5 h-5 md:w-7 md:h-7 text-accent" /></div>
              <h2 className="font-serif  font-bold mb-2 md:mb-3">{visionTitle}</h2>
              {visionContent.split('\n\n').map((p, i) => <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed mt-2 md:mt-3">{p}</p>)}
            </motion.div>
          </ScrollReveal>
        </div>

        <section className="mb-10 md:mb-16">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className=" font-serif font-bold mb-3">{valuesTitle}</h2>
              <p className="text-muted-foreground">{valuesDesc}</p>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 max-w-5xl mx-auto">
            {values.map((v: any) => {
              const Icon = iconMap[v.icon] || Shield;
              return (
                <StaggerItem key={v.title}>
                  <motion.div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50 warm-shadow text-center h-full" whileHover={{ y: -4 }}>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4"><Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" /></div>
                    <h3 className="font-serif  font-bold mb-1.5 md:mb-2">{v.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </section>

        <section className="max-w-3xl mx-auto mb-10 md:mb-16">
          <ScrollReveal>
            <div className="bg-card rounded-2xl p-5 md:p-8 border border-border/50 warm-shadow-lg">
              <h2 className="font-serif  font-bold mb-4 md:mb-6 text-center">{featuresTitle}</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {features.map((f: string, i: number) => (
                  <motion.div key={i} className="flex items-center gap-3 p-2" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} viewport={{ once: true }}>
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    <span className="text-sm">{f}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        <ScrollReveal>
          <div className="max-w-3xl mx-auto bg-warm-50 rounded-2xl p-5 md:p-8 border border-warning/20">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0"><Shield className="w-4 h-4 md:w-5 md:h-5 text-warning" /></div>
              <div>
                <h2 className="font-serif  font-bold mb-2">{disclaimerTitle}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{disclaimerContent}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </Layout>
  );
};

export default About;
