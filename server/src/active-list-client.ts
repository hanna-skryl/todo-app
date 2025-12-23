import { type Db, ObjectId } from 'mongodb';
import type { ActiveListModel } from './models.js';
import { Collection } from './collections.js';

export function createActiveListClient(db: Db) {
  const collection = db.collection<ActiveListModel>(Collection.ActiveList);

  return {
    async getActiveList(): Promise<ActiveListModel | null> {
      return collection.findOne();
    },

    async addTask(description: string): Promise<ActiveListModel | null> {
      const newTask = { _id: new ObjectId(), description, done: false };
      const result = await collection.findOneAndUpdate(
        {},
        { $push: { tasks: newTask } },
        { upsert: true, returnDocument: 'after' },
      );
      return result;
    },

    async removeTask(id: string): Promise<ActiveListModel | null> {
      const result = await collection.findOneAndUpdate(
        {},
        { $pull: { tasks: { _id: new ObjectId(id) } } },
        { returnDocument: 'after' },
      );
      return result;
    },

    async updateActiveList(
      tasks: ActiveListModel['tasks'],
    ): Promise<ActiveListModel | null> {
      const updatedTasks = tasks.map(task => ({
        _id: task._id ? new ObjectId(task._id) : new ObjectId(),
        description: task.description,
        done: !!task.done,
      }));
      const result = await collection.findOneAndUpdate(
        {},
        { $set: { tasks: updatedTasks } },
        { upsert: true, returnDocument: 'after' },
      );
      return result;
    },
  };
}

export type ActiveListClient = ReturnType<typeof createActiveListClient>;
