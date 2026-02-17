import { Dexie } from 'dexie';

export const db = new Dexie('tasksDatabase');
db.version(1).stores({
  tasks: 'id, taskName, isCompleted, dueDate, createdAt', // Primary key and indexed props
});
