import React from 'react';
import { AmortizationResult, formatCurrencyPrecise, exportToCSV } from '@/lib/amortization';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from './ScrollAnimations';
import { Download, Printer, ChevronDown, ChevronRight, Table, Calendar, DollarSign, TrendingUp, Percent } from 'lucide-react';

interface Props {
  result: AmortizationResult;
}

export function AmortizationTable({ result }: Props) {
  const { schedule } = result;
  const years = useMemo(() => {
    const set = new Set<number>();
    schedule.forEach(r => set.add(r.date.getFullYear()));
    return Array.from(set).sort();
  }, [schedule]);

  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

  const filtered = selectedYear === 'all' ? schedule : schedule.filter(r => r.date.getFullYear() === selectedYear);

  const yearGroups = useMemo(() => {
    const groups: Record<number, typeof schedule> = {};
    filtered.forEach(r => {
      const y = r.date.getFullYear();
      if (!groups[y]) groups[y] = [];
      groups[y].push(r);
    });
    return groups;
  }, [filtered]);

  const toggleYear = (y: number) => {
    const next = new Set(expandedYears);
    next.has(y) ? next.delete(y) : next.add(y);
    setExpandedYears(next);
  };

  return (
    <ScrollReveal>
      <div className="bg-card rounded-2xl overflow-hidden border border-border/50 warm-shadow-lg">
        <div className="flex flex-col gap-3 p-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Table className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif  font-bold truncate">Amortization Schedule</h3>
              <p className="text-xs text-muted-foreground">{schedule.length} total payments • Tap year to expand</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={String(selectedYear)}
              onChange={e => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="flex-1 sm:flex-none bg-background border border-border rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            
            <div className="flex gap-2">
              <motion.button
                onClick={() => exportToCSV(schedule)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors warm-shadow"
              >
                <Download className="w-4 h-4" />
                <span className="hidden xs:inline">CSV</span>
              </motion.button>
              <motion.button
                onClick={() => window.print()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden xs:inline">Print</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden">
          <div className="max-h-[500px] overflow-y-auto">
            {Object.entries(yearGroups).map(([yearStr, rows]) => {
              const year = Number(yearStr);
              const expanded = expandedYears.has(year);
              const totalPrinc = rows.reduce((s, r) => s + r.principalPortion, 0);
              const totalInt = rows.reduce((s, r) => s + r.interestPortion, 0);
              const totalPayment = rows.reduce((s, r) => s + r.paymentAmount, 0);
              const totalExtra = rows.reduce((s, r) => s + r.extraPayment, 0);

              return (
                <div key={year} className="border-b border-border/30 last:border-b-0">
                  {/* Year Summary Card */}
                  <div
                    onClick={() => toggleYear(year)}
                    className="p-4 bg-warm-50 cursor-pointer hover:bg-warm-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {expanded ? 
                          <ChevronDown className="w-4 h-4 text-primary" /> : 
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        }
                        <span className="font-semibold text-base">{year}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{rows.length} payments</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="w-3 h-3" />
                          <span className="text-[10px] uppercase tracking-wider">Start Balance</span>
                        </div>
                        <p className="font-mono font-semibold text-sm">{formatCurrencyPrecise(rows[0].beginningBalance)}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="w-3 h-3" />
                          <span className="text-[10px] uppercase tracking-wider">End Balance</span>
                        </div>
                        <p className="font-mono font-semibold text-sm">{formatCurrencyPrecise(rows[rows.length - 1].endingBalance)}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-success">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-[10px] uppercase tracking-wider">Principal</span>
                        </div>
                        <p className="font-mono font-semibold text-sm text-success">{formatCurrencyPrecise(totalPrinc)}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-destructive">
                          <Percent className="w-3 h-3" />
                          <span className="text-[10px] uppercase tracking-wider">Interest</span>
                        </div>
                        <p className="font-mono font-semibold text-sm text-destructive">{formatCurrencyPrecise(totalInt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Payment Details */}
                  {expanded && (
                    <div className="bg-background divide-y divide-border/20">
                      {rows.map(r => (
                        <div key={r.paymentNumber} className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold">#{r.paymentNumber}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {r.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                              </span>
                            </div>
                            <span className="font-mono font-semibold text-sm">{formatCurrencyPrecise(r.paymentAmount)}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                            <span className="text-muted-foreground">Principal:</span>
                            <span className="font-mono text-success text-right">{formatCurrencyPrecise(r.principalPortion)}</span>
                            
                            <span className="text-muted-foreground">Interest:</span>
                            <span className="font-mono text-destructive text-right">{formatCurrencyPrecise(r.interestPortion)}</span>
                            
                            {r.extraPayment > 0 && (
                              <>
                                <span className="text-muted-foreground">Extra Payment:</span>
                                <span className="font-mono text-right">{formatCurrencyPrecise(r.extraPayment)}</span>
                              </>
                            )}
                            
                            <span className="text-muted-foreground">Remaining:</span>
                            <span className="font-mono font-semibold text-right">{formatCurrencyPrecise(r.endingBalance)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto scrollbar-thin max-h-[500px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card z-10 border-b border-border/40">
              <tr>
                {['#', 'Date', 'Balance', 'Payment', 'Principal', 'Interest', 'Extra', 'End Bal.'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-semibold whitespace-nowrap uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(yearGroups).map(([yearStr, rows]) => {
                const year = Number(yearStr);
                const expanded = expandedYears.has(year);
                const totalPrinc = rows.reduce((s, r) => s + r.principalPortion, 0);
                const totalInt = rows.reduce((s, r) => s + r.interestPortion, 0);

                return (
                  <React.Fragment key={year}>
                    <tr
                      onClick={() => toggleYear(year)}
                      className="border-b border-border/30 bg-warm-50 cursor-pointer hover:bg-warm-100 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold">
                        <div className="flex items-center gap-1.5">
                          {expanded ? <ChevronDown className="w-3.5 h-3.5 text-primary" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                          <span>{year}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-[10px]">({rows.length} pmts)</td>
                      <td className="px-4 py-3 font-mono font-semibold">{formatCurrencyPrecise(rows[0].beginningBalance)}</td>
                      <td className="px-4 py-3 font-mono font-semibold">{formatCurrencyPrecise(rows.reduce((s, r) => s + r.paymentAmount, 0))}</td>
                      <td className="px-4 py-3 font-mono text-success font-semibold">{formatCurrencyPrecise(totalPrinc)}</td>
                      <td className="px-4 py-3 font-mono text-destructive font-semibold">{formatCurrencyPrecise(totalInt)}</td>
                      <td className="px-4 py-3 font-mono">{formatCurrencyPrecise(rows.reduce((s, r) => s + r.extraPayment, 0))}</td>
                      <td className="px-4 py-3 font-mono font-semibold">{formatCurrencyPrecise(rows[rows.length - 1].endingBalance)}</td>
                    </tr>
                    {expanded && rows.map(r => (
                      <tr key={r.paymentNumber} className="border-b border-border/20 hover:bg-warm-50 transition-colors">
                        <td className="px-4 py-2 font-mono text-muted-foreground">{r.paymentNumber}</td>
                        <td className="px-4 py-2 font-mono whitespace-nowrap">{r.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}</td>
                        <td className="px-4 py-2 font-mono">{formatCurrencyPrecise(r.beginningBalance)}</td>
                        <td className="px-4 py-2 font-mono">{formatCurrencyPrecise(r.paymentAmount)}</td>
                        <td className="px-4 py-2 font-mono text-success">{formatCurrencyPrecise(r.principalPortion)}</td>
                        <td className="px-4 py-2 font-mono text-destructive">{formatCurrencyPrecise(r.interestPortion)}</td>
                        <td className="px-4 py-2 font-mono">{r.extraPayment > 0 ? formatCurrencyPrecise(r.extraPayment) : '—'}</td>
                        <td className="px-4 py-2 font-mono">{formatCurrencyPrecise(r.endingBalance)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ScrollReveal>
  );
}