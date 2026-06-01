import { OrganizedInto } from '@/components/OrganizedInto';
import { Button } from '@/components/ui/button';
import { GithubIcon } from '@/icons';
import type { OESubmission } from '@/types/submissions';
import type { Metadata } from 'next';
import circuitModels from '../../../../data/observable-estimations/circuit-models.json' with { type: 'json' };
import submissionsData from '../../../../data/observable-estimations/submissions.json' with { type: 'json' };
import { SubmissionsTable } from './SubmissionsTable';

const submissions = submissionsData as OESubmission[];

export const metadata: Metadata = {
  title: 'Observable estimations',
  description:
    'Submissions in this tracker report expectation values for observables alongside rigorous error bars for validation.',
};

export default async function TrackersOE() {
  return (
    <>
      <div className="bg-hero-gradient">
        <div className="flex flex-col px-6 py-16 text-center">
          <h1 className="mx-auto mb-6 max-w-xl text-3xl">Observable estimations 📊</h1>
          <h2 className="mx-auto mb-2 max-w-xl">
            Submissions in this tracker report expectation values for observables alongside rigorous
            error bars for validation.
          </h2>
          <OrganizedInto />

          <div className="mx-auto mt-6 flex flex-row flex-wrap justify-center gap-x-6 gap-y-3">
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/quantum-advantage-tracker/quantum-advantage-tracker.github.io/tree/main/data/observable-estimations/circuit-models"
                target="_blank"
                rel="noopener noreferrer"
              >
                View circuit instances <GithubIcon />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/quantum-advantage-tracker/quantum-advantage-tracker.github.io/issues/new/choose"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open submission ticket <GithubIcon />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-384 px-6 pt-8">
        <SubmissionsTable submissions={submissions} circuitModels={circuitModels} />
      </div>
    </>
  );
}
