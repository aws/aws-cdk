#!/usr/bin/env node
import fs = require('fs-extra');
import path = require('path');
import 'source-map-support/register';
import * as yargs from 'yargs';

const argv = yargs
    .option('output', { type: 'string', alias: 'o', desc: 'Where to write resources.js' })
    .argv;

const RESOURCE_DIR = "resources";
const output = argv.output || '.';

async function main() {
    if (!(await fs.pathExists(RESOURCE_DIR))) { return; } // Nothing to do
    const files = await fs.readdir(RESOURCE_DIR);

    // Build the file
    const fragments: string[] = [];
    for (const file of files) {
        const contentsBuffer = await fs.readFile(path.join(RESOURCE_DIR, file));
        fragments.push(`exports["${file}"] = Buffer.from("${contentsBuffer.toString("base64")}", "base64");`);
    }

    // Write the file
    await fs.mkdirp(output);
    await fs.writeFile(path.join(output, 'resources.js'), fragments.join('\n'));
}

main().catch(err => {
    // tslint:disable-next-line:no-console
    console.error(err);
    process.exit(1);
});
