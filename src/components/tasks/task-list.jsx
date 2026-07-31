'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskItem } from './task-item';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trash2, CheckSquare } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

export function TaskList({ tasks = [] }) {
  const { updateTask, deleteTask } = useTasks();
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectChange = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === tasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tasks.map((t) => t.id));
    }
  };

  const handleBulkComplete = async () => {
    for (const id of selectedIds) {
      await updateTask(id, { status: 'completed' });
    }
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (confirm(`Delete ${selectedIds.length} selected tasks?`)) {
      for (const id of selectedIds) {
        await deleteTask(id);
      }
      setSelectedIds([]);
    }
  };

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
    <div className="space-y-4">
      {/* Bulk Toolbar */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border text-xs">
        <button
          type="button"
          onClick={handleSelectAll}
          className="flex items-center gap-2 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <CheckSquare size={14} className={selectedIds.length === tasks.length ? 'text-primary' : ''} />
          <span>{selectedIds.length === tasks.length ? 'Deselect All' : 'Select All'} ({selectedIds.length} selected)</span>
        </button>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" onClick={handleBulkComplete}>
              <CheckCircle2 size={13} className="text-green-600" />
              Complete Selected
            </Button>
            <Button size="sm" variant="destructive" className="h-7 text-xs gap-1.5" onClick={handleBulkDelete}>
              <Trash2 size={13} />
              Delete Selected
            </Button>
          </div>
        )}
      </div>

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
                  <TaskItem
                    task={task}
                    isSelected={selectedIds.includes(task.id)}
                    onSelectChange={handleSelectChange}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
