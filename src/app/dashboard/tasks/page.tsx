'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TaskList } from '@/components/tasks/task-list';
import { TaskFilters } from '@/components/tasks/task-filters';
import { Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

export default function TasksPage() {
  const { tasks, isLoading } = useTasks();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">{filteredTasks.length} tasks</p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2"
        >
          <Plus size={20} />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters
        onStatusChange={setFilterStatus}
        onPriorityChange={setFilterPriority}
        statusValue={filterStatus}
        priorityValue={filterPriority}
      />

      {/* Tasks List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-muted-foreground mb-4">No tasks found</p>
            <Button variant="outline" onClick={() => setIsCreateOpen(true)}>
              Create your first task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TaskList tasks={filteredTasks} />
      )}
    </motion.div>
  );
}
