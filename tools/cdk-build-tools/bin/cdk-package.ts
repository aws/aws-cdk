import * as path from 'path';
import * as fs from 'fs-extra';
import * as yargs from 'yargs';
import * as yarnCling from 'yarn-cling';
import { shell } from '../lib/os';
import { Timers } from '../lib/timer';
import {cdkPackageOptions, currentPackageJson, isJsii, isPrivate } from '../lib/package-info';

const timers = new Timers();
const buildTimer = timers.start('Total time');

async function main() {
  const args = yargs
    .env('CDK_PACKAGE')
    .usage('Usage: cdk-package')
    .option('verbose', { type: 'boolean', default: false, alias: 'v', desc: 'verbose output' })
    .option('targets', { type: 'array', default: new Array<string>(), desc: 'Targets to pass to jsii-pacmak' })
    .option('jsii-pacmak', {
      type: 'string',
      desc: 'Specify a different jsii-pacmak executable',
      default: require.resolve('jsii-pacmak/bin/jsii-pacmak'),
      defaultDescription: 'jsii-pacmak provided by node dependencies',
    })
    .argv;

  const options = cdkPackageOptions();

  const outdir = 'dist';

  // if this is a private module, don't package
  if (isPrivate()) {
    process.stdout.write('No packaging for private modules.\n');
    return;
  }

  // If we need to shrinkwrap this, do so now.
  if (options.shrinkWrap) {
    await yarnCling.generateShrinkwrap({
      packageJsonFile: 'package.json',
      outputFile: 'npm-shrinkwrap.json',
    });
  }

  // if this is a jsii package, use jsii-packmak
  if (isJsii()) {
    const command = [args['jsii-pacmak'],
      args.verbose ? '-vvv' : '-v',
      ...args.targets ? flatMap(args.targets, (target: string) => ['-t', target]) : [],
      '-o', outdir];
    await shell(command, { timers });
  } else {
    // just "npm pack" and deploy to "outdir"
    const tarball = (await shell(['npm', 'pack'], { timers })).trim();
    const target = path.join(outdir, 'js');
    await fs.remove(target);
    await fs.mkdirp(target);
    await fs.move(tarball, path.join(target, path.basename(tarball)));
  }

  if (options.post) {
    await shell(options.post, { timers });
  }
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

function flatMap<T, U>(xs: T[], f: (x: T) => U[]): U[] {
  const ret = new Array<U>();
  for (const x of xs) {
    ret.push(...f(x));
  }
  return ret;
}
