import { AmortizationResult, formatCurrency } from '@/lib/amortization';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from './ScrollAnimations';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface Props {
  result: AmortizationResult;
  hasExtra: boolean;
}

export function Charts({ result, hasExtra }: Props) {
  const balanceData = useMemo(() => {
    const step = Math.max(1, Math.floor(result.schedule.length / 100));
    return result.schedule
      .filter((_, i) => i % step === 0 || i === result.schedule.length - 1)
      .map(r => ({
        payment: r.paymentNumber,
        balance: Math.round(r.endingBalance),
      }));
  }, [result.schedule]);

  const stackedData = useMemo(() => {
    const step = Math.max(1, Math.floor(result.schedule.length / 80));
    return result.schedule
      .filter((_, i) => i % step === 0)
      .map(r => ({
        payment: r.paymentNumber,
        principal: Math.round(r.principalPortion),
        interest: Math.round(r.interestPortion),
      }));
  }, [result.schedule]);

  const pieData = [
    { name: 'Principal', value: Math.round(result.totalCost - result.totalInterest) },
    { name: 'Interest', value: Math.round(result.totalInterest) },
  ];

  const COLORS = ['hsl(25, 85%, 52%)', 'hsl(210, 60%, 50%)'];

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: 'hsl(40, 25%, 99%)',
      border: '1px solid hsl(35, 20%, 88%)',
      borderRadius: '12px',
      fontSize: '12px',
      color: 'hsl(25, 25%, 12%)',
      boxShadow: '0 4px 24px -4px rgba(0,0,0,0.08)',
    },
  };

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="bg-card rounded-2xl p-6 border border-border/50 warm-shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif  font-bold">Loan Balance Trajectory</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Remaining balance over the life of your loan</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {result.schedule.length} payments
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={balanceData}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(25, 85%, 52%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(25, 85%, 52%)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 90%)" />
              <XAxis dataKey="payment" tick={{ fontSize: 10, fill: 'hsl(25, 12%, 50%)' }} axisLine={{ stroke: 'hsl(35, 20%, 90%)' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(25, 12%, 50%)' }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} axisLine={{ stroke: 'hsl(35, 20%, 90%)' }} />
              <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="balance" stroke="hsl(25, 85%, 52%)" fill="url(#balGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-6">
        <ScrollReveal delay={0.1}>
          <div className="bg-card rounded-2xl p-6 border border-border/50 warm-shadow-lg">
            <h3 className="font-serif  font-bold mb-1">Principal vs Interest</h3>
            <p className="text-xs text-muted-foreground mb-5">See the crossover point where principal exceeds interest</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={stackedData}>
                <defs>
                  <linearGradient id="princGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(25, 85%, 52%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(25, 85%, 52%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(210, 60%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(210, 60%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(35, 20%, 90%)" />
                <XAxis dataKey="payment" tick={{ fontSize: 10, fill: 'hsl(25, 12%, 50%)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(25, 12%, 50%)' }} tickFormatter={v => `$${v}`} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => `$${v}`} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="principal" stackId="1" stroke="hsl(25, 85%, 52%)" fill="url(#princGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="interest" stackId="1" stroke="hsl(210, 60%, 50%)" fill="url(#intGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="bg-card rounded-2xl p-6 border border-border/50 warm-shadow-lg">
            <h3 className="font-serif  font-bold mb-1">Payment Allocation</h3>
            <p className="text-xs text-muted-foreground mb-5">How your total cost breaks down</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'hsl(25, 12%, 50%)' }}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
