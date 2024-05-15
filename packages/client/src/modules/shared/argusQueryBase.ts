import { api } from 'lwc';
import QueryBase from './queryBase';
import { Tag } from '../types/Tag';

const enum MetricType {
    StdCount = 'STANDARD.Count',
    StdAverage = 'STANDARD.Average',
    StdMaximum = 'STANDARD.Max',
    StdTotal = 'STANDARD.Total',
    PerCount = 'PERCENTILE_SET.Count',
    PerErrorCount = 'PERCENTILE_SET.Error.Count',
    PerP90 = 'PERCENTILE_SET.p90th',
    PerP95 = 'PERCENTILE_SET.p95th',
    PerP99 = 'PERCENTILE_SET.p99th',
    PerTotal = 'PERCENTILE_SET.Total'
}

export default abstract class ArgusQueryBase extends QueryBase {
    constructor() {
        super();
        this.earliest = '-2d'; // -7d seems to be more likely to cause an error
        this.bucketSize = '1h';
        this.language = 'language-plaintext';
    }

    private _metricName: string;
    @api
    get metricName(): string {
        return this._metricName;
    }
    set metricName(value: string) {
        this._metricName = value;
        this.updateQuery();
    }

    private _metricType: MetricType;
    @api
    get metricType(): MetricType {
        return this._metricType;
    }
    set metricType(value: MetricType) {
        this._metricType = value;
        this.updateQuery();
    }

    private _tags: Tag[];
    @api
    get tags(): Tag[] {
        return this._tags;
    }
    set tags(value: Tag[]) {
        this._tags = value;
        this.updateQuery();
    }

    private _aggregator: string;
    @api
    get aggregator(): string {
        return this._aggregator;
    }
    set aggregator(value: string) {
        this._aggregator = value;
        this.updateQuery();
    }

    private _downsampler: string;
    @api
    get downsampler(): string {
        return this._downsampler;
    }
    set downsampler(value: string) {
        this._downsampler = value;
        this.updateQuery();
    }

    private _grouper: string;
    @api
    get grouper(): string {
        return this._grouper;
    }
    set grouper(value: string) {
        this._grouper = value;
        this.updateQuery();
    }

    private _bucketSize: string;
    @api
    get bucketSize(): string {
        return this._bucketSize;
    }
    set bucketSize(value: string) {
        this._bucketSize = value;
        this.updateQuery();
    }

    private _hasError: boolean | undefined;
    @api
    get hasError(): boolean | undefined {
        return this._hasError;
    }
    set hasError(value: boolean | undefined) {
        this._hasError = value;
        this.updateQuery();
    }

    protected argusEncode(text: string) {
        // valid values: a to z, A to Z, 0 to 9, -, _, .,/
        const validChars = new Set([
            ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)), // a-z
            ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // A-Z
            ...Array.from({ length: 10 }, (_, i) => String.fromCharCode(48 + i)), // 0-9
            '-',
            '_',
            '.',
            '/'
        ]);

        const mod = [];
        for (let i = 0; i < text.length; i++) {
            if (validChars.has(text[i])) {
                mod.push(text[i]);
            } else {
                mod.push('__');
            }
        }

        return mod.join('');
    }

    protected updateQuery(): void {
        let query = this.getQuery();
        if (this.query !== query) {
            this.query = query;
        }
    }

    private getScope(scopePrefix: string): string {
        let scope = scopePrefix;
        if (this.loggerAppName !== '*') {
            scope += `.${this.loggerAppName}.`;
        }
        scope = this.argusEncode(scope) + '*';
        return scope;
    }

    private getTagsText(): string {
        const getPair = (key: string, value: string): string =>
            `${this.argusEncode(key)}=${this.argusEncode(value)}`;

        const tagSet = new Set<string>(
            this.tags
                ?.filter((tag) => tag.value !== undefined && tag.value !== null)
                .map((tag) => getPair(tag.key, tag.value))
        );

        if (this.loggerAppName && this.loggerAppName !== '*') {
            tagSet.add(getPair('o11yApp', this.loggerAppName));
        }

        if (this.schemaId) {
            tagSet.add(getPair('schemaId', this.schemaId));
        }
        if (this.hasError !== undefined && this.hasError !== null) {
            tagSet.add(getPair('status', this.hasError ? 'error' : 'success'));
        }

        return tagSet.size ? `{${Array.from(tagSet).join(',')}}` : '';
    }

    protected getMetricName(): string {
        if (this.metricName) {
            return this.argusEncode(this.metricName);
        }

        let tokens: string[] = [];
        if (this.loggerName) {
            tokens.push(this.argusEncode(this.loggerName));
        } else {
            tokens.push('*');
        }

        tokens.push(this.metricType);

        const metricName = tokens.join('.');
        return metricName;
    }

    protected getQuery(): string {
        const latest = '-5m';
        const scopePrefix = 'core_ui';

        const scope = this.getScope(scopePrefix);
        const tagsText = this.getTagsText();
        const metricName = this.getMetricName();

        let query = `${this.earliest}:${latest}:${scope}:${metricName}${tagsText}:${this.aggregator}:${this.bucketSize}-${this.downsampler}`;

        if (this.grouper) {
            const regex = `#(^${scopePrefix})#`;
            const group = `#${this.grouper}#`;
            query = `GROUPBY(${query},${regex},${group})`;
        }
        return query;
    }
}
