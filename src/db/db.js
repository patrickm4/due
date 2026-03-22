import { Dexie } from 'dexie';

export const db = new Dexie('tasksDatabase');
db.version(1).stores({
  tasks: 'id, taskName, isCompleted, dueDate, createdAt', // Primary key and indexed props
});

db.version(2)
  .stores({
    tasks: 'id, taskName, isCompleted, dueDate, createdAt, position', // Primary key and indexed props
  })
  .upgrade(async (tx) => {
    const table = tx.table('tasks');

    let position = 0;

    await table.toCollection().modify((item) => {
      item.position = position++;
    });
  });
