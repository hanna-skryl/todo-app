import * as express from 'express';
import { ObjectId } from 'mongodb';
import { UsersClient } from './users-client';

export function createUsersRouter(usersClient: UsersClient) {
  const router = express.Router();
  router.use(express.json());

  router.get('/', async (_req, res) => {
    try {
      const users = await usersClient.getUsers();
      res.status(200).send(users);
    } catch (error) {
      res
        .status(500)
        .send(error instanceof Error ? error.message : 'Unknown error');
    }
  });

  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const user = await usersClient.getUser(new ObjectId(id));
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send(`Failed to find a user: ID ${id}`);
      }
    } catch (error) {
      res.status(404).send(`Failed to find a user: ID ${id}`);
    }
  });

  router.post('/', async (req, res) => {
    try {
      const insertedId = await usersClient.createUser(req.body);
      if (insertedId) {
        res.status(201).send(`Created a new user: ID ${insertedId}.`);
      } else {
        res.status(500).send('Failed to create a new user.');
      }
    } catch (error) {
      res
        .status(400)
        .send(error instanceof Error ? error.message : 'Unknown error');
    }
  });

  router.put('/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const isUpdated = await usersClient.updateUser(
        new ObjectId(id),
        req.body,
      );
      if (isUpdated) {
        res.status(200).send(`Updated a user: ID ${id}.`);
      } else {
        res.status(404).send(`Failed to find a user: ID ${id}`);
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
      const isDeleted = await usersClient.deleteUser(new ObjectId(id));
      if (isDeleted) {
        res.status(202).send(`Removed a user: ID ${id}`);
      } else {
        res.status(400).send(`Failed to remove a user: ID ${id}`);
      }
    } catch (error) {
      res
        .status(400)
        .send(error instanceof Error ? error.message : 'Unknown error');
    }
  });

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await usersClient.getUserByUsername(username);
      if (user && user.password === password) {
        res.status(200).send({ message: 'Login successful' });
      } else {
        res.status(401).send({ message: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).send({ message: 'Error during login' });
    }
  });

  return router;
}
