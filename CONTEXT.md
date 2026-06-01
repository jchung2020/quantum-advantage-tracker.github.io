# Quantum Advantage Tracker

A static site that catalogues submissions from research groups attempting to demonstrate (or refute) quantum advantage on a small set of canonical problems. Submissions are contributed via GitHub issues and surfaced as filterable tables and charts.

## Language

**Tracker**:
One of three parallel pathways under which submissions are organized: Observable Estimations (OE), Variational Problems (VP), Classically Verifiable Problems (CVP). Each tracker has its own route, data folder, submission type, and issue template.
_Avoid_: Track, pathway (use "tracker pathway" if disambiguation is needed in prose).

**Submission**:
A single contributed result for a given instance. Stored as a row in the relevant `data/<tracker>/submissions.json` and originated from a verified GitHub issue.
_Avoid_: Entry, result, contribution.

**Instance**:
The concrete problem a submission targets. In OE and CVP, the instance is a **circuit model** (`circuit-models.json`); in VP, it is a **hamiltonian** (`hamiltonians.json`). Submissions are compared against each other within a single instance — comparisons across instances are not meaningful.
_Avoid_: Problem, target, benchmark.

**Category**:
The lifecycle bucket of an instance. Three values: `Active candidates`, `Superseded candidates`, `Baseline benchmarks` (defined in `src/lib/categories.ts`). Drives the primary tab filter on every tracker page.
_Avoid_: Status, state, group.

**Runtime to solution** (CVP only):
The total wall-clock time a submission took to reach its claimed answer, computed as `runtimeQuantum + runtimeClassical` with missing components treated as zero. Used as the Y-axis of the CVP scatter chart. A submission is excluded from time-based comparisons only if both runtime fields are missing.
_Avoid_: Total runtime, time-to-solution, TTS.
