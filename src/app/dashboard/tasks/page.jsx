'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { TaskList } from '@/components/tasks/task-list';
import { TaskFilters } from '@/components/tasks/task-filters';
import { Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useLabels } from '@/hooks/useLabels';
import { GuestVerifyModal } from '@/components/dashboard/guest-verify-modal';

export default function TasksPage() {
  const { tasks = [], isLoading, createTask, isCreating } = useTasks();
  const { projects = [] } = useProjects();
  const { labels = [] } = useLabels();

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterLabel, setFilterLabel] = useState('all');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // New task state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('daily');

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterProject !== 'all') {
      if (filterProject === 'none' && task.project_id) return false;
      if (filterProject !== 'none' && task.project_id !== filterProject) return false;
    }
    if (filterLabel !== 'all') {
      if (!Array.isArray(task.labels) || !task.labels.includes(filterLabel)) return false;
    }
    return true;
  });

  const handleLabelToggle = (labelId) => {
    if (selectedLabels.includes(labelId)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== labelId));
    } else {
      setSelectedLabels([...selectedLabels, labelId]);
    }
  };

  const submitTask = async () => {
    if (!title.trim()) return;

    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        status: 'todo',
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        project_id: projectId || null,
        labels: selectedLabels,
        is_recurring: isRecurring,
        recurrence_pattern: isRecurring ? recurrencePattern : null,
      });

      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setProjectId('');
      setSelectedLabels([]);
      setIsRecurring(false);
      setIsCreateOpen(false);
    } catch (err) {
      if (err.code === 'VERIFICATION_REQUIRED') {
        setIsCreateOpen(false);
        setShowVerifyModal(true);
        return;
      }
      console.error('Failed to create task:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    await submitTask();
  };

  const handleVerified = async () => {
    if (title.trim()) {
      await submitTask();
    }
  };

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
          <p className="text-muted-foreground mt-1">{filteredTasks.length} tasks matching filters</p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2"
        >
          <Plus size={18} />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters
        onStatusChange={setFilterStatus}
        onPriorityChange={setFilterPriority}
        onProjectChange={setFilterProject}
        onLabelChange={setFilterLabel}
        statusValue={filterStatus}
        priorityValue={filterPriority}
        projectValue={filterProject}
        labelValue={filterLabel}
        projects={projects}
        labels={labels}
      />

      {/* Tasks List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground mb-4">No tasks found</p>
            <Button variant="outline" onClick={() => setIsCreateOpen(true)}>
              Create a task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TaskList tasks={filteredTasks} />
      )}

      {/* Create Task Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your workspace.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <textarea
                placeholder="Task description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">No Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Recurring Task</label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_recurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="h-4 w-4 rounded border-input accent-primary cursor-pointer"
                  />
                  <label htmlFor="is_recurring" className="text-xs text-foreground cursor-pointer font-medium">
                    Enable Recurrence
                  </label>
                </div>
              </div>
            </div>

            {isRecurring && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Recurrence Pattern</label>
                <select
                  value={recurrencePattern}
                  onChange={(e) => setRecurrencePattern(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}

            {labels.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Labels</label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {labels.map((lbl) => {
                    const isSelected = selectedLabels.includes(lbl.id);
                    return (
                      <button
                        type="button"
                        key={lbl.id}
                        onClick={() => handleLabelToggle(lbl.id)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary font-semibold'
                            : 'bg-muted/40 text-muted-foreground border-border hover:bg-muted'
                        }`}
                      >
                        {lbl.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || !title.trim()}>
                {isCreating ? 'Creating...' : 'Create Task'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Guest Verification Modal */}
      <GuestVerifyModal
        open={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onVerified={handleVerified}
      />
    </motion.div>
  );
}
