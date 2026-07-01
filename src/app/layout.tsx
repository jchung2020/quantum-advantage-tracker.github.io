import { CookieConsent } from '@/components/analytics/CookieConsent';
import { CookieSettingsLink } from '@/components/analytics/CookieSettingsLink';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { NavMenu } from './NavMenu';

import './globals.css';

const interSans = Inter({
  variable: '--font-inter-sans',
});

const googleSiteVerificationId = process.env.GOOGLE_SITE_VERIFICATION_ID;

export const metadata: Metadata = {
  title: {
    template: '%s | Quantum Advantage Tracker',
    default: 'Quantum Advantage Tracker',
  },
  description:
    'As claims of quantum advantage emerge, this project provides a platform-agnostic framework to collect, validate, and compare experimental results.',
  icons: {
    icon: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📐</text></svg>')}`,
  },
  ...(googleSiteVerificationId && {
    verification: { google: googleSiteVerificationId },
  }),
};

export default function RootLayout(props: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body className={`${interSans.variable} font-sans antialiased`}>
        <GoogleAnalytics />
        <NuqsAdapter>
          <TooltipProvider>
            <header>
              <nav className="py-6">
                <div className="mx-auto flex h-full max-w-7xl flex-col items-center justify-between gap-3 px-6 md:flex-row">
                  <Link href="/" className="font-semibold">
                    📐 Quantum Advantage Tracker
                  </Link>

                  <NavMenu />
                </div>
              </nav>
            </header>

            <main>{props.children}</main>

            <footer className="text-muted-foreground px-6 py-6 text-center text-sm">
              <div className="flex flex-col items-center justify-center gap-x-3 gap-y-1 sm:flex-row">
                <span>Quantum Advantage Tracker © 2026</span>
                <Link href="/legal/privacy" className="hover:text-foreground underline">
                  Privacy &amp; Cookies
                </Link>
                <CookieSettingsLink />
              </div>
            </footer>

            <CookieConsent />
          </TooltipProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
