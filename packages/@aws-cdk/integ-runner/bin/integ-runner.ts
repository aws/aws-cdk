#!/usr/bin/env node
// Exercise all integ stacks and if they deploy, update the expected synth files
import * as os from 'os';
import * as path from 'path';
import * as workerpool from 'workerpool';
import * as yargs from 'yargs';
import { IntegrationTests, IntegTestConfig } from '../lib/runner/integ-tests';
import * as logger from '../lib/runner/private/logger';
import { SnapshotBatchResponse, SnapshotBatchRequest, IntegBatchResponse } from '../lib/workers/extract_worker';
import { Diagnostic, DiagnosticReason } from '../lib/workers/workers';


function batchTests(tests: IntegTestConfig[], regions?: string[]): SnapshotBatchRequest[] {
  const batchSize = regions?.length ?? 10;
  const ret: SnapshotBatchRequest[] = [];
  for (let i = 0; i < tests.length; i += batchSize) {
    ret.push({
      region: regions ? regions[i] : '',
      tests: tests.slice(i, i + batchSize),
    });
  }
  return ret;
}

async function main() {
  const argv = yargs
    .usage('Usage: integ-runner [TEST...]')
    .option('list', { type: 'boolean', default: false, desc: 'List tests instead of running them' })
    .option('clean', { type: 'boolean', default: true, desc: 'Skips stack clean up after test is completed (use --no-clean to negate)' })
    .option('verbose', { type: 'boolean', default: false, alias: 'v', desc: 'Verbose logs' })
    .option('dry-run', { type: 'boolean', default: false, desc: 'do not actually deploy the stack. just update the snapshot (not recommended!)' })
    .option('update', { type: 'boolean', default: false, desc: 'rerun integration tests and update snapshots for failed tests.' })
    .option('force', { type: 'boolean', default: false, desc: 'Rerun all integration tests even if tests are passing' })
    .option('parallel', { type: 'boolean', default: false, desc: 'run integration tests in parallel' })
    .option('parallel-regions', { type: 'array', desc: 'if --parallel is used then these regions are used to run tests in parallel', nargs: 1, default: [] })
    .options('directory', { type: 'string', default: 'test', desc: 'starting directory to discover integration tests' })
    .argv;

  // Use about half the advertised cores because hyperthreading doesn't seem to
  // help that much, or we become I/O-bound at some point. On my machine, using
  // more than half the cores actually makes it slower.
  // Cap to a reasonable top-level limit to prevent thrash on machines with many, many cores.
  const maxWorkers = parseInt(process.env.CDK_INTEG_MAX_WORKER_COUNT ?? '16');
  const N = Math.min(maxWorkers, Math.max(1, Math.ceil(os.cpus().length / 2)));
  const pool = workerpool.pool(path.join(__dirname, 'extract_worker.js'), {
    maxWorkers: N,
  });

  const testsToRun: IntegTestConfig[] = [];
  const testsFromArgs: IntegTestConfig[] = [];
  const parallelRegions = arrayFromYargs(argv['parallel-regions']);
  const testRegions: string[] = parallelRegions ?? ['us-east-1', 'us-east-2', 'us-west-2'];
  const updateFailed = argv.update ?? false;


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

    const diagnostics = new Array<Diagnostic>();
    if (!argv.force) {
      const requests = batchTests(testsFromArgs);
      logger.highlight('\nVerifying integration test snapshots...\n');
      const responses: SnapshotBatchResponse[] = await Promise.all(
        requests.map((request) => pool.exec('snapshotTestBatch', [request], {
          on: workerpoolLogger,
        })),
      );
      for (const response of responses) {
        diagnostics.push(...response.diagnostics);
        testsToRun.push(...response.failedTests);
      }
    } else {
      testsToRun.push(...testsFromArgs);
    }

    if (diagnostics.length > 0) {
      logger.highlight('\nSnapshot Results: \n');
      diagnostics.forEach(diagnostic => {
        switch (diagnostic.reason) {
          case DiagnosticReason.SUCCESS:
            logger.success('  %s No Change!', diagnostic.testName);
            break;
          case DiagnosticReason.NO_SNAPSHOT:
            logger.error('  %s - No Snapshot!\n    %s', diagnostic.testName, diagnostic.message);
            break;
          case DiagnosticReason.SNAPSHOT_FAILED:
            logger.error('  %s - Snapshot changed!\n%s', diagnostic.testName, diagnostic.message);
        }
      });
    }
    const testDiagnostics = new Array<Diagnostic>();

    if (updateFailed) {
      logger.highlight('\nRunning integration tests for failed tests...\n');
      const requests = batchTests(testsToRun, testRegions);
      logger.print('Running in parallel: ');
      requests.forEach(request =>
        logger.print(`Running the following tests in ${request.region}: \n    %s`,
          request.tests.map(r => r.fileName).join('\n    '),
        ));
      const testResponses: IntegBatchResponse[] = await Promise.all(
        requests.map((request) => pool.exec('integTestBatch', [{
          clean: argv.clean,
          dryRun: argv['dry-run'],
          verbose: argv.verbose,
          ...request,
        }], {
          on: workerpoolLogger,
        })),
      );
      for (const response of testResponses) {
        testDiagnostics.push(...response.diagnostics);
      }
      if (testDiagnostics.length > 0) {
        logger.highlight('\nTest Results: \n');
        testDiagnostics.forEach(diagnostic => {
          switch (diagnostic.reason) {
            case DiagnosticReason.SUCCESS:
              logger.success('  %s Success!', diagnostic.testName);
              break;
            case DiagnosticReason.TEST_FAILED:
              logger.error('  %s - Failed!\n%s', diagnostic.testName, diagnostic.message);
          }
        });
      }
    }

  } finally {
    void pool.terminate();
  }
}

export enum LogLevel {
  WARN,
  ERROR,
  INFO,
}

export interface LoggerOpts {
  message: string;
  level?: LogLevel;
}
function workerpoolLogger(payload: LoggerOpts) {
  switch (payload.level) {
    case LogLevel.WARN:
      logger.warning(payload.message);
      break;
    case LogLevel.ERROR:
      logger.error(payload.message);
      break;
    default:
      logger.print(payload.message);
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
