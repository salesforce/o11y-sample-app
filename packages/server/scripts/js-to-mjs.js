//Load the library and specify options
const fs = require('fs');
const path = require('path');
const { exit } = require('process');
const readline = require('readline');
const recursive = require('recursive-readdir');

const distDir = path.resolve(__dirname, '..', '..', '..', 'dist-server');

function ignoreFunc(file, stats) {
    // `file` is the path to the file, and `stats` is an `fs.Stats`
    // object returned from `fs.lstat()`.
    const ext = path.extname(file);
    return stats.isFile() && ext && ext.toLowerCase() !== '.js';
}

let hasError = false;

recursive(distDir, [ignoreFunc], async function (err, files) {
    if (err) {
        console.error(err);
        return;
    }

    for (const file of files) {
        const lineReader = readline.createInterface({
            input: fs.createReadStream(file)
        });

        const pathInfo = path.parse(file);
        const newFile = path.join(pathInfo.dir, `${pathInfo.name}.mjs`);
        const out = fs.createWriteStream(newFile);

        let replaceCount = 0;
        for await (const line of lineReader) {
            // Each line in input.txt will be successively available here as `line`
            const match = line.match(/^(\s*import\s.+\sfrom\s+['"]\.\/)(.+)(['"].+)$/);
            if (match) {
                const left = match[1];
                const mid = match[2];
                const right = match[3];
                out.write(`${left}${mid}.mjs${right}`);
                replaceCount += 1;
            } else {
                out.write(line);
            }
            out.write('\n');
        }
        const message = replaceCount ? ` and replaced ${replaceCount} imports` : '';
        console.log(`Renamed "${file}"${message}`);

        fs.rm(file, (err) => {
            if (err) {
                console.error(err);
                hasError = true;
            }
        });
    }
});

if (hasError) {
    exit(1);
}
