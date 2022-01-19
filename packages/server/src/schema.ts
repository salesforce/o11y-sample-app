// Reminder: If adding schema imports from a new module, declare it in o11y_schema.d.ts
import { actionSchema, transportSchema } from 'o11y_schema/sf_aura';
import { explorerCardDataSchema, explorerInitLoadSchema } from 'o11y_schema/sf_automation';
import {
    activitySchema,
    coreEnvelopeSchema,
    errorSchema,
    instrumentedEventSchema,
    simpleSchema
} from 'o11y_schema/sf_instrumentation';
import {
    batchSchema,
    batchCoordinatorSchema,
    bulkResolveSchema,
    prefetchSchema,
    prefetchServiceSchema,
    wireContextSchema
} from 'o11y_schema/sf_komaci';
import {
    durableStoreEvictSchema,
    durableStoreGraphqlSchema,
    durableStoreReadSchema,
    durableStoreWriteSchema,
    luvioStoreStatsSchema
} from 'o11y_schema/sf_lds';
import { initialLexRootActivitySchema, lexRootActivitySchema } from 'o11y_schema/sf_lex';
import {
    appPrimingSchema,
    httpSchema,
    launchSchema,
    moduleDownloadSchema,
    moduleInvalidationSchema,
    moduleLoadSchema,
    navigationSchema,
    routePrimingSchema
} from 'o11y_schema/sf_lightningsdk';
import { sidePanelContentSchema } from 'o11y_schema/sf_lol';
import {
    bootstrapRequestSchema,
    mappingRequestSchema,
    moduleRequestCountSchema
} from 'o11y_schema/sf_lwrjs';
import { userPayloadSchema, appPayloadSchema, pagePayloadSchema } from 'o11y_schema/sf_o11ySample';
import { resultClickDemoSchema } from 'o11y_schema/sf_searchui';
import { appStartSchema } from 'o11y_schema/sf_sfs';

import { exampleSchema } from './schemas/exampleSchema';

import type { Schema } from './interfaces/Schema';

export function getSchemaId(schema: Schema): string {
    return `${schema.namespace}.${schema.name}`;
}

export const schemas = new Map()
    // sf_aura
    .set(getSchemaId(actionSchema), actionSchema)
    .set(getSchemaId(transportSchema), transportSchema)
    // sf_automation
    .set(getSchemaId(explorerCardDataSchema), explorerCardDataSchema)
    .set(getSchemaId(explorerInitLoadSchema), explorerInitLoadSchema)
    // sf_instrumentation
    .set(getSchemaId(activitySchema), activitySchema)
    .set(getSchemaId(coreEnvelopeSchema), coreEnvelopeSchema)
    .set(getSchemaId(errorSchema), errorSchema)
    .set(getSchemaId(instrumentedEventSchema), instrumentedEventSchema)
    .set(getSchemaId(simpleSchema), simpleSchema)
    // sf_komaci
    .set(getSchemaId(batchSchema), batchSchema)
    .set(getSchemaId(batchCoordinatorSchema), batchCoordinatorSchema)
    .set(getSchemaId(bulkResolveSchema), bulkResolveSchema)
    .set(getSchemaId(prefetchSchema), prefetchSchema)
    .set(getSchemaId(prefetchServiceSchema), prefetchServiceSchema)
    .set(getSchemaId(wireContextSchema), wireContextSchema)
    // sf_ldx
    .set(getSchemaId(durableStoreEvictSchema), durableStoreEvictSchema)
    .set(getSchemaId(durableStoreGraphqlSchema), durableStoreGraphqlSchema)
    .set(getSchemaId(durableStoreReadSchema), durableStoreReadSchema)
    .set(getSchemaId(durableStoreWriteSchema), durableStoreWriteSchema)
    .set(getSchemaId(luvioStoreStatsSchema), luvioStoreStatsSchema)
    // sf_lex
    .set(getSchemaId(initialLexRootActivitySchema), initialLexRootActivitySchema)
    .set(getSchemaId(lexRootActivitySchema), lexRootActivitySchema)
    // sf_lightningsdk
    .set(getSchemaId(appPrimingSchema), appPrimingSchema)
    .set(getSchemaId(httpSchema), httpSchema)
    .set(getSchemaId(launchSchema), launchSchema)
    .set(getSchemaId(moduleDownloadSchema), moduleDownloadSchema)
    .set(getSchemaId(moduleInvalidationSchema), moduleInvalidationSchema)
    .set(getSchemaId(moduleLoadSchema), moduleLoadSchema)
    .set(getSchemaId(navigationSchema), navigationSchema)
    .set(getSchemaId(routePrimingSchema), routePrimingSchema)
    // sf_lol
    .set(getSchemaId(sidePanelContentSchema), sidePanelContentSchema)
    // sf_lwrjs
    .set(getSchemaId(bootstrapRequestSchema), bootstrapRequestSchema)
    .set(getSchemaId(mappingRequestSchema), mappingRequestSchema)
    .set(getSchemaId(moduleRequestCountSchema), moduleRequestCountSchema)
    // sf_o11ySample
    .set(getSchemaId(userPayloadSchema), userPayloadSchema)
    .set(getSchemaId(appPayloadSchema), appPayloadSchema)
    .set(getSchemaId(pagePayloadSchema), pagePayloadSchema)
    // sf_searchui
    .set(getSchemaId(resultClickDemoSchema), resultClickDemoSchema)
    // sf_sfs
    .set(getSchemaId(appStartSchema), appStartSchema)
    // Schema specific to this app
    .set(getSchemaId(exampleSchema), exampleSchema);
