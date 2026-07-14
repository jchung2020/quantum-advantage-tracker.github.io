'use client';

import { GA_ENABLED, OPEN_CONSENT_EVENT } from '@/lib/consent';

export function CookieSettingsLink() {
  if (!GA_ENABLED) return null;

  return (
    <button
      type="button"
      className="hover:text-foreground cursor-pointer underline"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT))}
    >
      Cookie settings
    </button>
  );
}
