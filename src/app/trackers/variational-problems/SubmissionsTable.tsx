import { RuntimeSeconds } from '@/components/RuntimeSeconds';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Hamiltonians } from '@/types/hamiltonians';
import type { VPSubmission } from '@/types/submissions';
import { flattenInstances, formatDate, getHamiltonianUrl, sortSubmissions } from '@/utils';
import { ArrowDownIcon } from 'lucide-react';

export function SubmissionsTable(props: {
  submissions: VPSubmission[];
  hamiltonians: Hamiltonians;
}) {
  const { submissions, hamiltonians } = props;
  const hamiltonianInstances = flattenInstances(hamiltonians);

  return (
    <div>
      {/* Filters */}

      <Table className="min-w-330 table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-26">
              Date <ArrowDownIcon size={16} className="float-end mt-0.5" />
            </TableHead>
            <TableHead className="w-64 min-w-64">Name / Institutions</TableHead>
            <TableHead className="w-36">Method</TableHead>
            <TableHead className="w-36">Hamiltonian</TableHead>
            <TableHead className="w-18">Qubits</TableHead>
            <TableHead className="w-18">Gates</TableHead>
            <TableHead className="w-48">
              Energy (Eh)
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
          {submissions.length === 0 ? (
            <TableBodyEmpty />
          ) : (
            sortSubmissions(submissions).map((submission, index) => {
              const hamiltonianInstance = hamiltonianInstances.find(
                (instance) => instance.id === submission.hamiltonian,
              )!;

              return (
                <TableRow key={`submission-vp-${index}`}>
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
                  <TableCell className="wrap-break-word whitespace-normal">
                    <a
                      href={getHamiltonianUrl(hamiltonianInstance)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link-foreground hover:underline"
                    >
                      {submission.hamiltonian}
                    </a>
                  </TableCell>
                  <TableCell>{submission.qubits}</TableCell>
                  <TableCell>{submission.gates}</TableCell>
                  <TableCell className="wrap-break-word whitespace-normal">
                    <div>{submission.energy}</div>
                    <div>
                      [{submission.errorBoundHigh || 'N/A'}, {submission.errorBoundLow || 'N/A'}]
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
                      <span title="Quantum">Q</span>: {submission.computeResourcesQuantum || '-'}
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
  );
}

function TableBodyEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={8}>There are no submissions yet.</TableCell>
    </TableRow>
  );
}
