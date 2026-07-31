'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';

export function TaskFilters({
  onStatusChange,
  onPriorityChange,
  onProjectChange,
  onLabelChange,
  statusValue,
  priorityValue,
  projectValue = 'all',
  labelValue = 'all',
  projects = [],
  labels = [],
}) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Status
            </label>
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={statusValue === 'all' ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => onStatusChange('all')}
              >
                All
              </Button>
              {TASK_STATUSES.map((status) => (
                <Button
                  key={status.value}
                  variant={statusValue === status.value ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => onStatusChange(status.value)}
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Priority
            </label>
            <div className="flex flex-wrap gap-1.5">
              <Button
                variant={priorityValue === 'all' ? 'default' : 'outline'}
                size="sm"
                className="h-8 text-xs"
                onClick={() => onPriorityChange('all')}
              >
                All
              </Button>
              {TASK_PRIORITIES.map((priority) => (
                <Button
                  key={priority.value}
                  variant={priorityValue === priority.value ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => onPriorityChange(priority.value)}
                >
                  {priority.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Project Filter */}
          {onProjectChange && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Project
              </label>
              <select
                value={projectValue}
                onChange={(e) => onProjectChange(e.target.value)}
                className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Projects</option>
                <option value="none">No Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Label Filter */}
          {onLabelChange && (
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Label
              </label>
              <select
                value={labelValue}
                onChange={(e) => onLabelChange(e.target.value)}
                className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Labels</option>
                {labels.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
