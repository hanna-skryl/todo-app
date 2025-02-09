import * as mongodb from 'mongodb';
import { ActiveListModel } from './models';
import { Collection } from './collections';

export function createActiveListClient(db: mongodb.Db) {
  const collection = db.collection<ActiveListModel>(Collection.ActiveList);

  return {
    async getActiveList(): Promise<ActiveListModel | null> {
      return collection.findOne();
    },

    async updateActiveList(tasks: ActiveListModel['tasks']): Promise<boolean> {
      const result = await collection.updateOne(
        {},
        { $set: { tasks } },
        { upsert: true },
      );
      return result.matchedCount > 0 || result.upsertedCount > 0;
    },
  };
}

export type ActiveListClient = ReturnType<typeof createActiveListClient>;
