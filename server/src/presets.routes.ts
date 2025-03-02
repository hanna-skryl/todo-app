import * as express from 'express';
import { ObjectId } from 'mongodb';
import { PresetsClient } from './presets-client';

export function createPresetsRouter(presetsClient: PresetsClient) {
  const router = express.Router();
  router.use(express.json());

  router.get('/', async (_req, res) => {
    try {
      const presets = await presetsClient.getPresets();
      res.status(200).send(presets);
    } catch (error) {
      res
        .status(500)
        .send(error instanceof Error ? error.message : 'Unknown error');
    }
  });

  router.get('/:id', async (req, res) => {
    const id = req?.params?.id;
    try {
      const preset = await presetsClient.getPreset(new ObjectId(id));
      if (preset) {
        res.status(200).send(preset);
      } else {
        res.status(404).send(`Failed to find a preset: ID ${id}`);
      }
    } catch (error) {
      res.status(404).send(`Failed to find a preset: ID ${id}`);
    }
  });

  router.post('/', async (req, res) => {
    try {
      const newPreset = await presetsClient.createPreset(req.body);
      if (newPreset) {
        res.status(201).json(newPreset);
      } else {
        res.status(500).send('Failed to create a new preset.');
      }
    } catch (error) {
      res
        .status(400)
        .send(error instanceof Error ? error.message : 'Unknown error');
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const updatedPreset = await presetsClient.updatePreset(req.body);
      if (updatedPreset) {
        res.status(200).json(updatedPreset);
      } else {
        res.status(404).send(`Failed to find a preset: ID ${req.body._id}`);
      }
    } catch (error) {
      res
        .status(400)
        .send(error instanceof Error ? error.message : 'Unknown error');
    }
  });

  router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const isDeleted = await presetsClient.deletePreset(new ObjectId(id));
      if (isDeleted) {
        res.status(202).send(`Removed a preset: ID ${id}`);
      } else {
        res.status(400).send(`Failed to remove a preset: ID ${id}`);
      }
    } catch (error) {
      res
        .status(400)
        .send(error instanceof Error ? error.message : 'Unknown error');
    }
  });

  return router;
}
