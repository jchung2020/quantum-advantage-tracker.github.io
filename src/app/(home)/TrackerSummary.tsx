import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CATEGORIES, type Category } from '@/lib/categories';
import clsx from 'clsx';
import { ChevronRightIcon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';

export type ActiveCard = {
  id: string;
  type: string;
  instanceLabel: string;
  entries: number;
};

export function TrackerSummary(props: {
  title: string;
  href: Route;
  counts: Record<Category, number>;
  activeCards: ActiveCard[];
}) {
  const { title, href, counts, activeCards } = props;
  return (
    <li className="flex h-full flex-col items-center text-center">
      <div className="text-2xl font-semibold">{title}</div>
      <div className="mt-2 mb-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map(({ value, label }) => {
          const isActiveBadge = value === 'Active Candidates';
          return (
            <Badge
              key={value}
              variant="outline"
              className={clsx(isActiveBadge && 'border-transparent bg-green-200 text-green-900')}
            >
              {counts[value]} {label.toLowerCase()}
            </Badge>
          );
        })}
      </div>

      <div className="mb-8 flex w-full flex-col items-stretch gap-3 md:min-h-38">
        {activeCards.length === 0 ? (
          <div className="text-muted-foreground flex flex-1 items-center justify-center rounded-md border border-dashed px-4 py-6 text-sm">
            No active candidates recorded
          </div>
        ) : (
          activeCards.map((card, idx) => (
            <Link
              key={idx}
              href={{ pathname: href, query: { instance: card.id } }}
              className="bg-background hover:bg-accent flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-left transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium" title={card.type}>
                  {card.type}
                </div>
                <div className="text-muted-foreground truncate text-sm" title={card.instanceLabel}>
                  {card.instanceLabel}
                </div>
              </div>
              <div className="text-muted-foreground shrink-0 text-sm">{card.entries} entries</div>
              <ChevronRightIcon className="text-muted-foreground shrink-0" size={16} />
            </Link>
          ))
        )}
      </div>

      <Button asChild variant="secondary" className="mt-auto">
        <Link href={href}>View all</Link>
      </Button>
    </li>
  );
}
