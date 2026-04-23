// pages/Terms.tsx
import { Layout } from '@/components/Layout';
import { ScrollReveal } from '@/components/ScrollAnimations';
import { motion } from 'framer-motion';
import { FileText, ShieldCheck, Users, AlertTriangle, Scale, Database, Clock } from 'lucide-react';
import {SEO} from '@/components/SEO';

const Terms = () => {
  return (
    <Layout>
      <SEO 
        title="Terms & Conditions | AmortIQ"
        description="Read the terms and conditions governing your use of AmortIQ's loan calculator platform. Understand your rights, responsibilities, and our policies."
        url="http://localhost:8080/terms"
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif font-bold mb-4">Terms & Conditions</h1>
          <p className="text-muted-foreground text-lg">Last Updated: February 2026</p>
        </motion.div>

        <div className="space-y-8">
          <ScrollReveal>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className=" font-serif font-bold mb-3">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using AmortIQ (the "Platform," "Website," or "Service"), you agree to be bound 
                by these Terms & Conditions (the "Terms"). If you disagree with any part of these Terms, you 
                may not access or use our Service. These Terms constitute a legally binding agreement between 
                you ("User," "You," or "Your") and AmortIQ ("Company," "We," "Us," or "Our").
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className=" font-serif font-bold mb-3">Eligibility & User Accounts</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By using AmortIQ, you represent and warrant that:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                    <li>You are at least 18 years of age or the age of majority in your jurisdiction</li>
                    <li>You have the legal capacity to enter into these Terms</li>
                    <li>You will not use the Platform for any illegal or unauthorized purpose</li>
                    <li>All information you provide is accurate, current, and complete</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    AmortIQ does not require user accounts for basic calculator functionality. However, if 
                    you choose to create an account for additional features (such as saving calculations or 
                    accessing personalized insights), you are responsible for maintaining the confidentiality 
                    of your login credentials and for all activities under your account.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className=" font-serif font-bold mb-3">Intellectual Property Rights</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    All content, features, and functionality of AmortIQ, including but not limited to text, 
                    graphics, logos, icons, images, audio clips, video clips, data compilations, software, 
                    algorithms, and the "look and feel" of the Platform, are owned by AmortIQ or its licensors 
                    and are protected by United States and international copyright, trademark, patent, trade 
                    secret, and other intellectual property laws.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    You may not:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                    <li>Copy, modify, reproduce, distribute, or create derivative works of our content</li>
                    <li>Reverse engineer, decompile, or disassemble any portion of the Platform</li>
                    <li>Remove any copyright, trademark, or other proprietary notices</li>
                    <li>Use our Platform to develop competing products or services</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className=" font-serif font-bold mb-3">Prohibited Conduct</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You agree not to use AmortIQ in any way that:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                    <li>Violates any applicable local, state, national, or international law or regulation</li>
                    <li>Infringes upon the rights of others, including intellectual property rights</li>
                    <li>Is fraudulent, deceptive, or misleading</li>
                    <li>Interferes with or disrupts the operation of our Platform or servers</li>
                    <li>Attempts to gain unauthorized access to our systems or user data</li>
                    <li>Transmits viruses, malware, or other harmful code</li>
                    <li>Engages in data mining, scraping, or automated data collection without permission</li>
                    <li>Harasses, abuses, or threatens others</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <Scale className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className=" font-serif font-bold mb-3">Disclaimer of Warranties</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    AMORTIQ IS PROVIDED "AS IS," "AS AVAILABLE," AND WITHOUT WARRANTIES OF ANY KIND, WHETHER 
                    EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, 
                    INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
                    PURPOSE, TITLE, NON-INFRINGEMENT, AND ACCURACY.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    We do not warrant that:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                    <li>The Platform will be uninterrupted, secure, or error-free</li>
                    <li>Any defects or errors will be corrected</li>
                    <li>Calculations or results will be accurate or reliable</li>
                    <li>The Platform will be compatible with your devices or software</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <Database className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className=" font-serif font-bold mb-3">Limitation of Liability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL AMORTIQ, ITS 
                    AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY DIRECT, 
                    INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT 
                    LIMITATION LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                    <li>Your use or inability to use the Platform</li>
                    <li>Any reliance on calculations or information provided</li>
                    <li>Unauthorized access to or alteration of your transmissions or data</li>
                    <li>Statements or conduct of any third party on the Platform</li>
                    <li>Any other matter relating to the Service</li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className=" font-serif font-bold mb-3">Third-Party Links & Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                AmortIQ may contain links to third-party websites, advertisers, or services that are not owned 
                or controlled by us. We have no control over, and assume no responsibility for, the content, 
                privacy policies, or practices of any third-party websites or services. You acknowledge and 
                agree that AmortIQ shall not be responsible or liable for any damage or loss caused by or in 
                connection with your use of such third-party content or services.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.7}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className=" font-serif font-bold mb-3">Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify, defend, and hold harmless AmortIQ and its officers, directors, 
                employees, agents, and affiliates from and against any and all claims, damages, obligations, 
                losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's 
                fees) arising from:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                <li>Your use of and access to the Platform</li>
                <li>Your violation of any term of these Terms</li>
                <li>Your violation of any third-party right, including intellectual property or privacy rights</li>
                <li>Any claim that your conduct caused damage to a third party</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className=" font-serif font-bold mb-3">Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to terminate or suspend your access to AmortIQ immediately, without prior 
                notice or liability, for any reason whatsoever, including without limitation if you breach 
                these Terms. Upon termination, your right to use the Platform will cease immediately.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.9}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className=" font-serif font-bold mb-3">Modifications to Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    AmortIQ reserves the right to modify or replace these Terms at any time without prior 
                    notice. The most current version will be posted on this page with the "Last Updated" date. 
                    Your continued use of the Platform after any changes constitutes your acceptance of the 
                    new Terms. If you disagree with any changes, you must stop using the Platform.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1.0}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className=" font-serif font-bold mb-3">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of the State of 
                Delaware, without regard to its conflict of law provisions. Any legal action or proceeding 
                arising under these Terms shall be brought exclusively in the federal or state courts located 
                in Delaware, and you consent to personal jurisdiction in such courts.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1.1}>
            <div className="bg-card rounded-2xl p-6 border border-border/50">
              <h2 className=" font-serif font-bold mb-3">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-3 space-y-1 text-muted-foreground">
                <p><strong>Email:</strong> legal@amortiq.com</p>
                <p><strong>Through Website:</strong> <a href="/contact" className="text-primary hover:underline">Contact Form</a></p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;