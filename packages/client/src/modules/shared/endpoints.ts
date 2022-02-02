const PLACEHOLDER = 'PLACEHOLDER';
const LOCALHOST = 'localhost';
const QUERY_RETURN_LOGS = 'returnlogs';
const QUERY_RETURN_LOGS_AS_JSON = 'returnlogsasjson';

class Endpoints {
    private readonly _coreDefaultVersion = 'v52.0';
    private readonly _coreTelemetryEndpointFormat = `/services/data/${PLACEHOLDER}/connect/proxy/ui-telemetry`;
    private readonly _sampleTelemetryEndpoint = '/api/uitelemetry';
    private readonly _sampleIsoDateEndpoint = '/api/isodate';
    private readonly _coreGetUserSessionEndpoint = '/qa/getUserSession.jsp';
    private readonly _sampleLocalWebPort = '3001'; // As defined in server.js
    private readonly _sampleLocalApiPort = '3002';
    private readonly _coreHttpPort = '6109';
    private readonly _coreHttpsPort = '6101';
    private readonly _hostname: string;
    private readonly _isOriginSecure: boolean;
    private readonly _runtimeApiPort: string;

    constructor() {
        const loc = window.location;

        this._hostname = loc.hostname;
        this._isOriginSecure = loc.protocol === 'https:';
        this._runtimeApiPort =
            loc.port === this._sampleLocalWebPort ? this._sampleLocalApiPort : loc.port;
    }

    private _getHttpUrl(
        isSecure: boolean,
        hostname: string,
        port?: string,
        path?: string,
        query?: Record<string, string>
    ): string {
        const protocolText: string = isSecure ? 'https://' : 'http://';
        const portText = port ? `:${port}` : '';
        path = path === undefined ? '' : path;
        let qp = '';
        if (query) {
            const qps = [];
            for (const key in query) {
                qps.push(`${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`);
            }
            if (qps.length) {
                qp = '?' + qps.join('&');
            }
        }
        return `${protocolText}${hostname}${portText}${path}${qp}`;
    }

    get sampleIsoDateEndpoint(): string {
        return this._getHttpUrl(
            this._isOriginSecure,
            this._hostname,
            this._runtimeApiPort,
            this._sampleIsoDateEndpoint
        );
    }
    get sampleTelemetryEndpoint(): string {
        return this._getHttpUrl(
            this._isOriginSecure,
            this._hostname,
            this._runtimeApiPort,
            this._sampleTelemetryEndpoint
        );
    }

    get sampleTelemetryEndpointWithTextReturn(): string {
        const qp: Record<string, string> = {};
        qp[QUERY_RETURN_LOGS] = 'true';

        return this._getHttpUrl(
            this._isOriginSecure,
            this._hostname,
            this._runtimeApiPort,
            this._sampleTelemetryEndpoint,
            qp
        );
    }

    get sampleTelemetryEndpointWithJsonReturn(): string {
        const qp: Record<string, string> = {};
        qp[QUERY_RETURN_LOGS_AS_JSON] = 'true';

        return this._getHttpUrl(
            this._isOriginSecure,
            this._hostname,
            this._runtimeApiPort,
            this._sampleTelemetryEndpoint,
            qp
        );
    }

    getCoreTelemetryEndpoint(isSecure: boolean, versionText?: string): string {
        const port: string = isSecure ? this._coreHttpsPort : this._coreHttpPort;
        const path: string = this._coreTelemetryEndpointFormat.replace(
            PLACEHOLDER,
            versionText || this._coreDefaultVersion
        );
        return this._getHttpUrl(isSecure, LOCALHOST, port, path);
    }

    getCoreQaGetSessionEndpoint(isSecure: boolean): string {
        const port: string = isSecure ? this._coreHttpsPort : this._coreHttpPort;
        return this._getHttpUrl(isSecure, LOCALHOST, port, this._coreGetUserSessionEndpoint);
    }
}

export const endpoints = new Endpoints();
