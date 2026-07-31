'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flag, Calendar, AlertCircle, Trash2, CheckCircle2, Folder, Tag } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useLabels } from '@/hooks/useLabels';

const priorityColors = {
  low: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40',
  medium: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
  high: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40',
  critical: 'text-red-600 bg-red-50 dark:bg-red-950/40',
};

export function TaskItem({ task, isSelected, onSelectChange }) {
  const { updateTask, deleteTask } = useTasks();
  const { projects = [] } = useProjects();
  const { labels = [] } = useLabels();

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
  const isCompleted = task.status === 'completed';

  const project = projects.find((p) => p.id === task.project_id);

  const handleToggle = async (e) => {
    e.stopPropagation();
    await updateTask(task.id, {
      status: isCompleted ? 'todo' : 'completed',
    });
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    await deleteTask(task.id);
  };

  return (
    <Card className={`hover:shadow-md transition-all group ${isSelected ? 'border-primary bg-primary/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 md:gap-4">
          {onSelectChange && (
            <input
              type="checkbox"
              checked={isSelected || false}
              onChange={(e) => onSelectChange(task.id, e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-input accent-primary cursor-pointer"
            />
          )}
          <button
            type="button"
            onClick={handleToggle}
            className="mt-0.5 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
          >
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-primary fill-primary/20" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40 hover:border-primary transition-colors" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={`font-medium text-sm md:text-base ${
                  isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                }`}
              >
                {task.title}
              </h4>
              {project && (
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: project.color || '#3B82F6' }}
                >
                  <Folder size={10} />
                  {project.name}
                </span>
              )}
            </div>

            {task.description && (
              <p className="text-xs md:text-sm text-muted-foreground truncate mt-1">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2.5 mt-2.5">
              {task.due_date && (
                <div
                  className={`flex items-center gap-1 text-xs ${
                    isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {isOverdue && <AlertCircle size={14} />}
                  <Calendar size={14} />
                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              )}
              {task.is_recurring && (
                <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  🔄 {task.recurrence_pattern || 'Recurring'}
                </span>
              )}
              {task.estimated_time > 0 && (
                <div className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {task.estimated_time}m est.
                </div>
              )}
              {task.labels && task.labels.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {task.labels.map((lblId) => {
                    const labelObj = labels.find((l) => l.id === lblId || l.name === lblId);
                    return (
                      <span
                        key={lblId}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-border"
                        style={{
                          backgroundColor: labelObj ? `${labelObj.color}20` : undefined,
                          color: labelObj ? labelObj.color : undefined,
                        }}
                      >
                        <Tag size={10} />
                        {labelObj ? labelObj.name : lblId}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                priorityColors[task.priority] || priorityColors.medium
              }`}
            >
              <Flag size={12} />
              {task.priority}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
