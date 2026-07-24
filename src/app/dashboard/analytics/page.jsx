'use client';

import { AnalyticsDashboard } from '@/components/analytics';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">View your productivity insights and metrics</p>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
