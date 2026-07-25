'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { GuestVerifyModal } from '@/components/dashboard/guest-verify-modal';

export function TaskQuickAdd() {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const { createTask, isCreating } = useTasks();

  const handleCreate = async (titleToCreate) => {
    try {
      await createTask({
        title: titleToCreate,
        status: 'todo',
        priority: 'medium',
      });
      setInput('');
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
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            autoFocus
            type="text"
            placeholder="What needs to be done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isCreating}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isCreating || !input.trim()}>
              {isCreating ? 'Adding...' : 'Add Task'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setInput('');
              }}
            >
              Cancel
            </Button>
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
