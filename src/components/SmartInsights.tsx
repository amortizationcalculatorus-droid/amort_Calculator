import { AmortizationResult, formatCurrency } from '@/lib/amortization';
import { motion } from 'framer-motion';
import { ScrollReveal } from './ScrollAnimations';
import { Lightbulb, TrendingDown, Clock, Percent, Target, AlertTriangle } from 'lucide-react';

interface Props {
  result: AmortizationResult;
  hasExtra: boolean;
  extraAmount: number;
}

export function SmartInsights({ result, hasExtra, extraAmount }: Props) {
  const insights: { icon: typeof Lightbulb; text: string; type: 'info' | 'success' | 'warning' }[] = [];

  if (result.interestFirst5Years > 0) {
    insights.push({ icon: Percent, text: `You will pay ${result.interestFirst5Years.toFixed(0)}% of total interest in the first 5 years — interest is heavily front-loaded.`, type: 'warning' });
  }
  if (result.interestFirst10Years > 0 && result.schedule.length > 120) {
    insights.push({ icon: TrendingDown, text: `${result.interestFirst10Years.toFixed(0)}% of total interest accumulates within the first 10 years of your loan.`, type: 'info' });
  }
  if (hasExtra && result.interestSaved > 0) {
    insights.push({ icon: Lightbulb, text: `Adding ${formatCurrency(extraAmount)}/month in extra payments saves you ${formatCurrency(result.interestSaved)} in total interest.`, type: 'success' });
  }
  if (hasExtra && result.yearsSaved > 0) {
    insights.push({ icon: Clock, text: `Your extra payments reduce the loan term by ${result.yearsSaved.toFixed(1)} years, giving you earlier financial freedom.`, type: 'success' });
  }
  insights.push({ icon: Target, text: `Your loan reaches 50% principal repayment at year ${result.halfLifeYear.toFixed(1)} — the "amortization half-life."`, type: 'info' });

  if (result.totalInterest > result.totalCost * 0.35) {
    insights.push({ icon: AlertTriangle, text: `Interest accounts for ${((result.totalInterest / result.totalCost) * 100).toFixed(0)}% of your total cost. Consider a shorter term or larger down payment.`, type: 'warning' });
  }

  const typeColors = {
    info: 'border-l-primary bg-primary/5',
    success: 'border-l-success bg-success/5',
    warning: 'border-l-warning bg-warning/5',
  };

  return (
    <ScrollReveal>
      <div className="bg-card rounded-2xl p-6 border border-border/50 warm-shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="font-serif  font-bold">Smart Insights</h3>
            <p className="text-xs text-muted-foreground">Auto-generated analysis based on your inputs</p>
          </div>
        </div>
        <div className="space-y-3">
          {insights.map(({ icon: Icon, text, type }, i) => (
            <motion.div
              key={i}
              className={`flex gap-4 items-start p-4 rounded-xl border-l-4 ${typeColors[type]}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Icon className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
              <p className=" leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
