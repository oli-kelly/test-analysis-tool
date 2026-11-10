import { readFileSync } from 'node:fs';
import { analyseTrend } from './analyse.js';

try {
  const file = process.argv[2];
  if (!file) throw new Error('Usage: node dist/cli.js <daily-closes.json>');
  const input: unknown = JSON.parse(readFileSync(file, 'utf8'));
  process.stdout.write(JSON.stringify(analyseTrend(input), null, 2) + '\n');
} catch (error) {
  process.stderr.write((error instanceof Error ? error.message : String(error)) + '\n');
  process.exitCode = 1;
}
