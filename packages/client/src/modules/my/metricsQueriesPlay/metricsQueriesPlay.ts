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
    oneRootActivity = 'oneRootActivity',
    oneWebVitalsFCP = 'oneWebVitalsFCP',
    oneWebVitalsINP = 'oneWebVitalsINP',
    oneWebVitalsLCP = 'oneWebVitalsLCP',
    oneWebVitalsTTFB = 'oneWebVitalsTTFB',
    oneNavigationTimingLegacy = 'oneNavigationTimingLegacy',
    oneResourceTimingLegacy = 'oneResourceTimingLegacy',
    oneNavigationTiming = 'oneNavigationTiming',
    oneResourceTiming = 'oneResourceTiming',
    oneXhrSend = 'oneXhrSend',
    oneFetch = 'oneFetch',
    clwrRootActivity = 'clwrRootActivity',
    clwrNav = 'clwrNav',
    clwrNavTansition = 'clwrNavTansition',
    clwrWebVitalsFCP = 'clwrWebVitalsFCP',
    clwrWebVitalsINP = 'clwrWebVitalsINP',
    clwrWebVitalsLCP = 'clwrWebVitalsLCP',
    clwrWebVitalsTTFB = 'clwrWebVitalsTTFB',
    clwrNavigationTimingLegacy = 'clwrNavigationTimingLegacy',
    clwrResourceTimingLegacy = 'clwrResourceTimingLegacy',
    clwrNavigationTiming = 'clwrNavigationTiming',
    clwrResourceTiming = 'clwrResourceTiming',
    clwrXhrSend = 'clwrXhrSend',
    clwrFetch = 'clwrFetch'
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
    // key                              label                                loggerAppName     loggerName        activityName             schemaId                                hasError useGrouper                                    
    [presets.oneRootActivity,          ['LEX, root activity',               'one:one',        'one:one',        'LexRootActivity',       'sf.lex.ScenarioTracker',               null,    true]],    
    [presets.oneWebVitalsFCP,          ['LEX, WebVitals, FCP',              'one:one',        'WebVitals',      'FCP',                   'sf.instrumentation.WebVitals',         null,    true]],
    [presets.oneWebVitalsINP,          ['LEX, WebVitals, INP',              'one:one',        'WebVitals',      'INP',                   'sf.instrumentation.WebVitals',         null,    true]],
    [presets.oneWebVitalsLCP,          ['LEX, WebVitals, LCP',              'one:one',        'WebVitals',      'LCP',                   'sf.instrumentation.WebVitals',         null,    true]],
    [presets.oneWebVitalsTTFB,         ['LEX, WebVitals, TTFB',             'one:one',        'WebVitals',      'TTFB',                  'sf.instrumentation.WebVitals',         null,    true]],
    [presets.oneNavigationTimingLegacy,['LEX, navigation timing (-248)',    'one:one',        'Network',        'perf_timing',           'sfcore.performance.NavigationTiming',  null,    true]],
    [presets.oneNavigationTiming,      ['LEX, navigation timing (250-)',    'one:one',        'Network',        'network',               'sfcore.performance.NavigationTiming',  null,    true]],
    [presets.oneResourceTimingLegacy,  ['LEX, resource timing (-248)',      'one:one',        'Network',        'perf_timing',           'sfcore.performance.ResourceTiming',    null,    true]],
    [presets.oneResourceTiming,        ['LEX, resource timing (250-)',      'one:one',        'Network',        'network',               'sfcore.performance.ResourceTiming',    null,    true]],
    [presets.oneXhrSend,               ['LEX, XMLHttpRequest send',         'one:one',        'Network',        'xhr_send',              'sf.instrumentation.Network',           null,    true]],    
    [presets.oneFetch,                 ['LEX, fetch',                       'one:one',        'Network',        'fetch',                 'sf.instrumentation.Network',           null,    true]],
    [presets.clwrRootActivity,         ['CLWR, root activity',              'lwr_experience', 'lwr_experience', 'root',                  'sf.clwr.Root',                         null,    true]],
    [presets.clwrNav,                  ['CLWR, page navigation',            'lwr_experience', 'lwr_experience', 'navigation',            'sf.clwr.Nav',                          null,    true]],          
    [presets.clwrNavTansition,         ['CLWR, page navigation transition', 'lwr_experience', 'lwr_experience', 'navigation transition', 'sf.clwr.NavTransition',                null,    true]],          
    [presets.clwrWebVitalsFCP,         ['CLWR, WebVitals, FCP',             'lwr_experience', 'WebVitals',      'FCP',                   'sf.instrumentation.WebVitals',         null,    true]],
    [presets.clwrWebVitalsINP,         ['CLWR, WebVitals, INP',             'lwr_experience', 'WebVitals',      'INP',                   'sf.instrumentation.WebVitals',         null,    true]],
    [presets.clwrWebVitalsLCP,         ['CLWR, WebVitals, LCP',             'lwr_experience', 'WebVitals',      'LCP',                   'sf.instrumentation.WebVitals',         null,    true]],
    [presets.clwrWebVitalsTTFB,        ['CLWR, WebVitals, TTFB',            'lwr_experience', 'WebVitals',      'TTFB',                  'sf.instrumentation.WebVitals',         null,    true]],
    [presets.clwrNavigationTiming,     ['CLWR, navigation timing',          'lwr_experience', 'Network',        'perf_timing',           'sfcore.performance.NavigationTiming',  null,    true]],
    [presets.clwrResourceTiming,       ['CLWR, resource timing',            'lwr_experience', 'Network',        'perf_timing',           'sfcore.performance.ResourceTiming',    null,    true]],
    [presets.clwrXhrSend,              ['CLWR, XMLHttpRequest send',        'lwr_experience', 'Network',        'xhr_send',              'sf.instrumentation.Network',           null,    true]],    
    [presets.clwrFetch,                ['CLWR, fetch',                      'lwr_experience', 'Network',        'fetch',                 'sf.instrumentation.Network',           null,    true]],
       
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
    selectedLoggerAppName: string;

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

    @track
    daysOptions: ComboBoxOption[];

    @track
    selectedDays: string;

    constructor() {
        super();
        this.schemaOptions = Array.from(schemas.keys())
            .filter((name) => !schemaUtil.isInternal(name))
            .map((name) => ({
                label: name,
                value: name
            }));
        this.schemaOptions.unshift({ label: '(None)', value: undefined });

        this.presetOptions = Array.from(presetValues.entries())
            .map(([key, value]) => ({
                value: key,
                label: value[0] as string
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
        this.presetOptions.unshift({ label: '(None)', value: undefined });

        this.daysOptions = [
            {
                label: 'Last 1 day',
                value: '-1d'
            },
            {
                label: 'Last 2 days',
                value: '-2d'
            },
            {
                label: 'Last 3 days',
                value: '-3d'
            },
            {
                label: 'Last 4 days',
                value: '-4d'
            },
            {
                label: 'Last 5 days',
                value: '-5d'
            },
            {
                label: 'Last 6 days',
                value: '-6d'
            },
            {
                label: 'Last 7 days',
                value: '-7d'
            },
            {
                label: 'Last 10 days',
                value: '-10d'
            },
            {
                label: 'Last 15 days',
                value: '-15d'
            }
        ];
        this.selectedDays = '-2d';
    }

    private unsetPreset() {
        this.selectedPreset = undefined;
    }

    handleDaysChange(event: CustomEvent) {
        this.selectedDays = event.detail.value;
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
