'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/dashboard/progress-bar';
import { TaskQuickAdd } from '@/components/dashboard/task-quick-add';

export function DashboardContent() {
  const [tasks] = useState([
    { id: '1', title: 'Design system setup', completed: true, priority: 'high' },
    { id: '2', title: 'Dashboard layout', completed: true, priority: 'high' },
    { id: '3', title: 'Task management', completed: false, priority: 'high' },
    { id: '4', title: 'Calendar integration', completed: false, priority: 'medium' },
  ]);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = Math.round((completedTasks / tasks.length) * 100);

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
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your tasks today</p>
        </div>
      </motion.div>

      {/* Quick Add Task */}
      <motion.div variants={itemVariants}>
        <TaskQuickAdd />
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Today's Tasks" value="4" description="2 completed" />
        <StatsCard title="Upcoming" value="8" description="Next 7 days" />
        <StatsCard title="Overdue" value="1" description="Needs attention" />
        <StatsCard title="Completion Rate" value={`${completionRate}%`} description="This week" />
      </motion.div>

      {/* Main Content Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
              <CardDescription>4 tasks total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      className="rounded"
                      readOnly
                    />
                    <span
                      className={`flex-1 ${
                        task.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
              <CardDescription>Weekly overview</CardDescription>
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
                  <span className="font-medium">{tasks.length - completedTasks}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatsCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
