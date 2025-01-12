import * as mongodb from 'mongodb';
import { PresetModel } from './models';
import { Collection } from './collections';

export function createPresetsClient(db: mongodb.Db) {
  const collection = db.collection<PresetModel>(Collection.Presets);

  return {
    async getPresets(): Promise<PresetModel[]> {
      return collection.find().toArray();
    },

    async getPreset(_id: mongodb.ObjectId): Promise<PresetModel | null> {
      return collection.findOne({ _id });
    },

    async createPreset(preset: PresetModel): Promise<mongodb.ObjectId> {
      const result = await collection.insertOne(preset);
      return result.insertedId;
    },

    async updatePreset(
      _id: mongodb.ObjectId,
      preset: Partial<PresetModel>,
    ): Promise<boolean> {
      const result = await collection.updateOne({ _id }, { $set: preset });
      return result.matchedCount > 0;
    },

    async deletePreset(_id: mongodb.ObjectId): Promise<boolean> {
      const result = await collection.deleteOne({ _id });
      return result.deletedCount > 0;
    },
  };
}

export type PresetsClient = ReturnType<typeof createPresetsClient>;
