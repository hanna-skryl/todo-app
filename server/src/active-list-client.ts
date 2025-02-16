import * as mongodb from 'mongodb';
import { ActiveListModel } from './models';
import { Collection } from './collections';

export function createActiveListClient(db: mongodb.Db) {
  const collection = db.collection<ActiveListModel>(Collection.ActiveList);

  return {
    async getActiveList(): Promise<ActiveListModel | null> {
      return collection.findOne();
    },

    async updateActiveList(
      tasks: ActiveListModel['tasks'],
    ): Promise<ActiveListModel | null> {
      const result = await collection.findOneAndUpdate(
        {},
        { $set: { tasks } },
        { upsert: true, returnDocument: 'after' },
      );
      return result;
    },
  };
}

export type ActiveListClient = ReturnType<typeof createActiveListClient>;
