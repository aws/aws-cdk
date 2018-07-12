#!/usr/bin/env node
// Exercise all integ stacks and if they deploy, update the expected synth files
import { IntegrationTests, STATIC_TEST_CONTEXT } from '../lib/integ-helpers';

// tslint:disable:no-console

async function main() {
    const tests = await new IntegrationTests('test').fromCliArgs(process.argv);

    for (const test of tests) {

        console.error(`Trying to deploy ${test.name}`);

        try {
            await test.invoke(['deploy']); // Note: no context, so use default user settings!

            console.error(`Success! Writing out reference synth.`);

            // If this all worked, write the new expectation file
            const actual = await test.invoke(['--json', 'synth'], true, STATIC_TEST_CONTEXT);
            await test.writeExpected(actual);
        } finally {
            console.error(`Cleaning up.`);
            await test.invoke(['destroy', '--force']);
        }
    }
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
