import http from 'http';

export function processHeaders(
    headers: http.IncomingHttpHeaders,
    logMethod?: (...params: unknown[]) => void
) {
    logMethod = logMethod ?? console.log.bind(console);
    logMethod('HTTP HEADERS');
    logMethod(headers);
}
