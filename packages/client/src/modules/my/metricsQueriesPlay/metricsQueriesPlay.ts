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
    o11yError = 'o11yError',
    oneRootActivity = 'oneRootActivity',
    oneWebVitalsFCP = 'oneWebVitalsFCP',
    oneWebVitalsFCPLegacy = 'oneWebVitalsFCPLegacy',
    oneWebVitalsINP = 'oneWebVitalsINP', // INP doesn't have a legacy version
    oneWebVitalsLCP = 'oneWebVitalsLCP',
    oneWebVitalsLCPLegacy = 'oneWebVitalsLCPLegacy',
    oneWebVitalsLog = 'oneWebVitalsLog',
    oneWebVitalsTTFB = 'oneWebVitalsTTFB',
    oneWebVitalsTTFBLegacy = 'oneWebVitalsTTFBLegacy',
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
    clwrWebVitalsFCPLegacy = 'clwrWebVitalsFCPLegacy',
    clwrWebVitalsINP = 'clwrWebVitalsINP',
    clwrWebVitalsLCP = 'clwrWebVitalsLCP',
    clwrWebVitalsLCPLegacy = 'clwrWebVitalsLCPLegacy',
    clwrWebVitalsLog = 'clwrWebVitalsLog',
    clwrWebVitalsTTFB = 'clwrWebVitalsTTFB',
    clwrWebVitalsTTFBLegacy = 'clwrWebVitalsTTFBLegacy',
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
// 7. metricName
// prettier-ignore

const presetValues = new Map<string, Array<string | boolean | null>>([
    // key                              label                                      loggerAppName     loggerName        activityName             schemaId                               hasError useGrouper 
    [presets.o11yError,                ['o11y, explicit counter of API misuses',     '',               '',               '',                      '',                                     true,    false, 'o11y-error']],
    [presets.oneRootActivity,          ['LEX, root activity',                        'one:one',        'one:one',        'LexRootActivity',       'sf.lex.ScenarioTracker',               null,    true]],    
    [presets.oneWebVitalsFCP,          ['LEX, WebVitals activity FCP',               'one:one',        'WebVitals',      'FCP',                   'sf.instrumentation.WebVitals',         null,    true]],
    [presets.oneWebVitalsFCPLegacy,    ['LEX, WebVitals activity FCP (legacy)',      'one:one',        'WebVitals',      'FCP',                   '',                                     null,    true]],
    [presets.oneWebVitalsINP,          ['LEX, WebVitals activity INP',               'one:one',        'WebVitals',      'INP',                   'sf.instrumentation.WebVitals',         null,    true]],
    [presets.oneWebVitalsLCP,          ['LEX, WebVitals activity LCP',               'one:one',        'WebVitals',      'LCP',                   'sf.instrumentation.WebVitals',         null,    true]],
    [presets.oneWebVitalsLCPLegacy,    ['LEX, WebVitals activity LCP (legacy)',      'one:one',        'WebVitals',      'LCP',                   '',                                     null,    true]],
    [presets.oneWebVitalsLog,          ['LEX, WebVitals log CLS/FID',                'one:one',        'WebVitals',      '',                      'sf.instrumentation.WebVitals',         null,    true]],
    [presets.oneWebVitalsTTFB,         ['LEX, WebVitals activity TTFB',              'one:one',        'WebVitals',      'TTFB',                  'sf.instrumentation.WebVitals',         null,    true]],
    [presets.oneWebVitalsTTFBLegacy,   ['LEX, WebVitals activity TTFB (legacy)',     'one:one',        'WebVitals',      'TTFB',                  '',                                     null,    true]],
    [presets.oneNavigationTimingLegacy,['LEX, navigation timing activity (legacy)',  'one:one',        'Network',        'perf_timing',           'sfcore.performance.NavigationTiming',  null,    true]],
    [presets.oneNavigationTiming,      ['LEX, navigation timing activity',           'one:one',        'Network',        'network',               'sfcore.performance.NavigationTiming',  null,    true]],
    [presets.oneResourceTimingLegacy,  ['LEX, resource timing activity (legacy)',    'one:one',        'Network',        'perf_timing',           'sfcore.performance.ResourceTiming',    null,    true]],
    [presets.oneResourceTiming,        ['LEX, resource timing activity',             'one:one',        'Network',        'network',               'sfcore.performance.ResourceTiming',    null,    true]],
    [presets.oneXhrSend,               ['LEX, XMLHttpRequest activity',              'one:one',        'Network',        'xhr_send',              'sf.instrumentation.Network',           null,    true]],    
    [presets.oneFetch,                 ['LEX, fetch activity',                       'one:one',        'Network',        'fetch',                 'sf.instrumentation.Network',           null,    true]],
    [presets.clwrRootActivity,         ['CLWR, root activity',                       'lwr_experience', 'lwr_experience', 'root',                  'sf.clwr.Root',                         null,    true]],
    [presets.clwrNav,                  ['CLWR, page navigation activity',            'lwr_experience', 'lwr_experience', 'navigation',            'sf.clwr.Nav',                          null,    true]],          
    [presets.clwrNavTansition,         ['CLWR, page navigation transition activity', 'lwr_experience', 'lwr_experience', 'navigation transition', 'sf.clwr.NavTransition',                null,    true]],
    [presets.clwrWebVitalsFCP,         ['CLWR, WebVitals activity FCP',              'lwr_experience', 'WebVitals',      'FCP',                   'sf.instrumentation.WebVitals',         null,    true]],
    [presets.clwrWebVitalsFCPLegacy,   ['CLWR, WebVitals activity FCP (legacy)',     'lwr_experience', 'WebVitals',      'FCP',                   '',                                     null,    true]],
    [presets.clwrWebVitalsINP,         ['CLWR, WebVitals activity INP',              'lwr_experience', 'WebVitals',      'INP',                   'sf.instrumentation.WebVitals',         null,    true]],
    [presets.clwrWebVitalsLCP,         ['CLWR, WebVitals activity LCP',              'lwr_experience', 'WebVitals',      'LCP',                   'sf.instrumentation.WebVitals',         null,    true]],
    [presets.clwrWebVitalsLCPLegacy,   ['CLWR, WebVitals activity LCP (legacy)',     'lwr_experience', 'WebVitals',      'LCP',                   '',                                     null,    true]],
    [presets.clwrWebVitalsLog,         ['CLWR, WebVitals log CLS/FID',               'lwr_experience', 'WebVitals',      '',                      'sf.instrumentation.WebVitals',         null,    true]],              
    [presets.clwrWebVitalsTTFB,        ['CLWR, WebVitals activity TTFB',             'lwr_experience', 'WebVitals',      'TTFB',                  'sf.instrumentation.WebVitals',         null,    true]],
    [presets.clwrWebVitalsTTFBLegacy,  ['CLWR, WebVitals activity TTFB (legacy)',    'lwr_experience', 'WebVitals',      'TTFB',                  '',                                     null,    true]],
    [presets.clwrNavigationTiming,     ['CLWR, navigation timing',                   'lwr_experience', 'Network',        'perf_timing',           'sfcore.performance.NavigationTiming',  null,    true]],
    [presets.clwrResourceTiming,       ['CLWR, resource timing activity',            'lwr_experience', 'Network',        'perf_timing',           'sfcore.performance.ResourceTiming',    null,    true]],
    [presets.clwrXhrSend,              ['CLWR, XMLHttpRequest activity',             'lwr_experience', 'Network',        'xhr_send',              'sf.instrumentation.Network',           null,    true]],    
    [presets.clwrFetch,                ['CLWR, fetch activity',                      'lwr_experience', 'Network',        'fetch',                 'sf.instrumentation.Network',           null,    true]],
       
]);

