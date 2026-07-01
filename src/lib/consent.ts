// Shared client-side consent logic for GDPR-compliant Google Analytics under
// Consent Mode v2. No-op unless a GA4 Measurement ID is set at build time via
// `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`.

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
export const GA_ENABLED = Boolean(GA_ID);

export const CONSENT_STORAGE_KEY = 'qat-analytics-consent';

// Fired on `window` when the stored choice changes / to re-open the banner.
export const CONSENT_CHANGE_EVENT = 'qat-consent-change';
export const OPEN_CONSENT_EVENT = 'qat-open-consent';

export type ConsentChoice = 'granted' | 'denied';

// Fallback for when localStorage is blocked: keeps the choice for the session.
let memoryConsent: ConsentChoice | null = null;

export function getStoredConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === 'granted' || value === 'denied') return value;
  } catch {
    // Storage blocked — fall back to the in-memory choice.
  }
  return memoryConsent;
}

export function setStoredConsent(choice: ConsentChoice): void {
  if (typeof window === 'undefined') return;
  memoryConsent = choice;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage blocked — the in-memory value keeps the choice for this session.
  }
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_CHANGE_EVENT, { detail: choice }));
}

// Only analytics storage is managed (no ads).
export function updateGtagConsent(choice: ConsentChoice): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', { analytics_storage: choice });
}

// Deletes GA first-party cookies (`_ga*`) so a withdrawn consent also removes
// identifiers already on the device. No-op when none exist.
export function clearAnalyticsCookies(): void {
  if (typeof document === 'undefined') return;

  const names = document.cookie
    .split('; ')
    .map((cookie) => cookie.split('=')[0])
    .filter((name) => name.startsWith('_ga'));
  if (names.length === 0) return;

  // GA scopes cookies to the host or the registrable domain (sometimes with a
  // leading dot), so expire every plausible domain/path combination.
  const { hostname } = window.location;
  const domains = ['', hostname, `.${hostname}`];
  const parts = hostname.split('.');
  if (parts.length > 2) {
    const registrable = parts.slice(-2).join('.');
    domains.push(registrable, `.${registrable}`);
  }

  for (const name of names) {
    for (const domain of domains) {
      const scope = domain ? `; domain=${domain}` : '';
      document.cookie = `${name}=; path=/; max-age=0${scope}`;
    }
  }
}
