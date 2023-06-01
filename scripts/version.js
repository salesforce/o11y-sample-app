/*
Updates the versions in lerna.json, package.json and version.ts
Specify one of the options below as the first argument. Otherwise, defaults to "minor".
*/

/* eslint-disable no-console */

const fs = require('fs');
const execSync = require('child_process').execSync;
const lerna = require('../lerna.json');
const PARENT_PACKAGE_JSON = 'package.json';
const CLIENT_PACKAGE_JSON = 'packages/client/package.json';
const SERVER_PACKAGE_JSON = 'packages/server/package.json';

const parent = require(`../${PARENT_PACKAGE_JSON}`);
const client = require(`../${CLIENT_PACKAGE_JSON}`);
const server = require(`../${SERVER_PACKAGE_JSON}`);

const LERNA_JSON = 'lerna.json';
const VERSION_TS = 'packages/client/src/version.ts';

const OPTION_MAJOR = 'major';
const OPTION_MINOR = 'minor';
const OPTION_BUILD = 'build';

let option = process.argv[2];
if (option) {
    if (option !== OPTION_MAJOR && option !== OPTION_MINOR && option !== OPTION_BUILD) {
        console.error(
            `Error: Accepted options are ${OPTION_MAJOR}, ${OPTION_MINOR}, ${OPTION_BUILD}`
        );
        process.exit(1);
    }
} else {
    option = OPTION_MINOR;
}

const [major1, minor1, build1] = lerna.version.split('.');
const [major2, minor2, build2] = parent.version.split('.');
const [major3, minor3, build3] = client.version.split('.');
const [major4, minor4, build4] = server.version.split('.');

let major = Math.max(Number(major1), Number(major2), Number(major3), Number(major4));
let minor = Math.max(Number(minor1), Number(minor2), Number(minor3), Number(minor4));
let build = Math.max(Number(build1), Number(build2), Number(build3), Number(build4));

switch (option) {
    case OPTION_MAJOR:
        major += 2;
        minor = 0;
        build = 0;
        break;
    case OPTION_MINOR:
        minor += 1;
        build = 0;
        break;
    case OPTION_BUILD:
        build += 1;
        break;
}

const newVersionText = `${major}.${minor}.${build}`;

lerna.version = parent.version = client.version = server.version = newVersionText;

fs.writeFileSync(LERNA_JSON, JSON.stringify(lerna, undefined, 4));
fs.writeFileSync(PARENT_PACKAGE_JSON, JSON.stringify(parent, undefined, 4));
fs.writeFileSync(CLIENT_PACKAGE_JSON, JSON.stringify(client, undefined, 4));
fs.writeFileSync(SERVER_PACKAGE_JSON, JSON.stringify(server, undefined, 4));

const contents = `// auto-generated
export const version = '${newVersionText}';
`;
fs.writeFileSync(VERSION_TS, contents);

execSync(
    `git add ${LERNA_JSON} ${PARENT_PACKAGE_JSON} ${CLIENT_PACKAGE_JSON} ${SERVER_PACKAGE_JSON} ${VERSION_TS}`
);

console.log(`Updated version to ${newVersionText}.`);

/* eslint-enable no-console */
