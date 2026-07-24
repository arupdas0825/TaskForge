'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Task } from '@/types';
import { TaskItem } from './task-item';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
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

  // Group tasks by status
  const groupedTasks = tasks.reduce(
    (acc, task) => {
      if (!acc[task.status]) {
        acc[task.status] = [];
      }
      acc[task.status].push(task);
      return acc;
    },
    {} as Record<string, Task[]>
  );

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {Object.entries(groupedTasks).map(([status, statusTasks]) => (
        <div key={status} className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {status}
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
