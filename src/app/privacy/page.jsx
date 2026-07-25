import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-foreground space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground mt-1">Last updated: {currentDate}</p>
      </div>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-foreground">1. What we collect</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Account info you provide: full name, email address.</li>
          <li>Phone number — only if you choose to enable WhatsApp reminders, and only after you verify ownership via a one-time code.</li>
          <li>Your tasks, projects, and labels — the content you create in the app.</li>
          <li>If you connect Google Calendar/Tasks: a temporary access token used only to create calendar events/tasks on your behalf, which we do not store long-term.</li>
        </ul>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-foreground">2. What we don&apos;t do</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>We never sell your personal data to anyone.</li>
          <li>We never read your task content for advertising or marketing purposes.</li>
          <li>We never store your sign-in codes or Google access tokens in plaintext or long-term storage.</li>
        </ul>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-foreground">3. How we use your data</h2>
        <p className="text-muted-foreground">
          Solely to operate the app: authenticate you, present your tasks, and send automated reminders you have explicitly opted into (email and/or WhatsApp).
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-foreground">4. Data storage & security</h2>
        <p className="text-muted-foreground">
          Your data is stored in Google Cloud Firestore, access-controlled so only you can read or write your own tasks, projects, and labels. Sign-in codes are hashed with SHA-256 and expire within minutes. See our <Link href="/cookies" className="text-primary underline">Cookie Policy</Link> for browser storage details.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-foreground">5. Third parties we use</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Firebase (Google) — authentication and database.</li>
          <li>Twilio — WhatsApp message delivery and phone number verification.</li>
          <li>SendGrid — sending sign-in codes and reminder emails.</li>
        </ul>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold text-foreground">6. Your rights</h2>
        <p className="text-muted-foreground">
          You can delete your account and all associated data at any time from Settings. You can disable WhatsApp reminders (reply STOP) or email reminders (Settings toggle) independently.
        </p>
      </section>

      <div className="pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <Link href="/auth" className="text-primary underline">
          ← Back to Sign In
        </Link>
        <Link href="/cookies" className="text-primary underline">
          Cookie Policy →
        </Link>
      </div>
    </div>
  );
}
