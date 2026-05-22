'use client';

import { CATEGORIES, CategoryFilter, type Category } from '@/components/CategoryFilter';
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
import type { CircuitModels } from '@/types/circuitModels';
import type { OESubmission } from '@/types/submissions';
import { flattenInstances, formatDate, sortSubmissions } from '@/utils';
import { ArrowDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

const DEFAULT_CATEGORY: Category = 'Active Candidates';

export function SubmissionsTable(props: {
  submissions: OESubmission[];
  circuitModels: CircuitModels;
}) {
  const { submissions, circuitModels } = props;
  const circuitInstances = useMemo(() => flattenInstances(circuitModels), [circuitModels]);

  const [categoryFilter, setCategoryFilter] = useState<Category>(DEFAULT_CATEGORY);

  const firstInstanceOf = (category: Category) =>
    circuitInstances.find((inst) => inst.category === category)?.id ?? null;

  const [instanceFilter, setInstanceFilter] = useState<string | null>(() =>
    firstInstanceOf(DEFAULT_CATEGORY),
  );

  const instanceOptions = useMemo(() => {
    const entriesById: Record<string, number> = {};
    for (const submission of submissions) {
      entriesById[submission.circuit] = (entriesById[submission.circuit] ?? 0) + 1;
    }
    return circuitInstances
      .filter((inst) => inst.category === categoryFilter)
      .map((inst) => ({ ...inst, entries: entriesById[inst.id] ?? 0 }));
  }, [submissions, circuitInstances, categoryFilter]);

  const filteredSubmissions = useMemo(() => {
    if (!instanceFilter) return [];
    return submissions.filter((submission) => submission.circuit === instanceFilter);
  }, [submissions, instanceFilter]);

  const counts = useMemo(() => {
    const acc: Record<Category, number> = {
      'Active Candidates': 0,
      'Baseline Benchmarks': 0,
      'Superseded Candidates': 0,
    };
    for (const submission of submissions) {
      const instance = circuitInstances.find((inst) => inst.id === submission.circuit);
      if (instance && (CATEGORIES as readonly string[]).includes(instance.category)) {
        acc[instance.category as Category]++;
      }
    }
    return acc;
  }, [submissions, circuitInstances]);

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

        <div className="@container min-w-0 flex-1">
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
                <TableHead className="w-48">
                  Expectation value
                  <br />
                  [upper, lower bound]
                </TableHead>
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
                  const circuitInstance = circuitInstances.find(
                    (instance) => instance.id === submission.circuit,
                  )!;

                  return (
                    <TableRow key={`submission-oe-${index}`}>
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
                      <TableCell>{circuitInstance.qubits}</TableCell>
                      <TableCell>{circuitInstance.gates}</TableCell>
                      <TableCell className="wrap-break-word whitespace-normal">
                        <div>{submission.observableValue}</div>
                        <div>
                          [{submission.errorBoundHigh || 'N/A'},{' '}
                          {submission.errorBoundLow || 'N/A'}]
                        </div>
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
      <TableCell colSpan={8} className="content-center px-0 py-10 md:h-64">
        <div className="sticky left-0 flex w-[100cqw] flex-col items-center gap-3">
          <TableEmptyIcon />
          <p>There are no submissions yet</p>
        </div>
      </TableCell>
    </TableRow>
  );
}
