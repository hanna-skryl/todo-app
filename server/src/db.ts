import * as mongodb from 'mongodb';
import { Preset } from './preset.model';

export const collections: {
  presets?: mongodb.Collection<Preset>;
} = {};

export async function connectToDatabase(uri: string) {
  const client = new mongodb.MongoClient(uri);
  await client.connect();

  const db = client.db('todos');
  await applySchemaValidation(db);

  const presetsCollection = db.collection<Preset>('presets');
  collections.presets = presetsCollection;
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Preset model, even if added elsewhere.
async function applySchemaValidation(db: mongodb.Db) {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'items'],
      additionalProperties: false,
      properties: {
        _id: {},
        title: {
          bsonType: 'string',
          description: "'title' is required and is a string",
        },
        items: {
          bsonType: 'array',
          description: "'items' is required and is an array",
        },
      },
    },
  };

  await db
    .command({
      collMod: 'presets',
      validator: jsonSchema,
    })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection('presets', { validator: jsonSchema });
      }
    });
}
