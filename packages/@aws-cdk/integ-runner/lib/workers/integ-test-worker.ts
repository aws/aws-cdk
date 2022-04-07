import * as workerpool from 'workerpool';
import * as logger from '../logger';
import { IntegTestConfig } from '../runner/integ-tests';
import { IntegTestRunner } from '../runner/runners';
import { printResults, printSummary, IntegBatchResponse, IntegTestOptions, DiagnosticReason } from './common';

/**
 * Options for an integration test batch
 */
export interface IntegTestBatchRequest extends IntegTestOptions {
  /**
   * The AWS region to run this batch in
   */
  readonly region: string;
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
   * The workerpool to use
   */
  readonly pool: workerpool.WorkerPool;
}

/**
 * Run Integration tests.
 */
export async function runIntegrationTests(options: IntegTestRunOptions): Promise<void> {
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
 * Runs a set of integration tests in parallel across a list of AWS regions.
 * Only a single test can be run at a time in a given region. Once a region
 * is done running a test, the next test will be pulled from the queue
 */
export async function runIntegrationTestsInParallel(
  options: IntegTestRunOptions,
): Promise<IntegBatchResponse[]> {

  const queue = options.tests;
  const results: IntegBatchResponse[] = [];

  async function runTest(region: string): Promise<void> {
    do {
      const test = queue.pop();
      if (!test) break;
      logger.highlight(`Running test ${test.fileName} in ${region}`);
      const response: IntegBatchResponse = await options.pool.exec('integTestBatch', [{
        region,
        tests: [test],
        clean: options.clean,
        dryRun: options.dryRun,
        verbose: options.verbose,
      }], {
        on: printResults,
      });

      results.push(response);
    } while (queue.length > 0);
  }

  const workers = options.regions.map((region) => runTest(region));
  await Promise.all(workers);
  return results;
}

/**
 * Runs a single integration test batch request.
 * If the test does not have an existing snapshot,
 * this will first generate a snapshot and then execute
 * the integration tests.
 *
 * If the tests succeed it will then save the snapshot
 */
export function singleThreadedTestRunner(request: IntegTestBatchRequest): IntegBatchResponse {
  const failures: IntegTestConfig[] = [];
  for (const test of request.tests) {
    const runner = new IntegTestRunner({
      fileName: test.fileName,
      env: {
        AWS_REGION: request.region,
      },
    });
    try {
      if (!runner.hasSnapshot()) {
        runner.generateSnapshot();
      }

      if (!runner.tests) {
        throw new Error(`No tests defined for ${runner.testName}`);
      }
      for (const [testName, testCase] of Object.entries(runner.tests)) {
        try {
          runner.runIntegTestCase({
            testCase: testCase,
            clean: request.clean,
            dryRun: request.dryRun,
          });
          workerpool.workerEmit({
            reason: DiagnosticReason.TEST_SUCCESS,
            testName: testName,
            message: 'Success',
          });
        } catch (e) {
          failures.push(test);
          workerpool.workerEmit({
            reason: DiagnosticReason.TEST_FAILED,
            testName: testName,
            message: `Integration test failed: ${e}`,
          });
        }
      }
    } catch (e) {
      logger.error(`Errors running test cases: ${e}`);
    }
  }

  return {
    failedTests: failures,
  };
}
