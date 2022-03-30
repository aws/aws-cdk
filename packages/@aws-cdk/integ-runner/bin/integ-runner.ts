#!/usr/bin/env node
// Exercise all integ stacks and if they deploy, update the expected synth files
import * as os from 'os';
import * as path from 'path';
import * as chalk from 'chalk';
import * as workerpool from 'workerpool';
import * as yargs from 'yargs';
import { IntegrationTests, IntegTestConfig } from '../lib/runner/integ-tests';
import * as logger from '../lib/runner/private/logger';
import { IntegBatchResponse, printResults } from '../lib/workers/common';
import { SnapshotBatchRequest } from '../lib/workers/extract_worker';
import { runIntegrationTestsInParallel, IntegTestRunOptions } from '../lib/workers/integ-test-worker';


/**
 * Split a list of snapshot tests into batches that can be run using a workerpool.
 */
function batchTests(tests: IntegTestConfig[]): SnapshotBatchRequest[] {
  let batchSize = 3;
  const ret: SnapshotBatchRequest[] = [];
  for (let i = 0; i < tests.length; i += batchSize) {
    ret.push({
      tests: tests.slice(i, i + batchSize),
    });
  }
  return ret;
}

export function printSummary(total: number, failed: number): void {
  if (failed > 0) {
    logger.print('%s:    %s %s, %s total', chalk.bold('Tests'), chalk.red(failed), chalk.red('failed'), total);
  } else {
    logger.print('%s:    %s %s, %s total', chalk.bold('Tests'), chalk.green(total), chalk.green('passed'), total);
  }
}

/**
 * Run Integration tests.
 */
async function runIntegrationTests(options: IntegTestRunOptions): Promise<void> {
  logger.highlight('\nRunning integration tests for failed tests...\n');
  logger.print('Running in parallel across: %s', options.regions.join(', '));
  const totalTests = options.tests.length;
  const failedTests: IntegTestConfig[] = [];

  const responses = await runIntegrationTestsInParallel(options);
  for (const response of responses) {
    failedTests.push(...response.failedTests);
  }
  logger.highlight('\nTest Results: \n');
  printSummary(totalTests, failedTests.length);
}

/**
 * Run Snapshot tests
 * First batch up the tests. By default there will be 3 tests per batch.
 * Use a workerpool to run the batches in parallel.
 */
async function runSnapshotTests(pool: workerpool.WorkerPool, tests: IntegTestConfig[]): Promise<IntegTestConfig[]> {
  const testsToRun: IntegTestConfig[] = [];
  const requests = batchTests(tests);
  logger.highlight('\nVerifying integration test snapshots...\n');
  const responses: IntegBatchResponse[] = await Promise.all(
    requests.map((request) => pool.exec('snapshotTestBatch', [request], {
      on: printResults,
    })),
  );
  for (const response of responses) {
    testsToRun.push(...response.failedTests);
  }

  logger.highlight('\nSnapshot Results: \n');
  printSummary(tests.length, testsToRun.length);
  return testsToRun;
}

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
  const pool = workerpool.pool(path.join(__dirname, '../lib/workers/extract_worker.js'), {
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
      testsFromArgs.push(...(await new IntegrationTests(argv.directory).fromCliArgs(argv._.map(x => x.toString()))));
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

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
