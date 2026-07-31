import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy & Cookies',
  description:
    'How the Quantum Advantage Tracker uses analytics and cookies, and how you can control your consent.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Privacy &amp; Cookies</h1>

      <div className="text-muted-foreground mt-6 space-y-4 text-sm leading-relaxed">
        <p>
          The Quantum Advantage Tracker is a static website. We use Google Analytics 4 (GA4) to
          understand how visitors use the site so we can improve it. We do not sell your data or use
          it for advertising.
        </p>

        <h2 className="text-foreground text-lg font-medium">Consent</h2>
        <p>
          Analytics are governed by Google Consent Mode v2. When you first visit, analytics storage
          is <strong>denied</strong> by default: no analytics cookies are set and the analytics
          service cannot identify you. Until you choose, the analytics service may still receive
          anonymous, aggregated signals that contain no cookies or identifiers. Full analytics —
          including the cookies that recognise returning visitors — is only enabled after you click{' '}
          <strong>Accept</strong> in the consent banner. If you click <strong>Reject</strong>, no
          analytics cookies are stored and no identifiers are used.
        </p>

        <h2 className="text-foreground text-lg font-medium">What we collect</h2>
        <p>
          When analytics are enabled, the analytics service collects standard usage data such as
          pages visited, approximate location (derived from your IP address, which the analytics
          service does not log or store), device and browser type, and referral source. This data is
          processed by the analytics service on our behalf.
        </p>

        <h2 className="text-foreground text-lg font-medium">Cookies</h2>
        <p>
          After you accept, the analytics service sets first-party analytics cookies to distinguish
          visitors and measure how the site is used. These are only created once consent is granted.
        </p>

        <h2 className="text-foreground text-lg font-medium">Changing your choice</h2>
        <p>
          You can change or withdraw your consent at any time using the link in the site footer
          labeled <strong>Cookie settings</strong>. Withdrawing consent disables analytics and
          automatically removes the analytics cookies already stored on your device, so you are no
          longer identified. You can also clear the site&apos;s cookies in your browser at any time.
        </p>

        <h2 className="text-foreground text-lg font-medium">Contact</h2>
        <p>
          Questions about this policy can be raised on our{' '}
          <a
            href="https://github.com/quantum-advantage-tracker/quantum-advantage-tracker.github.io"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repository
          </a>
          .
        </p>
      </div>
    </div>
  );
}
