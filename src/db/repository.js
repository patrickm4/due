import { db } from '@/db/db.js';
import Dexie from 'dexie';

export const todoRepository = {
  getAll() {
    return db.tasks.toArray();
  },

  add(task) {
    return db.tasks.add(task);
  },

  update(id, changes) {
    return db.tasks.update(id, changes);
  },

  put(obj) {
    console.log(obj);
    return db.tasks.put(Dexie.deepClone(obj));
  },

  delete(id) {
    return db.tasks.delete(id);
  },
};
