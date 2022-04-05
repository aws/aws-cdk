// Exercise all integ stacks and if they deploy, update the expected synth files
import * as os from 'os';
import * as path from 'path';
import * as workerpool from 'workerpool';
import * as logger from './logger';
import { IntegrationTests, IntegTestConfig } from './runner/integ-tests';
import { runSnapshotTests, runIntegrationTests } from './workers';

// https://github.com/yargs/yargs/issues/1929
// https://github.com/evanw/esbuild/issues/1492
// eslint-disable-next-line @typescript-eslint/no-require-imports
const yargs = require('yargs');


async function main() {
  const argv = yargs
    .usage('Usage: integ-runner [TEST...]')
    .option('list', { type: 'boolean', default: false, desc: 'List tests instead of running them' })
    .option('clean', { type: 'boolean', default: true, desc: 'Skips stack clean up after test is completed (use --no-clean to negate)' })
    .option('verbose', { type: 'boolean', default: false, alias: 'v', desc: 'Verbose logs' })
    .option('dry-run', { type: 'boolean', default: false, desc: 'do not actually deploy the stack. just update the snapshot (not recommended!)' })
    .option('update-on-failed', { type: 'boolean', default: false, desc: 'rerun integration tests and update snapshots for failed tests.' })
    .option('force', { type: 'boolean', default: false, desc: 'Rerun all integration tests even if tests are passing' })
    .option('parallel', { type: 'boolean', default: false, desc: 'run integration tests in parallel' })
    .option('parallel-regions', { type: 'array', desc: 'if --parallel is used then these regions are used to run tests in parallel', nargs: 1, default: [] })
    .options('directory', { type: 'string', default: 'test', desc: 'starting directory to discover integration tests' })
    .argv;

  // Cap to a reasonable top-level limit to prevent thrash on machines with many, many cores.
  const maxWorkers = parseInt(process.env.CDK_INTEG_MAX_WORKER_COUNT ?? '16');
  const N = Math.min(maxWorkers, Math.max(1, Math.ceil(os.cpus().length / 2)));
  const pool = workerpool.pool(path.join(__dirname, '../lib/workers/extract/index.js'), {
    maxWorkers: N,
  });

  // list of integration tests that will be executed
  const testsToRun: IntegTestConfig[] = [];
  const testsFromArgs: IntegTestConfig[] = [];
  const parallelRegions = arrayFromYargs(argv['parallel-regions']);
  const testRegions: string[] = parallelRegions ?? ['us-east-1', 'us-east-2', 'us-west-2'];
  const runUpdateOnFailed = argv['update-on-failed'] ?? false;
  try {

    if (argv.list) {
      const tests = await new IntegrationTests(argv.directory).fromCliArgs();
      process.stdout.write(tests.map(t => t.fileName).join('\n') + '\n');
      return;
    }

    if (argv._.length === 0) {
      testsFromArgs.push(...(await new IntegrationTests(argv.directory).fromCliArgs()));
    } else {
      testsFromArgs.push(...(await new IntegrationTests(argv.directory).fromCliArgs(argv._.map((x: any) => x.toString()))));
    }

    // If `--force` is not used then first validate the snapshots and gather
    // the failed snapshot tests. If `--force` is used then we will skip snapshot
    // tests and run integration tests for all tests
    if (!argv.force) {
      const failedSnapshots = await runSnapshotTests(pool, testsFromArgs);
      testsToRun.push(...failedSnapshots);
    } else {
      testsToRun.push(...testsFromArgs);
    }


    // run integration tests if `--update-on-failed` OR `--force` is used
    if (runUpdateOnFailed || argv.force) {
      await runIntegrationTests({
        pool,
        tests: testsToRun,
        regions: testRegions,
        clean: argv.clean,
        dryRun: argv['dry-run'],
        verbose: argv.verbose,
      });

      if (argv.clean === false) {
        logger.warning('Not cleaning up stacks since "--no-clean" was used');
      }
    }
  } finally {
    void pool.terminate();
  }
}

/**
 * Translate a Yargs input array to something that makes more sense in a programming language
 * model (telling the difference between absence and an empty array)
 *
 * - An empty array is the default case, meaning the user didn't pass any arguments. We return
 *   undefined.
 * - If the user passed a single empty string, they did something like `--array=`, which we'll
 *   take to mean they passed an empty array.
 */
function arrayFromYargs(xs: string[]): string[] | undefined {
  if (xs.length === 0) { return undefined; }
  return xs.filter(x => x !== '');
}

export function cli() {
  main().then().catch(err => {
    logger.error(err);
    process.exitCode = 1;
  });
}
