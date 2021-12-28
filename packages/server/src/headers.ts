import http from 'http';

export function processHeaders(headers: http.IncomingHttpHeaders) {
    console.log('Received Headers');
    console.log(headers);
}
