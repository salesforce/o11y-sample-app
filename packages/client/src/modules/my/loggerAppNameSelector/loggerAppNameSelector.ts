import { LightningElement, track } from 'lwc';
import { ComboBoxOption } from '../../types/ComboBoxOption';
import { ComponentUtils } from '../../shared/componentUtils';

export default class LoggerAppNameSelector extends LightningElement {
    @track
    loggerAppNames: ComboBoxOption[];

    @track
    selectedLoggerAppName: string;

    constructor() {
        super();
        this._init();
    }

    connectedCallback(): void {
        this._raiseSelectEvent();
    }

    handleLoggerAppNameChange(event: CustomEvent) {
        this.selectedLoggerAppName = event.detail.value;
        this._raiseSelectEvent();
    }

    private _raiseSelectEvent() {
        ComponentUtils.raiseEvent(this, 'select', this.selectedLoggerAppName);
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
        this.selectedLoggerAppName = '*';
    }
}
