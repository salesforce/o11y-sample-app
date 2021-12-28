// #LOOK:
// The sample app comes with a built-in Express webserver, that defaults to port 3002.
// You can set this to the salesforce endpoint in the form:
// {ServerUrl}/services/data/{API version}/connect/proxy/ui-telemetry
// Example: const apiEndpoint = 'https://{HOSTNAME}/services/data/v52.0/connect/proxy/ui-telemetry';
export const apiEndpoint = 'http://localhost:3002/api/uitelemetry';
export const isoDateEndpoint = 'http://localhost:3002/api/isodate'; // This doesn't have a Salesforce counterpart
