import colors = require('colors');
import os = require('os');
import path = require('path');
import yargs = require('yargs');
import { calculateBuildHashes } from '../lib';
import { Cache } from '../lib/cache';
import { findAllBuildInputs } from '../lib/deps';
import { log, Progress } from '../lib/display';
import { discoverMonoRepo } from '../lib/monorepo';
import { executeTopo } from '../lib/topo';
import { Latch, spawnAndWait } from '../lib/util';

const DEFAULT_CACHE_DIR = path.resolve(os.homedir(), '.cache', 'lerno');
const DEFAULT_BUILD_COMMAND = 'yarn build';

async function main() {
  let handler: () => Promise<void>;

  const argv = yargs
    .usage('$0 [ROOT]', 'Build the monorepo rooted at ROOT', cmd => cmd
      .option('cache', { alias: 'C', type: 'string', default: DEFAULT_CACHE_DIR })
      .option('command', { alias: 'c', type: 'string', default: DEFAULT_BUILD_COMMAND })
      .positional('ROOT', { type: 'string', require: true }), args => {
        const cache = new Cache(args.cache);
        handler = async () => await buildRepo(args.ROOT!, cache, args.command);
      }
    )
    .strict()
    .argv;

  Array.isArray(argv);
  await handler!();
}

async function buildRepo(root: string, cache: Cache, buildCommand: string) {
  log('Finding packages');
  const mono = await discoverMonoRepo(root);
  log('Discovering build inputs');
  const inputs = await findAllBuildInputs(mono);
  log('Calculating hashes');
  const hashes = await calculateBuildHashes(inputs);
  const packageNames = Object.keys(inputs);

  const progress = new Progress();
  const latch = new Latch(6); // To avoid starting 100 subprocesses at the same time
  progress.start('Starting build');
  try {

    await executeTopo(packageNames, {
      id: x => x,
      deps: x => inputs[x].internalDependencyNames,
      exec: async (thisPackage) => {
        const key = hashes[thisPackage];
        const dir = mono.packages[thisPackage].directory;

        await latch.withLatch(async () => {
          if (await cache.contains(key)) {
            progress.message(colors.grey(`Retrieving ${thisPackage} from cache (${key})`));
            await cache.fetch(key, dir);
          } else {
            await progress.withElement(thisPackage, `Building ${thisPackage} (${key})`, async () => {
              try {
                await spawnAndWait(['bash', '-c', buildCommand], { cwd: dir });
                await cache.store(key, dir);
                progress.message(`Finished ${thisPackage}`);
              } catch (e) {
                progress.message(colors.red(`Error building ${thisPackage}: ${e}`));
                throw new Error('Aborted because of build error');
              }
            });
          }
        });
      },
    });
  } finally {
    progress.end();
  }
}

// tslint:disable-next-line:no-console
main().catch(console.error);