import * as workerpool from 'workerpool';
import { IntegTestConfig } from '../runner/integ-tests';
import * as logger from '../runner/private/logger';
import { IntegSnapshotRunner, IntegTestRunner } from '../runner/runners';

export enum DiagnosticReason {
  NO_SNAPSHOT = 'NO_SNAPSHOT',
  TEST_FAILED = 'TEST_FAILED',
  SNAPSHOT_FAILED = 'SNAPSHOT_FAILED',
  SUCCESS = 'SUCCESS',
}

export interface IntegTestBatchRequest {
  readonly tests: IntegTestConfig[];
  readonly region: string;
  readonly clean?: boolean;
  readonly dryRun?: boolean;
  readonly verbose?: boolean;
}

export interface Diagnostic {
  readonly testName: string;
  readonly message: string;
  readonly reason: DiagnosticReason;
}

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
        runner.testSnapshot();
        diagnostics.push({
          reason: DiagnosticReason.SUCCESS,
          testName: runner.testName,
          message: 'Success',
        });
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

export function singleThreadedTestRunner(
  request: IntegTestBatchRequest,
): Diagnostic[] {
  const diagnostics = new Array<Diagnostic>();
  for (const test of request.tests) {
    const runner = new IntegTestRunner(test.fileName, {
      CDK_DEFAULT_REGION: request.region,
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
            reason: DiagnosticReason.SUCCESS,
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
      logger.error('Errors running test cases');
    }
  }

  return diagnostics;
}
