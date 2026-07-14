import { CONSENT_STORAGE_KEY, GA_ENABLED, GA_ID } from '@/lib/consent';
import Script from 'next/script';

// Loads GA4 under Consent Mode v2. The consent defaults are a plain inline
// <script> (not next/script) so they run on parse — before gtag.js and before
// hydration — reading the persisted choice synchronously so returning visitors
// who accepted start `granted`. Renders nothing when GA is not configured.
export function GoogleAnalytics() {
  if (!GA_ENABLED) return null;

  return (
    <>
      <script
        id="ga-consent-default"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            (function () {
              var granted = false;
              try { granted = localStorage.getItem('${CONSENT_STORAGE_KEY}') === 'granted'; } catch (e) {}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: granted ? 'granted' : 'denied',
                wait_for_update: 500
              });
            })();
            gtag('js', new Date());
            // No route tracking: soft-navigation page_views come from GA4
            // Enhanced Measurement, so a manual hook would double-count them.
            gtag('config', '${GA_ID}');
          `,
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
