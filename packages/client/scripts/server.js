// Simple Express server setup to serve the build output

// TODO:
// const compression = require('compression');
// const helmet = require('helmet');

const express = require('express');
const path = require('path');

const app = express();

// TODO:
// app.use(helmet());
// app.use(compression());

const HOST = process.env.WEB_HOST || process.env.HOST || 'localhost';
const PORT = process.env.WEB_PORT || process.env.PORT || 3001;
const DIST_DIR = path.resolve(__dirname, '..', '..', '..', 'dist-client');

app.use(express.static(DIST_DIR))
    .use('*', (_req, res) => {
        res.sendFile(path.resolve(DIST_DIR, 'index.html'));
    })
    .listen(PORT, () => console.log(`✅  Web Server started: http://${HOST}:${PORT}`));
