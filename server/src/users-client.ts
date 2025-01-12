import * as mongodb from 'mongodb';
import { UserModel } from './models';
import { Collection } from './collections';

export function createUsersClient(db: mongodb.Db) {
  const collection = db.collection<UserModel>(Collection.Users);

  return {
    getUsers(): Promise<UserModel[]> {
      return collection.find().toArray();
    },

    getUser(_id: mongodb.ObjectId): Promise<UserModel | null> {
      return collection.findOne({ _id });
    },

    getUserByUsername(username: string): Promise<UserModel | null> {
      return collection.findOne({ username });
    },

    async createUser(data: UserModel): Promise<mongodb.ObjectId> {
      const result = await collection.insertOne(data);
      return result.insertedId;
    },

    async updateUser(_id: mongodb.ObjectId, data: UserModel): Promise<boolean> {
      const result = await collection.updateOne({ _id }, { $set: data });
      return result.matchedCount > 0;
    },

    async deleteUser(_id: mongodb.ObjectId): Promise<boolean> {
      const result = await collection.deleteOne({ _id });
      return result.deletedCount > 0;
    },
  };
}

export type UsersClient = ReturnType<typeof createUsersClient>;
