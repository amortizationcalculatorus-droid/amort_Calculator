// pages/Privacy.tsx
import { Layout } from '@/components/Layout';
import { ScrollReveal } from '@/components/ScrollAnimations';
import { motion } from 'framer-motion';
import { Lock, Eye, Database, Cookie, Mail, Shield, Trash2, Globe } from 'lucide-react';
import {SEO} from '@/components/SEO';

const Privacy = () => {
  return (
    <Layout>
      <SEO 
        title="Privacy Policy | AmortIQ"
        description="Learn how AmortIQ collects, uses, and protects your personal information. Our commitment to your privacy and data security."
        url="http://localhost:8080/privacy"
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl  font-serif font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">Last Updated: February 2026</p>
        </motion.div>

        <div className="space-y-8">
          <ScrollReveal>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className=" font-serif font-bold mb-3">Our Commitment to Your Privacy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    At AmortIQ, we take your privacy seriously. This Privacy Policy explains how we collect, 
                    use, disclose, and protect your information when you use our loan amortization calculator 
                    platform and related services. We are committed to transparency and giving you control 
                    over your personal data.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <Database className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className=" font-serif font-bold mb-3">Information We Collect</h2>
                  <p className="text-muted-foreground leading-relaxed font-semibold mb-2">We collect several types of information:</p>
                  
                  <p className="text-muted-foreground leading-relaxed mt-3"><strong>1. Information You Provide Voluntarily:</strong></p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground ml-4">
                    <li>Loan details (amount, interest rate, term, start date)</li>
                    <li>Extra payment amounts and frequencies</li>
                    <li>Contact information if you reach out via contact form (name, email, message)</li>
                    <li>Account information if you create an account (email, password)</li>
                  </ul>

                  <p className="text-muted-foreground leading-relaxed mt-3"><strong>2. Automatically Collected Information:</strong></p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground ml-4">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent on our Platform</li>
                    <li>Referring website URLs</li>
                    <li>Clickstream data and user interactions</li>
                  </ul>

                  <p className="text-muted-foreground leading-relaxed mt-3"><strong>3. Cookies & Similar Technologies:</strong></p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground ml-4">
                    <li>Essential cookies for platform functionality</li>
                    <li>Analytics cookies to understand usage patterns</li>
                    <li>Preference cookies to remember your settings</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <Eye className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className=" font-serif font-bold mb-3">How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed">We use the information we collect to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                    <li>Provide, operate, and maintain our loan calculator and analytics tools</li>
                    <li>Calculate accurate amortization schedules based on your inputs</li>
                    <li>Generate AI-powered insights and recommendations</li>
                    <li>Improve, personalize, and expand our platform features</li>
                    <li>Understand and analyze how you use our Platform</li>
                    <li>Develop new products, services, and features</li>
                    <li>Communicate with you about updates, security alerts, and support</li>
                    <li>Prevent fraud and enhance platform security</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <Cookie className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className=" font-serif font-bold mb-3">Cookies & Tracking Technologies</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    AmortIQ uses cookies and similar tracking technologies to enhance your experience. You can 
                    control cookies through your browser settings. However, disabling certain cookies may affect 
                    the functionality of our Platform.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    <strong>Types of cookies we use:</strong>
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-muted-foreground ml-4">
                    <li><strong>Essential Cookies:</strong> Required for basic platform operation</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand user behavior (e.g., Google Analytics)</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <Globe className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className=" font-serif font-bold mb-3">Data Sharing & Disclosure</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell, trade, or rent your personal information to third parties. We may share 
                    your information in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                    <li><strong>Service Providers:</strong> With third-party vendors who help us operate our Platform (hosting, analytics, customer support)</li>
                    <li><strong>Legal Compliance:</strong> When required by law, court order, or governmental regulation</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                    <li><strong>Protection of Rights:</strong> To protect the security, property, or rights of AmortIQ or our users</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    All service providers are contractually obligated to protect your data and use it only for 
                    the purposes we specify.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className=" font-serif font-bold mb-3">Your Rights & Choices</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Depending on your location, you may have certain rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                    <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal obligations)</li>
                    <li><strong>Opt-Out:</strong> Opt-out of marketing communications or data collection for analytics</li>
                    <li><strong>Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
                    <li><strong>Withdraw Consent:</strong> Withdraw consent where we rely on it for processing</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    To exercise these rights, please contact us using the information at the end of this policy. 
                    We will respond within 30 days.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <Trash2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className=" font-serif font-bold mb-3">Data Retention</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We retain your personal information only for as long as necessary to fulfill the purposes 
                    outlined in this Privacy Policy, unless a longer retention period is required or permitted 
                    by law. Calculation inputs you provide are used in real-time and are not permanently stored 
                    unless you create an account and save them.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.7}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className=" font-serif font-bold mb-3">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your 
                personal information against accidental or unlawful destruction, loss, alteration, unauthorized 
                disclosure, or access. These measures include:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                <li>Encryption of data in transit (TLS/SSL)</li>
                <li>Secure data storage practices</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                However, no method of transmission over the Internet or electronic storage is 100% secure. 
                While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className=" font-serif font-bold mb-3">Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                AmortIQ is not intended for children under the age of 13. We do not knowingly collect personal 
                information from children under 13. If you are a parent or guardian and believe your child has 
                provided us with personal information, please contact us, and we will take steps to delete such 
                information.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.9}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className=" font-serif font-bold mb-3">International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and maintained on servers located outside of your state, 
                province, country, or other governmental jurisdiction where data protection laws may differ. 
                By using AmortIQ, you consent to the transfer of your information to the United States and 
                other countries where we operate.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1.0}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className=" font-serif font-bold mb-3">California Privacy Rights (CCPA)</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you are a California resident, you have additional rights under the California Consumer 
                Privacy Act (CCPA), including the right to know what personal information we collect, the 
                right to request deletion, and the right to opt-out of the sale of your information (we do 
                not sell personal information). To exercise these rights, please contact us.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1.1}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className=" font-serif font-bold mb-3">GDPR Rights (European Union)</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you are in the European Economic Area (EEA), you have certain data protection rights under 
                the General Data Protection Regulation (GDPR), including the right to access, rectify, port, 
                and erase your data. We process your data based on legitimate interests, contract performance, 
                and your consent where applicable.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1.2}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className=" font-serif font-bold mb-3">Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for 
                legal, operational, or regulatory reasons. We will notify you of any material changes by posting 
                the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to 
                review this policy periodically.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1.3}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className=" font-serif font-bold mb-3">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data 
                practices, please contact us at:
              </p>
              <div className="mt-3 space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> privacy@amortiq.com</p>
                <p><strong>Contact Form:</strong> <a href="/contact" className="text-primary hover:underline">amortiq.com/contact</a></p>
                <p><strong>Mail:</strong> AmortIQ Privacy Team, [Your Business Address]</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1.4}>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
              <p className="text-sm">
                By using AmortIQ, you acknowledge that you have read, understood, and agree to this Privacy Policy.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;