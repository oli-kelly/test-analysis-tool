import { describe, expect, it } from 'vitest';
import { analyseTrend } from '../src/analyse.js';
import { sma } from '../src/sma.js';
import { validateDailyCloses } from '../src/market-data.js';

const fixture = (values: number[]) => values.map((close, i) => ({
  date: new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10), close
}));

describe('simple moving average', () => {
  it('averages only the latest window', () => expect(sma([1, 2, 3, 4], 2)).toBe(3.5));
  it('returns null for insufficient observations', () => expect(sma([1], 2)).toBeNull());
  it('rejects invalid windows and nonfinite values', () => {
    expect(() => sma([1], 0)).toThrow();
    expect(() => sma([1], 1.5)).toThrow();
    expect(() => sma([NaN], 1)).toThrow();
  });
});

describe('market data validation', () => {
  it('rejects duplicate and unsorted dates', () => {
    expect(() => validateDailyCloses([{date:'2026-01-02',close:2},{date:'2026-01-02',close:3}])).toThrow();
    expect(() => validateDailyCloses([{date:'2026-01-02',close:2},{date:'2026-01-01',close:3}])).toThrow();
  });
  it('rejects invalid dates and prices', () => {
    expect(() => validateDailyCloses([{date:'2026-02-30',close:1}])).toThrow();
    expect(() => validateDailyCloses([{date:'2026-01-01',close:0}])).toThrow();
    expect(() => validateDailyCloses([{date:'2026-01-01',close:Infinity}])).toThrow();
  });
});

describe('SMA trend classification', () => {
  it('classifies a rising series as bullish', () => expect(analyseTrend(fixture(Array.from({length:50},(_,i)=>i+1))).signal).toBe('BULLISH'));
  it('classifies a falling series as bearish', () => expect(analyseTrend(fixture(Array.from({length:50},(_,i)=>50-i))).signal).toBe('BEARISH'));
  it('classifies a flat series as neutral', () => expect(analyseTrend(fixture(Array(50).fill(10))).signal).toBe('NEUTRAL'));
  it('requires 50 observations', () => {
    const result = analyseTrend(fixture(Array(49).fill(10)));
    expect(result.signal).toBe('INSUFFICIENT_DATA');
    expect(result.longSma).toBeNull();
  });
  it('handles exactly 50 observations and does not mutate input', () => {
    const input = fixture(Array.from({length:50},(_,i)=>i+1));
    const before = JSON.stringify(input);
    expect(analyseTrend(input).observations).toBe(50);
    expect(JSON.stringify(input)).toBe(before);
  });
});
