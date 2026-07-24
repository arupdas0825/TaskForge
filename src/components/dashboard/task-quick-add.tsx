'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function TaskQuickAdd() {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // TODO: Add task creation logic
      console.log('Creating task:', input);
      setInput('');
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full">
      {!isOpen ? (
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
          onClick={() => setIsOpen(true)}
        >
          <Plus size={20} />
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
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              Add Task
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
    </div>
  );
}
