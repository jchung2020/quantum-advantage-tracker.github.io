import { Button } from '@/components/ui/button';
import { GithubIcon } from '@/icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Participate',
  description:
    'You can contribute by submitting a new result, proposing a new problem instance, or joining the public review discussion on GitHub.',
};

const GITHUB_BASE =
  'https://github.com/quantum-advantage-tracker/quantum-advantage-tracker.github.io';

export default function Participate() {
  return (
    <>
      <header className="bg-hero-gradient">
        <div className="px-6 py-20 text-center">
          <h1 className="mx-auto max-w-lg text-5xl">Submit your quantum advantage candidate</h1>
          <h2 className="mx-auto my-6 max-w-2xl">
            You can contribute by submitting a new result, proposing a new problem instance, or
            joining the public review discussion on GitHub.
          </h2>
        </div>
      </header>

      <div className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-20">
        <section className="flex flex-col gap-4">
          <h3 className="text-4xl">
            <span className="text-primary">01</span> Choose a pathway
          </h3>
          <p>Submissions are organized into three pathways:</p>

          <h4 className="mt-2 text-xl font-semibold">Observable estimations</h4>
          <p>
            Submissions in this tracker report expectation values for observables alongside rigorous
            error bars for validation.
          </p>

          <h4 className="mt-2 text-xl font-semibold">Variational problems</h4>
          <p>
            Submissions must provide upper bounds on the ground-state energy. Verified entries
            include evidence that the algorithm respects the variational principle.
          </p>

          <h4 className="mt-2 text-xl font-semibold">Classically verifiable problems</h4>
          <p>
            Submissions must demonstrate quantum advantage by scoring solutions against known
            answers or efficiently checkable witnesses.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-4xl">
            <span className="text-primary">02</span> Choose a candidate type
          </h3>
          <p>Each submission is reviewed for one of three tracker categories:</p>

          <h4 className="mt-2 text-xl font-semibold">Active candidates</h4>
          <p>
            Problem instances where quantum computations currently appear to challenge leading
            classical methods, and where further benchmarking is needed to determine whether an
            advantage exists.
          </p>

          <h4 className="mt-2 text-xl font-semibold">Superseded candidates</h4>
          <p>
            Problem instances where quantum computations once appeared to challenge leading
            classical methods, but for which subsequent classical progress has closed or reversed
            the apparent gap.
          </p>

          <h4 className="mt-2 text-xl font-semibold">Baseline benchmarks</h4>
          <p>
            Problem instances that provide useful reference points for comparing quantum and
            classical methods, including examples where the state-of-the-art solutions are
            classical.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-4xl">
            <span className="text-primary">03</span> Prepare your submission
          </h3>
          <p>If the problem is already listed in the tracker, provide:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>The problem instance being addressed</li>
            <li>
              A short summary of your method and main result (at least 1 page), including supporting
              evidence such as figures, link to a paper and / or code
            </li>
            <li>Quantum and / or classical resource details, including hardware and runtime</li>
          </ul>

          <p className="mt-2">
            If the problem is not yet listed, you should provide as well the problem details:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              A summary of the problem description (at least 1 page), including justification for
              why the instance is nontrivial and relevant to quantum advantage
            </li>
            <li>The files describing the problem (quantum circuits or Hamiltonian)</li>
            <li>Problem category (Baseline / Active / Superseded)</li>
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-4xl">
            <span className="text-primary">04</span> Submit through GitHub
          </h3>
          <p>
            Open a new issue and choose the template that matches your pathway and whether the
            problem instance already exists in the tracker.
          </p>
          <div>
            <Button variant="secondary" size="lg" asChild>
              <a
                href={`${GITHUB_BASE}/issues/new/choose`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open a submission issue <GithubIcon />
              </a>
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-4xl">
            <span className="text-primary">05</span> Review process
          </h3>
          <p>
            Submitters indicate whether they are proposing a contribution for{' '}
            <strong>Active Candidates</strong> or <strong>Baseline Benchmarks</strong>, and each
            submission is evaluated by independent reviewers.
          </p>
          <p>
            Reviewers assess whether the submitted benchmark is sufficiently documented and whether
            the supporting quantum and classical evidence is appropriate for the proposed category.
            For submissions seeking <strong>Active Candidate</strong> status, reviewers may request
            additional clarification or classical benchmarking if they believe another established
            method should be considered. Discussion and reviewer feedback takes place publicly on
            GitHub so the broader community can follow and contribute to the evaluation.
          </p>
          <p>
            Submissions may be accepted as <strong>Active Candidate</strong>, kept pending while
            issues are resolved, included as <strong>Baseline Benchmarks</strong>, or reclassified
            later if new evidence changes the assessment (e.g. an <strong>Active Candidate</strong>{' '}
            may be reclassified as <strong>Superseded</strong> after a new classical method
            submission).
          </p>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="text-4xl">
            <span className="text-primary">06</span> Join the discussion
          </h3>
          <p>
            Review and discussion happen publicly on{' '}
            <a
              href={`${GITHUB_BASE}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link-foreground hover:underline"
            >
              GitHub
            </a>
            .
          </p>
          <p>Community members are encouraged to comment on open submissions.</p>
        </section>
      </div>
    </>
  );
}
