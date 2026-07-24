'use client';

import { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Flag, Calendar, AlertCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

const priorityColors = {
  low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
  high: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
  critical: 'text-red-600 bg-red-50 dark:bg-red-900/20',
};

export function TaskItem({ task }: TaskItemProps) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            className="mt-1 rounded cursor-pointer"
            readOnly
          />
          <div className="flex-1 min-w-0">
            <h4
              className={`font-medium truncate ${
                task.status === 'completed' ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {task.title}
            </h4>
            {task.description && (
              <p className="text-sm text-muted-foreground truncate mt-1">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3">
              {task.due_date && (
                <div className={`flex items-center gap-1 text-xs ${
                  isOverdue ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  {isOverdue && <AlertCircle size={14} />}
                  <Calendar size={14} />
                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              )}
              {task.estimated_time && (
                <div className="text-xs text-muted-foreground">
                  {task.estimated_time}m
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                priorityColors[task.priority]
              }`}
            >
              <Flag size={12} />
              {task.priority}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
