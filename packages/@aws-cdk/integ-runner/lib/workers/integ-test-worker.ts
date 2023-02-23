import * as workerpool from 'workerpool';
import { printResults, printSummary, IntegBatchResponse, IntegTestOptions, IntegRunnerMetrics } from './common';
import * as logger from '../logger';
import { IntegTestInfo } from '../runner/integration-tests';
import { flatten } from '../utils';

/**
 * Options for an integration test batch
 */
export interface IntegTestBatchRequest extends IntegTestOptions {
  /**
   * The AWS region to run this batch in
   */
  readonly region: string;

  /**
   * The AWS profile to use when running this test
   */
  readonly profile?: string;
}

/**
 * Options for running all integration tests
 */
export interface IntegTestRunOptions extends IntegTestOptions {
  /**
   * The regions to run the integration tests across.
   * This allows the runner to run integration tests in parallel
   */
  readonly regions: string[];

  /**
   * List of AWS profiles. This will be used in conjunction with `regions`
   * to run tests in parallel across accounts + regions
   */
  readonly profiles?: string[];

  /**
   * The workerpool to use
   */
  readonly pool: workerpool.WorkerPool;
}

/**
 * Run Integration tests.
 */
export async function runIntegrationTests(options: IntegTestRunOptions): Promise<{ success: boolean, metrics: IntegRunnerMetrics[] }> {
  logger.highlight('\nRunning integration tests for failed tests...\n');
  logger.print(
    'Running in parallel across %sregions: %s',
    options.profiles ? `profiles ${options.profiles.join(', ')} and `: '',
    options.regions.join(', '));
  const totalTests = options.tests.length;

  const responses = await runIntegrationTestsInParallel(options);
  logger.highlight('\nTest Results: \n');
  printSummary(totalTests, responses.failedTests.length);
  return {
    success: responses.failedTests.length === 0,
    metrics: responses.metrics,
  };
}

/**
 * Represents a worker for a single account + region
 */
interface AccountWorker {
  /**
   * The region the worker should run in
   */
  readonly region: string;

  /**
   * The AWS profile that the worker should use
   * This will be passed as the '--profile' option to the CDK CLI
   *
   * @default - default profile
   */
  readonly profile?: string;
}

/**
 * Returns a list of AccountWorkers based on the list of regions and profiles
 * given to the CLI.
 */
function getAccountWorkers(regions: string[], profiles?: string[]): AccountWorker[] {
  const workers: AccountWorker[] = [];
  function pushWorker(profile?: string) {
    for (const region of regions) {
      workers.push({
        region,
        profile,
      });
    }
  }
  if (profiles && profiles.length > 0) {
    for (const profile of profiles ?? []) {
      pushWorker(profile);
    }
  } else {
    pushWorker();
  }
  return workers;
}

/**
 * Runs a set of integration tests in parallel across a list of AWS regions.
 * Only a single test can be run at a time in a given region. Once a region
 * is done running a test, the next test will be pulled from the queue
 */
export async function runIntegrationTestsInParallel(
  options: IntegTestRunOptions,
): Promise<IntegBatchResponse> {

  const queue = options.tests;
  const results: IntegBatchResponse = {
    metrics: [],
    failedTests: [],
  };
  const accountWorkers: AccountWorker[] = getAccountWorkers(options.regions, options.profiles);

  async function runTest(worker: AccountWorker): Promise<void> {
    const start = Date.now();
    const tests: { [testName: string]: number } = {};
    do {
      const test = queue.pop();
      if (!test) break;
      const testStart = Date.now();
      logger.highlight(`Running test ${test.fileName} in ${worker.profile ? worker.profile + '/' : ''}${worker.region}`);
      const response: IntegTestInfo[][] = await options.pool.exec('integTestWorker', [{
        region: worker.region,
        profile: worker.profile,
        tests: [test],
        clean: options.clean,
        dryRun: options.dryRun,
        verbosity: options.verbosity,
        updateWorkflow: options.updateWorkflow,
      }], {
        on: printResults,
      });

      results.failedTests.push(...flatten(response));
      tests[test.fileName] = (Date.now() - testStart) / 1000;
    } while (queue.length > 0);
    const metrics: IntegRunnerMetrics = {
      region: worker.region,
      profile: worker.profile,
      duration: (Date.now() - start) / 1000,
      tests,
    };
    if (Object.keys(tests).length > 0) {
      results.metrics.push(metrics);
    }
  }

  const workers = accountWorkers.map((worker) => runTest(worker));
  await Promise.all(workers);
  return results;
}
