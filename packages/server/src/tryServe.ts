import type express from 'express';
import type { ApiResponse } from './interfaces/ApiResponse';
import { processHeaders } from './headers';
import { TextLogBuilder } from './textLogBuilder';
import { JsonLogBuilder } from './jsonLogBuilder';
import { LogBuilder } from './interfaces/LogBuilder';

const QUERY_RETURN_LOGS = 'returnlogs';
const QUERY_RETURN_LOGS_AS_JSON = 'returnlogsasjson';

export function tryServe<T>(
    req: express.Request,
    res: express.Response,
    logHeaders: boolean,
    serverFunc: (body: T, logBuilder?: LogBuilder) => boolean,
    prereqFunc?: (req: express.Request) => boolean
): void {
    let result: ApiResponse;
    let logBuilder: LogBuilder;

    try {
        if (!prereqFunc || prereqFunc(req)) {
            if (req.query[QUERY_RETURN_LOGS]) {
                logBuilder = new TextLogBuilder({ jsonIndent: 4 });
            } else if (req.query[QUERY_RETURN_LOGS_AS_JSON]) {
                logBuilder = new JsonLogBuilder();
            }
            if (logHeaders) {
                processHeaders(req.headers, logBuilder?.log.bind(logBuilder));
            }
            if (serverFunc(req.body, logBuilder)) {
                result = {
                    success: true,
                    data: logBuilder?.get()
                };
                res.json(result);
                return;
            }
        }
        console.warn('STATUS: 400');
        res.status(400).send();
    } catch (err: unknown) {
        console.error(err);
        result = {
            error: err instanceof Error ? err.stack : err,
            data: logBuilder?.get()
        };
        res.status(422).json(result);
    }
}
