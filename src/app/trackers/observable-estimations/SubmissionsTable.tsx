'use client';

import { SubmissionsTable as SharedSubmissionsTable } from '@/components/SubmissionsTable';
import type { CircuitModels } from '@/types/circuitModels';
import type { OESubmission } from '@/types/submissions';
import { flattenInstances, getCircuitInstanceUrl } from '@/utils';

export function SubmissionsTable(props: {
  submissions: OESubmission[];
  circuitModels: CircuitModels;
}) {
  return (
    <SharedSubmissionsTable
      submissions={props.submissions}
      instances={flattenInstances(props.circuitModels)}
      getInstanceId={(s) => s.circuit}
      getInstanceUrl={(inst) => getCircuitInstanceUrl('observable-estimations', inst)}
      getQubits={(_s, inst) => inst.qubits}
      getGates={(_s, inst) => inst.gates}
      valueColumn={{
        header: (
          <>
            Expectation value
            <br />
            [upper, lower bound]
          </>
        ),
        render: (s) => (
          <>
            <div>{s.observableValue}</div>
            <div>
              [{s.errorBoundHigh || 'N/A'}, {s.errorBoundLow || 'N/A'}]
            </div>
          </>
        ),
      }}
    />
  );
}
