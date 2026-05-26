import { CATEGORIES, type Category } from '@/lib/categories';
import { ChevronRightIcon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';

export function TrackerCard(props: {
  title: string;
  href: Route;
  counts: Record<Category, number>;
}) {
  const { title, href, counts } = props;
  return (
    <li>
      <Link
        href={href}
        className="bg-background hover:border-foreground/40 group flex flex-col gap-3 rounded-md border p-5 transition-colors"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="font-semibold">{title}</div>
          <ChevronRightIcon
            size={20}
            className="text-muted-foreground group-hover:text-foreground flex-none transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {CATEGORIES.map(({ value, label }) => {
            const isActiveBadge = value === 'Active Candidates';
            return (
              <span
                key={value}
                className={
                  isActiveBadge
                    ? 'rounded-full bg-green-200 px-2 py-0.5 text-green-900'
                    : 'bg-secondary text-secondary-foreground rounded-full px-2 py-0.5'
                }
              >
                {counts[value]} {label.toLowerCase()}
              </span>
            );
          })}
        </div>
      </Link>
    </li>
  );
}
