/* eslint import/no-nodejs-modules: "off" */
import {
  AngularNodeAppEngine,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = path.dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = path.resolve(serverDistFolder, '../browser');

  const angularApp = new AngularNodeAppEngine();

  // Serve static files from /browser
  server.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
    }),
  );

  // All routes use the Angular engine
  server.use((req, res, next) => {
    angularApp
      .handle(req)
      .then(response => {
        if (response) {
          writeResponseToNodeResponse(response, res);
        } else {
          next();
        }
      })
      .catch(next);
  });

  return server;
}

const DEFAULT_PORT = 4000;

const server = app();

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] ?? DEFAULT_PORT;

  server.listen(port, () => {
    console.info(`Node Express server listening on http://localhost:${port}`);
  });
}
