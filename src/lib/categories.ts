export const CATEGORIES = [
  { value: 'Active Candidates', label: 'Active', slug: 'active' },
  { value: 'Superseded Candidates', label: 'Superseded', slug: 'superseded' },
  { value: 'Baseline Benchmarks', label: 'Baseline', slug: 'baseline' },
] as const;

export type Category = (typeof CATEGORIES)[number]['value'];
export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

export function isCategory(value: string): value is Category {
  return CATEGORIES.some((c) => c.value === value);
}

export function slugToCategory(slug: CategorySlug): Category {
  return CATEGORIES.find((c) => c.slug === slug)!.value;
}

export function categoryToSlug(category: Category): CategorySlug {
  return CATEGORIES.find((c) => c.value === category)!.slug;
}
