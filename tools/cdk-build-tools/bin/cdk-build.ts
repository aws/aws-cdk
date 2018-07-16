import yargs = require('yargs');
import { compileCurrentPackage } from '../lib/compile';
import { shell } from '../lib/os';
import { cdkBuildOptions } from '../lib/package-info';
import { Timers } from '../lib/timer';

async function main() {
    const args = yargs
        .usage('Usage: cdk-build')
        .option('force', { type: 'boolean', alias: 'f', desc: 'Force a rebuild' })
        .argv;

    const options = cdkBuildOptions();

    if (options.pre) {
        await shell(options.pre, timers);
    }

    // See if we need to call cfn2ts
    if (options.cloudformation) {
        await shell(['cfn2ts', `--scope=${options.cloudformation}`], timers);
    }

    await compileCurrentPackage(timers, args.force);
}

const timers = new Timers();
const buildTimer = timers.start('Total time');

main().then(() => {
    buildTimer.end();
    process.stdout.write(`Build complete. ${timers.display()}\n`);
}).catch(e => {
    buildTimer.end();
    process.stderr.write(`${e.toString()}\n`);
    process.stderr.write(`Build failed. ${timers.display()}\n`);
    process.exit(1);
});
