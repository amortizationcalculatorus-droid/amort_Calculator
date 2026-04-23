export interface LoanInputs {
  principal: number;
  annualRate: number;
  termYears: number;
  frequency: 'monthly' | 'biweekly' | 'weekly';
  compounding: 'monthly' | 'daily' | 'annually';
  extraMonthlyPayment: number;
  lumpSumPayment: number;
  lumpSumMonth: number;
  interestOnlyMonths: number;
  balloonPayment: boolean;
}

export interface ScheduleRow {
  paymentNumber: number;
  date: Date;
  beginningBalance: number;
  paymentAmount: number;
  principalPortion: number;
  interestPortion: number;
  extraPayment: number;
  endingBalance: number;
}

export interface AmortizationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  payoffDate: Date;
  schedule: ScheduleRow[];
  totalInterestWithoutExtra: number;
  totalPaymentsWithoutExtra: number;
  payoffDateWithoutExtra: Date;
  interestSaved: number;
  yearsSaved: number;
  effectiveRate: number;
  halfLifeYear: number;
  interestFirst5Years: number;
  interestFirst10Years: number;
}

function getPeriodicRate(annualRate: number, compounding: string, frequency: string): number {
  const r = annualRate / 100;
  let effectiveAnnual: number;

  if (compounding === 'daily') {
    effectiveAnnual = Math.pow(1 + r / 365, 365) - 1;
  } else if (compounding === 'annually') {
    effectiveAnnual = r;
  } else {
    effectiveAnnual = Math.pow(1 + r / 12, 12) - 1;
  }

  const periodsPerYear = frequency === 'weekly' ? 52 : frequency === 'biweekly' ? 26 : 12;
  return Math.pow(1 + effectiveAnnual, 1 / periodsPerYear) - 1;
}

function getPeriodsPerYear(frequency: string): number {
  return frequency === 'weekly' ? 52 : frequency === 'biweekly' ? 26 : 12;
}

function calculateBasePayment(principal: number, periodicRate: number, totalPeriods: number): number {
  if (periodicRate === 0) return principal / totalPeriods;
  return principal * (periodicRate * Math.pow(1 + periodicRate, totalPeriods)) / (Math.pow(1 + periodicRate, totalPeriods) - 1);
}

export function calculateAmortization(inputs: LoanInputs): AmortizationResult {
  const { principal, annualRate, termYears, frequency, compounding, extraMonthlyPayment, lumpSumPayment, lumpSumMonth, interestOnlyMonths } = inputs;

  const periodicRate = getPeriodicRate(annualRate, compounding, frequency);
  const periodsPerYear = getPeriodsPerYear(frequency);
  const totalPeriods = termYears * periodsPerYear;

  const basePayment = calculateBasePayment(principal, periodicRate, totalPeriods - interestOnlyMonths);
  const startDate = new Date();

  // Calculate WITHOUT extra payments
  const scheduleWithout: ScheduleRow[] = [];
  let balWithout = principal;
  let totalIntWithout = 0;
  for (let i = 1; i <= totalPeriods && balWithout > 0.01; i++) {
    const interest = balWithout * periodicRate;
    const isIO = i <= interestOnlyMonths;
    const pmt = isIO ? interest : Math.min(basePayment, balWithout + interest);
    const princ = pmt - interest;
    totalIntWithout += interest;
    balWithout = Math.max(0, balWithout - princ);
    const d = new Date(startDate);
    if (frequency === 'monthly') d.setMonth(d.getMonth() + i);
    else if (frequency === 'biweekly') d.setDate(d.getDate() + i * 14);
    else d.setDate(d.getDate() + i * 7);
    scheduleWithout.push({
      paymentNumber: i, date: d, beginningBalance: balWithout + princ,
      paymentAmount: pmt, principalPortion: princ, interestPortion: interest,
      extraPayment: 0, endingBalance: balWithout,
    });
  }
  const payoffWithout = scheduleWithout.length > 0 ? scheduleWithout[scheduleWithout.length - 1].date : startDate;

  // Calculate WITH extra payments
  const schedule: ScheduleRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  let halfLifeYear = 0;
  let halfLifeFound = false;
  let int5 = 0;
  let int10 = 0;

  for (let i = 1; balance > 0.01; i++) {
    const interest = balance * periodicRate;
    const isIO = i <= interestOnlyMonths;
    let pmt = isIO ? interest : Math.min(basePayment, balance + interest);
    let extra = 0;

    if (!isIO) {
      extra = extraMonthlyPayment;
      if (lumpSumPayment > 0 && i === lumpSumMonth) extra += lumpSumPayment;
      if (pmt - interest + extra > balance) extra = Math.max(0, balance - (pmt - interest));
    }

    const princ = pmt - interest + extra;
    totalInterest += interest;
    const yearNum = i / periodsPerYear;
    if (yearNum <= 5) int5 += interest;
    if (yearNum <= 10) int10 += interest;

    balance = Math.max(0, balance - princ);

    if (!halfLifeFound && balance <= principal / 2) {
      halfLifeYear = yearNum;
      halfLifeFound = true;
    }

    const d = new Date(startDate);
    if (frequency === 'monthly') d.setMonth(d.getMonth() + i);
    else if (frequency === 'biweekly') d.setDate(d.getDate() + i * 14);
    else d.setDate(d.getDate() + i * 7);

    schedule.push({
      paymentNumber: i, date: d, beginningBalance: balance + princ,
      paymentAmount: pmt + extra, principalPortion: princ - extra,
      interestPortion: interest, extraPayment: extra, endingBalance: balance,
    });

    if (i > totalPeriods * 2) break; // safety
  }

  const payoffDate = schedule.length > 0 ? schedule[schedule.length - 1].date : startDate;
  const totalCost = principal + totalInterest;
  const interestSaved = totalIntWithout - totalInterest;
  const yearsSaved = (scheduleWithout.length - schedule.length) / periodsPerYear;
  const effectiveRate = totalInterest / principal * 100;

  return {
    monthlyPayment: basePayment,
    totalInterest,
    totalCost,
    payoffDate,
    schedule,
    totalInterestWithoutExtra: totalIntWithout,
    totalPaymentsWithoutExtra: scheduleWithout.length,
    payoffDateWithoutExtra: payoffWithout,
    interestSaved: Math.max(0, interestSaved),
    yearsSaved: Math.max(0, yearsSaved),
    effectiveRate,
    halfLifeYear: halfLifeFound ? halfLifeYear : termYears / 2,
    interestFirst5Years: totalInterest > 0 ? (int5 / totalInterest) * 100 : 0,
    interestFirst10Years: totalInterest > 0 ? (int10 / totalInterest) * 100 : 0,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

export function formatCurrencyPrecise(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export function exportToCSV(schedule: ScheduleRow[]): void {
  const headers = ['Payment #', 'Date', 'Beginning Balance', 'Payment', 'Principal', 'Interest', 'Extra Payment', 'Ending Balance'];
  const rows = schedule.map(r => [
    r.paymentNumber,
    r.date.toLocaleDateString(),
    r.beginningBalance.toFixed(2),
    r.paymentAmount.toFixed(2),
    r.principalPortion.toFixed(2),
    r.interestPortion.toFixed(2),
    r.extraPayment.toFixed(2),
    r.endingBalance.toFixed(2),
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'amortization_schedule.csv';
  a.click();
  URL.revokeObjectURL(url);
}
