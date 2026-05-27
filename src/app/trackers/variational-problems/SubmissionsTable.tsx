'use client';

import { SubmissionsTable as SharedSubmissionsTable } from '@/components/SubmissionsTable';
import type { Hamiltonians } from '@/types/hamiltonians';
import type { VPSubmission } from '@/types/submissions';
import { flattenInstances, getHamiltonianUrl } from '@/utils';

export function SubmissionsTable(props: {
  submissions: VPSubmission[];
  hamiltonians: Hamiltonians;
}) {
  return (
    <SharedSubmissionsTable
      submissions={props.submissions}
      instances={flattenInstances(props.hamiltonians)}
      getInstanceId={(s) => s.hamiltonian}
      getInstanceUrl={getHamiltonianUrl}
      getQubits={(s) => s.qubits}
      getGates={(s) => s.gates}
      valueColumn={{
        header: (
          <>
            Energy (Eh)
            <br />
            [upper, lower bound]
          </>
        ),
        render: (s) => (
          <>
            <div>{s.energy}</div>
            <div>
              [{s.errorBoundHigh || 'N/A'}, {s.errorBoundLow || 'N/A'}]
            </div>
          </>
        ),
      }}
      chart={{
        getValue: (s) => s.energy,
        yLabel: 'Energy (Eh)',
        yTooltipLabel: 'E',
      }}
    />
  );
}
