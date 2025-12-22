/* eslint import/no-nodejs-modules: "off" */
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = path.dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = path.resolve(serverDistFolder, '../browser');
  const indexHtml = path.join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html',
    }),
  );

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then(html => res.send(html))
      .catch(error => {
        next(error);
      });
  });

  return server;
}

const DEFAULT_PORT = 4000;

function run(): void {
  const port = process.env['PORT'] ?? DEFAULT_PORT;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.info(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
