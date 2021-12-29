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

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3001;
const DIST_DIR = path.resolve(__dirname, '..', '..', '..', 'dist-client');

app.use(express.static(DIST_DIR));

app.use('*', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => console.log(`✅  Server started: http://${HOST}:${PORT}`));