// Name of hidden components to workaround the UI shortcomings of lightning-accordion
const hidden = 'hidden';

export default class MetricsQueriesPlay extends LightningElement {
    private isPresetChanging = false;

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
    selectedMetricName: string;

    @track
    selectedActivityName: string;

    @track
    private _hasError: boolean | null = null;
    get hasError(): boolean | null {
        return this._hasError;
    }
    set hasError(value: boolean | null) {
        this._hasError = value;
        this.hasErrorText = value === null ? 'any' : String(value);
    }

    @track
    hasErrorText = 'any'; // corresponds to the null value of _hasError

    @track
    hasErrorOptions: ComboBoxOption[] = [
        { value: 'any', label: 'any' },
        { value: 'true', label: 'true' },
        { value: 'false', label: 'false' }
    ];

    @track
    private _useGrouper = true;
    get useGrouper(): boolean {
        return this._useGrouper;
    }
    set useGrouper(value: boolean) {
        this._useGrouper = value;
        this.useGrouperText = String(value);
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
    useGrouperText = String(this._useGrouper);

    @track
    groupingOptions: ComboBoxOption[] = [
        { value: 'true', label: 'On - Collapses multiple timeseries into one (default)' },
        { value: 'false', label: 'Off' }
    ];

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
    daysOptions: ComboBoxOption[] = [
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

    @track
    selectedDays = '-1d';

    @track
    selectedHostId: string;

    @track
    activeSectionCountOfCalls = hidden;

    @track
    activeSectionActivityDurations = hidden;

    @track
    activeSectionExplicitMetrics = hidden;

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
        if (this.presetOptions.length !== presetValues.size) {
            throw new Error('Duplicate preset labels');
        }
        this.presetOptions.unshift({ label: '(None)', value: undefined });
    }

    private unsetPreset() {
        if (!this.isPresetChanging) {
            this.selectedPreset = undefined;
        }
    }

    handleDaysChange(event: CustomEvent) {
        this.selectedDays = event.detail.value;
    }

    handleToggleSection(event: CustomEvent) {
        const os = event.detail.openSections;
        let openSection = hidden;
        if (Array.isArray(os) && os.length > 0) {
            openSection = os[0];
        } else if (typeof os === 'string') {
            openSection = os;
        }

        this.classes = {};
        this.classes[openSection] = 'highlight';

        const accordion = (event.target as HTMLElement).getAttribute('data-accordion');

        switch (accordion) {
            case 'countOfCalls':
                this.activeSectionActivityDurations = hidden;
                this.activeSectionExplicitMetrics = hidden;

                setTimeout(() => {
                    // Use setTimeout to ensure that the accordion is closed before opening the next one
                    this.activeSectionCountOfCalls = openSection;
                }, 0);
                break;
            case 'durationsOfActivities':
                this.activeSectionCountOfCalls = hidden;
                this.activeSectionExplicitMetrics = hidden;

                setTimeout(() => {
                    this.activeSectionActivityDurations = openSection;
                }, 0);
                break;
            case 'explicitMetrics':
                this.activeSectionCountOfCalls = hidden;
                this.activeSectionActivityDurations = hidden;

                setTimeout(() => {
                    this.activeSectionExplicitMetrics = openSection;
                }, 0);
                break;
            default:
                throw new Error(`Unknown accordion: ${accordion}`);
        }
    }

    handlePresetChange(event: CustomEvent) {
        this.selectedLoggerAppName = undefined;
        this.selectedLoggerName = undefined;
        this.selectedActivityName = undefined;
        this.selectedSchemaId = undefined;
        this.hasError = null;
        this.useGrouper = true;
        this.selectedMetricName = undefined;

        this.selectedPreset = event.detail.value;

        if (this.selectedPreset) {
            const values = presetValues.get(this.selectedPreset);
            if (!values) {
                throw new Error(`Unknown preset: ${this.selectedPreset}`);
            }
            this.isPresetChanging = true;
            this.selectedLoggerAppName = values[1] as string;
            this.selectedLoggerName = values[2] as string;
            this.selectedActivityName = values[3] as string;
            this.selectedSchemaId = values[4] as string;
            this.hasError = values[5] as boolean | null;
            this.useGrouper = values[6] as boolean;
            this.selectedMetricName = values[7] as string;

            // Wait for the next tick to allow the UI to update
            setTimeout(() => {
                this.isPresetChanging = false;
            }, 0);
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

    handleMetricNameChange(event: CustomEvent): void {
        this.unsetPreset();
        this.selectedMetricName = event.detail.value;
    }

    handleActivityNameChange(event: CustomEvent): void {
        this.unsetPreset();
        this.selectedActivityName = event.detail.value;
    }

    handleSchemaChange(event: CustomEvent) {
        this.unsetPreset();
        this.selectedSchemaId = event.detail.value;
    }

    handleHasErrorChange(event: CustomEvent) {
        this.unsetPreset();
        this.hasError =
            event.detail.value === 'true' ? true : event.detail.value === 'false' ? false : null;
    }

    handleUseGrouperChange(event: CustomEvent): void {
        this.unsetPreset();
        this.useGrouper = event.detail.value === 'true' ? true : false;
    }

    handleHostIdChange(event: CustomEvent): void {
        this.unsetPreset();
        this.selectedHostId = event.detail.value;
    }

    private clearInputBox(
        cssQuery:
            | '.logger-name-input'
            | '.metric-name-input'
            | '.activity-name-input'
            | '.host-id-input',
        trackedField:
            | 'selectedLoggerName'
            | 'selectedMetricName'
            | 'selectedActivityName'
            | 'selectedHostId'
    ) {
        this.unsetPreset();
        this[trackedField] = undefined;
        const inputBox = this.template.querySelector(cssQuery) as HTMLInputElement;
        inputBox.focus();
    }

    handleClearLoggerNameClick(event: CustomEvent): void {
        this.clearInputBox('.logger-name-input', 'selectedLoggerName');
    }

    handleClearMetricNameClick(event: CustomEvent): void {
        this.clearInputBox('.metric-name-input', 'selectedMetricName');
    }

    handleClearActivityNameClick(event: CustomEvent): void {
        this.clearInputBox('.activity-name-input', 'selectedActivityName');
    }

    handleClearHostIdClick(event: CustomEvent): void {
        this.clearInputBox('.host-id-input', 'selectedHostId');
    }
}
