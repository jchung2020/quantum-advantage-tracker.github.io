'use client';

import { CategoryFilter } from '@/components/CategoryFilter';
import { InstanceFilter } from '@/components/InstanceFilter';
import { RuntimeSeconds } from '@/components/RuntimeSeconds';
import { SubmissionsChart } from '@/components/SubmissionsChart';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableEmptyIcon } from '@/icons';
import {
  CATEGORIES,
  categoryToSlug,
  isCategory,
  slugToCategory,
  type Category,
} from '@/lib/categories';
import type { BaseSubmission } from '@/types/submissions';
import { buildInstanceOptions, formatDate, sortSubmissions } from '@/utils';
import clsx from 'clsx';
import { ArrowDownIcon, ArrowUpRight, ChevronRight } from 'lucide-react';
import { parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { Suspense, useMemo, useState, type ReactNode } from 'react';

const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

const DEFAULT_CATEGORY: Category = 'Active Candidates';
const COLUMN_COUNT = 9;

type Instance = {
  id: string;
  type: string;
  path: string;
  category: string;
};

type SubmissionsTableProps<T extends BaseSubmission, I extends Instance> = {
  submissions: T[];
  instances: I[];
  getInstanceId: (submission: T) => string;
  getInstanceUrl: (instance: I) => string;
  getQubits: (submission: T, instance: I) => number | undefined;
  getGates: (submission: T, instance: I) => number | undefined;
  valueColumn: {
    header: ReactNode;
    render: (submission: T) => ReactNode;
  };
  chart: {
    getValue: (submission: T) => number | null;
    yLabel: string;
    yTooltipLabel: string;
    yTooltipSuffix?: string;
    yScale?: 'linear' | 'log';
  };
};

export function SubmissionsTable<T extends BaseSubmission, I extends Instance>(
  props: SubmissionsTableProps<T, I>,
) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SubmissionsTableContent {...props} />
    </Suspense>
  );
}

