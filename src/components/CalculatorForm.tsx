import { LoanInputs } from '@/lib/amortization';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { DollarSign, Percent, Calendar, TrendingUp, Repeat, Layers, PiggyBank, Landmark } from 'lucide-react';

interface Props {
  inputs: LoanInputs;
  onChange: (inputs: LoanInputs) => void;
}

export function CalculatorForm({ inputs, onChange }: Props) {
  const update = (partial: Partial<LoanInputs>) => onChange({ ...inputs, ...partial });

  const inputClass = "w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all";

  return (
    <motion.div
      className="bg-card rounded-2xl p-6 warm-shadow-lg border border-border/50 space-y-6"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className=" font-serif font-bold">Loan Parameters</h2>
          <p className="text-xs text-muted-foreground">Adjust values to see real-time results</p>
        </div>
      </div>

      <div className="h-px bg-border/60" />

      {/* Principal */}
      <div className="space-y-2.5">
        <label className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" /> Loan Amount
        </label>
        <input
          type="number"
          value={inputs.principal}
          onChange={e => update({ principal: Math.max(0, Number(e.target.value)) })}
          className={inputClass}
        />
        <Slider
          value={[inputs.principal]}
          onValueChange={([v]) => update({ principal: v })}
          min={10000} max={2000000} step={5000}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$10,000</span><span>$2,000,000</span>
        </div>
      </div>

      {/* Interest Rate */}
      <div className="space-y-2.5">
        <label className="text-sm font-medium flex items-center gap-2">
          <Percent className="w-4 h-4 text-primary" /> Annual Interest Rate
        </label>
        <input
          type="number"
          step="0.125"
          value={inputs.annualRate}
          onChange={e => update({ annualRate: Math.max(0, Number(e.target.value)) })}
          className={inputClass}
        />
        <Slider
          value={[inputs.annualRate]}
          onValueChange={([v]) => update({ annualRate: v })}
          min={0.5} max={15} step={0.125}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0.5%</span><span>15%</span>
        </div>
      </div>

      {/* Term */}
      <div className="space-y-2.5">
        <label className="text-sm font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" /> Loan Term (Years)
        </label>
        <input
          type="number"
          value={inputs.termYears}
          onChange={e => update({ termYears: Math.max(1, Number(e.target.value)) })}
          className={inputClass}
        />
        <Slider
          value={[inputs.termYears]}
          onValueChange={([v]) => update({ termYears: v })}
          min={1} max={40} step={1}
        />
      </div>

      <div className="h-px bg-border/60" />

      {/* Payment Frequency */}
      <div className="space-y-2.5">
        <label className="text-sm font-medium flex items-center gap-2">
          <Repeat className="w-4 h-4 text-primary" /> Payment Frequency
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['monthly', 'biweekly', 'weekly'] as const).map(f => (
            <motion.button
              key={f}
              onClick={() => update({ frequency: f })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                inputs.frequency === f
                  ? 'bg-primary text-primary-foreground border-primary warm-shadow'
                  : 'bg-secondary text-secondary-foreground border-transparent hover:border-border'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Compounding */}
      <div className="space-y-2.5">
        <label className="text-sm font-medium flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" /> Compounding
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['monthly', 'daily', 'annually'] as const).map(c => (
            <motion.button
              key={c}
              onClick={() => update({ compounding: c })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                inputs.compounding === c
                  ? 'bg-primary text-primary-foreground border-primary warm-shadow'
                  : 'bg-secondary text-secondary-foreground border-transparent hover:border-border'
              }`}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border/60" />

      {/* Extra Payment */}
      <div className="space-y-2.5">
        <label className="text-sm font-medium flex items-center gap-2">
          <PiggyBank className="w-4 h-4 text-primary" /> Extra Monthly Payment
        </label>
        <input
          type="number"
          value={inputs.extraMonthlyPayment}
          onChange={e => update({ extraMonthlyPayment: Math.max(0, Number(e.target.value)) })}
          className={inputClass}
          placeholder="$0"
        />
      </div>

      {/* Lump Sum */}
      <div className="space-y-2.5">
        <label className="text-sm font-medium flex items-center gap-2">
          <Landmark className="w-4 h-4 text-primary" /> Lump Sum Payment
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={inputs.lumpSumPayment}
            onChange={e => update({ lumpSumPayment: Math.max(0, Number(e.target.value)) })}
            className={inputClass}
            placeholder="Amount"
          />
          <input
            type="number"
            value={inputs.lumpSumMonth}
            onChange={e => update({ lumpSumMonth: Math.max(1, Number(e.target.value)) })}
            className={inputClass}
            placeholder="At payment #"
          />
        </div>
      </div>

      {/* Interest Only */}
      <div className="space-y-2.5">
        <label className="text-sm font-medium flex items-center gap-2">
          Interest-Only Periods
        </label>
        <input
          type="number"
          value={inputs.interestOnlyMonths}
          onChange={e => update({ interestOnlyMonths: Math.max(0, Number(e.target.value)) })}
          className={inputClass}
          placeholder="0"
        />
      </div>
    </motion.div>
  );
}
