import { Layout } from '@/components/Layout';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollAnimations';
import { motion } from 'framer-motion';
import { BookOpen, Calculator, DollarSign, Calendar, TrendingUp, BarChart3, ArrowRight, Settings, CreditCard, CheckCircle, AlertTriangle, Lightbulb, HelpCircle, Target, Clock } from 'lucide-react';
import { SEO } from '@/components/SEO';


const HowToUse = () => {
  return (
    <Layout>
       <SEO 
        title="How to Use an Amortization Calculator: Easy Step-by-Step Guide"
        description="Learn how to use an amortization calculator to break down loan payments. See your monthly principal and interest schedule with our step-by-step guide."
        url="http://localhost:8080/how-to-use"
      />
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }} 
          className="text-center mb-10 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs font-semibold text-primary mb-4">
            <BookOpen className="w-3.5 h-3.5" /> Step-by-Step Guide 2026
          </div>
          <h2 className="text-2xl font-serif font-bold mb-4">
            How to Use An Amortization Calculator?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Learn how to use an amortization calculator to break down loan payments. See your monthly principal and interest schedule with our step-by-step guide.
          </p>
        </motion.div>

        {/* Intro */}
        <section className="mb-10 md:mb-14">
          <ScrollReveal>
            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>When we discuss loans and financial planning, the first question we ask is how much we have to pay each month. Many people borrow loans to buy things they want, but the question is, do they really know how their loans are being broken down into smaller amounts over time? Although there are many financial tools available, it is still confusing to see the full breakdown of interest and principal amounts in a simple format.</p>
              <p>Hence, it is essential to learn how to use an amortization calculator, which can help you to view the full breakdown of your loan in a simple format. Our amortization calculator can easily calculate your monthly payment and full repayment schedule. It can also break down your loan into interest and principal amounts and show you how it is decreasing over time.</p>
              <p>We will help you learn how to use an amortization calculator step by step and how it can assist you in making a better plan regarding your loan payments.</p>
            </div>
          </ScrollReveal>
        </section>

        {/* Step-by-Step Guide */}
        <section className="mb-10 md:mb-14">
          <ScrollReveal>
            <h2 className=" font-serif font-bold text-center mb-3">
              How to Use an Amortization Calculator? (Step-by-Step)
            </h2>
            <p className="text-sm md:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8">
              The process of using an amortization tool is easy. Most online calculators use the same process. You just need to enter some information related to your loan. This information will include the monthly payment, total interest paid, and the repayment schedule. Using the right process will ensure accurate results for your loan.
            </p>
          </ScrollReveal>
          
          <StaggerContainer className="space-y-5" staggerDelay={0.06}>
            {[
              {
                icon: DollarSign,
                title: 'Step 1: Enter the Loan Amount',
                content: 'First, you need to enter the total amount you plan to borrow. This number represents the principal that you must repay during the loan term. It is important to enter the exact amount to ensure accurate calculations.',
                examples: ['Home loan: $200,000', 'Car loan: $25,000', 'Personal loan: $10,000'],
                footer: 'This amount is then used to create a schedule by the calculator.'
              },
              {
                icon: TrendingUp,
                title: 'Step 2: Enter the Interest Rate',
                content: 'Once you have entered your loan amount, you then need to enter the interest rate offered by your lender for the loan. These factors can influence how much extra money you end up paying on your loan.',
                examples: ['Home loan interest rate: 6%', 'Personal loan interest rate: 9%'],
                footer: 'The amortization tool uses this rate to calculate the interest part of your loan. You therefore need to use the correct interest rate to get accurate results.'
              },
              {
                icon: Calendar,
                title: 'Step 3: Select the Loan Term',
                content: 'Now, it is time to decide how long it is going to take to pay off the loan. The amortization tool works with the length of the loan to spread out all of the payments over the length of the loan term.',
                examples: ['3 years', '5 years', '10 years', '15 years', '30 years'],
                footer: 'A longer loan term means that your monthly payment will be lower. However, it also means that you will be paying more in interest over the life of the loan. A shorter loan term means higher monthly payments.'
              },
              {
                icon: Settings,
                title: 'Step 4: Choose the Payment Frequency',
                content: 'Most loans require monthly payments, and many calculators default to this. Some calculators also allow you to choose alternative payment methods.',
                examples: ['Monthly payments', 'Bi-weekly payments', 'Weekly payments'],
                footer: 'These payment methods allow you to adjust how quickly you reduce your loan balance.'
              },
              {
                icon: CreditCard,
                title: 'Step 5: Add Extra Payments (Optional)',
                content: 'The amortization tool might offer the option of adding extra payments. By making extra payments on the principal, you can pay off the loan faster, save on the total interest paid, and pay off the balance sooner.',
                examples: null,
                footer: null
              },
              {
                icon: BarChart3,
                title: 'Step 6: Click the Calculate Button',
                content: 'After filling in all the information on the loan, click the calculate button. This will immediately produce several results.',
                examples: ['Monthly payment amount', 'Total amount paid over the life of the loan', 'Total interest paid', 'The entire amortization schedule'],
                footer: null
              },
            ].map((step) => (
              <StaggerItem key={step.title}>
                <motion.div 
                  className="bg-card rounded-2xl p-6 md:p-7 border border-border/50 warm-shadow-lg" 
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start gap-4 md:gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-serif  font-bold mb-2 text-foreground">
                        {step.title}
                      </h2>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
                        {step.content}
                      </p>
                      
                      {step.examples && (
                        <ul className="space-y-1.5 mb-3">
                          {step.examples.map((example, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                              <span className="text-primary text-base leading-tight mt-0.5">•</span>
                              <p>{example}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {step.footer && (
                        <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-4 italic">
                          {step.footer}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* What Is an Amortization Calculator? */}
        <section className="mb-10 md:mb-14">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-6 md:p-8 border border-border/40">
              <h2 className=" font-serif font-bold mb-4">
                What Is an Amortization Calculator?
              </h2>
              <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>An amortization calculator is a tool that assists you in calculating the amount of a loan that you are required to pay every month. It also helps you to know how this payment is divided into interest and principal amounts during a loan period. When you are required to make a loan payment every month, it is divided into two parts:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
                  <div className="bg-card rounded-xl p-5 border border-border/50 warm-shadow">
                    <h2 className="font-bold text-foreground  mb-2">Principal</h2>
                    <p className="text-sm text-muted-foreground">This part is used to reduce the loan amount.</p>
                  </div>
                  <div className="bg-card rounded-xl p-5 border border-border/50 warm-shadow">
                    <h2 className="font-bold text-foreground  mb-2">Interest</h2>
                    <p className="text-sm text-muted-foreground">This is the amount you pay to borrow.</p>
                  </div>
                </div>
                <p>For the initial months of the loan, more of your payment is interest-based. Over time, more of your payment is applied to the principal. The calculator will also give you an amortization schedule, which shows all payments made from the beginning of the loan until it is paid off.</p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Why You Should Use */}
        <section className="mb-10 md:mb-14">
          <ScrollReveal>
            <h2 className=" font-serif font-bold text-center mb-3">
              Why You Should Use an Amortization Calculator?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-6">
              Using an amortization tool can help you understand your loan even before you borrow money. The calculator helps you make smarter financial decisions and prevent unexpected problems with your loan repayments.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="bg-card rounded-2xl p-6 md:p-7 border border-border/50 warm-shadow">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Determine your monthly payment',
                  'Determine the total cost of interest',
                  'View the entire payment schedule',
                  'Compare different loan terms and interest rates',
                  'Understand the effects of extra payments on your loan',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm md:text-base">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Understanding the Amortization Schedule */}
        <section className="mb-10 md:mb-14">
          <ScrollReveal>
            <h2 className=" font-serif font-bold text-center mb-3">
              Understanding the Amortization Schedule
            </h2>
            <p className="text-sm md:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-6">
              An amortization schedule is a detailed table showing all payments to be made over the life of the loan. Each row of the schedule contains:
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="bg-card rounded-2xl p-6 md:p-7 border border-border/50 warm-shadow">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {['Payment Number', 'Payment Date', 'Payment Amount', 'Interest Portion', 'Principal Portion', 'Remaining Balance'].map((label) => (
                  <div key={label} className="flex items-center gap-2.5 text-sm md:text-base">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm md:text-base text-muted-foreground mt-5 pt-3 border-t border-border/30">
                At first, most of your payment is for interest. As time goes by, more of each payment is used to pay off the principal. This schedule shows you how your loan balance decreases with each payment.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Example of Loan Payment Breakdown */}
        <section className="mb-10 md:mb-14">
          <ScrollReveal>
            <h2 className="font-serif font-bold text-center mb-3">
              Example of Loan Payment Breakdown
            </h2>
            <p className="text-sm md:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-6">
              Here is a simple example to help you understand how payments are divided.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <div className="bg-card rounded-2xl border border-border/50 warm-shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm md:text-base">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="text-left p-4 font-semibold text-foreground">Month</th>
                      <th className="text-left p-4 font-semibold text-foreground">Payment</th>
                      <th className="text-left p-4 font-semibold text-foreground">Interest</th>
                      <th className="text-left p-4 font-semibold text-foreground">Principal</th>
                      <th className="text-left p-4 font-semibold text-foreground">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { month: '1', payment: '$1,000', interest: '$600', principal: '$400', balance: '$99,600' },
                      { month: '2', payment: '$1,000', interest: '$598', principal: '$402', balance: '$99,198' },
                      { month: '3', payment: '$1,000', interest: '$595', principal: '$405', balance: '$98,793' },
                    ].map((row) => (
                      <tr key={row.month} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-4 text-muted-foreground font-medium">{row.month}</td>
                        <td className="p-4 text-muted-foreground">{row.payment}</td>
                        <td className="p-4 text-muted-foreground">{row.interest}</td>
                        <td className="p-4 text-muted-foreground">{row.principal}</td>
                        <td className="p-4 text-muted-foreground">{row.balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-muted/20 border-t border-border/30">
                <p className="text-sm text-muted-foreground">
                  As you can see, the interest portion slowly decreases while the principal portion increases.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Tips */}
        <section className="mb-10 md:mb-14">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 md:p-8 border border-primary/20 warm-shadow-xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-serif  font-bold">Tips for Using an Amortization Calculator</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground mb-5">
                If you wish to get the most out of an amortization tool, you should know that you can try these tips:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  'Input accurate loan information',
                  'Compare various loan offers',
                  'Check various interest rates',
                  'Make extra payments to determine possible savings',
                  'Check the complete amortization schedule',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm md:text-base">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{tip}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic border-l-2 border-primary/40 pl-4">
                These are helpful in getting a clear idea about the true value of borrowing money.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Common Mistakes */}
        <section className="mb-10 md:mb-14">
          <ScrollReveal>
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 warm-shadow-lg">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <h2 className="font-serif  font-bold">Common Mistakes You Should Avoid</h2>
              </div>
              <p className="text-sm md:text-base text-muted-foreground mb-5">
                Some mistakes may occur when using an amortization tool. These mistakes can be avoided by:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  'Using the wrong interest rate',
                  'Not checking the loan term',
                  'Forgetting to add extra payments',
                  'Not checking the total cost of interest',
                ].map((mistake, i) => (
                  <div key={i} className="bg-muted/40 rounded-xl p-4 flex items-start gap-3 text-sm md:text-base">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{mistake}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic">
                It is essential to always check your input values to ensure accuracy.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Final Thoughts */}
        <section className="mb-10 md:mb-14">
          <ScrollReveal>
            <div className="bg-muted/30 rounded-2xl p-6 md:p-8 border border-border/40">
              <h2 className=" font-serif font-bold mb-4">Final Thoughts</h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                An amortization calculator is a helpful tool that can guide you in understanding your loan payments before you actually take up any loan. By providing basic information such as the loan amount, the interest rate, and the term of the loan, you can use this calculator to better understand how the loan would be repaid. By using this calculator frequently, you can have better control over your finances.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* FAQ */}
        <section className="mb-10 md:mb-14">
          <ScrollReveal>
            <h2 className=" font-serif font-bold text-center mb-6">
              Frequently Asked Questions
            </h2>
          </ScrollReveal>
          <StaggerContainer className="space-y-4" staggerDelay={0.05}>
            {[
              {
                q: 'How can I use an amortization calculator?',
                a: 'You can use an amortization calculator by entering the loan amount, interest rate, and loan term. After submitting these details, the tool will estimate your monthly payment and generate a repayment schedule.'
              },
              {
                q: 'How do we calculate amortization?',
                a: 'Amortization is calculated using a formula that determines a fixed payment over a specific loan period. The calculation considers the loan principal, interest rate, and the total number of payments using the formula: M = P × [r(1+r)ⁿ] / [(1+r)ⁿ – 1].'
              },
              {
                q: 'What does 30% amortization mean?',
                a: 'Thirty percent amortization refers to the portion of a payment that goes toward reducing the principal balance. The remaining percentage of the payment is typically applied to interest or other loan costs.'
              },
              {
                q: 'How to use the amortisation formula?',
                a: 'To use the amortisation formula, you need the loan principal, interest rate, and number of payments. By placing these values into the formula, you can calculate the fixed payment required to repay the loan.'
              },
              {
                q: 'Can I calculate amortization manually?',
                a: 'Yes, amortization can be calculated manually using the standard loan payment formula. However, the process takes time because you must calculate the interest and remaining balance after each payment.'
              },
            ].map((faq) => (
              <StaggerItem key={faq.q}>
                <motion.div 
                  className="bg-card rounded-2xl p-5 md:p-6 border border-border/50 warm-shadow" 
                  whileHover={{ y: -1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <HelpCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif  font-bold mb-2">{faq.q}</h3>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* CTA */}
        <ScrollReveal>
          <div className="text-center">
            <motion.a 
              href="/#calculator" 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-2xl font-bold text-base warm-shadow-lg hover:warm-shadow-xl transition-all"
            >
              <Calculator className="w-5 h-5" /> Try the Calculator Now <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </Layout>
  );
};

export default HowToUse;