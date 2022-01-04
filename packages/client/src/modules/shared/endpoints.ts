const PLACEHOLDER = 'PLACEHOLDER';
const LOCALHOST = 'localhost';

class Endpoints {
    private readonly _coreDefaultVersion = 'v52.0';
    private readonly _coreTelemetryEndpointFormat = `/services/data/${PLACEHOLDER}/connect/proxy/ui-telemetry`;
    private readonly _sampleTelemetryEndpoint = '/api/uitelemetry';
    private readonly _sampleIsoDateEndpoint = '/api/isodate';
    private readonly _coreGetUserSessionEndpoint = '/qa/getUserSession.jsp';
    private readonly _sampleApiPort = 3002;
    private readonly _coreHttpPort = 6109;
    private readonly _coreHttpsPort = 6101;
    private readonly _hostname: string = window.location.hostname;
    private readonly _isOriginSecure = window.location.protocol === 'https:';

    private _getHttpUrl(isSecure: boolean, hostname: string, port?: number, path?: string): string {
        const protocolText: string = isSecure ? 'https://' : 'http://';
        const portText = port === undefined ? '' : `:${port}`;
        path = path === undefined ? '' : path;
        return `${protocolText}${hostname}${portText}${path}`;
    }

    get sampleIsoDateEndpoint(): string {
        return this._getHttpUrl(
            this._isOriginSecure,
            this._hostname,
            this._sampleApiPort,
            this._sampleIsoDateEndpoint
        );
    }
    get sampleTelemetryEndpoint(): string {
        return this._getHttpUrl(
            this._isOriginSecure,
            this._hostname,
            this._sampleApiPort,
            this._sampleTelemetryEndpoint
        );
    }

    getCoreTelemetryEndpoint(isSecure: boolean, versionText?: string): string {
        const port: number = isSecure ? this._coreHttpsPort : this._coreHttpPort;
        const path: string = this._coreTelemetryEndpointFormat.replace(
            PLACEHOLDER,
            versionText || this._coreDefaultVersion
        );
        return this._getHttpUrl(isSecure, LOCALHOST, port, path);
    }

    getCoreQaGetSessionEndpoint(isSecure: boolean): string {
        const port: number = isSecure ? this._coreHttpsPort : this._coreHttpPort;
        return this._getHttpUrl(isSecure, LOCALHOST, port, this._coreGetUserSessionEndpoint);
    }
}

export const endpoints = new Endpoints();
