import { LightningElement, api, track } from 'lwc';
import { ComboBoxOption } from '../../types/ComboBoxOption';
import { ComponentUtils } from '../../shared/componentUtils';

export default class LoggerAppNameSelector extends LightningElement {
    private _value: string;
    get value(): string {
        return this._value;
    }
    @api
    set value(value: string) {
        if (this._value !== value) {
            this._value = value;
            this._raiseSelectEvent(this.value);
        }
    }

    @track
    loggerAppNames: ComboBoxOption[];

    constructor() {
        super();
        this._init();
    }

    connectedCallback(): void {
        this._raiseSelectEvent(this.value);
    }

    handleLoggerAppNameChange(event: CustomEvent) {
        this._raiseSelectEvent(event.detail.value);
    }

    private _raiseSelectEvent(newValue: string) {
        ComponentUtils.raiseEvent(this, 'select', newValue);
    }

    private _init(): void {
        const loggerAppNames = [
            {
                value: 'one:one',
                label: 'Salesforce Desktop [one:one]'
            },
            {
                value: 'FieldService',
                label: 'SFS Mobile [FieldService]'
            },
            {
                value: 'lwr_experience',
                label: 'CLWR (Communities Lightning Webruntime) [lwr_experience]'
            },
            {
                value: 'lwr_lightningmobileruntime/app_lightningmobileruntime/worker',
                label: 'LWR LMR Worker [lwr_lightningmobileruntime/app_lightningmobileruntime/worker]'
            },
            {
                value: 'lightningmobileruntime/app',
                label: 'LMR App [lightningmobileruntime/app]'
            },
            {
                value: 'siteforce:communityApp',
                label: 'Siteforce Community App [siteforce:communityApp]'
            },
            {
                value: 'builder_platform_interaction:flowBuilder',
                label: 'Flow Builder [builder_platform_interaction:flowBuilder]'
            },
            {
                value: 'clients:msMail',
                label: 'Outlook Integration [clients:msMail]'
            },
            {
                value: 'flowruntime:flowLightningOut',
                label: 'Flow Lightning Out [flowruntime:flowLightningOut]'
            },
            {
                value: 'wave:wave',
                label: 'Analytics [wave:wave]'
            },
            {
                value: 'embeddedService:sidebarApp',
                label: 'Embedded Service Sidebar [embeddedService:sidebarApp]'
            },
            {
                value: 'lwr_fieldservicemobile/container_fieldservicemobile/primer',
                label: 'LWR FSM Primer [lwr_fieldservicemobile/container_fieldservicemobile/primer]'
            },
            {
                value: 'visualEditor:appBuilder',
                label: 'App Builder [visualEditor:appBuilder]'
            },
            {
                value: 'cmsAuthor:contentEditor',
                label: 'CMS Content Editor [cmsAuthor:contentEditor]'
            },
            {
                value: 'perfApp',
                label: 'Performance App [perfApp]'
            },
            {
                value: 'survey:runtimeApp',
                label: 'Survey [survey:runtimeApp]'
            },
            {
                value: 'native:bridge',
                label: 'Salesforce Mobile [native:bridge]'
            }
        ];

        loggerAppNames.sort((a, b) => a.label.localeCompare(b.label));
        loggerAppNames.unshift({
            value: '*',
            label: '(All)'
        });

        this.loggerAppNames = loggerAppNames;
        if (!this.value || !this.loggerAppNames.find((option) => option.value === this.value)) {
            this.value = '*';
        }
    }
}
