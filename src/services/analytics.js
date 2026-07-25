import { listCollection } from '@/lib/firebase/firestore';

export async function getProductivityStats() {
  const allTasks = await listCollection('tasks');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const completedTasks = allTasks.filter((t) => t.status === 'completed');

  const todayTasks = completedTasks.filter((t) => new Date(t.updated_at || t.created_at) >= today);
  const weekTasks = completedTasks.filter((t) => new Date(t.updated_at || t.created_at) >= weekStart);
  const monthTasks = completedTasks.filter((t) => new Date(t.updated_at || t.created_at) >= monthStart);

  // Calculate streak
  const sortedCompleted = [...completedTasks].sort(
    (a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
  );

  let streak = 0;
  if (sortedCompleted.length > 0) {
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1);

    for (const task of sortedCompleted) {
      const taskDate = new Date(task.updated_at || task.created_at);
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
  const tasksWithTime = monthTasks.filter((t) => t.actual_time > 0).map((t) => t.actual_time);
  const totalFocusTime = tasksWithTime.reduce((a, b) => a + b, 0);
  const avgTime = tasksWithTime.length > 0 ? Math.round(totalFocusTime / tasksWithTime.length) : 0;

  // Productivity score calculation
  const totalThisWeek = allTasks.filter((t) => new Date(t.created_at) >= weekStart).length;
  const completionRate = totalThisWeek > 0 ? (weekTasks.length / totalThisWeek) * 100 : (weekTasks.length > 0 ? 85 : 0);
  const productivityScore = Math.min(Math.round(completionRate || 75), 100);

  return {
    tasks_completed_today: todayTasks.length,
    tasks_completed_this_week: weekTasks.length,
    tasks_completed_this_month: monthTasks.length,
    total_focus_time: totalFocusTime,
    productivity_score: productivityScore,
    streak,
    average_completion_time: avgTime,
  };
}

export async function getTaskMetrics() {
  const allTasks = await listCollection('tasks');

  if (!allTasks || allTasks.length === 0) {
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
  const overdue = allTasks.filter((t) => t.due_date && new Date(t.due_date) < now && t.status !== 'completed');

  const tasksByPriority = {
    low: allTasks.filter((t) => t.priority === 'low').length,
    medium: allTasks.filter((t) => t.priority === 'medium').length,
    high: allTasks.filter((t) => t.priority === 'high').length,
    critical: allTasks.filter((t) => t.priority === 'critical').length,
  };

  const tasksByProject = {};
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
    completion_rate: (completed.length / allTasks.length) * 100,
  };
}

export async function getTaskCompletionTrend(days = 30) {
  const allTasks = await listCollection('tasks');
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  const completedTasks = allTasks.filter(
    (t) => t.status === 'completed' && new Date(t.updated_at || t.created_at).getTime() >= cutoff
  );

  const trend = {};
  completedTasks.forEach((task) => {
    const date = new Date(task.updated_at || task.created_at).toLocaleDateString();
    trend[date] = (trend[date] || 0) + 1;
  });

  return Object.entries(trend).map(([date, count]) => ({
    date,
    completed: count,
  }));
}

export async function getCategoryAnalysis() {
  const allTasks = await listCollection('tasks');

  const byLabel = {};
  const byPriority = {};

  allTasks.forEach((task) => {
    if (task.labels && Array.isArray(task.labels)) {
      task.labels.forEach((label) => {
        byLabel[label] = (byLabel[label] || 0) + 1;
      });
    }
    if (task.priority) {
      byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
    }
  });

  return { byLabel, byPriority };
}

export async function getProjectAnalysis() {
  const projects = await listCollection('projects');
  const tasks = await listCollection('tasks');

  if (!projects) return [];

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
