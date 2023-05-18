//Load the library and specify options
import * as fs from 'fs';
import * as path from 'path';
import { exit } from 'process';
import * as url from 'url';

import schemasJson from '../generated/o11y_schema.json' assert { type: 'json' };

let hasError = false;

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const outSchema = fs.createWriteStream(path.resolve(__dirname, '..', 'generated', 'schema.ts'));

function getAlias(schemaName, parent) {
    return `${parent}_${schemaName}`;
}

const allSchemas = schemasJson.schemas;

outSchema.write('// This file is auto-generated\n');

Object.entries(allSchemas).forEach(([parent, schemas]) => {
    if (schemas.length) {
        outSchema.write('import {\n');

        schemas.forEach((name, index) => {
            outSchema.write(`    ${name} as ${getAlias(name, parent)},\n`);
        });
        outSchema.write(`} from 'o11y_schema/${parent}';\n\n`);
    }
});

outSchema.write(`
import type { Schema } from '../interfaces/Schema';

export function getSchemaId(schema: Schema): string {
    return \`\${schema.namespace}.\${schema.name}\`;
}

export function hasUserPayload(schemaId: string): boolean {
    return (
        schemaId === 'sf.instrumentation.Activity' ||
        schemaId === 'sf.instrumentation.Error' ||
        schemaId === 'sf.instrumentation.InstrumentedEvent' ||
        schemaId === 'sf.instrumentation.Simple'
    );
}

export const schemas = new Map<string, Schema>()`);

Object.entries(allSchemas).forEach(([parent, schemas]) => {
    if (schemas.length) {
        outSchema.write(`\n    // ${parent}\n`);
        outSchema.write(
            schemas
                .map((schema) => {
                    const alias = getAlias(schema, parent);
                    return `    .set(getSchemaId(${alias}), ${alias})`;
                })
                .join('\n')
        );
    }
});
outSchema.write(';\n');
outSchema.close();

if (hasError) {
    exit(1);
}
