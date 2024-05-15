import { LightningElement, track } from 'lwc';

import { schemas } from '../../../../../_common/generated/schema';
import { schemaUtil } from '../../../../../_common/src/schemaUtil';
import type { ComboBoxOption } from '../../types/ComboBoxOption';

type Query = {
    key: string;
    label: string;
    name: string;
    query: string;
    cssClass?: string;
};

const enum presets {
    lexRootActivity = 'lexRootActivity',
    webVitalsFCP = 'webVitalsFCP',
    webVitalsINP = 'webVitalsINP',
    webVitalsLCP = 'webVitalsLCP',
    webVitalsTTFB = 'webVitalsTTFB',
    navigationTimingLegacy = 'navigationTimingLegacy',
    resourceTimingLegacy = 'resourceTimingLegacy',
    navigationTiming = 'navigationTiming',
    resourceTiming = 'resourceTiming',
    xhrSend = 'xhrSend',
    fetch = 'fetch'
}

// The array values are positioned based on the following order:
// 0. label
// 1. loggerAppName
// 2. loggerName
// 3. activityName (use '' for no activityName)
// 4. schemaId (use '' for no schemaId)
// 5. hasError (use null for any, true for true, false for false)
// 6. useGrouper (true/false)
// prettier-ignore
const presetValues = new Map<string, Array<string | boolean | null>>([
    [presets.lexRootActivity,       ['one:one, LexRootActivity',          'one:one', 'one:one',   'LexRootActivity', 'sf.instrumentation.ScenarioTracker',   null,  true]],    
    [presets.webVitalsFCP,          ['one:one, WebVitals, FCP',           'one:one', 'WebVitals', 'FCP',             'sf.instrumentation.WebVitals',         null,  true]],
    [presets.webVitalsINP,          ['one:one, WebVitals, INP',           'one:one', 'WebVitals', 'INP',             'sf.instrumentation.WebVitals',         null,  true]],
    [presets.webVitalsLCP,          ['one:one, WebVitals, LCP',           'one:one', 'WebVitals', 'LCP',             'sf.instrumentation.WebVitals',         null,  true]],
    [presets.webVitalsTTFB,         ['one:one, WebVitals, TTFB',          'one:one', 'WebVitals', 'TTFB',            'sf.instrumentation.WebVitals',         null,  true]],
    [presets.navigationTimingLegacy,['one:one, navigation timing (-248)', 'one:one', 'Network',   'perf_timing',     'sfcore.performance.NavigationTiming',  null,  true]],
    [presets.navigationTiming,      ['one:one, navigation timing (250-)', 'one:one', 'Network',   'network',         'sfcore.performance.NavigationTiming',  null,  true]],
    [presets.resourceTimingLegacy,  ['one:one, resource timing (-248)',   'one:one', 'Network',   'perf_timing',     'sfcore.performance.ResourceTiming',    null,  true]],
    [presets.resourceTiming,        ['one:one, resource timing (250-)',   'one:one', 'Network',   'network',         'sfcore.performance.ResourceTiming',    null,  true]],
    [presets.xhrSend,               ['one:one, XMLHttpRequest send',      'one:one', 'Network',   'xhr_send',        'sf.instrumentation.Network',           null,  true]],    
    [presets.fetch,                 ['one:one, fetch',                    'one:one', 'Network',   'fetch',           'sf.instrumentation.Network',           null,  true]],
]);

export default class MetricsQueriesPlay extends LightningElement {
    @track
    schemaOptions: ComboBoxOption[];

    @track
    selectedSchemaId: string;

    @track
    queries: Query[];

    @track
    classes: Record<string, string> = {};

    @track
    selectedLoggerAppName: string = 'one:one';

    @track
    selectedLoggerName: string;

    @track
    selectedActivityName: string;

    @track
    hasErrorLabel = 'any';

    @track
    hasError: boolean | null = null;

    @track
    private _useGrouper: boolean = true;
    get useGrouper(): boolean {
        return this._useGrouper;
    }
    set useGrouper(value: boolean) {
        this._useGrouper = value;
        if (this._useGrouper) {
            this.grouperSum = 'SUM';
            this.grouperAvg = 'AVERAGE';
            this.grouperMax = 'MAX';
        } else {
            this.grouperSum = undefined;
            this.grouperAvg = undefined;
            this.grouperMax = undefined;
        }
    }

    @track
    grouperSum: string = 'SUM';

    @track
    grouperAvg: string = 'AVERAGE';

    @track
    grouperMax: string = 'MAX';

    @track
    presetOptions: ComboBoxOption[];

    @track
    selectedPreset: string;

    constructor() {
        super();
        this.schemaOptions = Array.from(schemas.keys())
            .filter((name) => !schemaUtil.isInternal(name))
            .map((name) => ({
                label: name,
                value: name
            }));
        this.schemaOptions.unshift({ label: '(None)', value: undefined });

        this.presetOptions = Array.from(presetValues.entries()).map(([key, value]) => ({
            value: key,
            label: value[0] as string
        }));
        this.presetOptions.unshift({ label: '(None)', value: undefined });
    }

    private unsetPreset() {
        this.selectedPreset = undefined;
    }

    handleToggleSection(event: CustomEvent) {
        this.classes = {};
        this.classes[event.detail.openSections] = 'highlight';
    }

    handlePresetChange(event: CustomEvent) {
        this.selectedLoggerAppName = undefined;
        this.selectedLoggerName = undefined;
        this.selectedActivityName = undefined;
        this.selectedSchemaId = undefined;
        this.hasError = null;
        this.useGrouper = true;

        this.selectedPreset = event.detail.value;

        if (this.selectedPreset) {
            const values = presetValues.get(this.selectedPreset);
            if (!values) {
                throw new Error(`Unknown preset: ${this.selectedPreset}`);
            }
            this.selectedLoggerAppName = values[1] as string;
            this.selectedLoggerName = values[2] as string;
            this.selectedActivityName = values[3] as string;
            this.selectedSchemaId = values[4] as string;
            this.hasError = values[5] as boolean | null;
            this.useGrouper = values[6] as boolean;
        }
    }

    handleLoggerAppNameChange(event: CustomEvent) {
        this.unsetPreset();
        this.selectedLoggerAppName = event.detail.value;
    }

    handleLoggerNameChange(event: CustomEvent): void {
        this.unsetPreset();
        this.selectedLoggerName = event.detail.value;
    }

    handleActivityNameChange(event: CustomEvent): void {
        this.unsetPreset();
        this.selectedActivityName = event.detail.value;
    }

    handleSchemaChange(event: CustomEvent) {
        this.unsetPreset();
        this.selectedSchemaId = event.detail.value;
    }

    handleHasErrorClick() {
        this.unsetPreset();
        if (this.hasError === null) {
            this.hasError = true;
            this.hasErrorLabel = 'true';
        } else if (this.hasError === true) {
            this.hasError = false;
            this.hasErrorLabel = 'false';
        } else {
            this.hasError = null;
            this.hasErrorLabel = 'any';
        }
    }

    handleUseGrouperChange(event: CustomEvent): void {
        this.unsetPreset();
        this.useGrouper = Boolean(event.detail.checked);
    }
}
