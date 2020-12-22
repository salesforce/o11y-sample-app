// Simple Express server setup to serve for local testing/dev API server
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const processCoreEnvelope = require('./coreEnvelope').processCoreEnvelope;

const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 3002;

express()
    .use(helmet())
    .use(compression())
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
            processCoreEnvelope(req.body);
            res.json({ success: true });
        } catch (err) {
            console.log(err);
            res.status(422).json({ error: err });
        }
    })
    .listen(PORT, () =>
        console.log(
            `✅  API Server started: http://${HOST}:${PORT}/api/uitelemetry`
        )
    );
