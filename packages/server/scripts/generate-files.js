//Load the library and specify options
import * as fs from 'fs';
import * as path from 'path';
import { exit } from 'process';
import * as readline from 'readline';
import recursive from 'recursive-readdir';
import * as url from 'url';

function ignoreFunc(file, stats) {
    // `file` is the path to the file, and `stats` is an `fs.Stats`
    // object returned from `fs.lstat()`.
    return stats.isFile(file) && path.parse(file).base !== 'index.js';
}

let hasError = false;

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const outTypes = fs.createWriteStream(
    path.resolve(__dirname, '..', 'src', 'typings', 'o11y_schema.d.ts')
);
const outSchema = fs.createWriteStream(path.resolve(__dirname, '..', 'src', 'schema.ts'));
const schemaDir = path.resolve(__dirname, '..', '..', '..', 'node_modules', 'o11y_schema');

recursive(schemaDir, [ignoreFunc], async function (err, files) {
    if (err) {
        console.error(err);
        hasError = true;
        return;
    }

    function getAlias(schemaName, parent) {
        return `${parent}_${schemaName}`;
    }

    const allSchemas = [];

    files.sort();
    for (const indexFile of files) {
        console.log(`Processing: ${indexFile}`);

        const filepath = path.parse(indexFile);
        const folders = filepath.dir.split(path.sep);
        const parent = folders[folders.length - 1];

        outTypes.write(`declare module 'o11y_schema/${parent}';\n`);

        const lineReader = readline.createInterface({
            input: fs.createReadStream(indexFile)
        });

        const schemas = [];
        for await (const line of lineReader) {
            const match = line.match(/^\s*export\s*{\s*\w+\s+as\s+(\w+Schema)\s+}/);
            if (match) {
                const schemaName = match[1];
                schemas.push(schemaName);
                allSchemas.push(getAlias(schemaName, parent));
            }
        }

        if (schemas.length) {
            outSchema.write('import {\n');
            schemas.forEach((name, index) => {
                outSchema.write(`    ${name} as ${getAlias(name, parent)},\n`);
            });
            outSchema.write(`} from 'o11y_schema/${parent}';\n\n`);
        }
    }

    const setters = allSchemas
        .sort()
        .map((schema) => `.set(getSchemaId(${schema}), ${schema})`)
        .join('\n    ');

    outSchema.write(`
import { exampleSchema } from './schemas/exampleSchema';

import type { Schema } from './interfaces/Schema';

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
    ${setters}
    .set(getSchemaId(exampleSchema), exampleSchema);
`);
});

if (hasError) {
    exit(1);
}
