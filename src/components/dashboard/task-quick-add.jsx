'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { GuestVerifyModal } from '@/components/dashboard/guest-verify-modal';

export function TaskQuickAdd() {
  const [input, setInput] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isOpen, setIsOpen] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const { createTask, isCreating } = useTasks();
  const { projects = [] } = useProjects();

  const handleCreate = async (titleToCreate) => {
    try {
      await createTask({
        title: titleToCreate,
        status: 'todo',
        priority,
        project_id: projectId || null,
      });
      setInput('');
      setProjectId('');
      setPriority('medium');
      setIsOpen(false);
    } catch (err) {
      if (err.code === 'VERIFICATION_REQUIRED') {
        setShowVerifyModal(true);
        return;
      }
      console.error('Failed to create quick task:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await handleCreate(input.trim());
  };

  const handleVerified = async () => {
    if (input.trim()) {
      await handleCreate(input.trim());
    }
  };

  return (
    <div className="w-full">
      {!isOpen ? (
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => setIsOpen(true)}
        >
          <Plus size={20} className="mr-2" />
          <span>Add a task...</span>
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 p-3 border border-border rounded-lg bg-card shadow-sm">
          <input
            autoFocus
            type="text"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isCreating}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex gap-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="h-8 px-2 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              {projects.length > 0 && (
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="h-8 px-2 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">No Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setIsOpen(false);
                  setInput('');
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-8 text-xs" disabled={isCreating || !input.trim()}>
                {isCreating ? 'Adding...' : 'Add Task'}
              </Button>
            </div>
          </div>
        </form>
      )}

      <GuestVerifyModal
        open={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onVerified={handleVerified}
      />
    </div>
  );
}
