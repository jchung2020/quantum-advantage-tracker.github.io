import { Button } from '@/components/ui/button';
import { CATEGORIES, type Category } from '@/lib/categories';
import type { Route } from 'next';
import Link from 'next/link';

export function TrackerSummary(props: {
  title: string;
  href: Route;
  counts: Record<Category, number>;
}) {
  const { title, href, counts } = props;
  return (
    <li className="flex h-full flex-col items-center text-center">
      <div className="text-2xl font-semibold">{title}</div>
      <div className="flex flex-wrap justify-center gap-2 text-xs mt-2 mb-8">
        {CATEGORIES.map(({ value, label }) => {
          const isActiveBadge = value === 'Active Candidates';
          return (
            <span
              key={value}
              className={
                isActiveBadge
                  ? 'rounded-full border border-transparent bg-green-200 px-2 py-0.5 text-green-900'
                  : 'rounded-full border bg-background px-2 py-0.5 text-foreground'
              }
            >
              {counts[value]} {label.toLowerCase()}
            </span>
          );
        })}
      </div>
      <Button asChild variant="secondary" className="mt-auto">
        <Link href={href}>View all</Link>
      </Button>
    </li>
  );
}
