'use client';

import { motion } from 'framer-motion';
import { TaskItem } from './task-item';

export function TaskList({ tasks = [] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-xl">
        <p className="text-muted-foreground text-sm">No tasks found matching your filters.</p>
      </div>
    );
  }

  // Group tasks by status
  const groupedTasks = tasks.reduce((acc, task) => {
    const status = task.status || 'todo';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {});

  const statusLabels = {
    todo: 'To Do',
    in_progress: 'In Progress',
    completed: 'Completed',
    archived: 'Archived',
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {Object.entries(groupedTasks).map(([status, statusTasks]) => (
        <div key={status} className="space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {statusLabels[status] || status} ({statusTasks.length})
          </h3>
          <div className="space-y-2">
            {statusTasks.map((task) => (
              <motion.div key={task.id} variants={itemVariants}>
                <TaskItem task={task} />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
