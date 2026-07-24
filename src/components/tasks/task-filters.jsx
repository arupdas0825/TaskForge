'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';

export function TaskFilters({
  onStatusChange,
  onPriorityChange,
  statusValue,
  priorityValue,
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusValue === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onStatusChange('all')}
              >
                All
              </Button>
              {TASK_STATUSES.map((status) => (
                <Button
                  key={status.value}
                  variant={statusValue === status.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onStatusChange(status.value)}
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Priority
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={priorityValue === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPriorityChange('all')}
              >
                All
              </Button>
              {TASK_PRIORITIES.map((priority) => (
                <Button
                  key={priority.value}
                  variant={priorityValue === priority.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPriorityChange(priority.value)}
                >
                  {priority.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
