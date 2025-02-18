import * as express from 'express';
import { ActiveListClient } from './active-list-client';

export function createActiveListRouter(activeListClient: ActiveListClient) {
  const router = express.Router();
  router.use(express.json());

  router.get('/', async (_req, res) => {
    try {
      const activeList = await activeListClient.getActiveList();
      res.status(200).send(activeList ?? { tasks: [] });
    } catch (error) {
      res
        .status(500)
        .send(error instanceof Error ? error.message : 'Unknown error');
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { description } = req.body;
      const updatedList = await activeListClient.addTask(description);
      res.status(201).send(updatedList);
    } catch (error) {
      res
        .status(400)
        .send(error instanceof Error ? error.message : 'Unknown error');
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const taskId = req.params.id;
      const updatedList = await activeListClient.removeTask(taskId);
      res.status(200).send(updatedList);
    } catch (error) {
      res
        .status(400)
        .send(error instanceof Error ? error.message : 'Unknown error');
    }
  });

  router.put('/', async (req, res) => {
    try {
      const { tasks } = req.body;
      const updatedList = await activeListClient.updateActiveList(tasks);
      if (updatedList) {
        res.status(200).send(updatedList);
      } else {
        res.status(404).send('Failed to update an active list');
      }
    } catch (error) {
      res
        .status(400)
        .send(error instanceof Error ? error.message : 'Unknown error');
    }
  });

  return router;
}
