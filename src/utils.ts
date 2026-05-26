import type { BaseSubmission } from '@/types/submissions';

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  // The locale 'en-CA' naturally formats dates as YYYY-MM-DD
  const formattedDate = new Intl.DateTimeFormat('en-CA').format(date);
  return formattedDate;
}

export function sortSubmissions<T extends { createdAt: string }>(arr: T[]): T[] {
  return arr.toSorted((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
}

export function flattenInstances<T>(
  data: Record<string, { instances: T[] }>,
): (T & { type: string })[] {
  return Object.entries(data).flatMap(([type, model]) =>
    model.instances.map((instance) => ({
      ...instance,
      type,
    })),
  );
}

export function getCircuitInstanceUrl(
  path: string,
  circuitInstance: { type: string; path: string },
) {
  return `https://github.com/quantum-advantage-tracker/quantum-advantage-tracker.github.io/tree/main/data/${path}/circuit-models/${circuitInstance.type}/${circuitInstance.path}`;
}

export function getHamiltonianUrl(hamiltonianInstance: { type: string; path: string }) {
  return `https://github.com/quantum-advantage-tracker/quantum-advantage-tracker.github.io/tree/main/data/variational-problems/hamiltonians/${hamiltonianInstance.type}/${hamiltonianInstance.path}`;
}

export function stripType(id: string, type: string): string {
  if (!id.startsWith(type)) return id;
  return id.slice(type.length).replace(/^[_-]+/, '');
}

export function buildInstanceOptions<
  T extends BaseSubmission,
  I extends { id: string; category: string },
>(
  submissions: T[],
  instances: I[],
  getInstanceId: (submission: T) => string,
  category: string,
): (I & { entries: number })[] {
  const entriesById: Record<string, number> = {};
  const lastQuantumById: Record<string, number> = {};
  const lastAnyById: Record<string, number> = {};

  for (const submission of submissions) {
    const id = getInstanceId(submission);
    const ts = new Date(submission.createdAt).getTime();
    entriesById[id] = (entriesById[id] ?? 0) + 1;
    if (ts > (lastAnyById[id] ?? -Infinity)) lastAnyById[id] = ts;
    if (submission.runtimeQuantum !== undefined && ts > (lastQuantumById[id] ?? -Infinity)) {
      lastQuantumById[id] = ts;
    }
  }

  const tierOf = (id: string) => (lastQuantumById[id] !== undefined ? 0 : 1);
  const tsOf = (id: string) => lastQuantumById[id] ?? lastAnyById[id] ?? 0;

  return instances
    .filter((inst) => inst.category === category && entriesById[inst.id] !== undefined)
    .map((inst) => ({ ...inst, entries: entriesById[inst.id]! }))
    .toSorted((a, b) => {
      const tierDiff = tierOf(a.id) - tierOf(b.id);
      return tierDiff !== 0 ? tierDiff : tsOf(b.id) - tsOf(a.id);
    });
}
