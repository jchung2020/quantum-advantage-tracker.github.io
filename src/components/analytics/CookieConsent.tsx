'use client';

import { Button } from '@/components/ui/button';
import {
  clearAnalyticsCookies,
  CONSENT_CHANGE_EVENT,
  ConsentChoice,
  GA_ENABLED,
  getStoredConsent,
  OPEN_CONSENT_EVENT,
  setStoredConsent,
  updateGtagConsent,
} from '@/lib/consent';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';

// External store so banner visibility stays in sync with localStorage without a
// hydration mismatch. Visible until a choice is stored, or when re-opened.
let forceOpen = false;

function subscribe(onChange: () => void) {
  const reopen = () => {
    forceOpen = true;
    onChange();
  };
  window.addEventListener(OPEN_CONSENT_EVENT, reopen);
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
    window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  };
}

const getSnapshot = () => forceOpen || getStoredConsent() === null;
// Keep the banner out of the prerendered static HTML.
const getServerSnapshot = () => false;

// GDPR consent banner, re-openable from the footer "Cookie settings" link.
export function CookieConsent() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!GA_ENABLED || !visible) return null;

  function choose(choice: ConsentChoice) {
    forceOpen = false;
    updateGtagConsent(choice);
    // On grant we don't emit a page_view — Consent Mode records the page and GA
    // writes the `_ga` cookie on the next event. On denial, clear existing ones.
    if (choice === 'denied') clearAnalyticsCookies();
    setStoredConsent(choice);
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="border-border bg-card text-card-foreground fixed inset-x-0 bottom-0 z-50 border-t shadow-lg"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-muted-foreground text-sm">
          We use analytics to understand usage. Nothing is stored unless you accept — see our{' '}
          <Link href="/legal/privacy" className="text-foreground underline">
            Privacy &amp; Cookies
          </Link>{' '}
          page.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" onClick={() => choose('denied')}>
            Reject
          </Button>
          <Button onClick={() => choose('granted')}>Accept</Button>
        </div>
      </div>
    </div>
  );
}
