import fs = require('fs-extra');
import { ChangeDetector } from "merkle-build";
import path = require('path');
import yargs = require('yargs');
import ignoreList = require('../lib/ignore-list');
import { shell } from '../lib/os';
import { Timers } from '../lib/timer';

const timers = new Timers();
const buildTimer = timers.start('Total time');

async function main() {
    const args = yargs
        .usage('Usage: cdk-package')
        .option('verbose', { type: 'boolean', default: false, alias: 'v', desc: 'verbose output' })
        .argv;

    const detector = new ChangeDetector('.', {
        ignore: ignoreList,
        markerFile: '.LAST_PACKAGE'
    });

    if (!await detector.isChanged()) {
        process.stdout.write('Sources and dependencies unchanged since last package; skipping.\n');
        return;
    }

    // if this is a jsii package, use jsii-packmak
    const outdir = 'dist';
    const pkg = await fs.readJson('package.json');

    // if this is a private module, don't package
    if (pkg.private) {
        process.stdout.write('No packaging for private modules.\n');
        return;
    }

    if (pkg.jsii) {
        const pacmak = require.resolve('jsii-pacmak/bin/jsii-pacmak');
        await shell([ pacmak, args.verbose ? '-vvv' : '-v', '-o', outdir ], timers);
    } else {
        // just "npm pack" and deploy to "outdir"
        const tarball = (await shell([ 'npm', 'pack' ], timers)).trim();
        const target = path.join(outdir, 'npm');
        await fs.remove(target);
        await fs.mkdirp(target);
        await fs.move(tarball, path.join(target, path.basename(tarball)));
    }

    detector.markClean();
}

main().then(() => {
    buildTimer.end();
    process.stdout.write(`Package complete. ${timers.display()}\n`);
}).catch(e => {
    buildTimer.end();
    process.stderr.write(`${e.toString()}\n`);
    process.stderr.write(`Package failed. ${timers.display()}\n`);
    process.exit(1);
});
