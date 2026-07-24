export function ProgressBar({ progress }) {
  const safeProgress = Math.min(Math.max(progress || 0, 0), 100);

  return (
    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
      <div
        className="bg-primary h-full rounded-full transition-all duration-300"
        style={{ width: `${safeProgress}%` }}
      />
    </div>
  );
}
