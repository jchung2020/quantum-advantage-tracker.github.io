export const CATEGORIES = [
  'Active Candidates',
  'Baseline Benchmarks',
  'Superseded Candidates',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  'Active Candidates': 'Active',
  'Baseline Benchmarks': 'Baseline',
  'Superseded Candidates': 'Superseded',
};

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}
