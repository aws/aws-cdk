/* eslint-disable @cdklabs/no-throw-default-error */
import * as path from 'path';
import * as fs from 'fs-extra';
import * as yargs from 'yargs';
import { shell } from '../lib/os';
import { cdkPackageOptions, isJsii, isPrivate } from '../lib/package-info';
import { Timers } from '../lib/timer';

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
    .option('pre-only', { type: 'boolean', default: false, desc: 'run pre package steps only' })
    .option('post-only', { type: 'boolean', default: false, desc: 'run post package steps only' })
    .option('private', { type: 'boolean', default: false, desc: 'Also package private packages for local usage' })
    .argv;

  if (args['pre-only'] && args['post-only']) {
    throw new Error('You can set a maxiumum of one of --pre-only and --post-only flags to true. Pick one.');
  }

  const options = cdkPackageOptions();

  if (args['post-only']) {
    if (options.post) {
      const commands = options.post.join(' && ');
      await shell([commands], { timers });
    }
    return;
  }

  const outdir = 'dist';

  // if this is a private module, don't package
  const packPrivate = args.private || options.private;
  if (isPrivate() && !packPrivate) {
    process.stdout.write('No packaging for private modules.\nUse --private to force packing private packages for local testing.\n');
    return;
  }

  if (options.pre ) {
    const commands = options.pre.join(' && ');
    await shell([commands], { timers });
  }
  if (args['pre-only']) {
    return;
  }

  // if this is a jsii package, use jsii-packmak
  if (isJsii()) {
    const command = [args['jsii-pacmak'],
      args.verbose ? '-vvv' : '-v',
      ...args.targets ? flatMap(args.targets, (target: string) => ['-t', target]) : [],
      '-o', outdir];
    await shell(command, { timers });
  } else {
    const target = path.join(outdir, 'js');
    await fs.remove(target);
    await fs.mkdirp(target);
    // just "npm pack" and deploy to "outdir"
    const tarball = (await shell(['npm', 'pack'], { timers })).trim();
    await fs.move(tarball, path.join(target, path.basename(tarball)));
  }

  if (options.post) {
    const commands = options.post.join(' && ');
    await shell([commands], { timers });
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
