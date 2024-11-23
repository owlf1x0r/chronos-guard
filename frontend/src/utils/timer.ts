import { SessionRecord, Task } from '@/types';

export function clearTimeInterval(interval: NodeJS.Timeout | null) {
  if (interval) {
    clearInterval(interval);
  }
}

const sessionRecordsKey = 'sessionRecords';
const TasksKey = 'tasks';
const currentTaskKey = 'currentTask';

export function getSessionRecords() {
  const records = localStorage.getItem(sessionRecordsKey);
  return records ? JSON.parse(records) : [];
}

export function saveSessionRecords(records: SessionRecord[]) {
  localStorage.setItem(sessionRecordsKey, JSON.stringify(records));
}

export function getTasks(): Task[] {
  const tasks = localStorage.getItem(TasksKey);
  return tasks ? JSON.parse(tasks) : [];
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(TasksKey, JSON.stringify(tasks));
}

export function getCurrentTask(): Task {
  const task = localStorage.getItem(currentTaskKey);
  return task ? JSON.parse(task) : getDefaultTask();
}

export function saveCurrentTask(task: Task) {
  localStorage.setItem(currentTaskKey, JSON.stringify(task));
}

export function getDefaultTask(): Task {
  return { id: 0, name: 'Not selected' };
}
