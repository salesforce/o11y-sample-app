// Simple Express server setup to serve the build output

const express = require('express');
const helmet = require('helmet');
const path = require('path');

const HOST = process.env.WEB_HOST || process.env.HOST || 'localhost';
const PORT = process.env.WEB_PORT || process.env.PORT || 3001;
const DIST_DIR = path.resolve(__dirname, '..', '..', '..', 'dist-client');

const app = express()
    .use(
        helmet({
            // NOTE: Make sure to test any changes you make to these options by
            // hard-reloading the web page, even if it seems to work otherwise.
            contentSecurityPolicy: false
        })
    )
    .use(express.static(DIST_DIR))
    .use('*', (_req, res) => {
        res.sendFile(path.resolve(DIST_DIR, 'index.html'));
    })
    .listen(PORT, () => console.log(`✅  Web Server started: http://${HOST}:${PORT}`));
