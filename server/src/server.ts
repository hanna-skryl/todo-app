import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDatabase } from './db';
import express from 'express';
import { presetRouter } from './presets.routes';

// Load environment variables from the .env file
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.error(
    'No ATLAS_URI environment variable has been defined in config.env',
  );
  process.exit(1);
}

connectToDatabase(ATLAS_URI)
  .then(() => {
    const app = express();
    app.use(cors());

    app.use('/presets', presetRouter);
    // start the Express server
    app.listen(5200, () => {
      console.log(`Server running at http://localhost:5200...`);
    });
  })
  .catch(error => console.error(error));
