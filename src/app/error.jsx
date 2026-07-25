'use client';

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-6 bg-background text-foreground">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-muted-foreground text-sm max-w-sm">{error?.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition"
      >
        Try again
      </button>
    </div>
  );
}
