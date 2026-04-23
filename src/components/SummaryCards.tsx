import { AmortizationResult } from '@/lib/amortization';
import { AnimatedCounter } from './AnimatedCounter';
import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, Clock, Target, Zap, BarChart2, CalendarCheck, Percent } from 'lucide-react';

interface Props {
  result: AmortizationResult;
  hasExtra: boolean;
}

const cards: Array<{ key: string; label: string; icon: typeof DollarSign; prefix?: string; suffix?: string; color: string }> = [
  { key: 'payment', label: 'Monthly Payment', icon: DollarSign, prefix: '$', color: 'text-primary' },
  { key: 'totalInterest', label: 'Total Interest', icon: TrendingDown, prefix: '$', color: 'text-destructive' },
  { key: 'totalCost', label: 'Total Loan Cost', icon: BarChart2, prefix: '$', color: 'text-foreground' },
  { key: 'payoff', label: 'Payoff Date', icon: CalendarCheck, color: 'text-primary' },
  { key: 'saved', label: 'Interest Saved', icon: Zap, prefix: '$', color: 'text-success' },
  { key: 'halfLife', label: 'Amortization Half-Life', icon: Target, suffix: ' yrs', color: 'text-primary' },
  { key: 'effectiveRate', label: 'Effective Rate', icon: Percent, suffix: '%', color: 'text-muted-foreground' },
];

export function SummaryCards({ result, hasExtra }: Props) {
  const getValue = (key: string): number => {
    switch (key) {
      case 'payment': return result.monthlyPayment;
      case 'totalInterest': return result.totalInterest;
      case 'totalCost': return result.totalCost;
      case 'saved': return result.interestSaved;
      case 'halfLife': return result.halfLifeYear;
      case 'effectiveRate': return result.effectiveRate;
      default: return 0;
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ key, label, icon: Icon, prefix, suffix, color }, i) => {
        if (key === 'saved' && !hasExtra) return null;
        return (
          <motion.div
            key={key}
            className="bg-card rounded-2xl p-5 border border-border/50 warm-shadow hover:warm-shadow-lg transition-shadow group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </div>
            {key === 'payoff' ? (
              <p className="text-xl font-bold font-mono">
                {result.payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            ) : (
              <p className="text-xl font-bold">
                <AnimatedCounter
                  value={getValue(key)}
                  prefix={prefix || ''}
                  suffix={suffix || ''}
                  decimals={key === 'halfLife' || key === 'effectiveRate' ? 1 : 0}
                />
              </p>
            )}
          </motion.div>
        );
      })}
      {hasExtra && result.yearsSaved > 0 && (
        <motion.div
          className="bg-card rounded-2xl p-5 border-2 border-success/30 warm-shadow"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-success" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Years Saved</span>
          </div>
          <p className="text-xl font-bold text-success">
            <AnimatedCounter value={result.yearsSaved} decimals={1} suffix=" yrs" />
          </p>
        </motion.div>
      )}
    </div>
  );
}
