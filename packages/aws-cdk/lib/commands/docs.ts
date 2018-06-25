import { exec } from 'child_process';
import { green } from 'colors/safe';
import * as process from 'process';
import * as yargs from 'yargs';
import { debug, error, warning } from '../../lib/logging';

export const command = 'docs';
export const describe = 'Opens the documentation in a browser';
export const aliases = ['doc'];
export const builder = {
    browser: {
        alias: 'b',
        desc: 'the command to use to open the browser, using %u as a placeholder for the path of the file to open',
        type: 'string',
        default: process.platform === 'win32' ? 'start %u' : 'open %u'
    }
};

export interface Arguments extends yargs.Arguments {
    browser: string
}

export async function handler(argv: Arguments) {
    let documentationIndexPath: string;
    try {
        // tslint:disable-next-line:no-var-require Taking an un-declared dep on aws-cdk-docs, to avoid a dependency circle
        const docs = require('aws-cdk-docs');
        documentationIndexPath = docs.documentationIndexPath;
    } catch (err) {
        error('Unable to open CDK documentation - the aws-cdk-docs package appears to be missing. Please run `npm install -g aws-cdk-docs`');
        process.exit(-1);
        return;
    }

    const browserCommand = argv.browser.replace(/%u/g, documentationIndexPath);
    debug(`Opening documentation ${green(browserCommand)}`);
    process.exit(await new Promise<number>((resolve, reject) => {
        exec(browserCommand, (err, stdout, stderr) => {
            if (err) { return reject(err); }
            if (stdout) { debug(stdout); }
            if (stderr) { warning(stderr); }
            resolve(0);
        });
    }));
}
