import { toast } from 'sonner';

/**
 * Sync a task to Google Calendar and Google Tasks via Google REST APIs
 * using the OAuth access token retrieved upon Google Sign-In.
 */
export async function syncTaskToGoogle(task, accessToken) {
  if (!accessToken || !task || !task.due_date) return false;

  let calendarSuccess = false;
  let tasksSuccess = false;

  try {
    const dueIso = new Date(task.due_date).toISOString();

    // 1. Google Calendar Event Creation
    const calendarRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: task.title,
        description: task.description || '',
        start: { dateTime: dueIso },
        end: { dateTime: new Date(new Date(task.due_date).getTime() + 30 * 60 * 1000).toISOString() },
      }),
    });

    if (calendarRes.ok) {
      calendarSuccess = true;
    } else {
      console.warn('Google Calendar sync warning:', await calendarRes.text());
    }

    // 2. Google Tasks Task Creation
    const tasksRes = await fetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: task.title,
        notes: task.description || '',
        due: dueIso,
      }),
    });

    if (tasksRes.ok) {
      tasksSuccess = true;
    } else {
      console.warn('Google Tasks sync warning:', await tasksRes.text());
    }

    if (calendarSuccess || tasksSuccess) {
      toast.success('Task synced to Google Calendar / Tasks');
      return true;
    } else {
      toast.warning('Google sync attempted but requires valid OAuth scope');
      return false;
    }
  } catch (err) {
    console.error('Error syncing task to Google services:', err);
    toast.error(`Google sync failed: ${err.message || err}`);
    return false;
  }
}
