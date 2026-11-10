/** Average the most recent window observations without intermediate rounding. */
export function sma(values: readonly number[], window: number): number | null {
  if (!Number.isSafeInteger(window) || window <= 0) throw new Error('Window must be a positive integer');
  if (values.some(value => !Number.isFinite(value))) throw new Error('Values must be finite');
  if (values.length < window) return null;
  return values.slice(-window).reduce((sum, value) => sum + value, 0) / window;
}
