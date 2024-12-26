import * as express from 'express';
import { ObjectId } from 'mongodb';
import { collections } from './db';

export const presetRouter = express.Router();
presetRouter.use(express.json());

presetRouter.get('/', async (_req, res) => {
  try {
    const presets = await collections?.presets?.find({}).toArray();
    res.status(200).send(presets);
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : 'Unknown error');
  }
});

presetRouter.get('/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const preset = await collections?.presets?.findOne(query);

    if (preset) {
      res.status(200).send(preset);
    } else {
      res.status(404).send(`Failed to find a preset: ID ${id}`);
    }
  } catch (error) {
    res.status(404).send(`Failed to find a preset: ID ${req?.params?.id}`);
  }
});

presetRouter.post('/', async (req, res) => {
  try {
    const preset = req.body;
    const result = await collections?.presets?.insertOne(preset);

    if (result?.acknowledged) {
      res.status(201).send(`Created a new preset: ID ${result.insertedId}.`);
    } else {
      res.status(500).send('Failed to create a new preset.');
    }
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send(error instanceof Error ? error.message : 'Unknown error');
  }
});

presetRouter.put('/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    const preset = req.body;
    const query = { _id: new ObjectId(id) };
    const result = await collections?.presets?.updateOne(query, {
      $set: preset,
    });

    if (result && result.matchedCount) {
      res.status(200).send(`Updated a preset: ID ${id}.`);
    } else if (!result?.matchedCount) {
      res.status(404).send(`Failed to find a preset: ID ${id}`);
    } else {
      res.status(304).send(`Failed to update a preset: ID ${id}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(message);
    res.status(400).send(message);
  }
});

presetRouter.delete('/:id', async (req, res) => {
  try {
    const id = req?.params?.id;
    const query = { _id: new ObjectId(id) };
    const result = await collections?.presets?.deleteOne(query);

    if (result && result.deletedCount) {
      res.status(202).send(`Removed a preset: ID ${id}`);
    } else if (!result) {
      res.status(400).send(`Failed to remove a preset: ID ${id}`);
    } else if (!result.deletedCount) {
      res.status(404).send(`Failed to find a preset: ID ${id}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(message);
    res.status(400).send(message);
  }
});
