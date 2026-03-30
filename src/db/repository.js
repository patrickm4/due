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
    return db.tasks.put(Dexie.deepClone(obj));
  },

  bulkPut(array) {
    const payload = array.map((a) => Dexie.deepClone(a));
    return db.tasks.bulkPut(payload);
  },

  delete(id) {
    return db.tasks.delete(id);
  },

  bulkDelete(array) {
    return db.tasks.bulkDelete(array);
  },
};
