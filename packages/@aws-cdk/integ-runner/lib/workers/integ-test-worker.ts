import * as workerpool from 'workerpool';
import { IntegTestConfig } from '../runner/integ-tests';
import * as logger from '../runner/private/logger';
import { IntegTestRunner } from '../runner/runners';
import { printResults, IntegBatchResponse, IntegTestOptions, DiagnosticReason } from './common';

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
 * A queue holding the list of tests to run and the available regions
 * Each region can only run a single test at a time
 */
class IntegTestQueue {
  /**
   * Map of region to availability
   */
  private readonly regions = new Map<string, boolean>();

  /**
   * List of tests to run
   */
  private readonly tests: IntegTestConfig[];
  constructor(regions: string[], tests: IntegTestConfig[]) {
    regions.forEach(region => this.regions.set(region, true));
    this.tests = tests;
  }

  /**
   * Returns true if there are still tests that
   * are available to be run
   */
  public get testsAvailable(): boolean {
    if (this.tests.length > 0) {
      return true;
    }
    return false;
  }

  /**
   * Gets the next available region to run the current test in
   * Returns the region and sets it as unavailable
   */
  public get nextAvailableRegion(): string | undefined {
    for (const [region, available] of this.regions.entries()) {
      if (available) {
        this.regions.set(region, false);
        return region;
      }
    }
    return undefined;
  }

  /**
   *  Sets the region as available to run tests
   */
  public setRegionAvailable(region: string) {
    this.regions.set(region, true);
  }

  /**
   * Returns the next available test or undefined
   * if there are no remaining tests
   */
  public get nextTest(): IntegTestConfig | undefined {
    if (this.tests.length > 0) {
      return this.tests.pop();
    } else {
      return undefined;
    }
  }
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
 * Runs a set of integration tests in parallel across a list of AWS regions.
 * Only a single test can be run at a time in a given region. Once a region
 * is done running a test, the next test will be pulled from the queue
 */
export async function runIntegrationTestsInParallel(
  options: IntegTestRunOptions,
): Promise<IntegBatchResponse[]> {

  const queue = new IntegTestQueue(options.regions, options.tests);
  const results: IntegBatchResponse[] = [];

  async function runTest(): Promise<void> {
    do {
      const region = queue.nextAvailableRegion;
      // if all regions are unavailable then wait and try again
      if (!region) {
        await sleep(300);
        continue;
      }
      const test = queue.nextTest;
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
      queue.setRegionAvailable(region);
    } while (queue.testsAvailable);
  }

  const workers = options.regions.map(() => runTest());
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

async function sleep(ms: number) {
  return new Promise(ok => setTimeout(ok, ms));
}
