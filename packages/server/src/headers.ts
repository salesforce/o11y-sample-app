import http from 'http';

export function processHeaders(headers: http.IncomingHttpHeaders) {
    console.log('HTTP HEADERS');
    console.log(headers);
}
