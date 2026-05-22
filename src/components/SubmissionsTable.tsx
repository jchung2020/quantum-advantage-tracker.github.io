'use client';

import { CategoryFilter, isCategory, type Category } from '@/components/CategoryFilter';
import { InstanceFilter } from '@/components/InstanceFilter';
import { RuntimeSeconds } from '@/components/RuntimeSeconds';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableEmptyIcon } from '@/icons';
import type { BaseSubmission } from '@/types/submissions';
import { formatDate, sortSubmissions } from '@/utils';
import { ArrowDownIcon, ArrowUpRight } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

const DEFAULT_CATEGORY: Category = 'Active Candidates';
const COLUMN_COUNT = 8;

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
};

export function SubmissionsTable<T extends BaseSubmission, I extends Instance>(
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
  } = props;

  const [categoryFilter, setCategoryFilter] = useState<Category>(DEFAULT_CATEGORY);

  const firstInstanceOf = (category: Category) =>
    instances.find((inst) => inst.category === category)?.id ?? null;

  const [instanceFilter, setInstanceFilter] = useState<string | null>(() =>
    firstInstanceOf(DEFAULT_CATEGORY),
  );

  const instanceOptions = useMemo(() => {
    const entriesById: Record<string, number> = {};
    for (const submission of submissions) {
      const id = getInstanceId(submission);
      entriesById[id] = (entriesById[id] ?? 0) + 1;
    }
    return instances
      .filter((inst) => inst.category === categoryFilter)
      .map((inst) => ({ ...inst, entries: entriesById[inst.id] ?? 0 }));
  }, [submissions, instances, categoryFilter, getInstanceId]);

  const filteredSubmissions = useMemo(() => {
    if (!instanceFilter) return [];
    return submissions.filter((submission) => getInstanceId(submission) === instanceFilter);
  }, [submissions, instanceFilter, getInstanceId]);

  const selectedInstance = useMemo(
    () => instances.find((inst) => inst.id === instanceFilter) ?? null,
    [instances, instanceFilter],
  );

  const counts = useMemo(() => {
    const acc: Record<Category, number> = {
      'Active Candidates': 0,
      'Baseline Benchmarks': 0,
      'Superseded Candidates': 0,
    };
    for (const submission of submissions) {
      const instance = instances.find((inst) => inst.id === getInstanceId(submission));
      if (instance && isCategory(instance.category)) {
        acc[instance.category]++;
      }
    }
    return acc;
  }, [submissions, instances, getInstanceId]);

  const handleCategoryChange = (value: Category) => {
    setCategoryFilter(value);
    setInstanceFilter(firstInstanceOf(value));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center">
        <CategoryFilter value={categoryFilter} onChange={handleCategoryChange} counts={counts} />
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <InstanceFilter
          instances={instanceOptions}
          value={instanceFilter}
          onChange={setInstanceFilter}
        />

        <div className="@container min-w-0 flex-1 overflow-hidden rounded-lg border md:mt-9">
          {selectedInstance && (
            <div className="flex items-center justify-between gap-4 border-b px-4 py-6">
              <h3 className="font-medium">{selectedInstance.id}</h3>
              <a
                href={getInstanceUrl(selectedInstance)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-foreground inline-flex items-center gap-1 hover:underline"
              >
                View on Github <ArrowUpRight size={16} />
              </a>
            </div>
          )}
          <Table className="min-w-300 table-fixed">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length === 0 ? (
                <TableBodyEmpty />
              ) : (
                sortSubmissions(filteredSubmissions).map((submission, index) => {
                  const instance = instances.find(
                    (inst) => inst.id === getInstanceId(submission),
                  )!;

                  return (
                    <TableRow key={`submission-${index}`}>
                      <TableCell>
                        <time dateTime={submission.createdAt} title={submission.createdAt}>
                          {formatDate(submission.createdAt)}
                        </time>
                      </TableCell>
                      <TableCell className="whitespace-normal">
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
