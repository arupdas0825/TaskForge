'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTaskCompletionTrend, useTaskMetrics, useProjectAnalysis } from '@/hooks/useAnalytics';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export function AnalyticsDashboard() {
  const { data: trend, isLoading: trendLoading } = useTaskCompletionTrend(30);
  const { data: metrics, isLoading: metricsLoading } = useTaskMetrics();
  const { data: projects, isLoading: projectsLoading } = useProjectAnalysis();

  if (trendLoading || metricsLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  const priorityData = metrics ? [
    { name: 'Low', value: metrics.tasks_by_priority?.low || 0 },
    { name: 'Medium', value: metrics.tasks_by_priority?.medium || 0 },
    { name: 'High', value: metrics.tasks_by_priority?.high || 0 },
    { name: 'Critical', value: metrics.tasks_by_priority?.critical || 0 },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Completion Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Completion Trend</CardTitle>
          <CardDescription>Tasks completed over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {trend && trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No task completions recorded in the last 30 days. Complete a task to see your trend!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Priority Distribution & Completion Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
              <CardDescription>Tasks by priority level</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Completion Metrics</CardTitle>
              <CardDescription>Overview of task completion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completion Rate</span>
                  <span className="font-semibold">{(metrics.completion_rate || 0).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(metrics.completion_rate || 0, 100)}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-border">
                <div>
                  <p className="text-2xl font-bold">{metrics.total_tasks}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Tasks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{metrics.completed_tasks}</p>
                  <p className="text-xs text-muted-foreground mt-1">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{metrics.overdue_tasks}</p>
                  <p className="text-xs text-muted-foreground mt-1">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Project Analysis */}
      {projects && projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Performance</CardTitle>
            <CardDescription>Completion rate by project</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={projects.map((p) => ({
                  name: p.projectName,
                  completion: Math.round(p.completionRate || 0),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                <Bar dataKey="completion" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
