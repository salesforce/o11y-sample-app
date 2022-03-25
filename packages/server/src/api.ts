// Simple Express server setup to serve for local testing/dev API server
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { HelmetOptions } from 'helmet/dist/types/index';

import path from 'path';
import { URL } from 'url';
import { processCoreEnvelope } from './coreEnvelope';
import { tryServe } from './tryServe';
import { LogBuilder } from './interfaces/LogBuilder';

const HOST = process.env.API_HOST || process.env.HOST || 'localhost';
const PORT = process.env.API_PORT || process.env.PORT || 3002;
const SERVE_WEB = process.env.O11Y_SERVE_WEB === 'true' || false;
const LOG_HEADERS = process.env.O11Y_LOG_HEADERS === 'true' || false;
const __dirname = new URL('.', import.meta.url).pathname;
const DIST_DIR = path.resolve(__dirname, '..', 'dist-client');

const helmetOptions: HelmetOptions = {};
if (SERVE_WEB) {
    // NOTE: Make sure to test any changes you make to these options by
    // hard-reloading the web page, even if it seems to work otherwise.
    Object.assign(helmetOptions, {
        contentSecurityPolicy: false
    } as HelmetOptions);
}

const app = express()
    .use(cors())
    .use(helmet(helmetOptions))
    .use(
        bodyParser.json({
            type: 'application/json'
        })
    )
    .use(
        bodyParser.raw({
            type: 'application/octet-stream'
        })
    )
    .use(bodyParser.text())
    .post('/api/uitelemetry', (req: express.Request, res: express.Response) => {
        // This endpoint expects a binary inside the request body
        console.log(' ');
        console.log('---------------------------------------------------------');
        console.log('Received call to /api/uitelemetry');

        tryServe(req, res, LOG_HEADERS, (body: Uint8Array, logBuilder?: LogBuilder) => {
            const options = logBuilder?.getCoreEnvelopeProcessingOptions();
            return processCoreEnvelope(body, options);
        });
    })
    .post('/api/uitelemetry_csv', (req: express.Request, res: express.Response) => {
        // This endpoint expects plain text inside the request body, in the form of a UInt8Array CSV
        // (The CSV can contain signed integers)
        console.log(' ');
        console.log('---------------------------------------------------------');
        console.log('Received call to /api/uitelemetry_csv');

        tryServe(
            req,
            res,
            LOG_HEADERS,
            (body: string, logBuilder?: LogBuilder) => {
                const lines: number[] = body.split(',').map((text) => parseInt(text));
                const data = new Uint8Array(lines);
                const options = logBuilder?.getCoreEnvelopeProcessingOptions();
                return processCoreEnvelope(data, options);
            },
            (req) => typeof req.body === 'string' && req.body.trim().length > 0
        );
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
    console.log(`✅  API Server started: http://${HOST}:${PORT} with endpoints:`);
    app._router.stack.forEach((r: any) => {
        if (r.route && r.route.path) {
            console.log(`- ${r.route.path}`);
        }
    });
});
