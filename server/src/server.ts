import dotenv from 'dotenv';
import cors from 'cors';
import { createDbClient } from './db-client.js';
import express from 'express';
import { createPresetsRouter } from './presets.routes.js';
import { createUsersRouter } from './users.routes.js';
import { createActiveListRouter } from './active-list.routes.js';

// Load environment variables from the .env file
dotenv.config();

const { ATLAS_URI, PORT } = process.env;

if (!ATLAS_URI) {
  console.error(
    'No ATLAS_URI environment variable has been defined in config.env',
  );
  process.exit(1);
}

createDbClient(ATLAS_URI)
  .then(dbClient => {
    const app = express();
    app.use(cors());

    app.use('/presets', createPresetsRouter(dbClient));
    app.use('/users', createUsersRouter(dbClient));
    app.use('/active-list', createActiveListRouter(dbClient));

    // dynamically use process.env.PORT or fallback to 5200 for local development
    const port = parseInt(PORT || '5200', 10);
    // start the Express server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => console.error(error));
