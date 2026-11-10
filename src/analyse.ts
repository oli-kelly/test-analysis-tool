import { validateDailyCloses } from './market-data.js';
import { sma } from './sma.js';

export type Trend = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'INSUFFICIENT_DATA';
export interface AnalysisResult {
  signal: Trend;
  shortSma: number | null;
  longSma: number | null;
  observations: number;
  asOf: string | null;
}

/** A trend state, not a trading recommendation or a crossover event. */
export function analyseTrend(input: unknown): AnalysisResult {
  const observations = validateDailyCloses(input);
  const prices = observations.map(item => item.close);
  const shortSma = sma(prices, 20);
  const longSma = sma(prices, 50);
  const signal: Trend = longSma === null || shortSma === null
    ? 'INSUFFICIENT_DATA'
    : shortSma > longSma ? 'BULLISH' : shortSma < longSma ? 'BEARISH' : 'NEUTRAL';
  return { signal, shortSma, longSma, observations: prices.length, asOf: observations.at(-1)?.date ?? null };
}
