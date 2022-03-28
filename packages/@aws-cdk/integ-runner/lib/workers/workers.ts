import * as workerpool from 'workerpool';
import { IntegTestConfig } from '../runner/integ-tests';
import * as logger from '../runner/private/logger';
import { IntegSnapshotRunner, IntegTestRunner } from '../runner/runners';

/**
 * Represents possible reasons for a diagnostic
 */
export enum DiagnosticReason {
  /**
   * The integration test failed because there
   * is not existing snapshot
   */
  NO_SNAPSHOT = 'NO_SNAPSHOT',

  /**
   * The integration test failed
   */
  TEST_FAILED = 'TEST_FAILED',

  /**
   * The snapshot test failed because the actual
   * snapshot was different than the expected snapshot
   */
  SNAPSHOT_FAILED = 'SNAPSHOT_FAILED',

  /**
   * The snapshot test succeeded
   */
  SNAPSHOT_SUCCESS = 'SNAPSHOT_SUCCESS',

  /**
   * The integration test succeeded
   */
  TEST_SUCCESS = 'TEST_SUCCESS',
}

/**
 * Options for an integration test batch
 */
export interface IntegTestBatchRequest {
  /**
   * A list of integration tests to run
   * in this batch
   */
  readonly tests: IntegTestConfig[];

  /**
   * The AWS region to run this batch in
   */
  readonly region: string;

  /**
   * Whether or not to destroy the stacks at the
   * end of the test
   *
   * @default true
   */
  readonly clean?: boolean;

  /**
   * When this is set to `true` the snapshot will
   * be created _without_ running the integration test
   * The resulting snapshot SHOULD NOT be checked in
   *
   * @default false
   */
  readonly dryRun?: boolean;

  /**
   * Whether to enable verbose logging
   *
   * @default false
   */
  readonly verbose?: boolean;
}

/**
 * Integration test diagnostics
 * This is used to report back the status of each test
 */
export interface Diagnostic {
  /**
   * The name of the test
   */
  readonly testName: string;

  /**
   * The diagnostic message
   */
  readonly message: string;

  /**
   * The reason for the diagnostic
   */
  readonly reason: DiagnosticReason;
}

/**
 * Runs a single snapshot test batch request.
 * For each integration test this will check to see
 * if there is an existing snapshot, and if there is will
 * check if there are any changes
 */
export function singleThreadedSnapshotRunner(
  tests: IntegTestConfig[],
): { failedTests: IntegTestConfig[], diagnostics: Diagnostic[] } {
  const diagnostics = new Array<Diagnostic>();
  const failedTests = new Array<IntegTestConfig>();
  for (const test of tests) {
    const runner = new IntegSnapshotRunner(test.fileName);
    try {
      if (!runner.hasSnapshot()) {
        failedTests.push(test);
        diagnostics.push({
          reason: DiagnosticReason.NO_SNAPSHOT,
          testName: runner.testName,
          message: 'No Snapshot',
        });
      } else {
        const snapshotDiagnostics = runner.testSnapshot();
        if (snapshotDiagnostics.length > 0) {
          diagnostics.push(...snapshotDiagnostics);
          failedTests.push(test);
        } else {
          diagnostics.push({
            reason: DiagnosticReason.SNAPSHOT_SUCCESS,
            testName: runner.testName,
            message: 'Success',
          });
        }
      }
    } catch (e) {
      failedTests.push(test);
      diagnostics.push({
        message: e.message,
        testName: runner.testName,
        reason: DiagnosticReason.SNAPSHOT_FAILED,
      });
    }
  }

  return {
    failedTests,
    diagnostics,
  };
}

/**
 * Runs a single integration test batch request.
 * If the test does not have an existing snapshot,
 * this will first generate a snapshot and then execute
 * the integration tests.
 *
 * If the tests succeed it will then save the snapshot
 */
export function singleThreadedTestRunner(
  request: IntegTestBatchRequest,
): Diagnostic[] {
  const diagnostics = new Array<Diagnostic>();
  for (const test of request.tests) {
    const runner = new IntegTestRunner(test.fileName, {
      AWS_REGION: request.region,
    });
    try {
      if (!runner.hasSnapshot()) {
        workerpool.workerEmit({
          message: `Synthesizing ${test.fileName}.`,
        });
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
          diagnostics.push({
            reason: DiagnosticReason.TEST_SUCCESS,
            testName: testName,
            message: 'Success',
          });
        } catch (e) {
          diagnostics.push({
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

  return diagnostics;
}
