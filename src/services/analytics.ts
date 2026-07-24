import { supabase } from '@/lib/supabase/client';
import { Task, ProductivityStats, TaskMetrics } from '@/types';

export async function getProductivityStats(): Promise<ProductivityStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // Get tasks completed today
  const { data: todayTasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'completed')
    .gte('updated_at', today.toISOString());

  // Get tasks completed this week
  const { data: weekTasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'completed')
    .gte('updated_at', weekStart.toISOString());

  // Get tasks completed this month
  const { data: monthTasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', 'completed')
    .gte('updated_at', monthStart.toISOString());

  // Calculate streak
  const { data: allTasks } = await supabase
    .from('tasks')
    .select('updated_at')
    .eq('status', 'completed')
    .order('updated_at', { ascending: false });

  let streak = 0;
  if (allTasks && allTasks.length > 0) {
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1);

    for (const task of allTasks) {
      const taskDate = new Date(task.updated_at);
      taskDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (taskDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (taskDate.getTime() < currentDate.getTime()) {
        break;
      }
    }
  }

  // Calculate average completion time (in minutes)
  const tasksWithTime = (monthTasks || [])
    .filter((task: any) => task.actual_time)
    .map((task: any) => task.actual_time);

  const avgTime =
    tasksWithTime.length > 0
      ? Math.round(tasksWithTime.reduce((a: number, b: number) => a + b, 0) / tasksWithTime.length)
      : 0;

  // Calculate productivity score (0-100)
  const completionRate = weekTasks ? (weekTasks.length / 10) * 100 : 0;
  const productivityScore = Math.min(Math.round(completionRate), 100);

  return {
    tasks_completed_today: todayTasks?.length || 0,
    tasks_completed_this_week: weekTasks?.length || 0,
    tasks_completed_this_month: monthTasks?.length || 0,
    total_focus_time: tasksWithTime.reduce((a: number, b: number) => a + b, 0),
    productivity_score: productivityScore,
    streak,
    average_completion_time: avgTime,
  };
}

export async function getTaskMetrics(): Promise<TaskMetrics> {
  const { data: allTasks } = await supabase.from('tasks').select('*');

  if (!allTasks) {
    return {
      total_tasks: 0,
      completed_tasks: 0,
      overdue_tasks: 0,
      tasks_by_priority: { low: 0, medium: 0, high: 0, critical: 0 },
      tasks_by_project: {},
      completion_rate: 0,
    };
  }

  const now = new Date();
  const completed = allTasks.filter((t) => t.status === 'completed');
  const overdue = allTasks.filter(
    (t) => t.due_date && new Date(t.due_date) < now && t.status !== 'completed'
  );

  const tasksByPriority = {
    low: allTasks.filter((t) => t.priority === 'low').length,
    medium: allTasks.filter((t) => t.priority === 'medium').length,
    high: allTasks.filter((t) => t.priority === 'high').length,
    critical: allTasks.filter((t) => t.priority === 'critical').length,
  };

  const tasksByProject: Record<string, number> = {};
  allTasks.forEach((task) => {
    if (task.project_id) {
      tasksByProject[task.project_id] = (tasksByProject[task.project_id] || 0) + 1;
    }
  });

  return {
    total_tasks: allTasks.length,
    completed_tasks: completed.length,
    overdue_tasks: overdue.length,
    tasks_by_priority: tasksByPriority,
    tasks_by_project: tasksByProject,
    completion_rate: allTasks.length > 0 ? (completed.length / allTasks.length) * 100 : 0,
  };
}

export async function getTaskCompletionTrend(days: number = 30) {
  const { data: tasks } = await supabase
    .from('tasks')
    .select('updated_at')
    .eq('status', 'completed')
    .gte('updated_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
    .order('updated_at', { ascending: true });

  if (!tasks) return [];

  // Group by day
  const trend: Record<string, number> = {};
  tasks.forEach((task) => {
    const date = new Date(task.updated_at).toLocaleDateString();
    trend[date] = (trend[date] || 0) + 1;
  });

  return Object.entries(trend).map(([date, count]) => ({
    date,
    completed: count,
  }));
}

export async function getCategoryAnalysis() {
  const { data: tasks } = await supabase.from('tasks').select('labels, priority');

  if (!tasks) return { byLabel: {}, byPriority: {} };

  const byLabel: Record<string, number> = {};
  const byPriority: Record<string, number> = {};

  tasks.forEach((task) => {
    if (task.labels && Array.isArray(task.labels)) {
      task.labels.forEach((label: string) => {
        byLabel[label] = (byLabel[label] || 0) + 1;
      });
    }
    byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
  });

  return { byLabel, byPriority };
}

export async function getProjectAnalysis() {
  const { data: projects } = await supabase.from('projects').select('id, name');
  const { data: tasks } = await supabase.from('tasks').select('project_id, status');

  if (!projects || !tasks) return [];

  return projects.map((project) => {
    const projectTasks = tasks.filter((t) => t.project_id === project.id);
    const completed = projectTasks.filter((t) => t.status === 'completed').length;

    return {
      projectId: project.id,
      projectName: project.name,
      totalTasks: projectTasks.length,
      completedTasks: completed,
      completionRate: projectTasks.length > 0 ? (completed / projectTasks.length) * 100 : 0,
    };
  });
}
