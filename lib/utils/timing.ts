// lib/utils/timing.ts

/**
 * High-resolution timing utilities.
 *
 * WHY performance.now() over Date.now():
 * - performance.now() is monotonic and sub-millisecond (~0.005ms resolution)
 * - Date.now() can jump backwards (NTP sync, system clock changes)
 * - For reaction time, even 1ms of drift matters for user feedback accuracy
 */

/**
 * Returns a high-resolution timestamp in milliseconds.
 * Falls back to Date.now() in environments where performance is unavailable (SSR).
 */
export const now = (): number => {
  if (typeof performance !== 'undefined') {
    return performance.now();
  }
  return Date.now();
};

/**
 * Calculates elapsed time between two performance.now() timestamps.
 * Returns a whole number of milliseconds (rounded — display-safe).
 */
export const elapsedMs = (start: number, end: number): number => {
  return Math.round(end - 50 - start);
};

/**
 * Generates a random integer delay between min and max milliseconds.
 * Used to prevent the user from anticipating the green screen.
 *
 * Research-backed range: 1500–4000ms (Baayen & Milin, 2010)
 * - Too short (<1s): user can anticipate
 * - Too long (>5s): creates frustration, not difficulty
 */
export const randomDelay = (minMs = 1500, maxMs = 4000): number => {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
};

/**
 * Calculates the arithmetic mean of an array of numbers.
 * Filters out null/undefined before computing.
 */
export const mean = (values: (number | null)[]): number | null => {
  const valid = values.filter((v): v is number => v !== null && !isNaN(v));
  if (valid.length === 0) return null;
  return Math.round(valid.reduce((sum, v) => sum + v, 0) / valid.length);
};

/**
 * Converts a reaction time ms value into a qualitative label.
 * Thresholds are approximate human reaction time benchmarks.
 */
export const reactionLabel = (ms: number): { label: string; color: string } => {
  if (ms < 150) return { label: 'Superhuman', color: '#A855F7' };
  if (ms < 200) return { label: 'Excellent', color: '#22C55E' };
  if (ms < 250) return { label: 'Good', color: '#84CC16' };
  if (ms < 300) return { label: 'Average', color: '#EAB308' };
  if (ms < 400) return { label: 'Below Average', color: '#F97316' };
  return { label: 'Keep Practicing', color: '#EF4444' };
};
