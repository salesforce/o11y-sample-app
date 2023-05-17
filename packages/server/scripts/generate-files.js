//Load the library and specify options
import * as fs from 'fs';
import * as path from 'path';
import { exit } from 'process';
import * as url from 'url';

import schemasJson from '../../_common/generated/o11y_schema.json' assert { type: 'json' };

let hasError = false;

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const outSchema = fs.createWriteStream(path.resolve(__dirname, '..', 'src', 'schema.ts'));

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
import { exampleSchema } from './schemas/exampleSchema';

import type { Schema } from '../../_common/interfaces/Schema';

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

export const schemas = new Map()
`);

Object.entries(allSchemas).forEach(([parent, schemas]) => {
    if (schemas.length) {
        outSchema.write(`    // ${parent}\n`);
        outSchema.write(
            schemas
                .map((schema) => {
                    const alias = getAlias(schema, parent);
                    return `    .set(getSchemaId(${alias}), ${alias})\n`;
                })
                .join('')
        );
    }
});

outSchema.write('    .set(getSchemaId(exampleSchema), exampleSchema);\n');
outSchema.close();

if (hasError) {
    exit(1);
}
