import { type Db, ObjectId } from 'mongodb';
import type { PresetModel } from './models';
import { Collection } from './collections';

export function createPresetsClient(db: Db) {
  const collection = db.collection<PresetModel>(Collection.Presets);

  return {
    async getPresets(): Promise<PresetModel[]> {
      return collection.find().toArray();
    },

    async getPreset(_id: ObjectId): Promise<PresetModel | null> {
      return collection.findOne({ _id });
    },

    async createPreset(preset: PresetModel): Promise<ObjectId> {
      const result = await collection.insertOne(preset);
      return result.insertedId;
    },

    async updatePreset(preset: PresetModel): Promise<PresetModel | null> {
      const result = await collection.findOneAndUpdate(
        { _id: preset._id ? new ObjectId(preset._id) : new ObjectId() },
        { $set: { title: preset.title, tasks: preset.tasks } },
        { upsert: true, returnDocument: 'after' },
      );
      return result;
    },

    async deletePreset(_id: ObjectId): Promise<boolean> {
      const result = await collection.deleteOne({ _id });
      return result.deletedCount > 0;
    },
  };
}

export type PresetsClient = ReturnType<typeof createPresetsClient>;
