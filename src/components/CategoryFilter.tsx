'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORIES, CATEGORY_LABELS, type Category } from '@/lib/categories';

export function CategoryFilter(props: {
  value: Category;
  onChange: (value: Category) => void;
  counts: Record<Category, number>;
}) {
  const { value, onChange, counts } = props;

  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as Category)}>
      <TabsList>
        {CATEGORIES.map((category) => (
          <TabsTrigger key={category} value={category}>
            {CATEGORY_LABELS[category]} ({counts[category]})
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
