import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { CalculatorForm } from '@/components/CalculatorForm';
import { SummaryCards } from '@/components/SummaryCards';
import { AmortizationTable } from '@/components/AmortizationTable';
import { Charts } from '@/components/Charts';
import { SmartInsights } from '@/components/SmartInsights';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollAnimations';
import { LoanInputs, calculateAmortization } from '@/lib/amortization';
import {
  ArrowRight, Calculator, TrendingUp, PieChart, Brain, BarChart3,
  DollarSign, LineChart, ArrowDownUp, Table2, CreditCard, BarChart,
  Settings, Calendar, Wallet, GraduationCap, Car, Home, ChevronDown
} from 'lucide-react';
import heroBg from '@/assets/hero-bg.png';
import { SEO } from '@/components/SEO';

const defaultInputs: LoanInputs = {
  principal: 350000,
  annualRate: 6.5,
  termYears: 30,
  frequency: 'monthly',
  compounding: 'monthly',
  extraMonthlyPayment: 0,
  lumpSumPayment: 0,
  lumpSumMonth: 12,
  interestOnlyMonths: 0,
  balloonPayment: false,
};

const Index = () => {
  const [inputs, setInputs] = useState<LoanInputs>(defaultInputs);
  const result = useMemo(() => calculateAmortization(inputs), [inputs]);
  const hasExtra = inputs.extraMonthlyPayment > 0 || inputs.lumpSumPayment > 0;

  return (
    <Layout>
       <SEO 
              title="Amortization Calculator: Calculate Loan Interest & Schedule"
              description="Use our Amortization Calculator to calculate your loan payments and get the full schedule. Get real-time insights and manage your loan easily."
              url="http://localhost:8080/how-to-use"
            />
      {/* ── Calculator Section ── */}
      <section id="calculator" className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-background/80" />
        <div className="container mx-auto px-4 py-10 md:py-12 relative">
          <ScrollReveal>
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs font-semibold text-primary mb-3">
                <Calculator className="w-3.5 h-3.5" /> Real-Time Loan &amp; Interest Tool
              </div>
              <h1 className="text-2xl font-serif font-bold mb-2">Amortization Calculator</h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">Adjust parameters on the left. Results update in real time.</p>
            </div>
          </ScrollReveal>
          <div className="grid lg:grid-cols-[400px_1fr] gap-6">
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <CalculatorForm inputs={inputs} onChange={setInputs} />
            </aside>
            <div className="space-y-6 min-w-0">
              <SummaryCards result={result} hasExtra={hasExtra} />
              <Charts result={result} hasExtra={hasExtra} />
              <AmortizationTable result={result} />
              <SmartInsights result={result} hasExtra={hasExtra} extraAmount={inputs.extraMonthlyPayment} />
            </div>
          </div>
        </div>
      </section>

      {/* ── What is the Amortization Calculator ── */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <h2 className=" font-serif font-bold text-center mb-5 md:mb-6">What is the Amortization Calculator?</h2>
            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>Managing your loan can be a complex task when dealing with matters such as interest and loan repayment schedules. Most people take loans for various purposes such as homes, cars, education, and personal use. However, they are not aware of the actual amount they will pay in the end. This is where the <span className='font-bold' >Amortization Calculator</span>  becomes extremely useful.</p>
              <p>It provides detailed information regarding the monthly payments and the breakdown between the principal and the interest. All you need are the loan amount and the interest rate.</p>
              <p>With the help of the <span className='font-bold' >loan Amortization Calculator</span> , we are able to understand the actual cost of the loan before we take it. It also helps us in planning better and wiser financial decisions. Below, we will be able to understand the working of the <span className="font-bold">Mortgage Amortization calculator</span>  and its usefulness in our financial planning.</p>
              {/* <p>An amortization calculator is a financial calculator that can be used to estimate the loan repayment plan. It can be used to divide each monthly payment into two parts: principal and interest. Initially, the loan payments are mainly used to pay the interest, but later on, the payments are used to reduce the loan balance.</p> */}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── How to Use ── */}
      <section className="bg-muted/30 border-y border-border/40 py-10 md:py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-8 md:mb-10">
              <h2 className=" font-serif font-bold mb-3">How to Use the Amortization Calculator?</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">We have made it easy to use our calculator so that you can quickly understand your loan in just a few steps. Below, we will guide you through exactly how to use it to enter your details and explore your payment schedule.</p>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-8xl mx-auto" staggerDelay={0.08}>
            {[
              { step: '01', icon: DollarSign, title: 'Enter Your Loan Amount', desc: 'Firstly, you can enter the total amount you want to borrow. This helps the calculator determine your monthly payments and total loan cost accurately.' },
              { step: '02', icon: TrendingUp, title: 'Add the Interest Rate', desc: 'Enter the annual interest rate provided by your lender so the calculator can determine accurate payment amounts. The interest rate directly affects how much interest you\'ll pay over the life of the loan.' },
              { step: '03', icon: Calendar, title: 'Select the Loan Term', desc: 'Choose the length of your loan in years, such as 15, 20, or 30 years. Longer terms typically lower monthly payments but increase the total interest paid.' },
              { step: '04', icon: Settings, title: 'Adjust Payment Frequency', desc: 'You can select how you want to make payments, monthly, biweekly, or weekly. Adjusting the frequency can help you to save on interest and pay off the loan faster.' },
              { step: '05', icon: BarChart3, title: 'Explore the Results', desc: 'Once you enter all the details, you\'ll instantly see your monthly payment, total interest, and total loan cost. You can also check your payoff date and full amortization schedule to plan your finances better.' },
            ].map((s) => (
              <StaggerItem key={s.step}>
                <motion.div className="bg-card rounded-2xl p-4 md:p-5 border border-border/50 warm-shadow h-full text-center" whileHover={{ y: -3 }}>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-xl md:text-2xl font-serif font-bold text-primary/70 mb-1">{s.step}</div>
                  <h3 className="font-serif text-xs md:text-sm font-bold mb-1.5">{s.title}</h3>
                  <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Extra Payments ── */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <h2 className=" font-serif font-bold text-center mb-5 md:mb-6">How to Calculate Amortization with an Extra Payment?</h2>
            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>Extra payments can reduce the cost of a loan. By making additional payments toward the principal, borrowers can shorten the loan term and reduce the total interest paid.</p>
              <p>To calculate amortization with an extra payment:</p>
              <ol className="list-decimal list-inside space-y-1.5 pl-2">
                <li>Enter your regular loan details into the calculator.</li>
                <li>Add the <span className="font-bold">extra payment amount</span> in the extra payment field.</li>
                <li>The calculator will automatically apply the extra amount to the principal balance.</li>
              </ol>
              <p>When an extra payment is made, it directly reduces the principal. Since interest is calculated based on the remaining balance, a lower balance means less interest in future payments.</p>
              <div className="bg-card rounded-2xl p-5 border border-border/50 warm-shadow space-y-3">
                <h3 className="font-serif font-bold text-foreground text-sm">Extra payments can be made in two ways:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span><strong className="text-foreground">Regular extra monthly payments</strong> </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span><strong className="text-foreground">One-time lump sum payments</strong> </span>
                  </li>
                </ul>
              </div>
              <p>For example, if you add an extra $100 to your monthly mortgage payment, you may save thousands of dollars in interest and pay off the loan several years earlier.</p>
              <p className="text-xs italic">However, borrowers should always check with their lender before making extra payments. Some lenders may charge a <span className="font-bold">prepayment penalty</span> for paying off the loan too early.</p>
            </div>
          </div>
        </ScrollReveal>
      </section>
{/* ── Dashboard / Loan Parameters ── */}
<section className="bg-muted/30 border-y border-border/40 py-10 md:py-16">
  <div className="container mx-auto px-4">
    <ScrollReveal>
      <div className="max-w-3xl mx-auto">
        <h2 className=" font-serif font-bold text-center mb-3">
          Amortization Calculator Dashboard - Loan Parameters
        </h2>
        <p className="text-sm md:text-base text-muted-foreground text-center mb-6 md:mb-8 max-w-2xl mx-auto">
          Our amortization calculator is designed to offer a comprehensive loan analysis in one place. 
          Its dashboard has many sections that can be used to understand every part of the loan repayment process.
        </p>
        <div className="bg-card rounded-2xl p-5 md:p-7 border border-border/50 warm-shadow">
          <h3 className="font-serif font-bold text-sm md:text-base mb-4">
            The calculator also comes with adjustable loan parameters that enable you to customize your loan parameters and see instant results.
          </h3>
          <p className="text-sm text-muted-foreground mb-4">You may easily adjust the following values:</p>
          <p className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              'Define the total amount you wish to borrow.',
              'Determine the percentage rate charged by your lender.',
              'Select the total time period for repayment.',
              'Choose the monthly, bi-weekly, or weekly payment options.',
              'Select the interest-compounding options: monthly, daily, or annually.',
              'Add additional payments to shorten the loan period.',
              'Add one-time extra payments.',
              'Add the interest-only payment periods.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs md:text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </p>
          <p className="text-xs text-muted-foreground mt-4 italic">
            As these values change, the calculator will automatically update the results in real-time without the need to refresh the page.
          </p>
        </div>
      </div>
    </ScrollReveal>
  </div>
</section>

{/* ── Real-Time Loan Results ── */}
<section className="container mx-auto px-4 py-10 md:py-16">
  <ScrollReveal>
    <div className="text-center mb-6 md:mb-8">
      <h2 className=" font-serif font-bold mb-3">Real-Time Loan Results</h2>
      <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
        Once the values have been entered, the calculator will display financial results that will help you understand your loan structure.
      </p>
    </div>
  </ScrollReveal>
  <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto" staggerDelay={0.06}>
    {[
      { title: 'Monthly Payment', desc: 'The calculator will determine the exact amount to be paid each month based on the loan information provided.' },
      { title: 'Total Interest', desc: 'This will show the total interest paid throughout the entire loan period.' },
      { title: 'Total Loan Cost', desc: 'This is the actual amount paid to the lender as it includes the interest as well as the principal loan amount.' },
      { title: 'Payoff Date', desc: 'Using the tool, the estimated time will be determined when the loan is fully paid.' },
      { title: 'Half-Life Point', desc: 'This special knowledge will give the user the time when the loan has paid out half of the principal loan amount.' },
      { title: 'Effective Rate', desc: 'Using the calculator, the interest rate will be determined, which is the actual interest rate paid on the loan.' },
    ].map((r) => (
      <StaggerItem key={r.title}>
        <motion.div className="bg-card rounded-2xl p-4 md:p-5 border border-border/50 warm-shadow h-full" whileHover={{ y: -2 }}>
          <h3 className="font-serif text-sm font-bold mb-1.5">{r.title}</h3>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
        </motion.div>
      </StaggerItem>
    ))}
  </StaggerContainer>
</section>

{/* ── Exclusive Features ── */}
<section id="features" className="bg-muted/30 border-y border-border/40 py-10 md:py-16">
  <div className="container mx-auto px-4">
    <ScrollReveal>
      <div className="text-center mb-8 md:mb-10">
        <h2 className=" font-serif font-bold mb-3">
          Exclusive Features of Our Amortization Calculator
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Below, you will learn about the unique features that make it easy and simple for you to manage your loan. 
          It will assist you in planning your payments and understanding your loan like never before.
        </p>
      </div>
    </ScrollReveal>
    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.06}>
      {[
        { 
          icon: DollarSign, 
          title: 'Accurate Monthly Payment Estimates', 
          desc: 'One of the most significant advantages of using an amortization calculator is the accuracy it offers in terms of monthly payment estimates. The user can simply input the loan amount, interest rate, and the term length, and the calculator will display the monthly payment estimates instantly.' 
        },
        { 
          icon: LineChart, 
          title: 'Loan Balance Trajectory', 
          desc: 'One of the most useful visual aids of the calculator is the Loan Balance Trajectory chart. This chart displays the progress of the loan balance as it decreases over time for all the payments. Rather than seeing the figures, the user can view the loan balance as it gradually decreases from the original loan amount down to zero. This allows the borrower to understand the time it takes for the loan balance to significantly decrease.' 
        },
        { 
          icon: ArrowDownUp, 
          title: 'Principal vs Interest Crossover', 
          desc: 'Beginning of a majority of loans, more money in a payment goes toward interest rather than principal repayment. The calculator we offer shows this crossover point where the principal payment in a payment is more than the interest payment. Seeing this crossover helps borrowers to grasp how a loan is amortized.' 
        },
        { 
          icon: PieChart, 
          title: 'Payment Allocation Breakdown', 
          desc: 'Another powerful feature is the Payment Allocation chart, which clearly displays the allocation of the total cost of the loan. The total payment is normally composed of the following two parts: Principal - The initial sum borrowed, and Interest - The expense incurred by the lender. For example, in the case of the typical mortgage scenario, the interest component is normally greater than half of the total payment.' 
        },
        { 
          icon: Brain, 
          title: 'Smart Insights - Automated Loan Analysis', 
          desc: 'One of the most advanced features of the calculator is the Smart Insights engine. Instead of showing numbers, the tool analyzes your input and produces relevant financial insights. These relevant financial insights can include: How much interest is paid in the first few years, how much of the total interest is accumulated in the early years as a percentage, the amortization half-life point, and how to save money on interest. For example, the calculator could show you how much of your loan is paid in the early years as interest. This can help you understand the importance of paying more in the early years of your loan.' 
        },
        { 
          icon: Table2, 
          title: 'Amortization Schedule', 
          desc: 'The Amortization Schedule offers detailed breakdowns of payments for the entire duration of the loan. Each section contains: Payment Date, Beginning Balance, Payment Amount, Principal Payment Amount, Interest Payment Amount, Extra Payments, and Ending Balance. A user can expand each year to see detailed breakdowns or export the entire schedule as a CSV file for personal financial planning purposes.' 
        },
        { 
          icon: CreditCard, 
          title: 'Extra Payments Support', 
          desc: 'You can enter extra payments every month or as a lump sum to see the results of the extra payments. Extra payments are applied directly to the principal and can save money in the amount of interest and the number of years it will take to pay off the loan. This is a great way to plan extra payments and lump sums.' 
        },
        { 
          icon: BarChart, 
          title: 'Visual Charts', 
          desc: 'Interactive charts will show you the loan balance over time and the breakdown of the principal and interest. It will help you to understand the point at which the principal will start exceeding the interest. You can monitor the effects of additional payments or changes in the loan term through the interactive charts. Charts help to understand complex information at a glance.' 
        },
      ].map((item) => (
        <StaggerItem key={item.title}>
          <motion.div className="bg-card rounded-2xl p-4 md:p-5 border border-border/50 warm-shadow hover:warm-shadow-lg transition-all h-full" whileHover={{ y: -4 }}>
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-serif text-xs md:text-sm font-bold mb-1.5">{item.title}</h3>
            <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  </div>
</section>

{/* ── Benefits ── */}
<section className="container mx-auto px-4 py-10 md:py-16">
  <ScrollReveal>
    <div className="max-w-5xl mx-auto">
      <h2 className=" font-serif font-bold text-center mb-5 md:mb-6">
        Benefits of Using Our Amortization Calculator
      </h2>
      <p className="text-sm md:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-6">
        Using a smart loan calculator provides many advantages for borrowers.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { 
            title: 'Plan Before You Borrow', 
            desc: 'The calculator helps users to estimate their future loan payments before committing to a loan. This makes budgeting and financial planning much easier.' 
          },
          { 
            title: 'See the True Cost', 
            desc: 'Many borrowers focus only on the monthly payment. However, the calculator reveals the total interest paid over the entire loan term, which is much larger than expected.' 
          },
          { 
            title: 'Compare Loan Scenarios', 
            desc: 'Users can adjust interest rates, loan terms, and payment frequencies to compare different loan scenarios.' 
          },
          { 
            title: 'Test Extra Payment Strategies', 
            desc: 'The calculator allows users to test extra payment strategies that can significantly reduce interest costs.' 
          },
          { 
            title: 'Visual Understanding', 
            desc: 'Charts and schedules show how the loan balance decreases over time, helping borrowers understand the repayment process clearly.' 
          },
        ].map((b) => (
          <motion.div key={b.title} className="bg-card rounded-2xl p-4 md:p-5 border border-border/50 warm-shadow h-full" whileHover={{ y: -2 }}>
            <h3 className="font-serif text-xs md:text-sm font-bold mb-1.5">{b.title}</h3>
            <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </ScrollReveal>
</section>

{/* ── Where Commonly Used ── */}
<section className="bg-muted/30 border-y border-border/40 py-10 md:py-16">
  <div className="container mx-auto px-4">
    <ScrollReveal>
      <div className="max-w-4xl mx-auto">
        <h2 className=" font-serif font-bold text-center mb-5 md:mb-6">
          Where Amortization Calculators Are Commonly Used?
        </h2>
        <p className="text-sm md:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-6">
          The Amortization tool is used in many financial situations. You can use it:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { 
              icon: Home, 
              title: 'Mortgage Loans', 
              desc: 'Mortgage loans last 15 to 30 years. It helps borrowers understand long-term payments and interest costs.' 
            },
            { 
              icon: Car, 
              title: 'Car Financing', 
              desc: 'Car financing involves monthly payments for several years. This calculator helps buyers estimate affordable payment plans.' 
            },
            { 
              icon: Wallet, 
              title: 'Personal Loans', 
              desc: 'Personal loans come with different interest rates and repayment periods. Using the calculator helps compare loan offers.' 
            },
            { 
              icon: GraduationCap, 
              title: 'Student Loans', 
              desc: 'Students and graduates can estimate their repayment schedules and understand the long-term cost of education loans.' 
            },
          ].map((item) => (
            <motion.div key={item.title} className="bg-card rounded-2xl p-4 md:p-5 border border-border/50 warm-shadow h-full flex items-start gap-3 md:gap-4" whileHover={{ y: -2 }}>
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-xs md:text-sm font-bold mb-1">{item.title}</h3>
                <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  </div>
</section>

      {/* ── Final Words ── */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className=" font-serif font-bold mb-4">Final Words</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">An amortization calculator is one of the most useful financial tools for anyone planning to take a loan. It provides clear insights into monthly payments, total interest, and the full repayment schedule. Instead of making financial decisions blindly, we can use this calculator to understand the real cost of borrowing. By using an amortization schedule calculator regularly, managing debt becomes much easier and more transparent.</p>
          </div>
        </ScrollReveal>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-muted/30 border-y border-border/40 py-10 md:py-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-6 md:mb-8">
              <h2 className=" font-serif font-bold mb-3">Frequently Asked Questions</h2>
              <p className="text-sm md:text-base text-muted-foreground">Everything you need to know about loan amortization.</p>
            </div>
          </ScrollReveal>
          <StaggerContainer className="max-w-3xl mx-auto space-y-3 md:space-y-4" staggerDelay={0.06}>
            {[
              { q: 'What is the Best Amortization Calculator?', a: 'The best amortization tool is accurate, easy to use, and provides detailed insights like monthly payments, interest breakdown, and loan schedules. Our calculator offers real-time updates, extra payment options, and visual charts, making it a top choice for borrowers.' },
              { q: 'How Much Does an Amortization Calculator Cost?', a: 'Our online mortgage calculator amortization is free to use, including ours. Simply enter your loan details and get instant results without any hidden fees.' },
              { q: 'How to Do Amortization on a Financial Calculator?', a: 'To perform amortization manually, use the PMT function to calculate monthly payments and track how much goes toward principal and interest each month. You can also adjust for extra payments to see how they reduce the loan term.' },
              { q: 'What is a Loan Amortization Calculator?', a: 'A loan amortization calculator is designed specifically for loans like mortgages, car loans, or personal loans. It breaks down each payment, shows your balance over time, and helps you plan repayment strategies.' },
              { q: 'How to Figure Amortization Using a Calculator?', a: 'Enter your loan amount, interest rate, term, and payment frequency into the calculator. The tool will automatically show monthly payments, interest paid, and total loan cost.' },
            ].map((faq) => (
              <StaggerItem key={faq.q}>
                <motion.div className="bg-card rounded-2xl p-4 md:p-5 border border-border/50 warm-shadow" whileHover={{ y: -2 }}>
                  <h3 className="font-serif text-xs md:text-sm font-bold mb-1.5">{faq.q}</h3>
                  <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container mx-auto px-4 py-10 md:pb-12">
        <ScrollReveal>
          <div className="relative bg-card rounded-3xl p-6 md:p-14 border border-border/50 warm-shadow-xl text-center overflow-hidden">
            <div className="absolute inset-0 bg-dots opacity-30" />
            <motion.div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-primary/8 blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 6, repeat: Infinity }} />
            <div className="relative">
              <h2 className=" font-serif font-bold mb-3 md:mb-4">Ready to Analyze Your Loan?</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto mb-5 md:mb-8">An amortization calculator is one of the most useful financial tools for anyone planning to take a loan. Instead of making financial decisions blindly, use this calculator to understand the real cost of borrowing.</p>
              <motion.a href="#calculator" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 md:px-7 py-3 md:py-3.5 rounded-2xl font-bold text-sm warm-shadow-lg">
                <Calculator className="w-4 h-4" /> Launch Calculator <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </Layout>
  );
};

export default Index;
