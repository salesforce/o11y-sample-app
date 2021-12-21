// Simple Express server setup to serve for local testing/dev API server
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { processCoreEnvelope } from './coreEnvelope';
import { processHeaders } from './headers';

const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 3002;

express()
    .use(cors())
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
    .post('/api/uitelemetry', (req, res) => {
        console.log(' ');
        try {
            processHeaders(req.headers);
            processCoreEnvelope(req.body);
            res.json({ success: true });
        } catch (err) {
            console.log(err);
            res.status(422).json({ error: err });
        }
    })
    .get('/api/isodate', (req, res) => {
        console.log(' ');
        console.log('Received call to /api/test');
        res.send(new Date().toISOString());
    })
    .listen(PORT, () =>
        console.log(
            `✅  API Server started: http://${HOST}:${PORT}/api/uitelemetry`
        )
    );
