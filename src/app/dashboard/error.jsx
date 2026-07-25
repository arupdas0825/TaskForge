'use client';

export default function DashboardError({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6 bg-background text-foreground">
      <h1 className="text-xl font-semibold">Dashboard Error</h1>
      <p className="text-muted-foreground text-sm max-w-sm">{error?.message || 'Failed to load dashboard state.'}</p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition"
      >
        Try again
      </button>
    </div>
  );
}
