import * as mongodb from 'mongodb';
import { Collection } from './collections';
import { createUsersClient } from './users-client';
import { createPresetsClient } from './presets-client';

export async function createDbClient(uri: string) {
  const mongoClient = new mongodb.MongoClient(uri);
  await mongoClient.connect();

  const db = mongoClient.db('todos');

  await applySchemaValidation(db, Collection.Presets, {
    bsonType: 'object',
    required: ['title', 'tasks'],
    additionalProperties: false,
    properties: {
      _id: {},
      title: { bsonType: 'string', description: "'title' is required" },
      tasks: { bsonType: 'array', description: "'tasks' is required" },
    },
  });

  await applySchemaValidation(db, Collection.Users, {
    bsonType: 'object',
    required: ['username', 'password'],
    additionalProperties: false,
    properties: {
      _id: {},
      username: { bsonType: 'string', description: "'username' is required" },
      password: { bsonType: 'string', description: "'password' is required" },
    },
  });

  return {
    ...createPresetsClient(db),
    ...createUsersClient(db),
  };
}

// Update our existing collection with JSON schema validation
// so we know our documents will always match the shape of our models, even if added elsewhere.
async function applySchemaValidation(
  db: mongodb.Db,
  collectionName: string,
  jsonSchema: object,
) {
  await db
    .command({
      collMod: collectionName,
      validator: { $jsonSchema: jsonSchema },
    })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
        await db.createCollection(collectionName, {
          validator: { $jsonSchema: jsonSchema },
        });
      }
    });
}
