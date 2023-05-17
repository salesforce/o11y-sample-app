// Reminder: If adding schema imports from a new module, declare it in o11y_schema.d.ts
import { actionSchema, transportSchema } from 'o11y_schema/sf_aura';
import {
    explorerCardDataSchema,
    explorerInitLoadSchema,
    explorerReorderSchema
} from 'o11y_schema/sf_automation';
import {
    activitySchema,
    coreEnvelopeSchema,
    errorSchema,
    instrumentedEventSchema,
    simpleSchema,
    webVitalsSchema
} from 'o11y_schema/sf_instrumentation';
import {
    batchSchema,
    batchCoordinatorSchema,
    bulkResolveSchema,
    prefetchSchema,
    prefetchServiceSchema,
    totalRoutingSchema,
    wireContextSchema
} from 'o11y_schema/sf_komaci';
import {
    adapterUnfulfilledErrorSchema,
    durableStoreEvictSchema,
    durableStoreGraphqlSchema,
    durableStoreReadSchema,
    durableStoreWriteSchema,
    luvioStoreStatsSchema
} from 'o11y_schema/sf_lds';
import {
    appPayloadSchema as lex_appPayloadSchema,
    //bootstrapSchema,
    //bootstrapRequestSchema as lex_bootstrapRequestSchema,
    //bootstrapTimingSchema,
    //componentLoadSchema,
    pageEndSchema,
    pagePayloadSchema as lex_pagePayloadSchema,
    //pageviewSchema,
    scenarioTrackerSchema
} from 'o11y_schema/sf_lex';
import {
    appPrimingSchema,
    httpSchema,
    launchSchema,
    moduleDownloadSchema,
    moduleInvalidationSchema,
    moduleLoadSchema,
    navigationSchema,
    resourceDownloadSchema,
    routePrimingSchema
} from 'o11y_schema/sf_lightningsdk';
import {
    homeOpenedSchema,
    moduleOpenedCompletedSchema,
    sidePanelContentSchema,
    sidePanelSimpleEventSchema
} from 'o11y_schema/sf_lol';
import {
    bootstrapRequestSchema,
    mappingRequestSchema,
    moduleRequestCountSchema
} from 'o11y_schema/sf_lwrjs';
import {
    barcodeScannerSchema,
    contactsServiceSchema,
    locationServiceSchema
} from 'o11y_schema/sf_nimbus';
import { userPayloadSchema, appPayloadSchema, pagePayloadSchema } from 'o11y_schema/sf_o11ySample';
import { resultClickDemoSchema } from 'o11y_schema/sf_searchui';
import { appInfoSchema, appStartSchema } from 'o11y_schema/sf_sfs';

import { exampleSchema } from './schemas/exampleSchema';

import type { Schema } from './interfaces/Schema';

export function getSchemaId(schema: Schema): string {
    return `${schema.namespace}.${schema.name}`;
}

export function hasUserPayload(schemaId: string): boolean {
    return (
        schemaId === 'sf.instrumentation.Activity' ||
        schemaId === 'sf.instrumentation.Error' ||
        schemaId === 'sf.instrumentation.InstrumentedEvent' ||
        schemaId === 'sf.instrumentation.Simple'
    );
}

