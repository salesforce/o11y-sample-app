// Simple Express server setup to serve for local testing/dev API server
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { URL } from 'url';
import { processCoreEnvelope } from './coreEnvelope';
import { processHeaders } from './headers';

const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 3002;
const SERVE_WEB = process.env.O11Y_SERVE_WEB === 'true' || false;
const LOG_HEADERS = process.env.O11Y_LOG_HEADERS === 'true' || false;
const __dirname = new URL('.', import.meta.url).pathname;
const DIST_DIR = path.resolve(__dirname, '..', 'dist-client');

const app = express();

if (!SERVE_WEB) {
    app.use(cors());
}

// .use(bodyParser.urlencoded({
//     extended: true
// }))
// .use(express.json({
//     extended: true,
//     inflate: true,
//     limit: '100kb',
//     parameterLimit: 1000,
//     strict: false,
//     //type: 'application/x-www-form-urlencoded',
//     type: 'application/json',
//     verify: undefined
// }))

app.use(
    bodyParser.json({
        type: 'application/json'
    })
)
    .use(
        bodyParser.raw({
            type: 'application/octet-stream'
        })
    )
    .post('/api/uitelemetry', (req: express.Request, res: express.Response) => {
        console.log(' ');
        console.log('---------------------------------------------------------');
        console.log('Received call to /api/uitelemetry');
        try {
            if (LOG_HEADERS) {
                processHeaders(req.headers);
            }
            if (processCoreEnvelope(req.body)) {
                res.json({ success: true });
            } else {
                res.status(400).send();
            }
        } catch (err) {
            console.log(err);
            res.status(422).json({ error: err });
        }
    })
    .get('/api/isodate', (_req: express.Request, res: express.Response) => {
        console.log(' ');
        console.log('---------------------------------------------------------');
        console.log('Received call to /api/isodate');
        res.send(new Date().toISOString());
    });

if (SERVE_WEB) {
    app.use(express.static(DIST_DIR));
}

app.listen(PORT, () => {
    if (SERVE_WEB) {
        console.log(`✅  Web Server started: http://${HOST}:${PORT}`);
    }
    console.log(`✅  API Server started: http://${HOST}:${PORT}/api/uitelemetry`);
});
