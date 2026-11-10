export interface DailyClose { date: string; close: number }

export function validateDailyCloses(input: unknown): DailyClose[] {
  if (!Array.isArray(input)) throw new Error('Expected an array of daily closing prices');
  let previous = '';
  return input.map((value: unknown, index: number): DailyClose => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error(`Invalid observation at index ${index}`);
    const item = value as Record<string, unknown>;
    if (typeof item.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) || Number.isNaN(Date.parse(item.date)) || new Date(item.date).toISOString().slice(0, 10) !== item.date) throw new Error(`Invalid date at index ${index}`);
    if (item.date <= previous) throw new Error('Dates must be unique and strictly increasing');
    if (typeof item.close !== 'number' || !Number.isFinite(item.close) || item.close <= 0) throw new Error(`Invalid closing price at index ${index}`);
    previous = item.date;
    return { date: item.date, close: item.close };
  });
}