export const schemas = new Map()
    // sf_aura
    .set(getSchemaId(actionSchema), actionSchema)
    .set(getSchemaId(transportSchema), transportSchema)
    // sf_automation
    .set(getSchemaId(explorerCardDataSchema), explorerCardDataSchema)
    .set(getSchemaId(explorerInitLoadSchema), explorerInitLoadSchema)
    .set(getSchemaId(explorerReorderSchema), explorerReorderSchema)
    // sf_instrumentation
    .set(getSchemaId(activitySchema), activitySchema)
    .set(getSchemaId(coreEnvelopeSchema), coreEnvelopeSchema)
    .set(getSchemaId(errorSchema), errorSchema)
    .set(getSchemaId(instrumentedEventSchema), instrumentedEventSchema)
    .set(getSchemaId(simpleSchema), simpleSchema)
    .set(getSchemaId(webVitalsSchema), webVitalsSchema)
    // sf_komaci
    .set(getSchemaId(batchSchema), batchSchema)
    .set(getSchemaId(batchCoordinatorSchema), batchCoordinatorSchema)
    .set(getSchemaId(bulkResolveSchema), bulkResolveSchema)
    .set(getSchemaId(prefetchSchema), prefetchSchema)
    .set(getSchemaId(prefetchServiceSchema), prefetchServiceSchema)
    .set(getSchemaId(totalRoutingSchema), totalRoutingSchema)
    .set(getSchemaId(wireContextSchema), wireContextSchema)
    // sf_lds
    .set(getSchemaId(adapterUnfulfilledErrorSchema), adapterUnfulfilledErrorSchema)
    .set(getSchemaId(durableStoreEvictSchema), durableStoreEvictSchema)
    .set(getSchemaId(durableStoreGraphqlSchema), durableStoreGraphqlSchema)
    .set(getSchemaId(durableStoreReadSchema), durableStoreReadSchema)
    .set(getSchemaId(durableStoreWriteSchema), durableStoreWriteSchema)
    .set(getSchemaId(luvioStoreStatsSchema), luvioStoreStatsSchema)
    // sf_lex
    .set(getSchemaId(lex_appPayloadSchema), lex_appPayloadSchema)
    .set(getSchemaId(pageEndSchema), pageEndSchema)
    .set(getSchemaId(lex_pagePayloadSchema), lex_pagePayloadSchema)
    .set(getSchemaId(scenarioTrackerSchema), scenarioTrackerSchema)
    // sf_lightningsdk
    .set(getSchemaId(appPrimingSchema), appPrimingSchema)
    .set(getSchemaId(httpSchema), httpSchema)
    .set(getSchemaId(launchSchema), launchSchema)
    .set(getSchemaId(moduleDownloadSchema), moduleDownloadSchema)
    .set(getSchemaId(moduleInvalidationSchema), moduleInvalidationSchema)
    .set(getSchemaId(moduleLoadSchema), moduleLoadSchema)
    .set(getSchemaId(navigationSchema), navigationSchema)
    .set(getSchemaId(resourceDownloadSchema), resourceDownloadSchema)
    .set(getSchemaId(routePrimingSchema), routePrimingSchema)
    // sf_lol
    .set(getSchemaId(homeOpenedSchema), homeOpenedSchema)
    .set(getSchemaId(moduleOpenedCompletedSchema), moduleOpenedCompletedSchema)
    .set(getSchemaId(sidePanelContentSchema), sidePanelContentSchema)
    .set(getSchemaId(sidePanelSimpleEventSchema), sidePanelSimpleEventSchema)
    // sf_lwrjs
    .set(getSchemaId(bootstrapRequestSchema), bootstrapRequestSchema)
    .set(getSchemaId(mappingRequestSchema), mappingRequestSchema)
    .set(getSchemaId(moduleRequestCountSchema), moduleRequestCountSchema)
    // sf_nimbus
    .set(getSchemaId(barcodeScannerSchema), barcodeScannerSchema)
    .set(getSchemaId(contactsServiceSchema), contactsServiceSchema)
    .set(getSchemaId(locationServiceSchema), locationServiceSchema)
    // sf_o11ySample
    .set(getSchemaId(userPayloadSchema), userPayloadSchema)
    .set(getSchemaId(appPayloadSchema), appPayloadSchema)
    .set(getSchemaId(pagePayloadSchema), pagePayloadSchema)
    // sf_searchui
    .set(getSchemaId(resultClickDemoSchema), resultClickDemoSchema)
    // sf_sfs
    .set(getSchemaId(appInfoSchema), appInfoSchema)
    .set(getSchemaId(appStartSchema), appStartSchema)
    // Schema specific to this app
    .set(getSchemaId(exampleSchema), exampleSchema);
