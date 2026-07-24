'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTasks } from '@/hooks/useTasks';

export default function CalendarPage() {
  const { tasks = [] } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Find tasks for specific date
  const getTasksForDay = (day) => {
    if (!day) return [];
    return tasks.filter((t) => {
      if (!t.due_date) return false;
      const d = new Date(t.due_date);
      return (
        d.getDate() === day &&
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1">View tasks scheduled across the month</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleToday}>
          Today
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{monthName}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft size={18} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-bold text-xs text-muted-foreground uppercase py-2">
                {day}
              </div>
            ))}
            {days.map((day, index) => {
              const dayTasks = getTasksForDay(day);
              const todayClass = isToday(day)
                ? 'border-2 border-primary font-bold'
                : 'border border-transparent';

              return (
                <div
                  key={index}
                  className={`min-h-[70px] p-2 rounded-lg text-xs flex flex-col justify-start transition-colors ${
                    day
                      ? 'bg-muted/50 hover:bg-muted cursor-pointer ' + todayClass
                      : 'bg-transparent'
                  }`}
                >
                  {day && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className={isToday(day) ? 'text-primary font-bold' : 'text-foreground font-medium'}>
                          {day}
                        </span>
                        {dayTasks.length > 0 && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <div className="mt-1 space-y-1 overflow-hidden">
                        {dayTasks.slice(0, 2).map((t) => (
                          <div
                            key={t.id}
                            className={`px-1.5 py-0.5 rounded text-[10px] truncate ${
                              t.status === 'completed'
                                ? 'line-through bg-muted text-muted-foreground'
                                : 'bg-primary/10 text-primary font-medium'
                            }`}
                          >
                            {t.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <div className="text-[9px] text-muted-foreground font-medium">
                            +{dayTasks.length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
