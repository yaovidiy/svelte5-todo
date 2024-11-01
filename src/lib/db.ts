import Dexie, { type Table } from "dexie";

export interface TODO {
  id?: number,
  name: string,
  done: boolean,
  createdAt?: number,
  labels?: string[],
  deadline?: number | string,
  description?: string,
}

export class DexieExtension extends Dexie {
  todos!: Table<TODO>

  constructor() {
    super('todoDB');
    this.version(1).stores({
      todos: '++id, name, done'
    })
  }
}

const db = new DexieExtension();

export default db;