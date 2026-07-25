/* eslint-disable @next/next/no-img-element */
export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-6 bg-[#0b0b0f] text-white">
      <img src="/icons/icon-192.png" alt="TaskForge" className="w-16 h-16 rounded-xl shadow-lg border border-white/10" />
      <h1 className="text-xl font-semibold">You&apos;re offline</h1>
      <p className="text-gray-400 text-sm max-w-sm">
        TaskForge needs an active connection to load your workspace. Reconnect to the internet and try again.
      </p>
    </div>
  );
}
