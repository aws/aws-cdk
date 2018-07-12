import yargs = require('yargs');

import { DirectoryChangeDetector } from '../lib/directory-hash';
import { makeExecutable, shell } from '../lib/os';
import { cdkBuildOptions, currentPackageJson, packageCompiler } from '../lib/package-info';

function main() {
    const args = yargs
        .usage('Usage: cdk-build')
        .option('force', { type: 'boolean', alias: 'f', desc: 'Force a rebuild' })
        .argv;

    const options = cdkBuildOptions();

    // See if we need to call cfn2ts
    if (options.cloudformation) {
        shell(['cfn2ts', `--scope=${options.cloudformation}`]);
    }

    // We don't need to do the rest if the folder hash didn't change
    // NOTE: This happens post-cfn2ts on purpose, since a change in cfn2ts or the spec might lead
    // to different generated sources, in which case we DO need to recompile.
    //
    // Otherwise, we assume that changes in the compiler don't affect the output too much.
    //
    // (Which might be false in case the compiler is jsii, but what can we do?)
    const detector = new DirectoryChangeDetector('.', {
        dontRecurse: ['node_modules', 'coverage', 'dist']
    });

    if (!detector.isChanged() && !args.force) {
        // tslint:disable-next-line:no-console
        console.log('Sources unchanged since last build; skipping build.');
        return;
    }

    shell([packageCompiler()]);

    // Find files in bin/ that look like they should be executable, and make them so.
    const scripts = currentPackageJson().bin || {};
    for (const script of Object.values(scripts) as any) {
        makeExecutable(script);
    }

    // Always call linters
    shell(['tslint', '-p', '.']);
    shell(['pkglint']);

    detector.markClean();
}

try {
    main();
} catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e.toString());
    throw e;
    // process.exit(1);
}