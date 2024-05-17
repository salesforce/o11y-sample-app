import { api } from 'lwc';
import QueryBase from './queryBase';
import { Tag } from '../types/Tag';

const enum MetricType {
    logCount = 'log.COUNT.Count',
    errorCount = 'error.COUNT.Count',
    domEventCount = 'domEvent.COUNT.Count',
    PerCount = 'PERCENTILE_SET.Count',
    PerP50 = 'PERCENTILE_SET.p50th',
    PerP90 = 'PERCENTILE_SET.p90th',
    PerP95 = 'PERCENTILE_SET.p95th',
    PerP99 = 'PERCENTILE_SET.p99th',
    HistogramAvg = 'HISTOGRAM.Average',
    HistogramMax = 'HISTOGRAM.Max'
}

export default abstract class ArgusQueryBase extends QueryBase {
    constructor() {
        super();
        this.earliest = '-1d'; // -7d seems to be more likely to cause an error
        this.bucketSize = '30m';
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

    private _hostId: string;
    @api
    get hostId(): string {
        return this._hostId;
    }
    set hostId(value: string) {
        this._hostId = value;
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

    private _useWorkaround: boolean;
    @api
    get useWorkaround(): boolean {
        return this._useWorkaround;
    }
    set useWorkaround(value: boolean) {
        this._useWorkaround = value;
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
        let tokens: string[] = [scopePrefix];

        if (this.loggerAppName && this.loggerAppName !== '*') {
            tokens.push(this.argusEncode(this.loggerAppName));
        } else {
            tokens.push('*');
        }

        if (this.hostId) {
            tokens.push(this.argusEncode(this.hostId));
        } else {
            tokens.push('*');
        }

        if (this.useWorkaround) {
            // There is some inconsistency in the way the metric name is encoded for certain cases.
            // For exmple, the scope starts with core_ui_ instead of core.ui.
            const firstTwo = tokens.splice(0, 2);
            tokens.unshift(firstTwo.join('_'));
            return tokens.join('.');
        }

        return tokens.join('.');
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
        let tokens: string[] = [];

        if (this.loggerName) {
            tokens.push(this.argusEncode(this.loggerName));
        } else {
            tokens.push('*');
        }

        if (this.useWorkaround) {
            tokens.push('-');
            tokens.push('-');
        }

        if (this.metricName) {
            tokens.push(this.argusEncode(this.metricName));
        } else if (this.useWorkaround) {
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
            query = `${this.grouper}(${query})`;
        }
        return query;
    }
}
