'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { TaskQuickAdd } from '@/components/dashboard/task-quick-add';
import { useTasks } from '@/hooks/useTasks';
import { useAuthStore } from '@/stores/auth-store';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';

export function DashboardContent() {
  const { user } = useAuthStore();
  const { tasks = [], updateTask, isLoading } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const overdueTasks = tasks.filter(
    (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
  ).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayTasks = tasks.filter((t) => t.status !== 'archived');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const toggleTaskCompletion = async (task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    await updateTask(task.id, { status: newStatus });
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your productivity today
          </p>
        </div>
      </motion.div>

      {/* Quick Add Task */}
      <motion.div variants={itemVariants}>
        <TaskQuickAdd />
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={totalTasks.toString()}
          description={`${completedTasks} completed`}
          icon={CheckCircle2}
        />
        <StatsCard
          title="Active Tasks"
          value={(totalTasks - completedTasks).toString()}
          description="In progress or pending"
          icon={Clock}
        />
        <StatsCard
          title="Overdue"
          value={overdueTasks.toString()}
          description="Requires attention"
          icon={AlertCircle}
        />
        <StatsCard
          title="Completion Rate"
          value={`${completionRate}%`}
          description="Overall progress"
          icon={TrendingUp}
        />
      </motion.div>

      {/* Main Content Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>{todayTasks.length} tasks total</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground text-sm py-4">Loading tasks...</p>
              ) : todayTasks.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">
                  No tasks available. Add one above to get started!
                </p>
              ) : (
                <div className="space-y-3">
                  {todayTasks.slice(0, 6).map((task) => {
                    const isDone = task.status === 'completed';
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border cursor-pointer"
                        onClick={() => toggleTaskCompletion(task)}
                      >
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => {}}
                          className="rounded h-4 w-4 accent-primary cursor-pointer"
                        />
                        <span
                          className={`flex-1 text-sm font-medium ${
                            isDone ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            task.priority === 'critical' || task.priority === 'high'
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                              : task.priority === 'medium'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
              <CardDescription>Overview of completed work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completion Rate</span>
                  <span className="font-semibold">{completionRate}%</span>
                </div>
                <ProgressBar progress={completionRate} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">{completedTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium">{totalTasks - completedTasks}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatsCard({ title, value, description, icon: Icon }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          {Icon && <Icon className="h-6 w-6 text-muted-foreground/60" />}
        </div>
      </CardContent>
    </Card>
  );
}
