'use client';

import { SubmissionsTable as SharedSubmissionsTable } from '@/components/SubmissionsTable';
import type { CircuitModels } from '@/types/circuitModels';
import type { CVPSubmission } from '@/types/submissions';
import { flattenInstances, getCircuitInstanceUrl } from '@/utils';

export function SubmissionsTable(props: {
  submissions: CVPSubmission[];
  circuitModels: CircuitModels;
}) {
  return (
    <SharedSubmissionsTable
      submissions={props.submissions}
      instances={flattenInstances(props.circuitModels)}
      getInstanceId={(s) => s.circuit}
      getInstanceUrl={(inst) => getCircuitInstanceUrl('classically-verifiable-problems', inst)}
      getQubits={(_s, inst) => inst.qubits}
      getGates={(_s, inst) => inst.gates}
      valueColumn={{
        header: 'Value',
        render: (s) => s.value,
      }}
      chart={{
        getValue: (s) => {
          if (s.runtimeQuantum === undefined && s.runtimeClassical === undefined) return null;
          return (s.runtimeQuantum ?? 0) + (s.runtimeClassical ?? 0);
        },
        yLabel: 'Runtime to solution (s)',
        yTooltipLabel: 'RT',
        yTooltipSuffix: 's',
      }}
    />
  );
}