function SubmissionsTableContent<T extends BaseSubmission, I extends Instance>(
  props: SubmissionsTableProps<T, I>,
) {
  const {
    submissions,
    instances,
    getInstanceId,
    getInstanceUrl,
    getQubits,
    getGates,
    valueColumn,
    chart,
  } = props;

  const [categorySlug, setCategorySlug] = useQueryState(
    'category',
    parseAsStringLiteral(CATEGORY_SLUGS).withDefault(categoryToSlug(DEFAULT_CATEGORY)),
  );
  const categoryFilter: Category = slugToCategory(categorySlug);

  const [instanceFilter, setInstanceFilter] = useQueryState('instance', parseAsString);

  const [chartOpen, setChartOpen] = useState(true);

  const instanceOptions = useMemo(
    () => buildInstanceOptions(submissions, instances, getInstanceId, categoryFilter),
    [submissions, instances, categoryFilter, getInstanceId],
  );

  const effectiveInstance = useMemo(() => {
    if (instanceFilter && instanceOptions.some((opt) => opt.id === instanceFilter)) {
      return instanceFilter;
    }
    return instanceOptions[0]?.id ?? null;
  }, [instanceFilter, instanceOptions]);

  const filteredSubmissions = useMemo(() => {
    if (!effectiveInstance) return [];
    return submissions.filter((submission) => getInstanceId(submission) === effectiveInstance);
  }, [submissions, effectiveInstance, getInstanceId]);

  const selectedInstance = useMemo(
    () => instances.find((inst) => inst.id === effectiveInstance) ?? null,
    [instances, effectiveInstance],
  );

  const counts = useMemo(() => {
    const acc: Record<Category, number> = {
      'Active Candidates': 0,
      'Superseded Candidates': 0,
      'Baseline Benchmarks': 0,
    };
    const instancesWithSubmissions = new Set(submissions.map(getInstanceId));
    for (const instance of instances) {
      if (instancesWithSubmissions.has(instance.id) && isCategory(instance.category)) {
        acc[instance.category]++;
      }
    }
    return acc;
  }, [submissions, instances, getInstanceId]);

  const handleCategoryChange = (value: Category) => {
    setCategorySlug(categoryToSlug(value));
    setInstanceFilter(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <CategoryFilter value={categoryFilter} onChange={handleCategoryChange} counts={counts} />
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {instanceOptions.length > 0 && (
          <InstanceFilter
            instances={instanceOptions}
            value={effectiveInstance}
            onChange={setInstanceFilter}
          />
        )}

        <div
          className={clsx('@container min-w-0 flex-1 overflow-hidden rounded-lg border', {
            'md:mt-9': instanceOptions.length > 0,
          })}
        >
          {selectedInstance && (
            <Collapsible open={chartOpen} onOpenChange={setChartOpen} className="border-b">
              <div className="flex items-center justify-between gap-4 px-4 py-6">
                <h3 className="font-medium wrap-anywhere">
                  <a
                    href={getInstanceUrl(selectedInstance)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link-foreground inline-flex items-center gap-1 hover:underline"
                  >
                    {selectedInstance.id}
                    <ArrowUpRight size={16} className="flex-none" />
                  </a>
                </h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="flex-none">
                    {chartOpen ? 'Collapse chart' : 'Expand chart'}
                    <ChevronRight
                      className={clsx('transition-transform', chartOpen && 'rotate-90')}
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="px-4 pb-6">
                  <SubmissionsChart
                    submissions={filteredSubmissions}
                    getValue={chart.getValue}
                    yLabel={chart.yLabel}
                    yTooltipLabel={chart.yTooltipLabel}
                    yTooltipSuffix={chart.yTooltipSuffix}
                    yScale={chart.yScale}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
          <Table className="min-w-356 table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-26">
                  Date <ArrowDownIcon size={16} className="float-end mt-0.5" />
                </TableHead>
                <TableHead className="w-64 min-w-64">Name / Institutions</TableHead>
                <TableHead className="w-36">Method</TableHead>
                <TableHead className="w-18">Qubits</TableHead>
                <TableHead className="w-18">Gates</TableHead>
                <TableHead className="w-48">{valueColumn.header}</TableHead>
                <TableHead className="w-28">
                  Runtime
                  <br />
                  (seconds)
                </TableHead>
                <TableHead className="w-56">Compute resources</TableHead>
                <TableHead className="w-56">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length === 0 ? (
                <TableBodyEmpty />
              ) : (
                sortSubmissions(filteredSubmissions).map((submission, index) => {
                  const instance = instances.find((inst) => inst.id === getInstanceId(submission))!;

                  return (
                    <TableRow key={`submission-${index}`}>
                      <TableCell>
                        <time dateTime={submission.createdAt} title={submission.createdAt}>
                          {formatDate(submission.createdAt)}
                        </time>
                      </TableCell>
                      <TableCell className="wrap-break-word whitespace-normal">
                        <a
                          href={submission.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link-foreground hover:underline"
                        >
                          {submission.name}
                        </a>

                        <div className="mt-2">
                          <span className="font-semibold text-green-600">By:</span>{' '}
                          <span>{submission.institutions}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-normal">{submission.method}</TableCell>
                      <TableCell>{getQubits(submission, instance) ?? '-'}</TableCell>
                      <TableCell>{getGates(submission, instance) ?? '-'}</TableCell>
                      <TableCell className="wrap-break-word whitespace-normal">
                        {valueColumn.render(submission)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <span title="Quantum">Q</span>:{' '}
                          <RuntimeSeconds value={submission.runtimeQuantum} />
                        </div>
                        <div>
                          <span title="Classical">C</span>:{' '}
                          <RuntimeSeconds value={submission.runtimeClassical} />
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <div>
                          <span title="Quantum">Q</span>:{' '}
                          {submission.computeResourcesQuantum || '-'}
                        </div>
                        <div>
                          <span title="Classical">C</span>:{' '}
                          {submission.computeResourcesClassical || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="wrap-break-word whitespace-normal">
                        {submission.notes || '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function TableBodyEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={COLUMN_COUNT} className="content-center px-0 py-10 md:h-64">
        <div className="sticky left-0 flex w-[100cqw] flex-col items-center gap-3">
          <TableEmptyIcon />
          <p>There are no submissions yet</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
