import { Button } from '@/components/ui/button';
import { isCategory, type Category } from '@/lib/categories';
import type { BaseSubmission } from '@/types/submissions';
import { buildInstanceOptions, flattenInstances, stripType } from '@/utils';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import cvpCircuitModels from '../../../data/classically-verifiable-problems/circuit-models.json' with { type: 'json' };
import cvpSubmissions from '../../../data/classically-verifiable-problems/submissions.json' with { type: 'json' };
import oeCircuitModels from '../../../data/observable-estimations/circuit-models.json' with { type: 'json' };
import oeSubmissions from '../../../data/observable-estimations/submissions.json' with { type: 'json' };
import vpHamiltonians from '../../../data/variational-problems/hamiltonians.json' with { type: 'json' };
import vpSubmissions from '../../../data/variational-problems/submissions.json' with { type: 'json' };
import { Contributors } from './Contributors';
import { TrackerSummary, type ActiveCard } from './TrackerSummary';

function computeCounts<T extends BaseSubmission>(
  submissions: T[],
  instances: { id: string; category: string }[],
  getInstanceId: (s: T) => string,
): Record<Category, number> {
  const counts: Record<Category, number> = {
    'Active Candidates': 0,
    'Superseded Candidates': 0,
    'Baseline Benchmarks': 0,
  };
  const withSubmissions = new Set(submissions.map(getInstanceId));
  for (const instance of instances) {
    if (withSubmissions.has(instance.id) && isCategory(instance.category)) {
      counts[instance.category]++;
    }
  }
  return counts;
}

function computeActiveCards<
  T extends BaseSubmission,
  I extends { id: string; type: string; category: string },
>(submissions: T[], instances: I[], getInstanceId: (s: T) => string): ActiveCard[] {
  return buildInstanceOptions(submissions, instances, getInstanceId, 'Active Candidates')
    .slice(0, 2)
    .map((inst) => ({
      id: inst.id,
      type: inst.type,
      instanceLabel: stripType(inst.id, inst.type),
      entries: inst.entries,
    }));
}

export default function Home() {
  const oeInstances = flattenInstances(oeCircuitModels);
  const vpInstances = flattenInstances(vpHamiltonians);
  const cvpInstances = flattenInstances(cvpCircuitModels);

  return (
    <>
      <header className="bg-hero-gradient">
        <div className="px-6 pt-20 pb-12 text-center">
          <h1 className="mx-auto max-w-lg text-5xl">Benchmarking quantum advantage</h1>
          <h2 className="mx-auto my-6 max-w-xl">
            As claims of quantum advantage emerge, this project provides a platform-agnostic
            framework to collect, validate, and compare results.
          </h2>
        </div>

        <div className="px-6 pb-20 text-center">
          <div className="text-secondary-foreground text-sm">
            Contributors include researchers from 10+ organizations
          </div>
          <Contributors />
        </div>
      </header>

      <section className="mx-auto px-6 py-20 text-center">
        <h3 className="mb-12 text-4xl">Active advantage candidates</h3>
        <ul className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          <TrackerSummary
            title="Observable estimations"
            href="/trackers/observable-estimations"
            counts={computeCounts(oeSubmissions, oeInstances, (s) => s.circuit)}
            activeCards={computeActiveCards(oeSubmissions, oeInstances, (s) => s.circuit)}
          />
          <TrackerSummary
            title="Variational problems"
            href="/trackers/variational-problems"
            counts={computeCounts(vpSubmissions, vpInstances, (s) => s.hamiltonian)}
            activeCards={computeActiveCards(vpSubmissions, vpInstances, (s) => s.hamiltonian)}
          />
          <TrackerSummary
            title="Classically verifiable problems"
            href="/trackers/classically-verifiable-problems"
            counts={computeCounts(cvpSubmissions, cvpInstances, (s) => s.circuit)}
            activeCards={computeActiveCards(cvpSubmissions, cvpInstances, (s) => s.circuit)}
          />
        </ul>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h3 className="mb-6 text-4xl">What is quantum advantage?</h3>
        <p>
          Quantum advantage refers to an information processing task performed more efficiently,
          cost-effectively, or accurately using a quantum computer than is known to be possible with
          classical computers alone.
        </p>
        <p className="mt-4">
          Achieving this milestone requires more than raw performance. It demands trust in the
          output of noisy quantum devices and scientific rigor in how we validate results.
        </p>
      </section>

      <section className="py-20 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h3 className="mb-6 text-4xl">Why is it hard to verify?</h3>
          <p>
            Quantum advantage is a falsifiable scientific hypothesis that must be tested through
            rigorous experimentation. Because quantum computers tackle problems in ways that
            classical systems can’t easily replicate, direct comparison is challenging. Verifying
            any claim of advantage therefore demands several multiple points of analysis.
          </p>
        </div>
        <div className="mx-auto max-w-3xl px-6">
          <pre className="bg-secondary mt-6 rounded-md border p-6 whitespace-pre-wrap">
            ✏️ &quot;The test of all knowledge is experiment&quot; — R. P. Feynman
          </pre>
        </div>
      </section>

      <section className="mx-auto px-6 py-20 text-center">
        <h3 className="mb-6 text-4xl">Three pathways to quantum advantage</h3>
        <p className="mx-auto max-w-2xl">
          To build confidence in advantage claims, this project explores three pathways for
          analysis. Learn more about the different paths below.
        </p>
        <ul className="mx-auto mt-20 grid max-w-7xl gap-4 text-left md:grid-cols-3">
          <li className="bg-secondary flex flex-col items-start gap-8 rounded-md border p-6">
            <div className="text-3xl md:max-w-72">Observable estimations 📊</div>
            <div className="font-semibold">Trust through rigorous error bars.</div>
            <div className="flex-1">
              Explore submissions that report expectation values for observables, and include
              rigorous error bars for validating the quantum computation.
            </div>
            <Button asChild size="lg">
              <Link href="/trackers/observable-estimations">
                View the tracker <ChevronRightIcon />
              </Link>
            </Button>
          </li>
          <li className="bg-secondary flex flex-col items-start gap-8 rounded-md border p-6">
            <div className="text-3xl md:max-w-72">Variational problems 🌀</div>
            <div className="font-semibold">
              Certifiable quantum solutions via the variational principle.
            </div>
            <div className="flex-1">
              Variational solutions offer guaranteed upper bounds on ground-state energies and
              enable benchmarking against classical methods - even when exact answers are unknown.
            </div>
            <Button asChild size="lg">
              <Link href="/trackers/variational-problems">
                View the tracker <ChevronRightIcon />
              </Link>
            </Button>
          </li>
          <li className="bg-secondary flex flex-col items-start gap-8 rounded-md border p-6">
            <div className="text-3xl md:max-w-80">Classically verifiable problems 🗝️</div>
            <div className="font-semibold">
              Leveraging classical resources to validate quantum outputs.
            </div>
            <div className="flex-1">
              Submissions in this path enable efficient validation of quantum outputs without
              requiring full classical simulation of the quantum process.
            </div>
            <Button asChild size="lg">
              <Link href="/trackers/classically-verifiable-problems">
                View the tracker <ChevronRightIcon />
              </Link>
            </Button>
          </li>
        </ul>
      </section>
    </>
  );
}
