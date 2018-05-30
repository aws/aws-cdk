#!/usr/bin/env node
import 'source-map-support/register';

import * as yargs from 'yargs';
import generate from '../lib';

const argv = yargs
    .usage('Usage: cfn2ts -o <OUTFILE> specfile...')
    .option('enrichments', { alias: 'e', type: 'string', desc: 'Enrichments directory' })
    .demandCommand(1)
    .argv;

const specfiles = argv._;
specfiles.sort();

const enrichments = argv.enrichments;

generate(specfiles, enrichments)
    .catch(err => {
        // tslint:disable:no-console
        console.error(err);
        // tslint:enable:no-console
        process.exit(1);
    });
