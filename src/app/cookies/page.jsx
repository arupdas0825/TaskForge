import Link from 'next/link';

export default function CookiePolicyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-foreground space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Cookie Policy</h1>
        <p className="text-xs text-muted-foreground mt-1">Last updated: {currentDate}</p>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        TaskForge uses minimal browser storage — strictly necessary for authentication and theme preferences. No advertising or tracking cookies are used.
      </p>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-foreground">What we store in your browser</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Session token (Firebase Auth, via IndexedDB/session storage)</strong> — keeps you signed in for the current browser session only; cleared when you close your browser, per our sign-in policy.
          </li>
          <li>
            <strong className="text-foreground">Theme preference (light/dark)</strong> — a small local storage entry, containing no personal data.
          </li>
          <li>
            <strong className="text-foreground">Cookie consent choice</strong> — remembers that you have acknowledged our privacy notice so we don&apos;t prompt you on every visit.
          </li>
        </ul>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-foreground">No tracking or analytics cookies</h2>
        <p className="text-muted-foreground">
          We do not use third-party advertising cookies, behavioral tracking scripts, or cross-site advertising networks of any kind.
        </p>
      </section>

      <div className="pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <Link href="/auth" className="text-primary underline">
          ← Back to Sign In
        </Link>
        <Link href="/privacy" className="text-primary underline">
          Privacy Policy →
        </Link>
      </div>
    </div>
  );
}
